const Discord = require("discord.js");

const token = process.env.token;

const weather = require('weather-js');

const PREFIX = '$';

const bot = new Discord.Client();

bot.on('ready', () => {
  console.log(`${bot.user.tag} has logged in.`);
});


// Break

const isValidCommand = (message, cmdName) => message.content.toLowerCase().startsWith(PREFIX + cmdName)
const rollDice = () => Math.floor(Math.random() * 6) + 1;
const checkPermissionRole = (role) => role.permissions.has('ADMINISTRATOR') || role.permissions.has('KICK_MEMBERS') || 
role.permissions.has('BAN_MEMBERS') ||role.permissions.has('MANAGE_GUILD') ||role.permissions.has('MANAGE_CHANNELS')

bot.on('message', async function(message) {
  if(message.author.bot) return;
  

  if(isValidCommand(message, 'hello'))
    message.reply('Hello!');
  else if(isValidCommand(message, 'rolldice')) 
    message.reply('rolled a ' + rollDice());
  else if(isValidCommand(message, 'add')) {
    message.delete()
    let args = message.content.toLowerCase().substring(5);
    let roleNames = args.split(", ");
    let roleSet = new Set(roleNames);
    let { cache } = message.guild.roles;  

    roleSet.forEach(roleName => {
      let role = cache.find(role => role.name.toLowerCase() === roleName);
    if(role) {
      if(message.member.roles.cache.has(role.id)) {
        message.channel.send("You already have this role!");
        return;
      }
      if(checkPermissionRole(role)){
          message.channel.send("You cannot add yourself to this role.");
      }
      else {
        message.member.roles.add(role)
        .then(member => message.channel.send("You were added to this role!"))
        .catch(err => {
          console.log(err);
          message.channel.send("Something went wrong....");
        });
      }
    } 
    else {
      message.channel.send("Role not found!");
    }

    });
     

    }
    else if(isValidCommand(message, "del")) {
      message.delete()
    let args = message.content.toLowerCase().substring(5);
    let roleNames = args.split(", ");
    let roleSet = new Set(roleNames);
    let { cache } = message.guild.roles; 
    roleSet.forEach(roleName => {
      let role = cache.find(role => role.name.toLowerCase() === roleName);
    if(role) {
      if(message.member.roles.cache.has(role.id)) {
        message.member.roles.remove(role)
        .then(member => message.channel.send("You were removed from this role!"))
        .catch(err => {
          console.log(err);
          message.channel.send("Something went wrong....");
        });
      
      }
    } 
    else {
      message.channel.send("Role not found!");
    }

    });

  }
  else if (isValidCommand(message, "embed")) {
    let embedContent = message.content.substring(7);
    // let embed = new Discord.MessageEmbed();
    // embed.setDescription(embedContent);
    // embed.setColor(colors.black);
    // embed.setTitle('New Embed Message Created');
    // embed.setTimestamp()
    // message.channel.send(embed);
    
    let embed = {
      image: {
        url: message.author.displayAvatarURL()
      },
      description: embedContent,
      thumbnail: {
        url: message.author.displayAvatarURL()
      },
      timestamp: new Date()
    }
    message.channel.send({ embed: embed });

  }
  else if (isValidCommand(message, "say")) {
    message.delete()
    let announcement = message.content.substring(5);
    let announcementsChannel = bot.channels.cache.get('689368138038771730');
    let genralChannel = bot.channels.cache.find(channel => channel.name.toLowerCase() === '『📢』annoucement');
    let embed = new Discord.MessageEmbed();
    if(announcementsChannel)
    embed.addField('**Announcement**', announcement);
    embed.setColor(000000);
    embed.setFooter('Announced by Staff')
    announcementsChannel.send(embed);
    
  }
  else if (isValidCommand(message, 'ban')) {
    message.delete()
    if (!message.member.hasPermission('BAN_MEMBERS')) {
      message.channel.send("You don't have permission to use this command.");
      
    }
    else {
       let memberId = message.content.substring(message.content.indexOf(' ') + 1);
      // let member = message.guild.members.cache.get(memberId);
      // if(member) {
      //   member.ban();
      // }
      // else {
      //   message.channel.send("Member does not exist.");
      // }
      try {
        let bannedMember = await message.guild.members.ban(memberId);
        if(bannedMember) {
          console.log(bannedMember.tag + " Was banned. "); 
        }
        else {
          console.log("Banned did not happen.");
        }
      }
      catch(err) {
        console.log(err);
      }
    }
  }
  else if (isValidCommand(message, 'kick')) {
    message.delete()
    if(!message.member.hasPermission('KICK_MEMBERS')) {
      message.channel.send("You don't have permission to use this command.");
    }
    else {
      let memberId = message.content.substring(message.content.indexOf(' ') + 1);
      let member = message.guild.members.cache.get(memberId);
      if (member) {
        try {
          await member.kick();
          console.log(' A member was kicked. ')
        }
        catch(err) {
          console.log(err);
        }
      }
      
    }
  }
  else if (isValidCommand(message, 'mute')) {
    message.delete()
    if (!message.member.hasPermission(['KICK_MEMBERS', 'BAN_MEMBERS'])){
      message.channel.send("You don't have permission to use this command.");
    }
    else {
      let memberId = message.content.substring(message.content.indexOf(' ') + 1);
      let member = message.guild.members.cache.get(memberId);
      if (member) {
        if (member.hasPermission(['KICK_MEMBERS', 'BAN_MEMBERS']) && !message.member.hasPermission('ADMINISTRATOR')) {
          message.channel.send("You cannot mute that person!");
        }
        else {
          let mutedRole = message.guild.roles.cache.get('688858722134655103');
          if (mutedRole) {
            member.roles.add(mutedRole);
            message.channel.send("User was muted.");
          }
          else {
            message.channel.send("Muted role not found.");
          }
        }
      }
      else {
        message.channel.send("Member not found.");
      }
    }
  }
  else if (isValidCommand(message, "unmute")) {
    message.delete()
    if (!message.member.hasPermission(['KICK_MEMBERS', 'BAN_MEMBERS'])){
      message.channel.send("You don't have permission to use this command.");
    }
    else {
      let memberId = message.content.substring(message.content.indexOf(' ') + 1);
      let member = message.guild.members.cache.get(memberId);
      if (member) {
        if (member.hasPermission(['KICK_MEMBERS', 'BAN_MEMBERS']) && !message.member.hasPermission('ADMINISTRATOR')) {
          message.channel.send("You cannot mute that person!");
        }
        else {
          let mutedRole = message.guild.roles.cache.get('688858722134655103');
          if (mutedRole) {
            member.roles.remove(mutedRole);
            message.channel.send("User was unmuted.");
          }
          else {
            message.channel.send("Muted role not found.");
          }
        }
      }
      else {
        message.channel.send("Member not found.");
      }
    } 
  } else if (message.content.toLowerCase() === "!say") {
      message.delete()
      let announcement = message.content.substring(5);
      let announcementsChannel = bot.channels.cache.get('794109492794884106');
      let embed = new Discord.MessageEmbed();
      if(announcementsChannel)
      embed.addField('**Announcement**', announcement);
      embed.setColor(000000);
      embed.setFooter('Announced by Staff')
      announcementsChannel.send(embed);
  }

});

// Break 

// Break 

bot.on("message", async message => {
  let args = message.content.substring(PREFIX.length).split(" ");
  if (message.author.bot) return;

if (message.content.startsWith('WEATHER') || (message.content.startsWith('weather'))){
  weather.find({search: args.join(" "), degreeType: 'F'}, function(err, result){
    if (err) message.channel.send(err);
    if (result.length === 0){
      message.channel.send('**Please enter a valid location.**')
      return;
    }
    var current = result[0].current;
    var location = result[0].location;
    const uEmbed = new Discord.MessageEmbed()
      .setDescription(`**${current.skytext}**`)
      .setAuthor(`Weather for ${current.observationpoint}`)
      .setThumbnail(current.imageUrl)
      .setColor(0x00AE86)
      .addField(`Timezone`,`UTC${location.timezone}`, true)
      .addField(`Degree Type`,location.degreetype, true)
      .addField(`Temperature`,`${current.temperature} Degrees`, true)
      .addField(`Feels Like`, `${current.feelslike} Degree`,true)
      .addField(`Winds`,current.winddisplay, true)
      .addField(`Humidity`, `${current.humidity}%`, true)
      message.channel.send({embed: uEmbed});

  });
}
})

// Break 

bot.login(token);