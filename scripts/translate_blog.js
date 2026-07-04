const fs = require('fs');
const path = require('path');

async function translateBlog() {
    const { translate } = await import('@vitalets/google-translate-api');
    
    const inputPath = path.join(__dirname, '../blog_data.json');
    const outputPath = path.join(__dirname, '../blog_data_en.json');
    
    console.log('Reading blog_data.json...');
    const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
    
    console.log(`Found ${data.length} blog posts to translate.`);
    
    const translatedData = [];
    
    for (let i = 0; i < data.length; i++) {
        const post = data[i];
        console.log(`Translating post ID ${post.id}: ${post.title}`);
        
        try {
            // Translate title
            const titleRes = await translate(post.title, { to: 'en' });
            // Translate category
            const categoryRes = await translate(post.category, { to: 'en' });
            
            // Translate tags
            const translatedTags = [];
            for (const tag of post.tags) {
                const tagRes = await translate(tag, { to: 'en' });
                translatedTags.push(tagRes.text);
            }
            
            // Translate content (which contains HTML tags)
            // google-translate-api preserves HTML but can sometimes add spaces around tags.
            const contentRes = await translate(post.content, { to: 'en' });
            
            translatedData.push({
                id: post.id,
                title: titleRes.text,
                category: categoryRes.text,
                tags: translatedTags,
                content: contentRes.text
            });
            
            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (err) {
            console.error(`Error translating post ID ${post.id}:`, err.message);
            // Fallback to original text if translation fails
            translatedData.push(post);
        }
    }
    
    fs.writeFileSync(outputPath, JSON.stringify(translatedData, null, 4), 'utf8');
    console.log(`Translation complete. Saved to blog_data_en.json`);
}

translateBlog().catch(console.error);
