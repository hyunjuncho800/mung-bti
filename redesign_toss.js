const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf8');

// 1. Add IntersectionObserver JS at the end of body
if (!content.includes('IntersectionObserver')) {
    const script = `
<script>
document.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: stop observing once faded in
                // observer.unobserve(entry.target); 
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));
});
</script>
`;
    content = content.replace('</body>', script + '\n</body>');
}

// 2. Add fade-in-up styles and update hover scale
if (!content.includes('.fade-in-up')) {
    const styleStr = `
        /* Toss Redesign Styles */
        .fade-in-up {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s cubic-bezier(0.25, 0.8, 0.25, 1), transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .fade-in-up.visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        /* Apply to components */
        .landing-hero, .core-values, .bento-card, .service-card {
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .bento-card:hover, .service-card:hover {
            transform: scale(1.02) !important;
            box-shadow: 0 12px 30px rgba(0,0,0,0.06) !important;
        }
    </style>`;
    content = content.replace('</style>', styleStr);
}

// 3. Add fade-in-up class to sections
content = content.replace(/<section class="landing-hero"/g, '<section class="landing-hero fade-in-up"');
content = content.replace(/<section class="core-values"/g, '<section class="core-values fade-in-up"');
content = content.replace(/<div class="bento-card/g, '<div class="bento-card fade-in-up"');
content = content.replace(/<a href="([^"]+)" class="service-card"/g, '<a href="$1" class="service-card fade-in-up"');

// 4. Update paddings and margins for Toss style (1.5~2x larger)
// Update landing-hero
content = content.replace(/padding: 60px 20px 40px;/g, 'padding: 100px 20px 80px;');
content = content.replace(/font-size: 2.8rem;/g, 'font-size: 3.5rem; font-weight: 900; letter-spacing: -0.03em;'); // Bolder, larger
content = content.replace(/font-size: 1.15rem;/g, 'font-size: 1.25rem;'); // larger body

// Update services-grid gap
content = content.replace(/gap: 20px;/g, 'gap: 32px;'); // Larger gap
content = content.replace(/padding: 30px 24px;/g, 'padding: 40px 32px;'); // Larger padding inside cards
content = content.replace(/border-radius: 20px;/g, 'border-radius: 16px;'); // Unify radius to 16px

fs.writeFileSync('index.html', content, 'utf8');
console.log('index.html redesigned successfully.');
