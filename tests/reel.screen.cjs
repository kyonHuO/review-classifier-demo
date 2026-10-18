// Run with PLAYWRIGHT_MODULE pointing to playwright-core and CHROME_BIN to Chromium.
// Uses only local files and a disposable browser context. No deployment or account APIs.
const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright-core');
const path = require('node:path');
const fs = require('node:fs');
const { pathToFileURL } = require('node:url');
const output = path.resolve(process.env.REEL_QA_DIR || '../reel-qa');
const home = pathToFileURL(path.resolve(__dirname, '../index.html')).href;
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
(async () => {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ executablePath: process.env.CHROME_BIN, headless: true });
  const errors = [], checks = [], requests = [];
  const check = (name, result) => { assert.ok(result, name); checks.push(name); };
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    page.on('pageerror', error => errors.push(error.message));
    page.on('request', request => { if (/^https?:/.test(request.url())) requests.push(request.url()); });
    await page.goto(home);
    check('limited home has no customer link', await page.locator('a[href="customer.html"]').count() === 0);
    check('limited home preserves no server storage statement', (await page.locator('body').textContent()).includes('入力や分類結果をサーバーに保存しません'));
    check('limited home preserves account storage preparation', (await page.locator('body').textContent()).includes('アカウントへの結果保存は準備中です'));
    check('limited home preserves history preparation', (await page.locator('body').textContent()).includes('アカウントへの保存と、履歴からの再取得は準備中です'));
    const toggle = page.locator('[data-reel-toggle]'), seek = page.locator('.nagi-reel input');
    const value = () => seek.inputValue().then(Number);
    const setTime = async t => {
      await seek.evaluate((element, time) => { element.value = time; element.dispatchEvent(new Event('input', { bubbles: true })); }, t);
    };
    await page.waitForFunction(() => Number(document.querySelector('.nagi-reel input').value) > .1);
    check('autoplay when visible', await value() > 0);
    await toggle.click(); const paused = await value(); await delay(250);
    check('pause holds timeline', await value() === paused);
    await toggle.click(); await delay(250); check('resume advances timeline', await value() > paused);
    await setTime(5.7);
    await page.screenshot({ path: path.join(output, 'desktop-morph.png') });
    await setTime(8.7);
    await page.screenshot({ path: path.join(output, 'desktop-particles.png') });
    for (const t of [0, 3.5, 5, 6, 7, 10.5, 12, 14.5]) {
      await setTime(t);
      await page.locator('.nagi-reel-stage').screenshot({ path: path.join(output, `scene-${t}.png`) });
    }
    await setTime(8.7);
    await page.locator('.nagi-reel-stage').focus();
    await page.keyboard.press('ArrowRight'); check('stage arrow seeks and pauses', Math.abs(await value() - 9.7) < .01);
    await page.keyboard.press('Space'); await delay(200); check('stage Space plays', await value() > 9.7);
    await page.keyboard.press('Space');
    const beforeOutside = await value();
    await page.locator('.home-actions a').first().focus();
    await page.keyboard.press('ArrowLeft'); check('outside arrow does not seek', await value() === beforeOutside);
    const outsidePrevented = await page.locator('.home-actions a').first().evaluate(element => {
      const event = new KeyboardEvent('keydown', { code: 'Space', bubbles: true, cancelable: true });
      element.dispatchEvent(event); return event.defaultPrevented;
    });
    check('outside Space is not intercepted', !outsidePrevented);
    await seek.focus(); const beforeNative = await value(); await page.keyboard.press('ArrowLeft');
    check('range keeps native keyboard step', Math.abs(await value() - (beforeNative - .1)) < .01);
    await setTime(14.9); await toggle.click(); await delay(350);
    check('15 second ending stops', await value() === 15 && await toggle.textContent() === '再生');
    await page.locator('[data-reel-restart]').click(); await delay(150);
    check('restart plays from beginning', await value() < 1 && await toggle.textContent() === '一時停止');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); await delay(200);
    const offscreen = await value(); await delay(250); check('offscreen playback suspended', await value() === offscreen);
    await page.locator('.nagi-reel').scrollIntoViewIfNeeded(); await delay(200);
    check('visible playback resumes', await value() > offscreen);
    await toggle.click();
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); await delay(100);
    await page.locator('.nagi-reel').scrollIntoViewIfNeeded(); await delay(200);
    check('manual pause survives scroll', await toggle.textContent() === '再生');
    await page.emulateMedia({ reducedMotion: 'reduce' }); await page.reload(); await delay(250);
    check('reduced motion prevents autoplay', await value() === 0 && await toggle.textContent() === '再生');
    await toggle.click(); await delay(200); check('reduced motion allows explicit play', await value() > 0);
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await delay(150);
    await page.emulateMedia({ reducedMotion: 'reduce' }); await delay(150);
    const reduced = await value(); await delay(150); check('preference change pauses playback', await value() === reduced);
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 }); await page.reload(); await setTime(0);
      await page.locator('.nagi-reel').scrollIntoViewIfNeeded();
      check(`no horizontal overflow at ${width}`, await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      check(`controls stay inside viewport at ${width}`, await page.locator('.nagi-reel-controls').evaluate(el => [...el.querySelectorAll('button,input,output')].every(c => { const r=c.getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth; })));
      await page.screenshot({ path: path.join(output, `home-${width}.png`) });
    }
    await page.goto(pathToFileURL(path.resolve(__dirname, '../sns.html')).href);
    check('limited SNS has no development notes link', await page.locator('a[href="sns-notes.html"]').count() === 0);
    check('limited SNS has no customer link', await page.locator('a[href="customer.html"]').count() === 0);
    check('limited SNS preserves storage not started statement', (await page.locator('body').textContent()).includes('投稿や分類結果の受付・保管は未開始です'));
    check('only specified SNS notice removed', await page.locator('.availability-note').count() === 0);
    check('SNS development heading preserved', (await page.locator('h1').textContent()).includes('関連する投稿'));
    check('SNS unavailable FAQ preserved', (await page.locator('body').textContent()).includes('実装はまだ提供していません'));
    await page.screenshot({ path: path.join(output, 'sns.png') });
    const nojs = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 390, height: 900 } });
    await nojs.goto(home);
    check('no-JS description and CTA available', await nojs.locator('.hero-description').isVisible() && await nojs.locator('.home-actions a').first().isVisible());
    check('no-JS static poster visible', await nojs.locator('.nagi-reel-poster').isVisible());
    check('no-JS inactive controls hidden', !await nojs.locator('.nagi-reel-controls').isVisible());
    check('no runtime errors', errors.length === 0);
    check('no external network requests on home', requests.length === 0);
    console.log(JSON.stringify({ browser: browser.version(), checks, errors, requests }, null, 2));
    fs.writeFileSync(path.join(output, 'results.json'), JSON.stringify({ browser: browser.version(), checks, errors, requests }, null, 2));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
