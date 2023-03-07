const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('weather')
        .setDescription('Get the weather for a city')
        .addStringOption(option => option.setName('city').setDescription('The city to check the weather for').setRequired(true)),
    async execute(interaction) {
        const city = interaction.options.getString('city');
        const api_key = 'a5c5343d1c1ca65d0c318fff8ced79d6'; // Replace with your API key
        const base_url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}&units=metric`;

        // Send request to OpenWeatherMap API
        const response = await fetch(base_url);
        const data = await response.json();
        if (response.status === 404) {
            await interaction.reply('City not found.');
        } else {
            //Parse the relevant weather data

            const temperature = data.main.temp;
            const weatherIcon = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;
            const feels_like = data.main.feels_like;
            const humidity = data.main.humidity;
            const weather_description = data.weather[0].description;
            await interaction.reply(`**${city}** - Temperature: ${temperature}°C, Feels like: ${feels_like}°C, Humidity: ${humidity}%, Description: ${weather_description}`);
        }
    },
};