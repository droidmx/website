module.exports.run = async (bot, msg, args) => {

    var db_path = require("../testingbot.js").database_path;
    var db_userdata = require("../testingbot.js").db_userdata;
    var db_settings = require("../testingbot.js").db_settings;

    const db = require("sqlite");
    db.open(db_path);

    if (msg.channel.id != "447950977509883905"){
        msg.delete();
        return;
    }
    db.get(`Select * From "${db_settings}"`).then(settings => {
        db.get(`Select * From "${db_userdata}" Where userid = ${msg.author.id}`).then(caller_row => {
            var rank_names = settings.ranknames.split(",");

            if (!caller_row) {
                msg.channel.send({
                    embed: {
                        color: 0xFF0000,
                        author: {
                            name: msg.author.username,
                            icon_url: msg.author.avatarURL
                        },
                        description: "Whoops! Something went wrong!"
                    }
                });
            }

            if (caller_row.userrank < 1) {
                msg.channel.send({
                    embed: {
                        color: 0xFF0000,
                        author: {
                            name: msg.author.username,
                            icon_url: msg.author.avatarURL
                        },
                        description: "You need to be at least rank " + rank_names[1] + " to use this."
                    }
                });
            }

            else {
                var _info = JSON.parse(caller_row.personalinfo);
                if (!_info.last_payout) {
                    var new_info = _info;
                    new_info.last_payout = new Date().getTime();
                    new_info = ((JSON.stringify(new_info)).toString());
                    db.run(`Update "${db_userdata}" Set personalinfo = '${new_info}' Where userid = ${caller_row.userid}`);
                    db.run(`Update "${db_userdata}" Set balance = '${caller_row.balance + 250 + (caller_row.messagecount)}' Where userid = ${caller_row.userid}`).then(() => {
                        msg.channel.send({
                            embed: {
                                color: 0x00FF00,
                                author: {
                                    name: msg.author.username,
                                    icon_url: msg.author.avatarURL
                                },
                                description: "You have been paid $" + (250 + (caller_row.messagecount))
                            }
                        });
                    });
                }
                else {
                    if (new Date().getTime() - _info.last_payout > (settings.salaryrate * 60 * 60 * 1000)){
                        var new_info = _info;
                        new_info.last_payout = new Date().getTime();
                        new_info = ((JSON.stringify(new_info)).toString());
                        db.run(`Update "${db_userdata}" Set personalinfo = '${new_info}' Where userid = ${caller_row.userid}`);
                        db.run(`Update "${db_userdata}" Set balance = '${caller_row.balance + 250 + (caller_row.messagecount)}' Where userid = ${caller_row.userid}`).then(() => {
                            msg.channel.send({
                                embed: {
                                    color: 0x00FF00,
                                    author: {
                                        name: msg.author.username,
                                        icon_url: msg.author.avatarURL
                                    },
                                    description: "You have been paid $" + (250 + (caller_row.messagecount))
                                }
                            });
                        });
                    }
                    else {
                        msg.channel.send({
                            embed: {
                                color: 0xFF0000,
                                author: {
                                    name: msg.author.username,
                                    icon_url: msg.author.avatarURL
                                },
                                description: "You cannot do that for another " + Math.round(((settings.salaryrate * 60 * 60 * 1000) - (new Date().getTime() - _info.last_payout)) / (60*1000), 2) + " minutes!"
                            }
                        });
                    }

                }
            }
        });
    });
}

module.exports.config = {
    command: "daily"
};