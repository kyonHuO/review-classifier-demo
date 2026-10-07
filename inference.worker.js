import {PREFIX, PROTOTYPES, LIMITS, validateRows, normalized, buildCentroids, classifyEmbedding} from './core.js';
import {MODEL_ID, MODEL_REVISION, RUNTIME_URL, MODEL_BYTES} from './model-config.js';

let tokenizer, model, centroids, prototypeVectors, backend, busy=false;
const send=(type,data={})=>self.postMessage({type,...data});
let stage='runtime';
let downloadFiles=new Map();
function progress(event){
  if(event.status==='progress'){
    downloadFiles.set(event.file,{loaded:event.loaded||0,total:event.total||0});
    const loaded=[...downloadFiles.values()].reduce((n,f)=>n+f.loaded,0);
    send('download',{loaded,total:MODEL_BYTES,file:event.file});
  }else if(event.status==='done')send('file-ready',{file:event.file});
}
async function embeddingFor(texts){
  const inputs=await tokenizer(texts.map(text=>PREFIX+text),{padding:true,truncation:false});
  const tokens=inputs.input_ids.dims[1];
  if(tokens>LIMITS.tokens)return {tooLong:true,tokens};
  const reserved=[model.config.image_token_id,model.config.audio_token_id,model.config.video_token_id];
  if(Array.from(inputs.input_ids.data).some(id=>reserved.includes(Number(id))))return {unsupportedTokens:true};
  const output=await model(inputs);
  if(!output.sentence_embedding||output.sentence_embedding.dims[1]!==768)throw Error('unexpected-embedding');
  const vectors=output.sentence_embedding.tolist().map(normalized);
  for(const item of Object.values(output))if(typeof item?.dispose==='function')await item.dispose();
  return {vectors,tokens};
}
async function prepare(choice){
  if(model)return;
  stage='runtime';send('status',{stage,text:'実行用ファイルを取得しています'});
  const {AutoConfig,AutoTokenizer,AutoModel,env}=await import(RUNTIME_URL);
  env.allowLocalModels=false;
  env.useBrowserCache=true; // Cache model assets, never inputs/results.
  env.backends.onnx.wasm.numThreads=1; // GitHub Pages does not supply COOP/COEP.
  env.backends.onnx.wasm.proxy=false; // We already run in a disposable worker.
  backend='wasm';
  if(choice!=='wasm'&&self.navigator.gpu){
    try {const adapter=await self.navigator.gpu.requestAdapter();if(adapter)backend='webgpu';} catch {/* Feature detection only; no remote inference. */}
  }
  // The asyncify build's reduced-type CPU registry lacks GatherBlockQuantized.
  // Use the same pinned release's standard WASM pair for CPU inference only.
  // WebGPU retains Transformers.js's default asyncify runtime.
  if(backend==='wasm'){
    const base='https://cdn.jsdelivr.net/npm/onnxruntime-web@1.31.0-dev.20260914-8d85527a0/dist/';
    env.backends.onnx.wasm.wasmPaths={mjs:base+'ort-wasm-simd-threaded.mjs',wasm:base+'ort-wasm-simd-threaded.wasm'};
  }
  send('backend',{backend});
  const options={revision:MODEL_REVISION,progress_callback:progress};
  stage='model';send('status',{stage,text:'EmbeddingGemma 2を取得しています'});
  const config=await AutoConfig.from_pretrained(MODEL_ID,options);
  config.vision_config=null;config.audio_config=null;
  tokenizer=await AutoTokenizer.from_pretrained(MODEL_ID,options);
  send('status',{stage,text:'モデルを読み込み・準備しています'});
  model=await AutoModel.from_pretrained(MODEL_ID,{...options,config,device:backend,dtype:'q4'});
  stage='prototypes';prototypeVectors=[];
  for(let i=0;i<PROTOTYPES.length;i+=4){
    send('status',{stage,text:`分類用の例文を準備しています（${i}/${PROTOTYPES.length}）`});
    const result=await embeddingFor(PROTOTYPES.slice(i,i+4).map(x=>x.text));
    if(result.tooLong)throw Error('prototype-token-limit');
    prototypeVectors.push(...result.vectors);
  }
  centroids=buildCentroids(prototypeVectors);send('ready',{backend});
}
self.onmessage=async({data})=>{
  if(data.type!=='classify'||busy)return;
  busy=true;
  try{
    validateRows(data.rows);
    await prepare(data.device);
    stage='inference';
    for(let i=0;i<data.rows.length;i++){
      send('status',{stage,text:`レビューを分類しています（${i+1}/${data.rows.length}）`,current:i,total:data.rows.length});
      const text=data.rows[i], result=await embeddingFor([text]);
      if(result.unsupportedTokens)send('result',{result:{id:i+1,text,category:'skipped',reason:'reserved_media_token'}});
      else if(result.tooLong)send('result',{result:{id:i+1,text,category:'skipped',reason:`token_limit_${result.tokens}`}});
      else send('result',{result:{id:i+1,text,...classifyEmbedding(result.vectors[0],centroids,prototypeVectors)}});
    }
    send('complete',{backend,count:data.rows.length});
  }catch(error){
    // Never log visitor text or emit telemetry. Error text stays local and is not
    // interpolated into URLs. UI receives only a fixed diagnostic category.
    const message=String(error?.message||error);
    const code=/memory|alloc|out of bounds|buffer size/i.test(message)?'memory':/fetch|network|download|404|403|external data|Load model/i.test(message)?'download':/WebGPU|GPUDevice|adapter|device lost|Shader|pipeline/i.test(message)?'gpu':'runtime';
    send('error',{stage,code,backend:backend||'unknown',diagnostic:message.slice(0,600)});
    try{await model?.dispose();}catch{}model=null;tokenizer=null;centroids=null;prototypeVectors=null;downloadFiles.clear();
  }finally{busy=false;}
};
