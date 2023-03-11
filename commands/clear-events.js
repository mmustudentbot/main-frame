const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');

// Define a path to the file to store the events
const eventsFilePath = './events.json';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clear a saved event by name or all events')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('The name of the event to delete. Leave blank to clear all events.')
                .setRequired(false)),
    async execute(interaction) 
    {
        try 
        {
            const eventName = interaction.options.getString('name');
            let events = JSON.parse(fs.readFileSync(eventsFilePath));
            if (!eventName || eventName.toLowerCase() === 'all') 
            {
                events = [];
                fs.writeFileSync(eventsFilePath, JSON.stringify(events));
                await interaction.reply(`All events have been cleared.`);
            } 
            else 
            {
                const filteredEvents = events.filter(event => event.name !== eventName);
                fs.writeFileSync(eventsFilePath, JSON.stringify(filteredEvents));
                await interaction.reply(`The event "${eventName}" has been cleared.`);
            }
        } catch (err) 
        {
            console.error(`Error clearing event: ${err}`);
            await interaction.reply('An error occurred while clearing the event.');
        }
    },
};
