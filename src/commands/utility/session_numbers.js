require("dotenv").config();
const { SlashCommandBuilder } = require("discord.js");
// return session numbers created today

module.exports = {
  data: new SlashCommandBuilder()
    .setName("sessions")
    .setDescription("Replies with number of sessions created today!"),
  async execute(interaction) {
    await interaction.reply(
      `Number of sessions created today : ${(
        await (await fetch(process.env.AF_DB_URL + "/api")).json()
      )
        .filter(
          (session) =>
            new Date(session.meta_data.date_created).toDateString() ===
            new Date().toDateString()
        )
        .length.toString()} sessions`
    );
  },
};
