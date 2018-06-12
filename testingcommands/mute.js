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

            var to_channel;
            msg.guild.channels.array().forEach(channel => {
                if (channel.id == "448650830032404480") {
                    to_channel = channel;
                }
            });

            if (row.userrank < 4) {
                msg.channel.send({
                    embed: {
                        color: 0x888888,
                        author: {
                            name: msg.author.username,
                            icon_url: msg.author.avatarURL
                        },
                        description: "You do not have sufficient permissions to use this command."
                    }
                }).then(message => {
                    message.delete(15000);
                });
            }

            else {
                var role_names = settings.ranknames.split(",");
                //				unverified				member					assistant			RL						Mod					Admin
                //				0						1						2					3						4					5
                var roles = ["447950991141109770", "447950560419643402", "447950559086116864", "447949904128507905", "447949022355783690", "426609665422524417"];

                var timeout = "448313389354188840";

                var to_mute = msg.mentions.members.first();

                if (args.length > 1) {
                    var time = 0;
                    try {
                        time = parseInt(args[1]);
                    }
                    catch (err) {
                        msg.channel.send({
                            embed: {
                                color: 0xFF0000,
                                author: {
                                    name: msg.author.username,
                                    icon_url: msg.author.avatarURL
                                },
                                description: "Please specify a time to mute (in hours)." +
                                    "`" + settings.prefix + "mute <@" + msg.author.id + "> 24`"
                            }
                        }).then(message => {
                            message.delete(15000);
                        });
                        console.log(args[1] + " is not a number.");
                    }

                    if (time == 0) {
                        msg.channel.send({
                            embed: {
                                color: 0xFF0000,
                                author: {
                                    name: msg.author.username,
                                    icon_url: msg.author.avatarURL
                                },
                                description: "Please specify a time to mute (in hours).\n" +
                                    "`" + settings.prefix + "mute <@" + msg.author.id + "> 24`"
                            }
                        }).then(message => {
                            message.delete(15000);
                        });
                    }
                    else {
                        if (to_mute.roles.some(r => ["timeout"].includes(r.name))) {
                            msg.channel.send({
                                embed: {
                                    color: 0x888888,
                                    author: {
                                        name: msg.author.username,
                                        icon_url: msg.author.avatarURL
                                    },
                                    description: "<@" + to_mute.id + "> is already muted."
                                }
                            }).then(message => {
                                message.delete(15000);
                            });
                        }
                        else {
                            db.get(`Select * From '${db_userdata}' Where userid = '${to_mute.id}'`).then(to_mute_row => {
                                var _personalinfo = JSON.parse("{}");

                                try {
                                    _personalinfo = JSON.parse(to_mute_row.personalinfo);
                                }
                                catch (err) {
                                    to_channel.send("**UNMUTE ERROR --> ** <@" + msg.author.id + "> || A database error occurred but the mute *may* still go through. <@" + to_mute.id + ">");
                                    msg.channel.send({
                                        embed: {
                                            color: 0x888888,
                                            author: {
                                                name: msg.author.username,
                                                icon_url: msg.author.avatarURL
                                            },
                                            description: "A database error occurred. Some of the data for this member is corrupted and needed to be reset."
                                        }
                                    }).then(message => {
                                        message.delete(15000);
                                    });
                                }
                                if (to_mute_row.userrank >= row.userrank)
                                    msg.channel.send({
                                        embed: {
                                            color: 0xFF0000,
                                            author: {
                                                name: msg.author.username,
                                                icon_url: msg.author.avatarURL
                                            },
                                            description: "You do not have sufficient permissions to mute <@" + to_mute.id + ">."
                                        }
                                    });
                                else {
                                    var new_rank = 0;
                                    to_mute.removeRoles(["447950991141109770", "447950560419643402", "447950559086116864", "447949904128507905", "447949022355783690", "426609665422524417"]);
                                    to_mute.addRole(timeout);
                                    _personalinfo.suspend = new Date().getTime() + (time * 60 * 60 * 1000);
                                    _personalinfo = JSON.stringify(_personalinfo);
                                    db.run(`Update "${db_userdata}" Set userrank = '${new_rank}', personalinfo = '${_personalinfo}' Where userid = ${to_mute.id}`).then(() => {
                                        to_channel.send("**MUTE --> ** <@" + msg.author.id + "> || Muted <@" + to_unmute.id + "> for " + args[1] + " hours.");
                                        msg.channel.send({
                                            embed: {
                                                color: 0x888888,
                                                author: {
                                                    name: msg.author.username,
                                                    icon_url: msg.author.avatarURL
                                                },
                                                description: "<@" + to_mute.id + "> has been muted for " + args[1] + " hours."
                                            }
                                        });
                                    }).catch(err => {
                                        console.log(err);
                                        console.log("--Error muting " + to_mute.username);
                                    });;
                                }
                            });
                        }
                    }
                }
                else {
                    if (to_mute.roles.some(r => ["timeout"].includes(r.name))) {
                        msg.channel.send({
                            embed: {
                                color: 0x888888,
                                author: {
                                    name: msg.author.username,
                                    icon_url: msg.author.avatarURL
                                },
                                description: "<@" + to_mute.id + "> is already muted."
                            }
                        }).then(message => {
                            message.delete(15000);
                        });
                    }
                    else {
                        db.get(`Select userrank From '${db_userdata}' Where userid = '${to_mute.id}'`).then(to_mute_row => {
                            if (to_mute_row.userrank >= row.userrank)
                                msg.channel.send({
                                    embed: {
                                        color: 0xFF0000,
                                        author: {
                                            name: msg.author.username,
                                            icon_url: msg.author.avatarURL
                                        },
                                        description: "You do not have sufficient permissions to mute <@" + to_mute.id + ">."
                                    }
                                });
                            else {
                                var _personalinfo = JSON.parse("{}");

                                try {
                                    _personalinfo = JSON.parse(to_mute_row.personalinfo);
                                }
                                catch (err) {
                                    to_channel.send("**MUTE ERROR --> ** <@" + msg.author.id + "> || A database error occurred but the mute *may* still go through.<@" + to_mute.id + ">");
                                    msg.channel.send({
                                        embed: {
                                            color: 0x888888,
                                            author: {
                                                name: msg.author.username,
                                                icon_url: msg.author.avatarURL
                                            },
                                            description: "A database error occurred. Some of the data for this member is corrupted and needed to be reset."
                                        }
                                    }).then(message => {
                                        message.delete(15000);
                                    });
                                }

                                _personalinfo.suspend = -1;
                                _personalinfo = JSON.stringify(_personalinfo);
                                var new_rank = 0;
                                to_mute.removeRoles(["447950991141109770", "447950560419643402", "447950559086116864", "447949904128507905", "447949022355783690", "426609665422524417"]);
                                to_mute.addRole(timeout);
                                db.run(`Update "${db_userdata}" Set userrank = '${new_rank}', personalinfo = '${_personalinfo}' Where userid = ${to_mute.id}`).then(() => {
                                    to_channel.send("**MUTE --> ** <@" + msg.author.id + "> || Muted <@" + to_unmute.id + "> permanently.");
                                    msg.channel.send({
                                        embed: {
                                            color: 0x888888,
                                            author: {
                                                name: msg.author.username,
                                                icon_url: msg.author.avatarURL
                                            },
                                            description: "<@" + to_mute.id + "> has been muted."
                                        }
                                    });
                                }).catch(err => {
                                    console.log(err);
                                    console.log("--Error muting " + to_mute.username);
                                });;
                            }
                        });
                    }
                }

            }
        }); // End User DB
}); // End Settings DB
}
module.exports.config = {
    command: "mute"
};