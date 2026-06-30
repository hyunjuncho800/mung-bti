const fs = require('fs');

const clothingEn = {
    1: "With a slim body and thin bones, Maltese dogs are sensitive to the cold. In winter, padded jackets or fleece vests are highly recommended. Due to their long, beautiful coat, avoid clothes that cause static or tangling; soft cotton or silk-lined clothes are best. If you keep their coat long, opt for capes or loose-fitting clothing.",
    2: "Poodles have a deep chest and a slim waist. Standard clothes might be tight on the chest or too loose around the waist, so crop-tops or clothes with elastic bands work well. Since their curly fur can easily mat from friction, choose clothes with smooth inner linings. Sleeveless designs are also great to prevent underarm matting.",
    3: "Pomeranians have a voluminous double coat, making them look larger than they are. If you buy clothes based on their visual size, they will be too big. Press their fur down slightly to measure their actual chest girth. Tight clothes can damage their beautiful coat and cause stress, so loose-fitting capes or poncho-style outerwear is ideal.",
    4: "Bichon Frises have sturdy, muscular bodies beneath their fluffy coats. They often have thicker necks and wider chests than Poodles. When choosing clothes, measure their chest girth generously and opt for stretchable fabrics. Since their fur adds volume, it's safer to buy one size larger than their actual body measurements to ensure comfort.",
    5: "Corgis have exceptionally long backs and short legs, along with a thick neck and broad chest. Standard dog clothes will often cover only half of their back or drag on the ground. You must look for brands that offer specialized 'Corgi sizes' or 'Dachshund sizes' (e.g., L-Long, XL-Long). For raincoats, ensure the belly area is well-covered since their short legs bring their bellies close to the ground.",
    6: "As the smallest breed, Chihuahuas have extremely little body fat and are highly sensitive to the cold. Thick, warm clothing is essential from late autumn to early spring. They have relatively deep chests and slender necks, so clothes with a snug collar or a turtleneck design are excellent for keeping them warm. Ensure the clothing isn't too heavy, as it can burden their tiny frames.",
    7: "Shih Tzus have a sturdy, somewhat rectangular body shape with a slightly broad chest. Standard sizes usually fit them quite well. However, since they are a brachycephalic (flat-faced) breed, they struggle with heat regulation. In summer, cooling vests or breathable mesh clothes are highly recommended. Avoid clothes with tight necks that could restrict their breathing.",
    8: "Golden Retrievers are large dogs with thick double coats, so they generally don't need clothes for warmth. However, 'rash guards' or 'cooling vests' are very useful for preventing ticks during hikes or managing heat in summer. For raincoats, choose ones with full belly coverage, as they love splashing in puddles. Since their chest is very broad, adjustable straps are a must.",
    9: "Jindos have a well-proportioned, athletic build with a thick double coat, making them highly resilient to cold weather. Clothing is rarely necessary for warmth. However, during rainy or snowy walks, a well-fitted raincoat can save you from extensive drying time. Ensure the clothing doesn't restrict their highly active and agile movements; sleeveless or harness-integrated vests are good choices.",
    10: "Maltipoos can vary in shape, inheriting traits from either the Maltese or the Poodle. Generally, they have a slender build but with slightly more chest depth than a pure Maltese. Clothes with good elasticity (like spandex blends) accommodate their varying body shapes best. Since their coat is prone to matting, prioritize soft, friction-free fabrics."
};

const data = JSON.parse(fs.readFileSync('breeds_data.json', 'utf8'));

data.forEach(item => {
    if (item.en && clothingEn[item.id]) {
        item.en.clothing = clothingEn[item.id];
    }
});

fs.writeFileSync('breeds_data.json', JSON.stringify(data, null, 4), 'utf8');
console.log('breeds_data.json clothing translated.');
