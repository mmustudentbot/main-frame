const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('define')
        .setDescription('Get the definition of a word.')
        .addStringOption(option =>
            option.setName('word')
            .setDescription('The word to define.')
            .setRequired(true)),
    async execute(interaction) {
        const userWord = interaction.options.getString('word');

        try {
            const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${userWord}`)

            const footerImage = "https://media.discordapp.net/attachments/908497909606141963/1088247465439936602/5027435.png?width=563&height=563";
            const data = response.data;
            var wordDefiniton = (data[0].meanings[0].definitions[0].definition)
            var wordType = (data[0].meanings[0].partOfSpeech)
            var wordSource = (data[0].sourceUrls[0])


            let embed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle(userWord)
                .addFields({
                    name: `**${userWord}**: ${wordDefiniton}`,
                    value: `Word Type: **${wordType}**\nWord Definition Source: **${wordSource}**`
                })
                .setFooter({ text: 'Powered by Dictionary API', iconURL: `${footerImage}` });
            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Sorry, there was an error processing your request.', ephemeral: true });
        }
    },
};