const https = require("https");
const csv = require('csvtojson');

https.get("https://cdn.discordapp.com/attachments/1081234375913508904/1083188453530947624/timetable_2023-03-07.csv", function (res) {
    let data = '';
    res.on('data', function (chunk) {
        data += chunk;
    });
    res.on('end', function () {
        csv().fromString(data).then((obj) => {
            console.log(obj);
            console.log(data);
        });
    });
});

//let timetable = await csv().fromFile('sample-data/timetable_2023-03-07.csv');