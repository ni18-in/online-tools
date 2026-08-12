import { test, expect, type Page } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

// Slugs are read out of the catalog rather than hand-copied, so a newly added tool is smoke-tested
// automatically and the list can never drift (it previously claimed 21 while holding 23).
// Read as text — importing tools.ts would drag in its `.astro` type imports.
const CATALOG = fs.readFileSync(path.resolve('src/data/tools.ts'), 'utf8');
const TOOL_SLUGS = [...CATALOG.matchAll(/^ {4}slug: '([^']+)'/gm)].map((m) => m[1]);

test('catalog parsed for smoke coverage', () => {
  // Guards the regex above: if the catalog's formatting changes and this yields nothing,
  // every per-tool test below would silently vanish instead of failing.
  expect(TOOL_SLUGS.length).toBeGreaterThan(20);
});

function trackErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  return errors;
}

for (const slug of TOOL_SLUGS) {
  test(`tool loads without errors: ${slug}`, async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto(`/tools/${slug}/`);
    // shell header present (MD3 chrome rendered)
    await expect(page.locator('.site-header')).toBeVisible();
    // preserved tool island present with content
    const island = page.locator(`#tool-${slug}`);
    await expect(island).toHaveCount(1);
    await page.waitForTimeout(400); // let inline JS run
    expect(errors, `page errors on ${slug}: ${errors.join(' | ')}`).toEqual([]);
  });
}

// ---- locale tool pages ----
// Every es/fr tool ships its OWN copy of the body + script.js, so an error in a localized copy
// used to be invisible: nothing executed those 42 pages. Island ids differ per page (some reuse
// the English slug), so assert on structure rather than a specific id.
const LOCALE_SLUGS: Array<[string, string]> = [];
for (const locale of ['es', 'fr'] as const) {
  const dir = path.resolve(`src/components/legacy/${locale}`);
  for (const entry of fs.readdirSync(dir)) {
    if (entry.startsWith('tool-')) LOCALE_SLUGS.push([locale, entry.slice('tool-'.length)]);
  }
}

test('locale tool bodies discovered', () => {
  expect(LOCALE_SLUGS.length).toBeGreaterThan(30);
});

for (const [locale, slug] of LOCALE_SLUGS) {
  test(`locale tool loads without errors: ${locale}/${slug}`, async ({ page }) => {
    const errors = trackErrors(page);
    const res = await page.goto(`/${locale}/tools/${slug}/`);
    expect(res?.status(), `HTTP status for /${locale}/tools/${slug}/`).toBeLessThan(400);
    await expect(page.locator('.site-header')).toBeVisible();
    await expect(page.locator('h1')).toHaveCount(1);
    const island = page.locator('.tool-island');
    await expect(island).toHaveCount(1);
    expect((await island.innerText()).trim().length, 'tool island renders text').toBeGreaterThan(0);
    await page.waitForTimeout(400); // let inline JS run
    expect(errors, `page errors on ${locale}/${slug}: ${errors.join(' | ')}`).toEqual([]);
  });
}

// ---- targeted interaction checks for representative tools ----
test('px-to-rem converts 16px -> 1rem and updates on input', async ({ page }) => {
  await page.goto('/tools/px-to-rem-converter/');
  await expect(page.locator('#result-value')).toHaveText('1rem');
  await page.fill('#px-input', '32');
  await expect(page.locator('#result-value')).toHaveText('2rem');
});

test('all-in-one-text-analyzer counts words/chars', async ({ page }) => {
  await page.goto('/tools/all-in-one-text-analyzer/');
  await page.fill('#textInput', 'Hello world this is a test');
  await expect(page.locator('#wordCount')).toHaveText('6');
});

test('mh-meter computes a fare', async ({ page }) => {
  await page.goto('/tools/mh-meter-price-calculator/');
  await page.selectOption('#vehicleType', { index: 1 });
  await page.fill('#distance', '10');
  await page.locator('#fareForm button[type="submit"]').click();
  await expect(page.locator('body')).toContainText('Total Pay');
});

test('homepage search filters tool cards', async ({ page }) => {
  await page.goto('/');
  const total = await page.locator('.tool-card').count();
  expect(total).toBeGreaterThan(10);
  await page.fill('#tool-search-input', 'json');
  await expect(page.locator('.tool-card:visible').first()).toBeVisible();
  expect(await page.locator('.tool-card:visible').count()).toBeLessThan(total);
});

test('jwt-debugger decodes sample token on button click', async ({ page }) => {
  await page.goto('/tools/jwt-debugger/');
  await page.click('#btnPasteSample');
  await expect(page.locator('#headerOutput')).toContainText('HS256');
  await expect(page.locator('#payloadOutput')).toContainText('John Doe');
});

test('smart language switcher has correct alternates', async ({ page }) => {
  await page.goto('/tools/px-to-rem-converter/');
  const select = page.locator('.lang-select');
  await expect(select).toBeVisible();
  const optionEs = select.locator('option[value*="/es/tools/px-a-rem-convertidor/"]');
  await expect(optionEs).toHaveCount(1);
  const optionFr = select.locator('option[value*="/fr/tools/px-to-rem-converter/"]');
  await expect(optionFr).toHaveCount(1);
});

test('blog lists load and alternates redirect correctly', async ({ page }) => {
  const errors = trackErrors(page);
  
  // Verify English blog list
  await page.goto('/blogs/');
  await expect(page.locator('h1')).toHaveText('Blog');
  await expect(page.locator('.post-list')).toBeVisible();

  // Verify Spanish blog list
  await page.goto('/es/blogs/');
  await expect(page.locator('h1')).toHaveText('Blog');
  await expect(page.locator('.post-list')).toBeVisible();

  // Verify French blog list
  await page.goto('/fr/blogs/');
  await expect(page.locator('h1')).toHaveText('Blog');
  await expect(page.locator('.post-list')).toBeVisible();

  // Verify smart language switching on translated post
  await page.goto('/blogs/edit-images-like-pro-free-online-tool');
  const select = page.locator('.lang-select');
  await expect(select).toBeVisible();
  const optionEs = select.locator('option[value*="/es/blogs/editar-imagenes-como-un-profesional-herramienta-gratuita-online.html"]');
  await expect(optionEs).toHaveCount(1);
  const optionFr = select.locator('option[value*="/fr/blogs/edit-images-like-pro-free-online-tool.html"]');
  await expect(optionFr).toHaveCount(1);

  expect(errors).toEqual([]);
});



// ---- image utility: the pieces that regressed or were newly added ----
test('image utility: icons render, single landmark, target-size compression works', async ({ page }) => {
  const errors = trackErrors(page);
  await page.goto('/tools/free-online-image-utility-tool/');

  // every icon must resolve to a symbol in the inline sprite (they used to be empty boxes:
  // the markup referenced a Lucide library that was never loaded on the page)
  const iconState = await page.evaluate(() => {
    const icons = [...document.querySelectorAll('.iu-icon')];
    return {
      total: icons.length,
      resolved: icons.filter((s) => {
        const href = s.querySelector('use')?.getAttribute('href');
        return href && document.querySelector(href);
      }).length,
      deadLucide: document.querySelectorAll('.lucide').length,
    };
  });
  expect(iconState.total).toBeGreaterThan(10);
  expect(iconState.resolved).toBe(iconState.total);
  expect(iconState.deadLucide).toBe(0);

  // ToolLayout owns the only <main>
  await expect(page.locator('main')).toHaveCount(1);

  // load an image, then compress it to a byte budget
  const result = await page.evaluate(async () => {
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const cv = document.createElement('canvas');
    cv.width = 600;
    cv.height = 400;
    const g = cv.getContext('2d')!;
    for (let i = 0; i < 3000; i++) {
      g.fillStyle = `hsl(${Math.random() * 360},70%,${30 + Math.random() * 50}%)`;
      g.fillRect(Math.random() * 600, Math.random() * 400, 14, 14);
    }
    const blob: Blob = await new Promise((r) => cv.toBlob((b) => r(b!), 'image/png'));
    const dt = new DataTransfer();
    dt.items.add(new File([blob], 'probe.png', { type: 'image/png' }));
    const input = document.getElementById('file-input') as HTMLInputElement;
    input.files = dt.files;
    input.dispatchEvent(new Event('change', { bubbles: true }));
    await wait(1200);

    const estimateOnLoad = document.getElementById('estimated-size')!.textContent!;

    // border preview must predict the applied result (it used to stroke inside the canvas
    // while Apply grew it, so the preview showed the wrong output size)
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    (document.querySelector('[data-tool="border"]') as HTMLElement).click();
    await wait(150);
    const bw = document.getElementById('border-width') as HTMLInputElement;
    bw.value = '20';
    bw.dispatchEvent(new Event('input', { bubbles: true }));
    await wait(400);
    const previewSize = `${canvas.width}x${canvas.height}`;
    (document.getElementById('apply-border-btn') as HTMLElement).click();
    await wait(900);
    const appliedSize = `${canvas.width}x${canvas.height}`;

    // compress to 40 KB
    (document.getElementById('target-size-enabled') as HTMLElement).click();
    (document.getElementById('target-size-kb') as HTMLInputElement).value = '40';
    (document.getElementById('find-quality-btn') as HTMLElement).click();
    await wait(3500);
    const quality = Number((document.getElementById('convert-quality') as HTMLInputElement).value);
    const format = (document.getElementById('convert-format') as HTMLSelectElement).value;
    const t = document.createElement('canvas');
    t.width = canvas.width;
    t.height = canvas.height;
    t.getContext('2d')!.drawImage(canvas, 0, 0);
    const out: Blob = await new Promise((r) => t.toBlob((b) => r(b!), format, quality / 100));
    return { estimateOnLoad, previewSize, appliedSize, quality, format, bytes: out.size };
  });

  expect(result.estimateOnLoad).not.toBe('N/A'); // estimate used to stay N/A until a control moved
  expect(result.previewSize).toBe(result.appliedSize);
  expect(result.format).toBe('image/jpeg'); // PNG can't hit a size target, so it switches
  expect(result.bytes).toBeLessThanOrEqual(40 * 1024);
  expect(errors).toEqual([]);
});
