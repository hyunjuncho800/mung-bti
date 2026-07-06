const fs = require('fs');

let foodData = JSON.parse(fs.readFileSync('food_data.json', 'utf8'));

async function translateAll() {
    let count = 0;
    for (const food of foodData) {
        if (food.description_en === food.description) {
            try {
                console.log('Translating description for ' + food.name_en);
                const res = await fetch('https://translate.googleapis.com/translate_a/single?client=gtx&sl=ko&tl=en&dt=t&q=' + encodeURIComponent(food.description));
                const json = await res.json();
                const translated = json[0].map(item => item[0]).join('');
                
                food.description_en = translated;
                count++;
                
                fs.writeFileSync('food_data.json', JSON.stringify(foodData, null, 2));
                
                await new Promise(r => setTimeout(r, 1000));
            } catch (err) {
                console.error('Error translating ' + food.name + ':', err.message);
                await new Promise(r => setTimeout(r, 5000));
            }
        }
    }
    console.log('Finished translating ' + count + ' descriptions.');
}

translateAll();
