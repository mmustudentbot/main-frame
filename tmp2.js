const { startOfWeek, endOfWeek } = require("date-fns");

const date = new Date;
const start = startOfWeek(date, {weekStartsOn: 1});
const end = endOfWeek(date, {weekStartsOn: 1});

console.log(start)
console.log(end)