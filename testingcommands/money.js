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
    db.get(`Select * From "${db_settings}"`).then(settings=>{
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

            else if (args.length == 0) {
                var message = "Your current balance is ";
                if (caller_row.balance < 0)
                    message += "-";
                msg.channel.send({
                    embed: {
                        color: 0x00FF00,
                        author: {
                            name: msg.author.username,
                            icon_url: msg.author.avatarURL
                        },
                        description: message + "$" + format(Math.abs(caller_row.balance))
                    }
                });
                return;
            }

            else if (args.length == 1) {
                try {
                    to_query = "";
                    temp = args[0];
                    for (var i = 0; i < temp.length; i++)
                        if (!isNaN(parseInt(temp.charAt(i))))
                            to_query += temp.charAt(i);
                    if (to_query === msg.author.id) {
                        var message = "Your current balance is ";
                        if (caller_row.balance < 0)
                            message += "-";
                        msg.channel.send({
                            embed: {
                                color: 0x00FF00,
                                author: {
                                    name: msg.author.username,
                                    icon_url: msg.author.avatarURL
                                },
                                description: message + "$" + format(Math.abs(caller_row.balance))
                            }
                        });
                        return;
                    }

                    else
                        db.get(`Select * From "${db_userdata}" Where userid = ${to_query}`).then(to_query_row => {
                            var message = "<@" + to_query_row.userid + ">'s current balance is "
                            if (to_query_row.balance < 0)
                                message += "-";
                            msg.channel.send({
                                embed: {
                                    color: 0x00FF00,
                                    author: {
                                        name: msg.author.username,
                                        icon_url: msg.author.avatarURL
                                    },
                                    description: message + "$" + format(Math.abs(to_query_row.balance))
                                }
                            });
                            return;
                        });
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
        });
    });

}

function format(input) {
    while (/(\d+)(\d{3})/.test(input.toString())) {
        input = input.toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
    }
    return input;
}

module.exports.config = {
    command: "money"
};