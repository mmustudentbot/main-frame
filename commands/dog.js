const { SlashCommandBuilder } = require('discord.js');
const { request } = require('undici');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dog')
        .setDescription('This sends a random image of a dog.'),
    async execute(interaction) {
        const catResult = await request('https://random.dog/woof.json'); //old https://aws.random.cat/meow
        const { url } = await catResult.body.json();
        await interaction.reply({ files: [url] });
    },
};