module.exports.run = async (bot, msg, args) => {

    var db_path = require("../testingbot.js").database_path;
    var db_userdata = require("../testingbot.js").db_userdata;
    var db_settings = require("../testingbot.js").db_settings;

    const db = require("sqlite");
    db.open(db_path);

    msg.delete();

    
    if (msg.channel.id != "447950929761665026"){
        msg.delete();
        return;
    }
	var bot_logs = bot.channels.get("448650830032404480");

    db.get(`Select * From "${db_settings}"`).then(settings => {
        db.get(`Select * From "${db_userdata}" Where userid = ${msg.author.id}`).then(caller_row => {

            if (!settings || !caller_row) {
                msg.channel.send({
                    embed: {
                        color: 0xFF0000,
                        author: {
                            name: msg.author.username,
                            icon_url: msg.author.avatarURL
                        },
                        description: "Whoops! Something went wrong!"
                    }
                }).then(message => {
                    message.delete(15000);
                });
            }
            
            if (caller_row.userrank != 0) {
                bot_logs.send("**VERIFICATION ERROR -->**  <@" + msg.author.id + "> || Member able to see <#447950929761665026> but has Member role");
                if (msg.member.roles.some(r => ["Member"].includes(r.name))) {
                    msg.channel.send({
                        embed: {
                            color: 0xFF0000,
                            author: {
                                name: msg.author.username,
                                icon_url: msg.author.avatarURL
                            },
                            description: "You are already verified."
                        }
                    }).then(message => {
                        message.delete(15000);
                    });
                }
                else {
                    msg.channel.send({
                        embed: {
                            color: 0x888888,
                            author: {
                                name: msg.author.username,
                                icon_url: msg.author.avatarURL
                            },
                            description: "You are already verified but there was a problem with your roles, fixing them now.\n" +
                            "If this problem persists, contact a Moderator"
                        }
                    }).then(message => {
                        message.delete(15000);
                    });
                    let guildMember = message.member;
                    guildMember.setNickname(json.player + "!").then(() => {
                        guildMember.addRole("447950560419643402").then(() => {
                            guildMember.removeRole("447950991141109770").catch(console.error);
                        });});
                }
            } else if (args.length == 0) {
                bot_logs.send("**VERIFICATION -->**  <@" + msg.author.id + "> || Requested code which is **SPC" + msg.author.discriminator + "**");
                msg.author.send({
                    embed: { 
                        color: 0x888888,
                        author: {
                            name: msg.author.username,
                            icon_url: msg.author.avatarURL
                        },
                        description: "Please paste this code in  your realmeye description: `SPC" + msg.author.discriminator + "`\n\n" +
                            "When you have done this, type `" + settings.prefix + "verify [your IGN]`\n\n(Without the brackets)"
                    }
                });
            } else if (args.length == 1) {

                checkProfile(args[0], msg);
                
            }
        });

    });
}

function checkProfile(name, message) {
    var db_settings = require("../testingbot.js").db_settings;
                
    var db_path = require("../testingbot.js").database_path;
    var db_userdata = require("../testingbot.js").db_userdata;

    var to_channel;
    message.guild.channels.array().forEach(channel =>{
        if (channel.id == "448650830032404480"){
            to_channel = channel;
        }
    });

    const db = require("sqlite");
    db.open(db_path);

    var request = require('request');
    if (!name) {
        console.log("No username to check");
    } else {
        request({
            url: 'https://nightfirec.at/realmeye-api/?player=' + name,
            json: true
        }, function (err, res, json) {
            if (err) {
                throw err;
            } 
            if (!json.player) { 
                to_channel.send("**DENIED -->**  <@" + message.author.id + "> || Private realmeye.");
                message.author.send({
                    embed: {
                        color: 0xFF0000,
                        author: {
                            name: message.author.username,
                            icon_url: message.author.avatarURL
                        },
                        description: "Could not find player. Account may be privated."
                    }
                });
            }
            let userDesc = `${json.desc1} ${json.desc2} ${json.desc3}`;
            if (!userDesc.toLowerCase().includes(`spc` + message.author.discriminator)) {
                
                
                db.get(`Select * From "${db_settings}"`).then(settings => {
                    
                    to_channel.send("**DENIED -->**  <@" + message.author.id + "> || No SPC code in realmeye desciption.");
                    message.author.send({
                        embed: {
                            color: 0xFF0000,
                            author: {
                                name: message.author.username,
                                icon_url: message.author.avatarURL
                            },
                            description: "Please use `" + settings.prefix + "verify` to have a verification code send to you.\n\n" +
                                "Your realmeye description does not contain the code we provided.\n\n" +
                                "Please make sure to put SPC" + message.author.discriminator + " somewhere in your realmeye description.\n\n" +
                                "For more info on how to do this, see https://www.realmeye.com/q-and-a"
                        }
                    });
                });
            } else if (userDesc.toLowerCase().includes(`spc` + message.author.discriminator)) {
                var maxed_stats = 0;
                for (var i = 0; i < json.chars; i++) {
                    maxed_stats += json.characters[i].stats_maxed;
                }
                if (maxed_stats < 8) {
                    to_channel.send("**DENIED -->**  <@" + message.author.id + "> || Not enough maxed stats, current stats total = " + maxed_stats);
                    message.author.send({
                        embed: {
                            color: 0xFF0000,
                            author: {
                                name: message.author.username,
                                icon_url: message.author.avatarURL
                            },
                            description: "You do not have 8 total stats maxed.\n this and the verification code are the only requrements we check for.\n"
                        }
                    });
                } else { // All tests passed, give role and set nickname



                    let guildMember = message.member;
                    guildMember.setNickname(json.player + "!").then(() => {
                        guildMember.addRole("447950560419643402").then(() => {
                            guildMember.removeRole("447950991141109770").catch(console.error);
                        });});

                    db.get(`Select * From "${db_userdata}" Where userid = ${message.author.id}`).then(caller_row => {
                        db.run(`Update "${db_userdata}" Set userrank = ${1}, username = '${json.player}' Where userid = ${caller_row.userid}`).catch((err) => {
                            console.log(err);
                        });
                    }); 

                    to_channel.send("**ACCEPTED -->**  <@" + message.author.id + "> || Verified and given member role.");
                    message.author.send({
                        embed: {
                            color: 0x00FF00,
                            author: {
                                name: message.author.username,
                                icon_url: message.author.avatarURL
                            },
                            description: "You have been accepted and given the member role in SPC!\n\n" +
                                "We recommend you remove the verification code from your realmeye and replace it with the discord link to spread the server around!\n\n" +
                                "Make sure to follow the rules and good luck on bulwark!" // TODO: Should probably change this
                        }
                    });
                    console.log("==>" + json.player + " has verified successfully!")
                    return true;
                }
            }
        });
    }
}



module.exports.config = {
    command: "verify"
};