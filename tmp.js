const { startOfWeek, endOfWeek } = require("date-fns");
const axios = require('axios');
const ical = require('ical');
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

axios.get('https://mytimetable.mmu.ac.uk/ical?6429e4ca&group=false&eu=MjEzMTE0NzhAc3R1Lm1tdS5hYy51aw==&h=wKppztT8PbuCHy9h_qV7VcsVaKLdEI-P45K_GS6kzIQ=')
    .then(function (response) {
        let todaysDate = new Date; // get current date
        const weekStart = startOfWeek(todaysDate, {weekStartsOn: 1});
        const weekEnd = endOfWeek(todaysDate, {weekStartsOn: 1});

        var data = ical.parseICS(response.data);
        for (let k in data) {
            if (data.hasOwnProperty(k)) {
                var ev = data[k];
                if (data[k].type == 'VEVENT') {
                    let requirements = new Date(ev.start) > weekStart
                                    && new Date(ev.start) < weekEnd;

                    if (requirements) {
                        console.log(`${ev.summary.toUpperCase()} is in ${ev.location.replace("     -     ", " - ")} on the ${ev.start.getDate()} of ${months[ev.start.getMonth()]} at ${ev.start.toLocaleTimeString('en-GB')}`);
                    }
                }
            }
        }
    });