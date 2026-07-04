const fs = require('fs');
const path = require('path');
const { translate } = require('@vitalets/google-translate-api');

const dataPath = path.join(__dirname, '../food_data.json');
let foodData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

async function translateAll() {
    for (const food of foodData) {
        if (!food.name_en || !food.description_en) {
            try {
                const nameRes = await translate(food.name, { to: 'en' });
                const descRes = await translate(food.description, { to: 'en' });
                food.name_en = nameRes.text;
                food.description_en = descRes.text;
                console.log('Translated ' + food.name + ' -> ' + food.name_en);
                await new Promise(r => setTimeout(r, 1000));
            } catch (err) {
                console.error('Error translating ' + food.name + ':', err.message);
                food.name_en = food.name;
                food.description_en = food.description;
            }
        }
    }
    fs.writeFileSync(dataPath, JSON.stringify(foodData, null, 4));
    console.log('Translation complete.');
}
translateAll();
