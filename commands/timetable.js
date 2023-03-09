const { SlashCommandBuilder } = require('discord.js');
const csv = require('csvtojson');
const Datastore = require('nedb');
const https = require("https");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timetable')
        .setDescription('Access your timetable')
        .addSubcommand(subcommand => subcommand
            .setName('set')
            .setDescription('Set your timetable data')
            .addAttachmentOption(option => 
                option.setName('file')
                    .setDescription('File of the myTimetable CSV export. Please make sure it is only for a week.')
                    .setRequired(true))
        )
        .addSubcommand(subcommand => subcommand
            .setName('view')
            .setDescription('View your timetable')
        )
        .addSubcommand(subcommand => subcommand
            .setName('delete')
            .setDescription('Deletes your timetable data')    
        )
    ,async execute(interaction) {
        if (!interaction.isCommand()) return;

        let db = new Datastore({ filename: 'database.db', autoload: true });

        switch(interaction.options.getSubcommand()) {
            case "set":
                let input = [];
                let url = interaction.options.getAttachment("file").attachment;
                https.get(url, function (res) {
                    let data = '';
                    res.on('data', function (chunk) {
                        data += chunk;
                    });
                    res.on('end', function () {
                        csv().fromString(data).then((timetable) => {
                            timetable.forEach(session => {
                                let description = session["Activity description"].toUpperCase();
                                let day = session["Start day"];
                                let start_time = session["Start time"];
                                let end_time = session["End time"];
                                let duration = session["Duration"];
                                let location = session["Location(s)"].replace("     -     ", " - ");

                                input.push({name: description, value: `${day}: ${start_time} - ${end_time}, a total of ${duration} hours.\nAt ${location}.`})
                            })

                            db.remove({ id: interaction.user.id}, {}, (err, numRemoved) => {}); // Delete the old entry.

                            db.insert({
                                id: interaction.user.id,
                                data: input
                            }, (err, newDocs) => { if (err) { console.log(err) }; });
                        });
                    });
                });

                await interaction.reply('set!!');
                break;
            case "view":
                let output = [];
                db.find({ id: interaction.user.id}, async (err, docs) => {
                    try {
                        output = docs[0].data;
                    } catch {
                        output = [{name: "No timetable found.", value: "Please set a timetable."}]
                    }

                    await interaction.reply({embeds: [{
                        color: 0xfd9e5f,
                        title: `Timetable for ${interaction.user.id}`,
                        thumbnail: {
                            url: 'https://i.imgur.com/TvnoxGp.png',
                        },
                        fields: output,
                    }]});

                })
                break;
            case "delete":
                db.remove({ id: interaction.user.id}, {}, (err, numRemoved) => {}); // Delete the old entry.
                await interaction.reply('Data deleted.');
        }
    },
};