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
        db.get(`Select * From "${db_userdata}" Where userid = ${msg.author.id}`).then(giver_row => {
            var rank_names = settings.ranknames.split(",");
            if (!giver_row){
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
            if (giver_row.userrank < 1) {
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

            else if (args.length < 2) {
                msg.channel.send({
                    embed: {
                        color: 0xFF0000,
                        author: {
                            name: msg.author.username,
                            icon_url: msg.author.avatarURL
                        },
                        description: "You must specify someone to pay and the amount.\nExample: `!give @" + msg.author.username + " 500`"
                    }
                });
            }

            else if (args[0].includes("<@") && args[0].endsWith(">")) {
                try {
                    to_give = "";
                    temp = args[0];
                    for (var i = 0; i < temp.length; i++)
                        if (!isNaN(parseInt(temp.charAt(i))))
                            to_give += temp.charAt(i);
                    if (to_give === msg.author.id) {
                        msg.channel.send({
                            embed: {
                                color: 0xFF0000,
                                author: {
                                    name: msg.author.username,
                                    icon_url: msg.author.avatarURL
                                },
                                description: "You cannot transfer money to yourself!"
                            }
                        });
                    }
                    else if (args.length > 0) {
                        to_give_amount = parseInt(args[1]);
                        if (isNaN(to_give_amount)) {
                            msg.channel.send({
                                embed: {
                                    color: 0xFF0000,
                                    author: {
                                        name: msg.author.username,
                                        icon_url: msg.author.avatarURL
                                    },
                                    description: "You must specify an integer to give."
                                }
                            });
                            return;
                        }
                        else {
                            db.get(`Select * From "${db_userdata}" Where userid = ${to_give}`).then(to_give_row => {
                                if (giver_row.balance >= to_give_amount) {
                                    db.run(`Update "${db_userdata}" Set balance = ${to_give_row.balance + to_give_amount} Where userid = ${to_give_row.userid}`).then(() => {
                                        db.run(`Update "${db_userdata}" Set balance = ${giver_row.balance - to_give_amount} Where userid = ${giver_row.userid}`).then(() => {
                                            msg.channel.send({
                                                embed: {
                                                    color: 0x0FF000,
                                                    author: {
                                                        name: msg.author.username,
                                                        icon_url: msg.author.avatarURL
                                                    },
                                                    description: giver_row.username + " has given " + to_give_row.username + " $" + to_give_amount + "!"
                                                }
                                            });
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
                                            description: "You do not have sufficient funds. Your current balance is " + giver_row.balance
                                        }
                                    });
                                }
                            });
                        }
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
                            description: "Whoops! Something went wrong!"
                        }
                    });
                    console.log(err);
                }
            }
            else {
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
                console.log(args);
            }
        }); // End User DB
    }); // End Settings DB
}
module.exports.config = {
    command: "givetest"
};