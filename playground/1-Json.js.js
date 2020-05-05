const fs = require('fs');

const dataBuffer = fs.readFileSync('1-data.json');
const dataJSON = dataBuffer.toString();
const data = JSON.parse(dataJSON);

data.name = 'Nil Deb';
data.age = 25;

fs.writeFileSync('1-data.json', JSON.stringify(data));