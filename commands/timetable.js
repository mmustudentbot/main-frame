const { SlashCommandBuilder } = require('discord.js');
const Datastore = require('nedb');
const { startOfWeek, endOfWeek } = require("date-fns");
const axios = require('axios');
const ical = require('ical');
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timetable')
        .setDescription('Access your timetable')
        .addSubcommand(subcommand => subcommand
            .setName('set')
            .setDescription('Set your timetable data')
            .addStringOption(option => 
                option.setName('url')
                    .setDescription('url hahahahhahahahaha')
                    .setRequired(true))
        )
        .addSubcommand(subcommand => subcommand
            .setName('view')
            .setDescription('View your timetable')
        )
        .addSubcommand(subcommand => subcommand
            .setName('delete')
            .setDescription('Deletes your timetable data')    
        ),
    async execute(interaction) {
        if (!interaction.isCommand()) return;

        let db = new Datastore({ filename: 'database.db', autoload: true });

        switch(interaction.options.getSubcommand()) {
            case "set":
                let url = interaction.options.getString("url");

                db.remove({ id: interaction.user.id}, {}, (err, numRemoved) => {}); // Delete the old entry.
                db.insert({
                    id: interaction.user.id,
                    url: url
                }, (err, newDocs) => { if (err) { console.log(err) }; });

                await interaction.reply('set!!');
                break;
            case "view":
                db.find({ id: interaction.user.id}, async (err, docs) => {
                    ical_url = docs[0].url;

                    axios.get(ical_url).then(function (response) {
                        const todaysDate = new Date; // get current date
                        const weekStart = startOfWeek(todaysDate, {weekStartsOn: 1});
                        const weekEnd = endOfWeek(todaysDate, {weekStartsOn: 1});

                        let output = []
                        let data = ical.parseICS(response.data);
                        for (let k in data) {
                            if (data.hasOwnProperty(k)) {
                                var ev = data[k];
                                if (data[k].type == 'VEVENT') {
                                    let requirements = new Date(ev.start) > weekStart
                                                    && new Date(ev.start) < weekEnd;
                                                    
                                    if (requirements) {
                                        let description = ev.summary.toUpperCase();
                                        console.log(ev.location)
                                        let location = (ev.location != "") ? `\n*${ev.location.replace("     -     ", " - ")}*` : "";
                                        let day = `${ev.start.getDate()} of ${months[ev.start.getMonth()]}`;
                                        let time = ev.start.toLocaleTimeString('en-GB');

                                        output.push({name: description, value: `${day} at ${time}. ${location}`})
                                    }
                                }
                            }
                        }

                        interaction.reply({embeds: [{
                            color: 0xfd9e5f,
                            title: `Timetable for ${interaction.user.id}`,
                            thumbnail: {
                                url: 'https://i.imgur.com/TvnoxGp.png',
                            },
                            fields: output,
                        }]})
                    });
                });
                break;
            case "delete":
                db.remove({ id: interaction.user.id}, {}, (err, numRemoved) => {}); // Delete the old entry.
                await interaction.reply('Data deleted.');
        }
    },
};