const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3000;
const dir = __dirname;

const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm'
};

const server = http.createServer((req, res) => {
    let urlPath = req.url.split('?')[0];
    
    // Explicit clean URL aliases
    const aliases = {
        '/': 'index.html',
        '/breeds': 'breeds.html',
        '/diagnostics': 'diagnostics.html',
        '/blog': 'blog.html',
        '/food': 'food-guide.html',
        '/travel': 'travel.html',
        '/test': 'mung-test.html',
        '/size-calculator': 'size-calculator.html',
        '/age-calculator': 'age-calculator.html',
        '/about': 'about.html',
        '/terms': 'terms.html',
        '/privacy': 'privacy.html',
        '/contact': 'contact.html'
    };

    let targetFile = aliases[urlPath] ? aliases[urlPath] : urlPath;
    let filePath = path.join(dir, targetFile);

    const serveFile = (actualPath) => {
        const extname = String(path.extname(actualPath)).toLowerCase();
        const contentType = mimeTypes[extname] || 'application/octet-stream';
        fs.readFile(actualPath, (error, content) => {
            if (error) {
                res.writeHead(500);
                res.end('Server error: ' + error.code);
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
            }
        });
    };

    fs.stat(filePath, (err, stats) => {
        if (!err && stats.isFile()) {
            serveFile(filePath);
        } else if (!err && stats.isDirectory()) {
            const indexPath = path.join(filePath, 'index.html');
            fs.stat(indexPath, (err2, stats2) => {
                if (!err2 && stats2.isFile()) serveFile(indexPath);
                else {
                    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
                    res.end(`<h1>404 Not Found</h1><p>${req.url} was not found.</p>`);
                }
            });
        } else if (err && !path.extname(filePath)) {
            const htmlPath = filePath + '.html';
            fs.stat(htmlPath, (err3, stats3) => {
                if (!err3 && stats3.isFile()) serveFile(htmlPath);
                else {
                    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
                    res.end(`<h1>404 Not Found</h1><p>${req.url} was not found.</p>`);
                }
            });
        } else {
            res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(`<h1>404 Not Found</h1><p>${req.url} was not found.</p>`);
        }
    });
});

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
