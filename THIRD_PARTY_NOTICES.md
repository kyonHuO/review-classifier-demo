# Model and runtime notices

This non-commercial technical demonstration is independent of Google, Hugging Face and 109ichiki.com. The site's original wireframe artwork and application code are not copied from those organizations.

## EmbeddingGemma 2

- Authors/base model: Google DeepMind, [google/embeddinggemma-2](https://huggingface.co/google/embeddinggemma-2)
- [Google launch, October 6, 2026](https://blog.google/innovation-and-ai/technology/developers-tools/embeddinggemma-2/)
- [Google developer guide](https://developers.googleblog.com/en/embeddinggemma-2-the-developer-guide/)
- Browser ONNX conversion: [onnx-community/embeddinggemma-2-ONNX](https://huggingface.co/onnx-community/embeddinggemma-2-ONNX/blob/daa72c51243991dfcaf9f9137d2c573d8f7790c0/README.md), revision daa72c51243991dfcaf9f9137d2c573d8f7790c0
- License: [Apache License 2.0](https://ai.google.dev/gemma/apache_2); see the upstream model card for use limitations and policy links
- This app uses only the 270M-parameter text portion. It sets audio_config and vision_config to null in memory; the upstream config file and model weights are unmodified. The q4 conversion is supplied by ONNX Community, not represented as a Google-authored ONNX export.
- The application does not redistribute or commit model weights. Browser downloads are from the pinned public Hugging Face revision. Input texts and results are not included in model download URLs.

## Transformers.js

[Hugging Face Transformers.js 4.3.1](https://github.com/huggingface/transformers.js/releases/tag/4.3.1), Apache-2.0. [License copy](licenses/transformers-LICENSE.txt).

The bundle includes @huggingface/tokenizers 0.2.0, Apache-2.0 ([license](licenses/tokenizers-LICENSE.txt)), and @huggingface/jinja 0.5.10, MIT ([license](licenses/jinja-LICENSE.txt)). The application imports the fixed npm version from jsDelivr, the distribution described by the [official installation guide](https://huggingface.co/docs/transformers.js/installation).

## ONNX Runtime

Microsoft ONNX Runtime Web 1.31.0-dev.20260914-8d85527a0, MIT. [License copy](licenses/onnx-LICENSE.txt). [Third-party notices](licenses/onnx-ThirdPartyNotices.txt). Commit 8d85527a010e294a26b274749f74294b2a32cec5.

Runtime code is downloaded from pinned npm package URLs. The application does not bundle or modify the third-party runtime. Model/runtime source URLs, sizes and expected SHA256 values are listed in [model-manifest.json](model-manifest.json). SHA256 values document provenance; the app does not implement an independent per-download integrity check. HTTPS, immutable model revision and exact runtime package versions are used.
