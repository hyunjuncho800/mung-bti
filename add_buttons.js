const fs = require('fs');

const diagMapping = {
    1: 'TEST',
    2: 'FOOD',
    3: 'FOOD',
    4: 'TEST',
    5: 'TEST',
    6: 'AGE',
    7: 'FOOD',
    8: 'TEST',
    9: 'TEST',
    10: 'FOOD'
};

const travelMapping = {
    1: 'TEST',
    2: 'TEST',
    3: 'FOOD',
    4: 'SIZE',
    5: 'SIZE',
    6: 'SIZE',
    7: 'SIZE',
    8: 'TEST',
    9: 'TEST',
    10: 'FOOD'
};

function processFile(filename, mapping) {
    const data = JSON.parse(fs.readFileSync(filename, 'utf8'));
    data.forEach(item => {
        item.buttonType = mapping[item.id] || 'TEST';
    });
    fs.writeFileSync(filename, JSON.stringify(data, null, 4), 'utf8');
}

processFile('diagnostics_data.json', diagMapping);
processFile('travel_data.json', travelMapping);
console.log('Button types added.');
