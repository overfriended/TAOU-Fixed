const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json')

const key = config.key;
const prefix = config.prefix;
const mentionHook = new Discord.WebhookClient("432728110904115211", "zOhqE4JbW3snqJ_XAAPmGLm7O_P67wgXWKJRrPZ2D20cBBgSz19BHQFSOmj5S_0m_ga4");

var eightball = [ // sets the answers to an eightball
  "Yes!",
  "No",
  "Maybe?",
  "Probably",
  "Never!",
  "Likely.",
  "Unlikely.",
]

var bot = new Discord.Client(); // sets Discord.Client to bot

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity(`Serving The Academy of Uthara. Bot made by Reid.`);
});
client.on("guildCreate", guild => {
  // This event triggers when the bot joins a guild.
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
});

client.on("guildDelete", guild => {
  // this event triggers when the bot is removed from a guild.
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  
});
client.on('message', message => {
  if (message.author.id === client.user.id || message.author.bot) return;
  if (message.isMentioned("212789715378765825") || message.mentions.everyone || (message.guild && message.mentions.roles.filter(r => message.guild.member("146048938242211840").roles.has(r.id)).size > 0)) {
      if (message.author.id === "212789715378765825") return;
      // Additional Code
      mentionHook.send("You were mentioned!");
  }
  let args = message.content.slice(prefix.length).trim().split(/ +/g);
  let command = args.shift().toLowerCase();
  if (message.author.equals(bot.user)) return; // if the message is sent by a bot, ignore

    if (!message.content.startsWith(prefix)) return; // if the message doesn't contain PREFIX (*), then ignore
    var mutedrole = message.guild.roles.find("name", "muted");

    if (command == "help") { // creates a command *help
        var embedhelpmember = new Discord.RichEmbed() // sets a embed box to the variable embedhelpmember
            .setTitle("**List of Commands**\n") // sets the title to List of Commands
            .addField(" - help", `Displays this message (Correct usage: ${prefix}help)`) // sets the first field to explain the command *help
            .addField(" - info", `Tells info about myself :grin:`) // sets the field information about the command *info
            .addField(" - ping", `Tests your ping (Correct usage: ${prefix}ping)`) // sets the second field to explain the command *ping
            .addField(" - cookie", `Sends a cookie to the desired player! :cookie: (Correct usage: ${prefix}cookie @username)`) // sets the third field to explain the command *cookie
            .addField(" - 8ball", `Answers to all of your questions! (Correct usage: ${prefix}8ball [question])") // sets the field to the 8ball command`)
            .addField(" - userinfo", `Gives information about yourself.`)
            .setColor(0xFFA500) // sets the color of the embed box to orange
            .setFooter("You need help, do you?") // sets the footer to "You need help, do you?"
        var embedhelpadmin = new Discord.RichEmbed() // sets a embed box to the var embedhelpadmin
            .setTitle("**List of Admin Commands**\n") // sets the title
            .addField(" - say", `Makes the bot say whatever you want (Correct usage: ${prefix}say [message])`)
            .addField(" - mute", `Mutes a desired member with a reason (Coorect usage: ${prefix}mute @username [reason])`) // sets a field
            .addField(" - unmute", `Unmutes a muted player (Correct usage: ${prefix}unmute @username)`)
            .addField(" - kick", `Kicks a desired member with a reason (Correct usage: ${prefix}kick @username [reason])`) //sets a field
            .setColor(0xFF0000) // sets a color
            .setFooter("You are an administrator!") // sets the footer
        message.channel.send(embedhelpmember); // sends the embed box "embedhelpmember" to the chatif
        if(message.member.roles.some(r=>["bot-admin"].includes(r.name)) || message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(embedhelpadmin); // if member is a botadmin, display this too
    }

    if (command == "info") { // creates the command *info
        message.channel.send(`Hey! My name is <@${client.user.id}> or ${client.user.username}. My id is ${client.user.id}. My entire tag is ${client.user.tag}. I was born on ${client.user.createdAt}.`) // gives u info
    }

    if (command == "ping") { // creates a command *ping
        message.channel.send(`Pong! \`${client.pings[0]}ms\``); // answers with "Pong!"
    }

    if (command == "cookie") { // creates the command cookie
        if (args[1]) message.channel.send(message.author.toString() + " has given " + args[1].toString() + " a cookie! :cookie:") // sends the message saying someone has given someone else a cookie if someone mentions someone else
        else message.channel.send("Who do you want to send a cookie to? :cookie: (Correct usage: *cookie @username)") // sends the error message if no-one is mentioned
    }
    if (command == "roll") {
      let rand = Math.floor(Math.random() * 100);
      let winningNum = config.winning;
      if (rand >= winningNum) {
        message.reply(`**Roll**\nYou rolled a ${rand}; Victory!`);
      }else{
        message.reply(`**Roll**\nYou rolled a ${rand}; Loss!`);
      }
    }
    if (command == "8ball") { // creates the command 8ball
        if (args[1] != null) message.reply(eightball[Math.floor(Math.random() * eightball.length).toString(16)]); // if args[1], post random answer
        else message.channel.send("You haven't specified a question.  (Correct usage: *8ball [question])"); // if not, error
    }

    if (command == "say") { // creates command say
        if (!message.member.roles.some(r=>["bot-admin"].includes(r.name) || !message.member.hasPermission("ADMINISTRATOR"))) return message.reply("Sorry, you do not have the permission to do this!");
        var sayMessage = message.content.substring(4)
        message.delete().catch(O_o=>{});
        message.channel.send(sayMessage);
    }

    if(command === "purge") {
        let messagecount = parseInt(args[1]) || 1;

        var deletedMessages = -1;

        message.channel.fetchMessages({limit: Math.min(messagecount + 1, 100)}).then(messages => {
            messages.forEach(m => {
                if (m.author.id == bot.user.id) {
                    m.delete().catch(console.error);
                    deletedMessages++;
                }
            });
        }).then(() => {
                if (deletedMessages === -1) deletedMessages = 0;
                message.channel.send(`:white_check_mark: Purged \`${deletedMessages}\` messages.`)
                    .then(m => m.delete(2000));
        }).catch(console.error);
    }

    if (command == "mute") { // creates the command mute
        if (!message.member.roles.some(r=>["bot-admin"].includes(r.name)) ) return message.reply("Sorry, you do not have the permission to do this!"); // if author has no perms
        var mutedmember = message.mentions.members.first(); // sets the mentioned user to the var kickedmember
        if (!mutedmember) return message.reply("Please mention a valid member of this server!") // if there is no kickedmmeber var
        if (mutedmember.hasPermission("ADMINISTRATOR")) return message.reply("I cannot mute this member!") // if memebr is an admin
        var mutereasondelete = 10 + mutedmember.user.id.length //sets the length of the kickreasondelete
        var mutereason = message.content.substring(mutereasondelete).split(" "); // deletes the first letters until it reaches the reason
        var mutereason = mutereason.join(" "); // joins the list kickreason into one line
        if (!mutereason) return message.reply("Please indicate a reason for the mute!") // if no reason
        mutedmember.addRole(mutedrole) //if reason, kick
            .catch(error => message.reply(`Sorry ${message.author} I couldn't mute because of: ${error}`)); //if error, display error
        message.reply(`${mutedmember.user} has been muted by ${message.author} because: ${mutereason}`); // sends a message saying he was kicked
    }

    if (command == "unmute") { // creates the command unmute
        if (!message.member.roles.some(r=>["bot-admin"].includes(r.name)) ) return message.reply("Sorry, you do not have the permission to do this!"); // if author has no perms
        var unmutedmember = message.mentions.members.first(); // sets the mentioned user to the var kickedmember
        if (!unmutedmember) return message.reply("Please mention a valid member of this server!") // if there is no kickedmmeber var
        unmutedmember.removeRole(mutedrole) //if reason, kick
            .catch(error => message.reply(`Sorry ${message.author} I couldn't mute because of : ${error}`)); //if error, display error
        message.reply(`${unmutedmember.user} has been unmuted by ${message.author}!`); // sends a message saying he was kicked
    }

    if (command == "kick") { // creates the command kick
        if (!message.member.roles.some(r=>["bot-admin"].includes(r.name)) ) return message.reply("Sorry, you do not have the permission to do this!"); // if author has no perms
        var kickedmember = message.mentions.members.first(); // sets the mentioned user to the var kickedmember
        if (!kickedmember) return message.reply("Please mention a valid member of this server!") // if there is no kickedmmeber var
        if (!kickedmember.kickable) return message.reply("I cannot kick this member!") // if the member is unkickable
        var kickreasondelete = 10 + kickedmember.user.id.length //sets the length of the kickreasondelete
        var kickreason = message.content.substring(kickreasondelete).split(" "); // deletes the first letters until it reaches the reason
        var kickreason = kickreason.join(" "); // joins the list kickreason into one line
        if (!kickreason) return message.reply("Please indicate a reason for the kick!") // if no reason
        kickedmember.kick(kickreason) //if reason, kick
            .catch(error => message.reply(`Sorry @${message.author} I couldn't kick because of : ${error}`)); //if error, display error
        message.reply(`${kickedmember.user.username} has been kicked by ${message.author.username} because: ${kickreason}`); // sends a message saying he was kicked
    }

  if (command == "bot$_!exit") {
    message.delete(10);
    message.channel.send(`<@${message.author.id}> has restarted the bot.`);3
    setTimeout(function(){ 
      process.exit(0);
    }, 3000);
  }
  if (command == "user-info" || command == "userinfo" || command == "myinfo") {
    message.channel.send(`<@${message.author.id}> `);
    message.channel.send({embed: {
      color: 3447003,
      author: {
        name: client.user.username,
        icon_url: client.user.avatarURL
      },
      title: `<@${message.author.id}>`,
      description: "Your user information",
      fields: [{
          name: "Username",
          value: `${message.author.username}`
        },
        {
          name: "Id",
          value: `${message.author.id}`
        },
        {
          name: "Created",
          value: `${message.author.createdAt} (${message.author.createdTimestamp})`
        },
        {
          name: "Last Message",
          value: `${message.author.lastMessage}`
        },
        {
          name: "Avatar",
          value: `${message.author.displayAvatarURL}`
        },
        {
          name: "Owner",
          value: `${message.guild.ownerID}`
        },
        {
          name: "Highest Role",
          value: `${message.member.highestRole}`
        },
      ],
      timestamp: new Date(),
    }});
  }
  if(command == "starting") {
    message.channel.send({embed: {
        color: 3447003,
        author: {
          name: client.user.username,
          icon_url: client.user.avatarURL
        },
        title: "How to Start",
        description: "How to start on the server.",
        fields: [{
            name: "Setting up your character",
            value: "Firstly, go to <#431183696700375040> and copy the format. Next, go to <#431185213201317908> and paste the format. After that, fill in the information of your character."
          },
          {
            name: "Becoming a teacher",
            value: "Firstly, set up your character. After approval, you can go to <#432348589423984641> and copy the format. After copying the format, go to <#432348792319377418> and fill in the pasted information."
          },
          {
            name: "Limitations",
            value: "You can only use the races provided in <#431181125008752640> and overpowered characters must be approved by a Manager+. Certain races have certain staff ranks in which only they and a higher rank than them can approve your character."
          }
        ],
        timestamp: new Date(),
        footer: {
          text: "We hope you enjoy your stay!"
        }
      }});
  }
  
});

client.login(key);