import { readFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import WebSocket from 'ws';

const baseUrl = process.env.SMOKE_BASE_URL || 'http://127.0.0.1:3000';
const apiBaseUrl = process.env.SMOKE_API_BASE_URL || 'https://sub.againdev.ru';
const adminUrl = process.env.SMOKE_ADMIN_URL || 'https://sub.againdev.ru/admin/products/reviews';
const productPath = '/catalog/menstrualnye-trusy-sexy-again-1';
const tokens = JSON.parse(await readFile(process.env.REVIEW_AUTH_TOKENS || '/tmp/product-reviews-auth.json', 'utf8'));
const browser = spawn(process.env.CHROMIUM_PATH || 'chromium', [
  '--headless=new', '--no-sandbox', '--disable-gpu', '--remote-debugging-port=9224',
  '--ignore-certificate-errors',
  `--user-data-dir=/tmp/reviews-auth-chromium-${process.pid}`, 'about:blank',
], { stdio: ['ignore', 'ignore', 'pipe'] });
let browserErrors = '';
browser.stderr.on('data', chunk => { browserErrors += chunk.toString(); });

const assert = (condition, message) => { if (!condition) throw new Error(message); };
const waitForDebugger = async () => {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try { if ((await fetch('http://127.0.0.1:9224/json/version')).ok) return; } catch {}
    await delay(200);
  }
  throw new Error(`Chromium debugger did not start: ${browserErrors}`);
};
const createClient = async () => {
  const target = await fetch('http://127.0.0.1:9224/json/new?about:blank', { method: 'PUT' }).then(r => r.json());
  const socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.once('open', resolve); socket.once('error', reject); });
  let id = 0;
  const pending = new Map();
  const events = [];
  socket.on('message', raw => {
    const message = JSON.parse(raw.toString());
    if (!message.id) { events.push(message); return; }
    const entry = pending.get(message.id);
    if (entry) { pending.delete(message.id); message.error ? entry.reject(message.error) : entry.resolve(message.result); }
  });
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const commandId = ++id;
    pending.set(commandId, { resolve, reject });
    socket.send(JSON.stringify({ id: commandId, method, params }));
  });
  return { socket, send, events };
};
const evaluate = async (client, expression) => {
  const result = await client.send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result.value;
};
const waitFor = async (client, expression, timeout = 20000) => {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    if (await evaluate(client, expression)) return;
    await delay(200);
  }
  throw new Error(`Timed out waiting for: ${expression}`);
};
const setToken = async (client, name, value, url = baseUrl) => {
  await client.send('Network.setCookie', { name, value, url, path: '/', secure: url.startsWith('https:') });
};

try {
  await waitForDebugger();
  const client = await createClient();
  await Promise.all([client.send('Runtime.enable'), client.send('Network.enable'), client.send('Page.enable')]);

  await setToken(client, 'auth_token', tokens.c1);
  await client.send('Page.navigate', { url: baseUrl + productPath });
  await waitFor(client, `document.readyState === 'complete'`);
  await waitFor(client, `document.querySelectorAll('.product-reviews__item').length >= 8`);
  const firstHeaders = await fetch(baseUrl + productPath, { headers: { Cookie: `auth_token=${tokens.c1}` } });
  assert(firstHeaders.headers.get('cache-control')?.includes('private'), 'Client 1 SSR is not private');
  assert(firstHeaders.headers.get('vary')?.includes('Cookie'), 'Client 1 SSR does not vary by Cookie');

  await evaluate(client, `document.querySelector('.product-reviews__more').click()`);
  await waitFor(client, `document.querySelectorAll('.product-reviews__item').length === 16`);
  await evaluate(client, `document.querySelectorAll('.product-reviews__item-like')[8].click()`);
  await waitFor(client, `document.querySelectorAll('.product-reviews__item-like')[8].getAttribute('aria-pressed') === 'true'`);

  const apiPath = `${apiBaseUrl}/api/public/catalog/products/252/reviews?page=2&per_page=8`;
  const [clientOne, clientTwo] = await Promise.all([
    fetch(apiPath, { headers: { Authorization: `Bearer ${tokens.c1}` } }).then(r => r.json()),
    fetch(apiPath, { headers: { Authorization: `Bearer ${tokens.c2}` } }).then(r => r.json()),
  ]);
  const reviewId = clientOne.data[0]?.id;
  assert(clientOne.data.find(item => item.id === reviewId)?.is_liked === true, 'Client 1 like is absent on page 2');
  assert(clientTwo.data.find(item => item.id === reviewId)?.is_liked === false, 'Client 2 inherited Client 1 like');
  const secondHeaders = await fetch(baseUrl + productPath, { headers: { Cookie: `auth_token=${tokens.c2}` } });
  assert(secondHeaders.headers.get('cache-control')?.includes('private'), 'Client 2 SSR is not private');
  assert(secondHeaders.headers.get('vary')?.includes('Cookie'), 'Client 2 SSR does not vary by Cookie');

  await setToken(client, 'access_token', tokens.admin, 'https://sub.againdev.ru');
  await client.send('Page.navigate', { url: adminUrl });
  await waitFor(client, `document.body?.innerText.includes('Отзывы')`);
  await waitFor(client, `document.querySelector('table') || document.body.innerText.includes('Все отзывы')`);
  const adminState = await evaluate(client, `({ url:location.href, text:document.body.innerText.slice(0,500) })`);
  assert(adminState.url.includes('/admin/products/reviews'), 'Admin reviews UI redirected away');

  console.log(JSON.stringify({ clientSsrIsolation: true, pageTwoLike: true, adminReviewsUi: true }));
  client.socket.close();
} finally {
  browser.kill('SIGTERM');
}
