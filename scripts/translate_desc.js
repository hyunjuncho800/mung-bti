const fs = require('fs');
const { translate } = require('@vitalets/google-translate-api');

let foodData = JSON.parse(fs.readFileSync('food_data.json', 'utf8'));

async function translateAll() {
    let count = 0;
    for (const food of foodData) {
        // Check if description_en is the same as description (meaning it's untranslated)
        if (food.description_en === food.description) {
            try {
                console.log('Translating description for ' + food.name_en);
                const descRes = await translate(food.description, { to: 'en' });
                food.description_en = descRes.text;
                count++;
                
                // Save incrementally
                fs.writeFileSync('food_data.json', JSON.stringify(foodData, null, 2));
                
                // 1.5 second delay to avoid rate limit
                await new Promise(r => setTimeout(r, 1500));
            } catch (err) {
                console.error('Error translating ' + food.name + ':', err.message);
                // Backoff
                await new Promise(r => setTimeout(r, 5000));
            }
        }
    }
    console.log('Finished translating ' + count + ' descriptions.');
}

translateAll();
