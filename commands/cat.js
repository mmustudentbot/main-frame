const { SlashCommandBuilder } = require('discord.js');
const { request } = require('undici');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cat')
        .setDescription('This sends a random image of a cat.'),
    async execute(interaction) {
        const catResult = await request('https://aws.random.cat/meow');
        const { file } = await catResult.body.json();
        await interaction.reply({ files: [file] });
    },
};