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


