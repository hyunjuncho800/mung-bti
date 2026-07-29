const fs = require('fs');
const code = `
// ===== Mobile Menu Toggle =====
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('nav');
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
});
`;
fs.appendFileSync('i18n.js', code, 'utf8');
console.log('Appended to i18n.js');
