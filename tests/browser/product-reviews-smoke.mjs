import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import WebSocket from 'ws';

const chromium = process.env.CHROMIUM_PATH || 'chromium';
const baseUrl = process.env.SMOKE_BASE_URL || 'http://127.0.0.1:3000';
const productPath = '/catalog/menstrualnye-trusy-sexy-again-1';
const port = 9223;
const browser = spawn(chromium, [
    '--headless=new', '--no-sandbox', '--disable-gpu',
    `--remote-debugging-port=${port}`, `--user-data-dir=/tmp/reviews-chromium-${process.pid}`,
    'about:blank',
], { stdio: ['ignore', 'ignore', 'pipe'] });

let browserErrors = '';
browser.stderr.on('data', chunk => { browserErrors += chunk.toString(); });

const waitForDebugger = async () => {
    for (let attempt = 0; attempt < 50; attempt += 1) {
        try {
            const response = await fetch(`http://127.0.0.1:${port}/json/version`);
            if (response.ok) return;
        } catch {}
        await delay(200);
    }
    throw new Error(`Chromium debugger did not start: ${browserErrors}`);
};

const createClient = async () => {
    const target = await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(baseUrl + productPath)}`, { method: 'PUT' }).then(r => r.json());
    const socket = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => { socket.once('open', resolve); socket.once('error', reject); });
    let id = 0;
    const pending = new Map();
    const events = [];
    socket.on('message', raw => {
        const message = JSON.parse(raw.toString());
        if (message.id) {
            const entry = pending.get(message.id);
            if (entry) { pending.delete(message.id); message.error ? entry.reject(message.error) : entry.resolve(message.result); }
        } else {
            events.push(message);
        }
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

const waitFor = async (client, expression, timeout = 15000) => {
    const started = Date.now();
    while (Date.now() - started < timeout) {
        if (await evaluate(client, expression)) return;
        await delay(200);
    }
    throw new Error(`Timed out waiting for: ${expression}`);
};

const assert = (condition, message) => {
    if (!condition) throw new Error(message);
};

try {
    await waitForDebugger();
    const client = await createClient();
    await Promise.all([client.send('Runtime.enable'), client.send('Log.enable'), client.send('Page.enable')]);
    await waitFor(client, `document.readyState === 'complete'`);
    await waitFor(client, `document.querySelectorAll('.product-reviews__item').length === 8`);

    const widths = [[1440, 4], [991, 2], [575, 1], [320, 1]];
    for (const [width, columns] of widths) {
        await client.send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width <= 575 });
        await delay(150);
        const layout = await evaluate(client, `(() => { const grid=document.querySelector('.product-reviews__grid'); return { columns:getComputedStyle(grid).gridTemplateColumns.split(' ').length, overflow:document.documentElement.scrollWidth > document.documentElement.clientWidth }; })()`);
        assert(layout.columns === columns, `${width}px: expected ${columns} columns, got ${layout.columns}`);
        assert(!layout.overflow, `${width}px: horizontal overflow detected`);
    }

    await client.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
    let previousCount = 8;
    for (let click = 0; click < 20; click += 1) {
        const hasButton = await evaluate(client, `Boolean(document.querySelector('.product-reviews__more'))`);
        if (!hasButton) break;
        await evaluate(client, `document.querySelector('.product-reviews__more').click()`);
        await waitFor(client, `!document.querySelector('.product-reviews__more')?.disabled`);
        const count = await evaluate(client, `document.querySelectorAll('.product-reviews__item').length`);
        assert(count > previousCount, `load-more did not append after ${previousCount} cards`);
        previousCount = count;
    }
    assert(previousCount === 91, `expected all 91 reviews, got ${previousCount}`);
    assert(await evaluate(client, `document.body.innerText.includes('Все 91 отзывов показаны')`), 'terminal state is missing');

    const toggle = await evaluate(client, `document.querySelector('.product-reviews__item-toggle')?.outerHTML || null`);
    if (toggle) {
        await evaluate(client, `document.querySelector('.product-reviews__item-toggle').click()`);
        assert(await evaluate(client, `document.querySelector('.product-reviews__item-toggle').getAttribute('aria-expanded') === 'true'`), 'long review did not expand');
        assert(await evaluate(client, `!document.querySelector('.product-reviews__item-text-content').classList.contains('_clamped')`), 'expanded review remains clamped');
    }

    const issues = client.events.filter(event =>
        (event.method === 'Log.entryAdded' && ['error', 'warning'].includes(event.params.entry.level))
        || (event.method === 'Runtime.consoleAPICalled' && ['error', 'warning'].includes(event.params.type)),
    );
    assert(issues.length === 0, `browser console warnings/errors: ${JSON.stringify(issues)}`);
    console.log(JSON.stringify({ cards: previousCount, responsive: widths, consoleIssues: 0, longTextToggle: Boolean(toggle) }));
    client.socket.close();
} finally {
    browser.kill('SIGTERM');
}
