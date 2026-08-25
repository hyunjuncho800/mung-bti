const fs = require('fs');
const path = require('path');

let errors = [];
let passCount = 0;

console.log("=== Starting Validation ===");

// 1. Validate sitemap.xml
if (fs.existsSync('sitemap.xml')) {
    const sitemapContent = fs.readFileSync('sitemap.xml', 'utf8');
    const locMatches = [...sitemapContent.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);

    console.log(`sitemap.xml total entries: ${locMatches.length}`);

    let sitemapErrors = 0;
    for (const loc of locMatches) {
        if (loc.includes('.html')) {
            errors.push(`[Sitemap Error] Location contains .html: ${loc}`);
            sitemapErrors++;
        }
        if (loc.includes('?')) {
            errors.push(`[Sitemap Error] Location contains params: ${loc}`);
            sitemapErrors++;
        }
        if (!loc.startsWith('https://mung-test.com')) {
            errors.push(`[Sitemap Error] Invalid domain/protocol: ${loc}`);
            sitemapErrors++;
        }
    }

    if (sitemapErrors === 0) {
        console.log("✓ sitemap.xml validation PASSED! (100% clean URLs)");
        passCount++;
    }
} else {
    errors.push("[Sitemap Error] sitemap.xml file not found!");
}

// 2. Validate HTML files
let totalHtmlFiles = 0;
let dirtyHrefCount = 0;
let invalidCanonicalCount = 0;

function checkHtmlFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');

    // Skip XML rss files
    if (content.trim().startsWith('<?xml')) {
        return;
    }

    totalHtmlFiles++;

    // Check href for internal .html links (e.g. href="something.html" or href="/something.html")
    const internalHtmlHrefRegex = /href=["'](?:\/|\.\/)?([a-zA-Z0-9_-]+\.html(?:\?[^"']*)?)["']/g;
    let match;
    while ((match = internalHtmlHrefRegex.exec(content)) !== null) {
        const fullHref = match[0];
        const target = match[1];
        if (!target.startsWith('http://') && !target.startsWith('https://')) {
            errors.push(`[HTML Link Warning] ${filePath} contains legacy href: ${fullHref}`);
            dirtyHrefCount++;
        }
    }

    // Check canonical tag
    const canonicalMatch = content.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/i);
    if (canonicalMatch) {
        const href = canonicalMatch[1];
        if (!href.startsWith('https://mung-test.com')) {
            errors.push(`[Canonical Error] ${filePath} canonical is not absolute mung-test.com: ${href}`);
            invalidCanonicalCount++;
        } else if (href.endsWith('.html') && href !== 'https://mung-test.com/') {
            errors.push(`[Canonical Error] ${filePath} canonical contains .html: ${href}`);
            invalidCanonicalCount++;
        }
    } else {
        errors.push(`[Canonical Warning] ${filePath} missing canonical tag`);
        invalidCanonicalCount++;
    }
}

function traverseDir(dir) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
        if (item === '.git' || item === 'node_modules' || item === 'scripts') continue;
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            traverseDir(fullPath);
        } else if (item.endsWith('.html')) {
            checkHtmlFile(fullPath);
        }
    }
}

traverseDir('.');

console.log(`Checked ${totalHtmlFiles} HTML files.`);
if (dirtyHrefCount === 0) {
    console.log("✓ HTML internal links validation PASSED! (0 dirty .html hrefs)");
    passCount++;
} else {
    console.log(`✕ HTML internal links validation found ${dirtyHrefCount} issues.`);
}

if (invalidCanonicalCount === 0) {
    console.log("✓ HTML Canonical tags validation PASSED! (100% clean absolute URLs)");
    passCount++;
} else {
    console.log(`✕ HTML Canonical tags validation found ${invalidCanonicalCount} issues.`);
}

console.log("\n=== Summary ===");
if (errors.length === 0) {
    console.log("🎉 ALL VALIDATIONS PASSED PERFECTLY!");
    process.exit(0);
} else {
    console.log(`Found ${errors.length} errors/warnings:`);
    errors.slice(0, 15).forEach(e => console.log(" - " + e));
    if (errors.length > 15) console.log(`... and ${errors.length - 15} more.`);
    process.exit(1);
}
