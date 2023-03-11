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

module.exports = {
  data: new SlashCommandBuilder()
    .setName('countdown')
    .setDescription('Create a countdown for an event')
    .addStringOption((option) =>
      option.setName('event').setDescription('The name of the event').setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('date')
        .setDescription('The date and time of the event (in YYYY-MM-DD HH:MM:SS format)')
        .setRequired(true)
    ),
    async execute(interaction) 
    {
      const event = interaction.options.getString('event');
      const date = interaction.options.getString('date');
      const eventDate = new Date(date);
      const currentDate = new Date();
      const timeDiff = eventDate.getTime() - currentDate.getTime();
      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
      const seconds = Math.floor((timeDiff / 1000) % 60);
    
      const countdownMessage = `Time until ${event}: ${days} days, ${hours} hours, ${minutes} minutes, and ${seconds} seconds`;
    
      // Store the event in the events array
      events.push({ name: event, date: eventDate });
    
      // Save the events array to file
      try {
        const eventsData = JSON.stringify(events, null, 2);
        fs.writeFileSync(eventsFilePath, eventsData);
      } catch (err) {
        console.error(`Error saving events file: ${err}`);
      }
    
      await interaction.reply(countdownMessage);
    }
};
