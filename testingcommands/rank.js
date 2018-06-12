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
        db.get(`Select * From "${db_userdata}" Where userid = ${msg.author.id}`).then(row => {
            var rank_names = settings.ranknames.split(",");
            // Could not find the caller (this should never happen!)
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
                });
            }

            // If no user specified, give the caller his/her rank 
            if (args.length === 0) {
                msg.channel.send({
                    embed: {
                        color: 0x00FF00,
                        author: {
                            name: msg.author.username,
                            icon_url: msg.author.avatarURL
                        },
                        description: "You are rank " + rank_names[row.userrank] + "."
                    }
                });
            }

            else {
                try {
                    to_query = "";
                    temp = args[0];
                    for (var i = 0; i < temp.length; i++)
                        if (!isNaN(parseInt(temp.charAt(i))))
                            to_query += temp.charAt(i);
                    db.get(`Select userid, userrank From "${db_userdata}" Where userid = ${to_query}`).then(to_query_row => {
                        msg.channel.send({
                            embed: {
                                color: 0x00FF00,
                                author: {
                                    name: msg.author.username,
                                    icon_url: msg.author.avatarURL
                                },
                                description: "<@" + to_query_row.userid + "> is rank " + rank_names[to_query_row.userrank] + "."
                            }
                        });
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
                            description: "Could not find that person, but you are rank " + rank_names[row.userrank] + "."
                        }
                    });
                }
            }
        });
    });
}
module.exports.config = {
    command: "rank"
};
