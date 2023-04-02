const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');

// Define a path to the file to store the events
const eventsFilePath = './events.json';

// Load existing events from file, or initialize an empty array
let events = [];
try {
  const eventsData = fs.readFileSync(eventsFilePath, 'utf8');
  events = JSON.parse(eventsData);
} catch (err) {
  console.error(`Error loading events file: ${err}`);
}

module.exports = 
{
  data: new SlashCommandBuilder()
    .setName('reminder-list')
    .setDescription('Show list of saved reminders'),
  async execute(interaction) {
    let eventList = 'List of saved reminders:\n';
    try 
    {
      const eventsData = fs.readFileSync(eventsFilePath, 'utf8');
      events = JSON.parse(eventsData);
    } 
    catch (err) 
    {
      console.error(`Error loading reminder file: ${err}`);
    }
    if (!events || events.length === 0) 
    { // check if events is undefined or empty
      eventList += 'No reminder saved.';
    } 
    else 
    {
      events.sort((a, b) => new Date(a.date) - new Date(b.date)); // sort events by date
      events.forEach((value) => {
        const timeDiff = new Date(value.date).getTime() - new Date().getTime();
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
        const seconds = Math.floor((timeDiff / 1000) % 60);
        eventList += `- ${value.name} (${days} days, ${hours} hours, ${minutes} minutes, and ${seconds} seconds)\n`;
      });
    }
    await interaction.reply(eventList);
  },
};
