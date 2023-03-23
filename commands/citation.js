const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('citation')
        .setDescription('gives a formatted citation')
        .addStringOption(option => 
            option.setName('title')
                .setDescription('Title')
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
                .setDescription('Year Published.')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('link')
                .setDescription('link to the webpage')
                .setRequired(false))
        ,
    async execute(interaction) {
        let surname = interaction.options.getString('surname');
        let firstname = interaction.options.getString('firstname');
        let year = interaction.options.getString('year');
        let title = interaction.options.getString('title');
        let link = interaction.options.getString("link")

        if (year === null){
            year = "n.d."
        }
       

        let citation = surname + ", " + firstname.charAt(0) + ". (" + year + ") " + title

        let inText = "(" + surname + ", " + year + ")"

        if (link){
            citation = citation + " [online] [accessed on " + new Date().getDate() + "] " + link
        }

        let reply = "reference list - " + citation + "\n in-text - " + inText 
        await interaction.reply(reply);


    },
};