const fs = require('fs');

function updateHtml(filename) {
    let html = fs.readFileSync(filename, 'utf8');
    // We will use a regex to replace the <div> containing the button
    const regex = /<div style="margin-top: 40px; padding: 24px; background: #f0f8ff; border: 2px dashed #1fa2ff; border-radius: 12px; text-align: center;">[\s\S]*?<\/div>/;
    html = html.replace(regex, '<div id="modal-dynamic-btn"></div>');
    fs.writeFileSync(filename, html, 'utf8');
}

updateHtml('diagnostics.html');
updateHtml('travel.html');
console.log('HTML updated.');
