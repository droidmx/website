module.exports.run = async (bot, msg, args) => {

    var db_path = require("../testingbot.js").database_path;
    var db_userdata = require("../testingbot.js").db_userdata;
    var db_settings = require("../testingbot.js").db_settings;

    const db = require("sqlite");
    db.open(db_path);

    msg.delete();

    db.get(`Select * From "${db_settings}"`).then(settings => {
        db.get(`Select * From "${db_userdata}" Where userid = ${msg.author.id}`).then(row => {

            if (!row) {
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
                    message.delete(10000);
                });
            }
            else if (row.userrank == 0) {

                var _personalinfo = JSON.parse("{}");
                try {
                    _personalinfo = JSON.parse(row.personalinfo);
                }
                catch (err) {
                    msg.channel.send({
                        embed: {
                            color: 0x888888,
                            author: {
                                name: msg.author.username,
                                icon_url: msg.author.avatarURL
                            },
                            description: "A database error occurred. Some of the data for this member is corrupted and needed to be reset.\n" +
                                "DM a moderator if you see this issue."
                        }
                    }).then(message => {
                        message.delete(15000);
                    });
                }
                try {
                    //				unverified				member					assistant			RL						Mod					Admin
                    //				0						1						2					3						4					5
                    var roles = ["447950991141109770", "447950560419643402", "447950559086116864", "447949904128507905", "447949022355783690", "426609665422524417"];
                    var timeout = "448313389354188840";

                    if (!_personalinfo.suspend) {
                        _personalinfo.suspend = 0;
                    }
                    if (_personalinfo.suspend == -1) {
                        msg.channel.send({
                            embed: {
                                color: 0x00FF00,
                                author: {
                                    name: msg.author.username,
                                    icon_url: msg.author.avatarURL
                                },
                                description: "You are muted permanently, contact a moderator if you believe this to be a mistake."
                            }
                        }).then(message => {
                            message.delete(15000);
                        });
                    }
                    else {
                        if (msg.member.roles.some(r => ["timeout"].includes(r.name))) {
                            var time = ((_personalinfo.suspend - new Date().getTime()) / (60 * 60 * 1000));
                            console.log("-->" + time + " hours remaining on mute for " + msg.author.username);
                            if (time <= 0) {
                                msg.member.addRole("447950991141109770");
                                msg.member.removeRole("448313389354188840");
                                msg.channel.send({
                                    embed: {
                                        color: 0x00FF00,
                                        author: {
                                            name: msg.author.username,
                                            icon_url: msg.author.avatarURL
                                        },
                                        description: "You have been unmuted, if there is still a problem with your roles, contact a moderator."
                                    }
                                }).then(message => {
                                    message.delete(15000);
                                });
                            }
                            else {
                                msg.channel.send({
                                    embed: {
                                        color: 0x00FF00,
                                        author: {
                                            name: msg.author.username,
                                            icon_url: msg.author.avatarURL
                                        },
                                        description: "You have " + Number.parseFloat(time).toPrecision(4) + " hours left on your mute."
                                    }
                                }).then(message => {
                                    message.delete(15000);
                                });
                            }
                        }
                        else msg.channel.send({
                            embed: {
                                color: 0xFF0000,
                                author: {
                                    name: msg.author.username,
                                    icon_url: msg.author.avatarURL
                                },
                                description: "You are not muted."
                            }
                        }).then(message => {
                            message.delete(15000);
                        });
                    }
                }

                catch (err) {
                    msg.channel.send({
                        embed: {
                            color: 0xFF0000,
                            author: {
                                name: msg.author.username,
                                icon_url: msg.author.avatarURL
                            },
                            description: "An unknown error occurred, contact a moderator if this problem persists."
                        }
                    }).then(message => {
                        message.delete(15000);
                    });
                }
            }
            else msg.channel.send({
                embed: {
                    color: 0xFF0000,
                    author: {
                        name: msg.author.username,
                        icon_url: msg.author.avatarURL
                    },
                    description: "You are not muted."
                }
            }).then(message => {
                message.delete(15000);
            });
        });
    });
}
module.exports.config = {
    command: "timeout"
};