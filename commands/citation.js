const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('citation')
        .setDescription('gives a formatted citation for a book')
        .addStringOption(option => 
            option.setName('title')
                .setDescription('Title of the book')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('surname')
                .setDescription('Authors Surname')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('firstname')
                .setDescription('Authors Firstname')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('year')
                .setDescription('Year Published. If no year, leave blank')
                .setRequired(true))

        ,
    async execute(interaction) {
        let surname = interaction.options.getString('surname');
        let firstname = interaction.options.getString('firstname');
        let year = interaction.options.getString('year');
        let title = interaction.options.getString('title');

        if (year === null){
            year = "n.d."
        }

        let citation = surname + ", " + firstname.charAt(0) + ". (" + year + ") " + title

        let inText = "(" + surname + ", " + year + ")"

        let reply = "reference list - " + citation + "\n in-text - " + inText 
        await interaction.reply(reply);
        
    },
};