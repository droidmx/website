module.exports.run = async (bot, msg, args) => {
    const Discord = require("discord.js");
    var db_path = require("../testingbot.js").database_path;
    var db_userdata = require("../testingbot.js").db_userdata;
    var db_settings = require("../testingbot.js").db_settings;

    const db = require("sqlite");
    db.open(db_path);

    db.get(`Select * From "${db_settings}"`).then(settings=>{
        db.get(`Select * From "${db_userdata}" Where userid = ${msg.author.id}`).then(row =>{
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

                var to_unmute = msg.mentions.members.first();

                if (to_unmute.roles.some(r => ["timeout"].includes(r.name))) {
                    db.get(`Select * From '${db_userdata}' Where userid = '${to_unmute.id}'`).then(to_unmute_row => {
                        if (to_unmute_row.userrank >= row.userrank)
                            msg.channel.send({
                                embed: {
                                    color: 0xFF0000,
                                    author: {
                                        name: msg.author.username,
                                        icon_url: msg.author.avatarURL
                                    },
                                    description: "Something's not right here..."
                                }
                            });
                        else {

                            var _personalinfo = JSON.parse("{}");

                            try {
                                _personalinfo = JSON.parse(to_unmute_row.personalinfo);
                            }
                            catch (err) {
								to_channel.send("**UNMUTE ERROR --> ** <@" + msg.author.id + "> || A database error occurred.");
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

                            _personalinfo.suspend = 0;
                            _personalinfo = JSON.stringify(_personalinfo);

                            var new_rank = 0;
                            to_unmute.removeRole(timeout);
                            to_unmute.addRole("447950991141109770");
                            db.run(`Update "${db_userdata}" Set userrank = '${new_rank}', personalinfo = '${_personalinfo}' Where userid = ${to_unmute.id}`).then(() => {
                                to_channel.send("**UNMUTE --> ** <@" + msg.author.id + "> || Unmuted <@" + to_unmute.id + ">.");
                                msg.channel.send({
                                    embed: {
                                        color: 0x888888,
                                        author: {
                                            name: msg.author.username,
                                            icon_url: msg.author.avatarURL
                                        },
                                        description: "<@" + to_unmute.id + "> has been unmuted."
                                    }
                                });
                            }).catch(err => {
                                console.log(err);
                                console.log("--Error unmuting " + to_unmute.username);
                            });;
                        }
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
                            description: "<@" + to_unmute.id + "> is not muted."
                        }
                    }).then(message => {
                        message.delete(15000);
                    });
                }
            }
        }); // End User DB
    }); // End Settings DB
}
module.exports.config = {
    command: "unmute"
};