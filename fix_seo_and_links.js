const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://mung-test.com';

// 1. Determine canonical clean URL for a relative file path
function getCleanUrlForFile(relPath) {
    relPath = relPath.replace(/\\/g, '/');
    if (relPath.startsWith('./')) relPath = relPath.slice(2);

    if (relPath === 'index.html') return `${DOMAIN}/`;
    if (relPath === 'breeds.html') return `${DOMAIN}/breeds`;
    if (relPath === 'diagnostics.html') return `${DOMAIN}/diagnostics`;
    if (relPath === 'blog.html') return `${DOMAIN}/blog`;
    if (relPath === 'food-guide.html' || relPath === 'food.html') return `${DOMAIN}/food-guide`;
    if (relPath === 'travel.html') return `${DOMAIN}/travel`;
    if (relPath === 'mung-test.html') return `${DOMAIN}/mung-test`;
    if (relPath === 'size-calculator.html') return `${DOMAIN}/size-calculator`;
    if (relPath === 'age-calculator.html') return `${DOMAIN}/age-calculator`;
    if (relPath === 'about.html') return `${DOMAIN}/about`;
    if (relPath === 'terms.html') return `${DOMAIN}/terms`;
    if (relPath === 'privacy.html') return `${DOMAIN}/privacy`;
    if (relPath === 'contact.html') return `${DOMAIN}/contact`;
    if (relPath === 'rss/index.html') return `${DOMAIN}/rss`;

    // post-N.html -> /blog/N
    const postMatch = relPath.match(/^post-(\d+)\.html$/);
    if (postMatch) return `${DOMAIN}/blog/${postMatch[1]}`;

    // blog/N/index.html -> /blog/N
    const blogMatch = relPath.match(/^blog\/(\d+)\/index\.html$/);
    if (blogMatch) return `${DOMAIN}/blog/${blogMatch[1]}`;

    // breeds/N/index.html -> /breeds/N
    const breedsMatch = relPath.match(/^breeds\/(\d+)\/index\.html$/);
    if (breedsMatch) return `${DOMAIN}/breeds/${breedsMatch[1]}`;

    // food/N/index.html -> /food/N
    const foodMatch = relPath.match(/^food\/(\d+)\/index\.html$/);
    if (foodMatch) return `${DOMAIN}/food/${foodMatch[1]}`;

    // Default fallback
    let clean = relPath.replace(/\/index\.html$/, '').replace(/\.html$/, '');
    return `${DOMAIN}/${clean}`;
}

// 2. Cleanup HTML hrefs & canonical/og:url
function cleanHtmlContent(filePath, relPath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Replacement map for internal hrefs
    const hrefReplacements = [
        // index.html?start=true -> /mung-test
        [/\bhref=["'](?:\/|\.\/)?index\.html\?start=true["']/g, 'href="/mung-test"'],

        [/\bhref=["'](?:\.\/)?index\.html["']/g, 'href="/"'],
        [/\bhref=["'](?:\.\/)?breeds\.html["']/g, 'href="/breeds"'],
        [/\bhref=["'](?:\.\/)?diagnostics\.html["']/g, 'href="/diagnostics"'],
        [/\bhref=["'](?:\.\/)?blog\.html["']/g, 'href="/blog"'],
        [/\bhref=["'](?:\.\/)?food-guide\.html["']/g, 'href="/food-guide"'],
        [/\bhref=["'](?:\.\/)?food\.html["']/g, 'href="/food-guide"'],
        [/\bhref=["'](?:\.\/)?travel\.html["']/g, 'href="/travel"'],
        [/\bhref=["'](?:\.\/)?mung-test\.html(?:\?start=true)?["']/g, 'href="/mung-test"'],
        [/\bhref=["'](?:\.\/)?size-calculator\.html["']/g, 'href="/size-calculator"'],
        [/\bhref=["'](?:\.\/)?age-calculator\.html["']/g, 'href="/age-calculator"'],
        [/\bhref=["'](?:\.\/)?about\.html["']/g, 'href="/about"'],
        [/\bhref=["'](?:\.\/)?terms\.html["']/g, 'href="/terms"'],
        [/\bhref=["'](?:\.\/)?privacy\.html["']/g, 'href="/privacy"'],
        [/\bhref=["'](?:\.\/)?contact\.html["']/g, 'href="/contact"'],

        // Root relative hrefs with .html
        [/\bhref=["']\/index\.html["']/g, 'href="/"'],
        [/\bhref=["']\/breeds\.html["']/g, 'href="/breeds"'],
        [/\bhref=["']\/diagnostics\.html["']/g, 'href="/diagnostics"'],
        [/\bhref=["']\/blog\.html["']/g, 'href="/blog"'],
        [/\bhref=["']\/food-guide\.html["']/g, 'href="/food-guide"'],
        [/\bhref=["']\/food\.html["']/g, 'href="/food-guide"'],
        [/\bhref=["']\/travel\.html["']/g, 'href="/travel"'],
        [/\bhref=["']\/mung-test\.html(?:\?start=true)?["']/g, 'href="/mung-test"'],
        [/\bhref=["']\/size-calculator\.html["']/g, 'href="/size-calculator"'],
        [/\bhref=["']\/age-calculator\.html["']/g, 'href="/age-calculator"'],
        [/\bhref=["']\/about\.html["']/g, 'href="/about"'],
        [/\bhref=["']\/terms\.html["']/g, 'href="/terms"'],
        [/\bhref=["']\/privacy\.html["']/g, 'href="/privacy"'],
        [/\bhref=["']\/contact\.html["']/g, 'href="/contact"'],

        // Alias hrefs cleanup to match unified clean URLs
        [/\bhref=["']\/encyclopedia["']/g, 'href="/breeds"'],
        [/\bhref=["']\/self-diagnosis["']/g, 'href="/diagnostics"'],
        [/\bhref=["']\/food["']/g, 'href="/food-guide"'],
        [/\bhref=["']\/personality-test["']/g, 'href="/mung-test"'],
        [/\bhref=["']\/test["']/g, 'href="/mung-test"'],
        [/\bhref=["']\/size-recommend["']/g, 'href="/size-calculator"'],
        [/\bhref=["']\/age-calc["']/g, 'href="/age-calculator"'],

        // post-N.html -> /blog/N
        [/\bhref=["'](?:\/|\.\/)?post-(\d+)\.html["']/g, 'href="/blog/$1"'],
        // /blog/N/index.html -> /blog/N
        [/\bhref=["']\/blog\/(\d+)\/index\.html["']/g, 'href="/blog/$1"']
    ];

    for (const [pattern, replacement] of hrefReplacements) {
        content = content.replace(pattern, replacement);
    }

    // Canonical & og:url handling
    const cleanUrl = getCleanUrlForFile(relPath);

    // Canonical tag update or insert
    const canonicalRegex = /<link\s+rel=["']canonical["']\s+href=["'][^"']*["']\s*\/?>/i;
    const newCanonical = `<link rel="canonical" href="${cleanUrl}">`;

    if (canonicalRegex.test(content)) {
        content = content.replace(canonicalRegex, newCanonical);
    } else {
        // Insert before </head> if missing
        if (content.includes('</head>')) {
            content = content.replace(/<\/head>/i, `    ${newCanonical}\n</head>`);
        } else if (content.includes('<head>')) {
            content = content.replace(/<head>/i, `<head>\n    ${newCanonical}`);
        }
    }

    // og:url tag update
    const ogUrlRegex = /<meta\s+property=["']og:url["']\s+content=["'][^"']*["']\s*\/?>/i;
    const newOgUrl = `<meta property="og:url" content="${cleanUrl}">`;

    if (ogUrlRegex.test(content)) {
        content = content.replace(ogUrlRegex, newOgUrl);
    }

    fs.writeFileSync(filePath, content, 'utf8');
}

// 3. Traversal
let updatedCount = 0;

function walkDir(dir) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
        if (item === '.git' || item === 'node_modules' || item === 'scripts') continue;
        const fullPath = path.join(dir, item);
        const relPath = path.relative('.', fullPath);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            walkDir(fullPath);
        } else if (item.endsWith('.html')) {
            cleanHtmlContent(fullPath, relPath);
            updatedCount++;
        }
    }
}

walkDir('.');
console.log(`Cleaned links & canonical tags in ${updatedCount} HTML files.`);
