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
                    .setDescription('Please enter the iCalendar import url. (This can be found user Connect Calendar > Other)')
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

                await interaction.reply({embeds: [{
                    color: 0xfd9e5f,
                    title: `Timetable for ${interaction.user.id}`,
                    thumbnail: {
                        url: 'https://i.imgur.com/TvnoxGp.png',
                    },
                    fields: [{name: "URL added.", value: "View your timetable by typing `/timetable view`."}],
                }]});
                break;
            case "view":
                db.find({ id: interaction.user.id}, async (err, docs) => {
                    try {
                        let ical_url = docs[0].url;
                        let output = [];

                        axios.get(ical_url).then(function (response) {
                            const todaysDate = new Date; // get current date
                            const weekStart = startOfWeek(todaysDate, {weekStartsOn: 1});
                            const weekEnd = endOfWeek(todaysDate, {weekStartsOn: 1});
                            let data = ical.parseICS(response.data);
                            for (let k in data) {
                                if (data.hasOwnProperty(k)) {
                                    var ev = data[k];
                                    if (data[k].type == 'VEVENT') {
                                        if (new Date(ev.start) > weekStart
                                         && new Date(ev.start) < weekEnd) {
                                            let description = ev.summary.toUpperCase();
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
                    } catch {
                        interaction.reply({embeds: [{
                            color: 0xfd9e5f,
                            title: `Timetable for ${interaction.user.id}`,
                            thumbnail: {
                                url: 'https://i.imgur.com/TvnoxGp.png',
                            },
                            fields: [{name: "No data found.", value: "Please add your URL."}],
                        }]})
                    }
                });
                break;
            case "delete":
                db.remove({ id: interaction.user.id}, {}, (err, numRemoved) => {}); // Delete the old entry.
                await interaction.reply({embeds: [{
                    color: 0xfd9e5f,
                    title: `Timetable for ${interaction.user.id}`,
                    thumbnail: {
                        url: 'https://i.imgur.com/TvnoxGp.png',
                    },
                    fields: [{name: "Data deleted.", value: "If you want to use the command again, please add another URL."}],
                }]});
        }
    },
};