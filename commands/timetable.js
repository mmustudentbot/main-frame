const { SlashCommandBuilder } = require('discord.js');
const csv = require('csvtojson');
const sqlite3 = require('sqlite3');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timetable')
        .setDescription('Access your timetable')
        .addSubcommand(subcommand => subcommand
            .setName('set')
            .setDescription('Set your timetable data')
            .addStringOption(option => 
                option.setName('url')
                    .setDescription('URL of the myTimetable CSV export. Please make sure it is only for a week.')
                    .setRequired(true))
        )
        .addSubcommand(subcommand => subcommand
            .setName('view')
            .setDescription('View your timetable')
        )
    ,async execute(interaction) {
        if (!interaction.isCommand()) return;

        switch(interaction.options.getSubcommand()) {
            case "set":
                await interaction.reply('set!!');
                break;
            case "view":
                let output = [];
                let timetable = await csv().fromFile('sample-data/timetable_2023-03-07.csv');
                timetable.forEach(session => {
                    let description = session["Activity description"].toUpperCase();
                    let day = session["Start day"];
                    let start_time = session["Start time"];
                    let end_time = session["End time"];
                    let duration = session["Duration"];
                    let location = session["Location(s)"].replace("     -     ", " - ");

                    output.push({name: description, value: `${day}: ${start_time} - ${end_time}, a total of ${duration} hours.\nAt ${location}.`})
                })

                await interaction.reply({embeds: [{
                    color: 0xfd9e5f,
                    title: `Timetable for ${interaction.user.id}`,
                    thumbnail: {
                        url: 'https://i.imgur.com/TvnoxGp.png',
                    },
                    fields: output,
                }]});
                break;
        }
    },
};