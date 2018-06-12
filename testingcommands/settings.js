module.exports.run = async (bot, msg, args) => {
    const Discord = require("discord.js");
    var db_path = require("../testingbot.js").database_path;
    var db_userdata = require("../testingbot.js").db_userdata;
    var db_settings = require("../testingbot.js").db_settings;

    const db = require("sqlite");
    db.open(db_path);

    db.get(`Select * From "${db_settings}"`).then(settings => {
        db.get(`Select * From "${db_userdata}" Where userid = ${msg.author.id}`).then(row => {
            var rank_names = settings.ranknames.split(",");
            if (row.userrank < 4) {
                msg.channel.send("You need to be at least rank " + rank_names[4] + " to customize settings.");
            }

            else if (args.length === 0) {
                msg.channel.send({
                    embed: {
                        color: 0x000FF0,
                        author: {
                            name: msg.author.username,
                            icon_url: msg.author.avatarURL
                        },
                        description: "A list of possible options will be sent to your Direct Messages."
                    }
                });
                msg.author.send({
                    embed: {
                        color: 0x0000FF,
                        author: {
                            name: msg.author.username,
                            icon_url: msg.author.avatarURL
                        },
                        description: "The ability to customize settings is very basic as of now.\n" +
                            "Here are the available commands:\n" +
                            "  `" + settings.prefix + "settings\n" +
                            "  " + settings.prefix + "settings emoji\n" +
                            "  " + settings.prefix + "settings prefix\n" +
                            "  " + settings.prefix + "settings payout\n" +
                            "  " + settings.prefix + "settings afk`\n"
                }
                });
            }
            else if (args[0].toLowerCase().includes("emoji")) {
                msg.channel.send({
                    embed: {
                        color: 0x000FF0,
                        author: {
                            name: msg.author.username,
                            icon_url: msg.author.avatarURL
                        },
                        description: "Please enter the 4 emojis you would like to replace the current ones."
                    }
                });
                const collector = new Discord.MessageCollector(msg.channel, m => m.author.id === msg.author.id, { time: 60000 });
                collector.on('collect', msg_collected => {
                    var emojis = msg_collected.content.split(" ");
                    if (emojis.length < 4) {
                        msg_collected.channel.send({
                            embed: {
                                color: 0xFF0000,
                                author: {
                                    name: msg.author.username,
                                    icon_url: msg.author.avatarURL
                                },
                                description: "Sorry, I couldn't read the emojis, next time please separate them by spaces"
                            }
                        });
                    }
                    else if (emojis.length == 4) {
                        db.run(`Update "${db_settings}" Set slotemojis = "${emojis.toString()}"`);
                        msg.channel.send({
                            embed: {
                                color: 0x00FF00,
                                author: {
                                    name: msg.author.username,
                                    icon_url: msg.author.avatarURL
                                },
                                description: "I have updated the emojis to: " + emojis
                            }
                        });
                    }
                    else {
                        msg_collected.channel.send({
                            embed: {
                                color: 0xFF0000,
                                author: {
                                    name: msg.author.username,
                                    icon_url: msg.author.avatarURL
                                },
                                description: "Sorry, I couldn't read the emojis, next time please separate them by spaces"
                            }
                        });

                    }
                    collector.stop();
                });
            }
            else if (args[0].toLowerCase().includes("prefix")) {
                msg.channel.send({
                    embed: {
                        color: 0x0000FF,
                        author: {
                            name: msg.author.username,
                            icon_url: msg.author.avatarURL
                        },
                        description: "Please enter the new prefix you would like to use. (Ideally 1-2 characters for your convenience)"
                    }
                });
                const collector = new Discord.MessageCollector(msg.channel, m => m.author.id === msg.author.id, { time: 30000 });
                collector.on('collect', msg_collected => {
                    var prefix = msg_collected.content;
                    if (prefix.length < 1) {
                        msg_collected.channel.send({
                            embed: {
                                color: 0xFF0000,
                                author: {
                                    name: msg.author.username,
                                    icon_url: msg.author.avatarURL
                                },
                                description: "Sorry, I couldn't read the prefix, please try something like: `!`"
                            }
                        });
                    }
                    else {
                        db.run(`Update "${db_settings}" Set prefix = "${prefix}"`);
                        msg.channel.send({
                            embed: {
                                color: 0x00FF00,
                                author: {
                                    name: msg.author.username,
                                    icon_url: msg.author.avatarURL
                                },
                                description: "I have updated the prefix to: " + prefix
                            }
                        });
                    }
                    collector.stop();
                });

            }
            else if (args[0].toLowerCase().includes("payout")) {
                msg.channel.send({
                    embed: {
                        color: 0x0000FF,
                        author: {
                            name: msg.author.username,
                            icon_url: msg.author.avatarURL
                        },
                        description: "Please enter the frequency you want users to be able to claim a payout (in hours)."
                    }
                });
                const collector = new Discord.MessageCollector(msg.channel, m => m.author.id === msg.author.id, { time: 30000 });
                collector.on('collect', msg_collected => {
                    var freq = msg_collected.content;
                    if (freq.length < 1 || isNaN(freq[0])) {
                        msg_collected.channel.send({
                            embed: {
                                color: 0xFF0000,
                                author: {
                                    name: msg.author.username,
                                    icon_url: msg.author.avatarURL
                                },
                                description: "Sorry, I couldn't read that. Please respond with a number between 1 and 48"
                            }
                        });
                    }
                    else if (freq[0] > 48 || freq[0] < 1){
                        msg_collected.channel.send({
                            embed: {
                                color: 0xFF0000,
                                author: {
                                    name: msg.author.username,
                                    icon_url: msg.author.avatarURL
                                },
                                description: "Sorry, I couldn't read that. Please respond with a number between 1 and 48"
                            }
                        });
                    }
                    else {
                        db.run(`Update "${db_settings}" Set salaryrate = "${freq}"`);
                        msg.channel.send({
                            embed: {
                                color: 0x00FF00,
                                author: {
                                    name: msg.author.username,
                                    icon_url: msg.author.avatarURL
                                },
                                description: "I have updated the payout frequency to: " + freq
                            }
                        });
                    }
                    collector.stop();
                });
            }
// AFK Emojis
            else if (args[0].toLowerCase().includes("afk") && (msg.content.toLowerCase().includes("react") || msg.content.toLowerCase().includes("emoji"))) {
                msg.channel.send({
                    embed: {
                        color: 0x0000FF,
                        author: {
                            name: msg.author.username,
                            icon_url: msg.author.avatarURL
                        },
                        description: "Please enter 1 - 10 **server-specific** emojis to use in afk checks.\n"+
                        "The first one will be the main 'Headcount' with the remaining being optional reacts.\n" + 
                        "The working reactions will be added to your message."
                    }
                });
                const collector = new Discord.MessageCollector(msg.channel, m => m.author.id === msg.author.id, { time: 60000 });
                collector.on('collect', msg_collected => {
                    var emojis = msg_collected.content.split(" ");
                    if (emojis.length < 1 || emojis.length > 10) {
                        msg_collected.channel.send({
                            embed: {
                                color: 0xFF0000,
                                author: {
                                    name: msg.author.username,
                                    icon_url: msg.author.avatarURL
                                },
                                description: "Sorry, I couldn't read the emojis, next time please separate them by spaces."
                            }
                        });
                    }
                    var success_total = 0;
                    emojis.forEach(emote => {
                        try {
                            var temp = "";
                            for (var i = emote.length; i > 0; i--) {
                                if (emote.charAt(i) == ':')
                                    break;
                                else if (!isNaN(emote.charAt(i)))
                                    temp = emote.charAt(i) + temp;
                            }
                            msg_collected.react(temp);
                            success_total++;
                        }
                        catch (err) {
                            msg_collected.react(emote);
                            success_total++;
                        }
                    });
                    if (success_total < emojis.length) {
                        msg_collected.channel.send({
                            embed: {
                                color: 0xFF0000,
                                author: {
                                    name: msg.author.username,
                                    icon_url: msg.author.avatarURL
                                },
                                description: "There was an issue with one or more of your emojis, the ones that were added to your message are able to be used.\n" +
                                "If all of them added, you may have had an extra space at the beginning of your message."
                            }
                        });
                    }
                    else {
                        msg_collected.channel.send({
                            embed: {
                                color: 0x00FF00,
                                author: {
                                    name: msg.author.username,
                                    icon_url: msg.author.avatarURL
                                },
                                description: "You are able to use `" + settings.prefix + "startafk` now.\n" + 
                                "Use `" + settings.prefix + "settings afk` at any time to review your afk check settings.\n" +
                                "Your attention will be required if an emoji goes out of date."
                            }
                        });
                        _serverinfo = JSON.parse(settings.serverinfo);
                        _serverinfo.afk_reactions = emojis;
                        //console.log(_serverinfo.afk_reactions);
                        _serverinfo = ((JSON.stringify(_serverinfo)).toString());;
                        db.run(`Update '${db_settings}' Set serverinfo = '${_serverinfo}'`);
                    }
                    
                    collector.stop();
                });
            }
// AFK Voice
            else if (args[0].toLowerCase().includes("afk") && msg.content.toLowerCase().includes("voice")){                
                msg.channel.send({
                    embed: {
                        color: 0x0000FF,
                        author: {
                            name: msg.author.username,
                            icon_url: msg.author.avatarURL
                        },
                        description: "Please enter 3 voice channels to use as:\n  1. Queue Channel\n  2.Destination Channel\n  3. AFK Channel\n" +
                        "They should be separated by a comma similar to this:\n  General, Raiding, AFK Channel"
                    }
                });
                const collector = new Discord.MessageCollector(msg.channel, m => m.author.id === msg.author.id, { time: 60000 });
                collector.on('collect', msg_collected => {
                    var channels = msg_collected.content.split(", ");
                    if (channels.length != 3)
                        channels = msg_collected.content.split(",");
                    var fails = 3;
                    console.log(channels);

                    var _serverinfo = JSON.parse(settings.serverinfo);

                    msg.guild.channels.forEach(element => {
                        if (element.type === "voice") {
                            if (element.name.toLowerCase().includes(channels[0].toLowerCase())) {
                                _serverinfo.queue_voice_channel = element.id;
                                fails--;
                            }
                            else if (element.name.toLowerCase().includes(channels[1].toLowerCase())) {
                                _serverinfo.to_voice_channel = element.id;
                                fails--;
                            }
                            else if (element.name.toLowerCase().includes(channels[2].toLowerCase())) {
                                _serverinfo.afk_voice_channel = element.id;
                                fails--;
                            }
                        }
                    });
                    if (fails > 0){
                        var optional = ".";
                        if (fails > 1)
                            optional = "s.";
                        msg_collected.channel.send({
                            embed: {
                                color: 0xFF0000,
                                author: {
                                    name: msg.author.username,
                                    icon_url: msg.author.avatarURL
                                },
                                description: "Sorry, I couldn't identify " + fails + " channel" + optional
                            }
                        });
                    }
                       
                    else {
                        msg_collected.channel.send({
                            embed: {
                                color: 0x00FF00,
                                author: {
                                    name: msg.author.username,
                                    icon_url: msg.author.avatarURL
                                },
                                description: "Voice channels updated successfully!\n" + 
                                "You are able to use `" + settings.prefix + "startafk` now.\n" + 
                                "Use `" + settings.prefix + "settings afk` at any time to review your afk check settings.\n" +
                                "Your attention will be required if a channel goes out of date."
                            }
                        });
                        _serverinfo = ((JSON.stringify(_serverinfo)).toString());;
                        db.run(`Update '${db_settings}' Set serverinfo = '${_serverinfo}'`);
                    }
                    
                    collector.stop();
                });
            } 

// AFK Text
            else if (args[0].toLowerCase().includes("afk") && (msg.content.toLowerCase().includes("text") || msg.content.toLowerCase().includes("channel"))){
               msg.channel.send({
                    embed: {
                        color: 0x0000FF,
                        author: {
                            name: msg.author.username,
                            icon_url: msg.author.avatarURL
                        },
                        description: "Please enter the text channel name to use as a default for AFK checks."
                    }
                });
                const collector = new Discord.MessageCollector(msg.channel, m => m.author.id === msg.author.id, { time: 60000 });
                collector.on('collect', msg_collected => {
                    var channel = msg_collected.content;
                    var fail = true;
                    var _serverinfo = JSON.parse(settings.serverinfo);

                    msg.guild.channels.forEach(element => {
                        if (element.type === "text") {
                            if (element.name.toLowerCase().includes(channel.toLowerCase())) {
                                _serverinfo.afk_text_channel = element.id;
                                fail = false;
                            }
                        }
                    });


                    if (fail){
                        msg_collected.channel.send({
                            embed: {
                                color: 0xFF0000,
                                author: {
                                    name: msg.author.username,
                                    icon_url: msg.author.avatarURL
                                },
                                description: "Sorry, I couldn't identify a text channel with that name."
                            }
                        });
                    }
                       
                    else {
                        msg_collected.channel.send({
                            embed: {
                                color: 0x00FF00,
                                author: {
                                    name: msg.author.username,
                                    icon_url: msg.author.avatarURL
                                },
                                description: "Text channel updated successfully!\n" + 
                                "You are able to use `" + settings.prefix + "startafk` now.\n" + 
                                "Use `" + settings.prefix + "settings afk` at any time to review your afk check settings.\n" +
                                "Your attention will be required if the channel goes out of date."
                            }
                        });
                        _serverinfo = ((JSON.stringify(_serverinfo)).toString());;
                        db.run(`Update '${db_settings}' Set serverinfo = '${_serverinfo}'`);
                    }
                    
                    collector.stop();
                });
            }

// AFK Message
            else if (args[0].toLowerCase().includes("afk") && msg.content.toLowerCase().includes("message")){
                msg.channel.send({
                    embed: {
                        color: 0x0000FF,
                        author: {
                            name: msg.author.username,
                            icon_url: msg.author.avatarURL
                        },
                        description: "Please enter the description of the afk check that you would like to use, including formatting and emojis."
                    }
                });
                const collector = new Discord.MessageCollector(msg.channel, m => m.author.id === msg.author.id, { time: 60000 });
                collector.on('collect', msg_collected => {
                    
                    var _serverinfo = JSON.parse(settings.serverinfo);
                    var text = msg_collected.content;
                    _serverinfo.afk_text = msg_collected.content;

                    msg_collected.channel.send({
                        embed: {
                            color: 0x00FF00,
                            author: {
                                name: msg.author.username,
                                icon_url: msg.author.avatarURL
                            },
                            description: "AFK check text updated successfully!\n" +
                                "You are able to use `" + settings.prefix + "startafk` now.\n" +
                                "Use `" + settings.prefix + "settings afk` at any time to review your afk check settings.\n" +
                                "Your attention will be required if a channel goes out of date."
                        }
                    });
                    _serverinfo = ((JSON.stringify(_serverinfo)).toString());;
                    db.run(`Update '${db_settings}' Set serverinfo = '${_serverinfo}'`);

                    
                    collector.stop();
                });
            }
// AFK Title
            else if (args[0].toLowerCase().includes("afk") && msg.content.toLowerCase().includes("title")){
                msg.channel.send({
                    embed: {
                        color: 0x0000FF,
                        author: {
                            name: msg.author.username,
                            icon_url: msg.author.avatarURL
                        },
                        description: "Please enter the title of the afk check that you would like to use, including formatting and emojis."
                    }
                });
                const collector = new Discord.MessageCollector(msg.channel, m => m.author.id === msg.author.id, { time: 60000 });
                collector.on('collect', msg_collected => {
                    
                    var _serverinfo = JSON.parse(settings.serverinfo);
                    var text = msg_collected.content;
                    _serverinfo.afk_title = msg_collected.content;

                    msg_collected.channel.send({
                        embed: {
                            color: 0x00FF00,
                            author: {
                                name: msg.author.username,
                                icon_url: msg.author.avatarURL
                            },
                            description: "AFK check title updated successfully!\n" +
                                "You are able to use `" + settings.prefix + "startafk` now.\n" +
                                "Use `" + settings.prefix + "settings afk` at any time to review your afk check settings.\n" +
                                "Your attention will be required if a channel goes out of date."
                        }
                    });
                    _serverinfo = ((JSON.stringify(_serverinfo)).toString());;
                    db.run(`Update '${db_settings}' Set serverinfo = '${_serverinfo}'`);

                    
                    collector.stop();
                });
            }
// Default afk message to dispay current settings and all commands
            else if (args[0].toLowerCase().includes("afk")){
                var _serverinfo = JSON.parse("{}");
                try {
                    var _serverinfo = JSON.parse(settings.serverinfo);
                }
                catch (err) { }
                _serverinfo.afk_reactions = !_serverinfo.afk_reactions ? {} : _serverinfo.afk_reactions;
                _serverinfo.afk_text = !_serverinfo.afk_text ? {} : _serverinfo.afk_text;
                _serverinfo.afk_title = !_serverinfo.afk_title ? {} : _serverinfo.afk_title;
                _serverinfo.afk_text_channel = !_serverinfo.afk_text_channel ? {} : _serverinfo.afk_text_channel;
                _serverinfo.queue_voice_channel = !_serverinfo.queue_voice_channel ? {} : _serverinfo.queue_voice_channel;
                _serverinfo.to_voice_channel = !_serverinfo.to_voice_channel ? {} : _serverinfo.to_voice_channel;
                _serverinfo.afk_voice_channel = !_serverinfo.afk_voice_channel ? {} : _serverinfo.afk_voice_channel;

                var emojis = _serverinfo.afk_reactions;

                msg.channel.send({
                    embed: {
                        color: 0x888888,
                        author: {
                            name: msg.author.username,
                            icon_url: msg.author.avatarURL
                        },
                        description: "**Your current settings:**\n" +
                            "Title: " + _serverinfo.afk_title + "\n" + 
                            "Description: " + _serverinfo.afk_text + "\n" + 
                            "Text Channel: <#" + _serverinfo.afk_text_channel + ">\n" + 
                            "Queue Voice Channel: **<#" + _serverinfo.queue_voice_channel + ">**\n" + 
                            "Destination Voice Channel: **<#" + _serverinfo.to_voice_channel + ">**\n" + 
                            "AFK Voice Channel: **<#" + _serverinfo.afk_voice_channel + ">**\n" +
                            "Emojis: " + _serverinfo.afk_reactions + "\n\n" +
                            "**All Commands:**\n" + 
                            "`" + settings.prefix + "settings afk\n" + 
                            settings.prefix + "settings afk title\n" + 
                            settings.prefix + "settings afk message\n" + 
                            settings.prefix + "settings afk text\n" + 
                            settings.prefix + "settings afk voice\n" +
                            settings.prefix + "settings afk emojis`" 
                    }
                });
            }

            // TODO: Edited afk message command and configuration
            // TODO: Add that command to general afk settings

        }); // End User DB
    }); // End Settings DB
}
module.exports.config = {
    command: "settings"
};