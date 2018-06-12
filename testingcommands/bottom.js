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
        db.all(`Select userrank, userid, balance From "${db_userdata}" Order By balance Asc`).then(server_data => {
            db.get(`Select * From "${db_userdata}" Where userid = ${msg.author.id}`).then(caller_row => {
                server_members = server_data.length;
                var rank_names = settings.ranknames.split(",");
                if (!server_data) {
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
                    if (server_members < 5){
                        var message = "The " + server_members + " poorest on this server are: ";
                        var leaderboard = "\n\n";
                        for (var i = 0; i < server_members; i++)
                            leaderboard += "<@" + server_data[i].userid + ">:  $" + server_data[i].balance + "\n";
                        msg.channel.send({
                            embed: {
                                color: 0x222222,
                                author: {
                                    name: msg.author.username,
                                    icon_url: msg.author.avatarURL
                                },
                                description: message + leaderboard
                            }
                        });
                    }
                    else {
                        var message = "The 5 poorest on this server are: ";
                        var leaderboard = "\n\n";
                        for (var i = 0; i < 5; i++)
                            leaderboard += "<@" + server_data[i].userid + ">:  $" + server_data[i].balance + "\n";
                        msg.channel.send({
                            embed: {
                                color: 0x222222,
                                author: {
                                    name: msg.author.username,
                                    icon_url: msg.author.avatarURL
                                },
                                description: message + leaderboard
                            }
                        });
                    }
                }

                else if (args.length == 1) {
                    try {
                        if (isNaN(parseInt(args[0]))){
                            msg.channel.send({embed:{
                                color:0xFF0000,
                                author: {
                                    name: msg.author.username,
                                    icon_url: msg.author.avatarURL
                                },
                                description: "You must supply an integer less than or equal to 15"
                            }});
                        }
                        else {
                            top_num = parseInt(args[0]);
                            if (top_num < 1)
                                top_num = 15;
                            if (top_num > 15)
                                top_num = 15;
                            if (server_members < top_num){
                                top_num = server_members;
                            }
                            var message = "The " + top_num + " poorest on this server are: ";
                            var leaderboard = "\n\n";
                            for (var i = 0; i < top_num; i++)
                                leaderboard += "<@" + server_data[i].userid + ">:  $" + format(server_data[i].balance) + "\n";
                            msg.channel.send({
                                embed: {
                                    color: 0x222222,
                                    author: {
                                        name: msg.author.username,
                                        icon_url: msg.author.avatarURL
                                    },
                                    description: message + leaderboard
                                }
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
    });

}

function format(input) {
    while (/(\d+)(\d{3})/.test(input.toString())) {
        input = input.toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
    }
    return input;
}

module.exports.config = {
    command: "bottom"
};