import { test, expect } from '@playwright/test';

test.describe('Admin to Public Notice Flow', () => {
  test('public notices board page renders category tabs, search, and RSS link', async ({ page }) => {
    await page.goto('/bn/notices');

    // Check heading
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();

    // Check Category Tabs
    const categoryTabs = page.locator('a:has-text("সকল বিভাগ"), a:has-text("ভর্তি"), a:has-text("সাম্প্রতিক")');
    await expect(categoryTabs.first()).toBeVisible();

    // Check RSS Feed Link
    const rssLink = page.locator('a[href="/notices/feed.xml"]');
    await expect(rssLink).toBeVisible();
  });

  test('admin notices dashboard page loads with management controls', async ({ page }) => {
    await page.goto('/admin/notices');

    // Verify Create Notice Button is visible
    const createBtn = page.locator('button:has-text("Create Notice")');
    await expect(createBtn).toBeVisible();

    // Verify Search Input
    const searchInput = page.locator('input[placeholder="Search notices..."]');
    await expect(searchInput).toBeVisible();
  });

  test('RSS feed endpoint responds with valid RSS XML content', async ({ request }) => {
    const response = await request.get('/notices/feed.xml');
    expect(response.status()).toBe(200);
    const text = await response.text();
    expect(text).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(text).toContain('<rss version="2.0"');
    expect(text).toContain('বিদ্যার্থী ফ্রি কোচিং সেন্টার');
  });
});
