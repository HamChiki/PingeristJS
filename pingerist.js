const { Client, Permissions, MessageActionRow, MessageEmbed, MessageButton } = require("discord.js");
const axios = require("axios");
const row = MessageActionRow;
const button = MessageButton;
const perms = Permissions;
const embed = MessageEmbed;
const { prefix, r1, r2, token, r1e, c1, c2, c3 } = require("./config.json");
const client = new Client({
  intents: 32767,
});

//=============================================
const channel_id = "1008592723290357870"
//=============================================

client.on('ready', async () => {
  console.log(`${client.user.tag}`)
  client.user.setStatus("online")
  client.user.setActivity(`Pings!`, { type: 'WATCHING' });
  const guild = client.guilds.cache.get('1007590407460372533');
  client.channels.cache.get('1007841391419859066').setName(`😳 Total - ${guild.memberCount}`);
  client.channels.cache.get('1007841432335286272').setName(`🔴 Users - ${guild.members.cache.filter(member => !member.user.bot).size}`);
  client.channels.cache.get('1007841497758044261').setName(`👾 Bots - ${guild.members.cache.filter(member => member.user.bot).size}`);

  function statusCount() {
    client.channels.cache.get('1007842623186276443').setName(`🟢 ${guild.members.cache.filter(m => m.presence?.status == 'online').size} ⛔ ${guild.members.cache.filter(m => m.presence?.status == 'dnd').size} 🌙 ${guild.members.cache.filter(m => m.presence?.status == 'idle').size} ⚫ ${guild.members.cache.filter(m => m.presence?.status == 'offline' || !m.presence).size}`);
  } statusCount()
  setInterval(() => {
    statusCount()
  }, 600000)
});
async function errorEmbed(text, message) {
  const newembed = new MessageEmbed()
    .setColor("#FF7676")
    .setDescription(`**❌ | ${text} **`)
  return message.channel.send({ embeds: [newembed] });
}
client.on('message', async (message) => {
  if (!message.guild) return;
  if (message.author.bot) return;
  try {
    if (message.channel.id != channel_id) return
    let res = await axios.get(`http://api.brainshop.ai/get?bid=165279&key=Fhi92uMKIcLdP5tj&uid=1&msg=${encodeURIComponent(message.content)}`);
    message.reply(res.data.cnt);
  } catch {
    errorEmbed(`Bot error, please try again!`, message)
  }
})

client.on("messageCreate", async (message) => {
  if (message.content == `${prefix}role`) {
    if (!message.member.permissions.has(perms.FLAGS.ADMINISTRATOR)) {
      message.channel.send(":x: | Admin Perms needed to execute this command");
    }
    if (message.member.permissions.has(perms.FLAGS.ADMINISTRATOR)) {
      const rw = new row().addComponents(
        new button()
          .setCustomId("r1")
          .setLabel("Pingerist")
          .setStyle("DANGER")
          .setEmoji(r1e),
        new button()
          .setCustomId("r2")
          .setLabel("Remove")
          .setStyle("SECONDARY")
          .setEmoji("❌")
      );
      const roles = new embed()
        .setColor("#ff0000")
        .setFooter({ text: `Hachiki loves you <3` })
        .setTitle(`Pingerist`)
        .setDescription(
          `Click the first button to start getting pinged.\nClick the second button to enter the Peaceful world.`
        );
      message.channel.send({ embeds: [roles], components: [rw] });
    }
  }
  if (message.content == `${prefix}crole`) {
    if (!message.member.permissions.has(perms.FLAGS.ADMINISTRATOR)) {
      message.channel.send(":x: | Admin Perms needed to execute this command");
    }
    if (message.member.permissions.has(perms.FLAGS.ADMINISTRATOR)) {
      const crw = new row().addComponents(
        new button()
          .setCustomId("c1")
          .setLabel("Chaos")
          .setStyle("PRIMARY")
          .setEmoji("☠"),
        new button()
          .setCustomId("c2")
          .setLabel("Normal!")
          .setStyle("SECONDARY")
          .setEmoji("<:pingerist:1007606143947919381>"),
        new button()
          .setCustomId("c3")
          .setLabel("Peaceful world!!")
          .setStyle("SUCCESS")
          .setEmoji("😇")
      );
      const crole = new embed()
        .setColor("#900b0b")
        .setFooter({ text: "Please think about it.." })
        .setTitle("Chaos Pings")
        .setDescription(
          `Click the Chaos button to start...\nYou can still go back in normal by clicking the 2nd button.\n3rd button will let you in peace.`
        )
      message.channel.send({ embeds: [crole], components: [crw] }).then(msg => {
        message.delete()
      });
    }
  }
});

client.on('guildMemberAdd', async (member) => {
  member.roles.add("1007633515178885151");
  const guild = await client.guilds.cache.get('1007590407460372533');
  client.channels.cache.get('1007841391419859066').setName(`😳 Total - ${guild.memberCount}`);
  client.channels.cache.get('1007841432335286272').setName(`🔴 Users - ${guild.members.cache.filter(member => !member.user.bot).size}`);
  client.channels.cache.get('1007841497758044261').setName(`👾 Bots - ${guild.members.cache.filter(member => member.user.bot).size}`);
});

client.on('guildMemberRemove', async (member) => {
  const guild = await client.guilds.cache.get('1007590407460372533');
  client.channels.cache.get('1007841391419859066').setName(`😳 Total - ${guild.memberCount}`);
  client.channels.cache.get('1007841432335286272').setName(`🔴 Users - ${guild.members.cache.filter(member => !member.user.bot).size}`);
  client.channels.cache.get('1007841497758044261').setName(`👾 Bots - ${guild.members.cache.filter(member => member.user.bot).size}`);
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.isButton()) {
    if (interaction.customId == "r1") {
      if (interaction.member.roles.cache.some((role) => role.id == r1)) {
        interaction.reply({
          content: `You have already taken  this role.`,
          ephemeral: true,
        });
      } else {
        interaction.member.roles.add(r1);
        interaction.member.roles.remove(r2);
        await interaction.reply({
          content: `The role <@&${r1}> was added to you.`,
          ephemeral: true,
        });
      }
    } else if (interaction.customId == "r2") {
      if (interaction.member.roles.cache.some((role) => role.id == r2)) {
        interaction.reply({
          content: "You are in Peacuful world already.",
          ephemeral: true,
        });
      } else {
        interaction.member.roles.add(r2);
        interaction.member.roles.remove(r1);
        await interaction.reply({
          content: `The role <@&${r2}> was added to you. You habe entered the the Peacful world.`,
          ephemeral: true,
        });
      }
    } else if (interaction.customId == "c1") {
      if (!interaction.member.permissions.has(perms.FLAGS.ADMINISTRATOR)) {
        interaction.reply({ content: ":x: | Chaos pings will start after we hit 50 users!", ephemeral: true });
      }
      //       if (interaction.member.roles.cache.some((role) => role.id == c1)) {
      //         interaction.reply({
      //           content: "Dude... you already have this role ☠",
      //           ephemeral: true,
      //         });
      //       } else {
      //         interaction.member.roles.add(c1);
      //         interaction.member.roles.remove(c2);
      //         interaction.member.roles.remove(c3);
      //         await interaction.reply({
      //           content: "I hope you know what your doing...",
      //           ephemeral: true,
      //         });
      //       }
    } else if (interaction.customId == "c2") {
      if (!interaction.member.permissions.has(perms.FLAGS.ADMINISTRATOR)) {
        interaction.reply({ content: ":x: | Chaos pings will start after we hit 50 users!", ephemeral: true });
      }
      //       if (interaction.member.roles.cache.some((role) => role.id == c2)) {
      //         interaction.reply({
      //           content: "Umm your already in normal ping..",
      //           ephemeral: true,
      //         }); 
      //       } else {
      //         interaction.member.roles.remove(c1);
      //         interaction.member.roles.add(c2);
      //         interaction.member.roles.remove(c3);
      //         await interaction.reply({
      //           content: "Your at normal ping, good for you.",
      //           ephemeral: true,
      //         });
      //       }
    } else if (interaction.customId == "c3") {
      if (!interaction.member.permissions.has(perms.FLAGS.ADMINISTRATOR)) {
        interaction.reply({ content: ":x: | Chaos pings will start after we hit 50 users!", ephemeral: true });
      }
      //       if (interaction.member.roles.cache.some((role) => role.id == c3)) {
      //         interaction.reply({
      //           content: "Calm down, your already in peaceful world.",
      //           ephemeral: true,
      //         });         
      //       } else {
      //         interaction.member.roles.add(c3);
      //         interaction.member.roles.remove(c2);
      //         interaction.member.roles.remove(c1);
      //         await interaction.reply({
      //           content: "I see... well goodluck!",
      //           ephemeral: true,
      //         });
      //       }
    }
  }
});

client.login(token);
