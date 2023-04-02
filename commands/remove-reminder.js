const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');

// Define a path to the file to store the events
const eventsFilePath = './events.json';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove-reminder')
        .setDescription('Clear a saved reminder by name or all reminders')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('The name of the reminder to delete. Leave blank to clear all reminders.')
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
                await interaction.reply(`All reminder have been cleared.`);
            } 
            else 
            {
                const filteredEvents = events.filter(event => event.name !== eventName);
                fs.writeFileSync(eventsFilePath, JSON.stringify(filteredEvents));
                await interaction.reply(`The reminder "${eventName}" has been cleared.`);
            }
        } catch (err) 
        {
            console.error(`Error clearing reminder: ${err}`);
            await interaction.reply('An error occurred while clearing the reminder.');
        }
    },
};
