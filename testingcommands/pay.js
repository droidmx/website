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
        db.all(`Select userrank, userid, balance, messagecount, previousmessagecount From "${db_userdata}"`).then(server_data => {
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

                if (caller_row.userrank < 5) {
                    msg.channel.send({
                        embed: {
                            color: 0xFF0000,
                            author: {
                                name: msg.author.username,
                                icon_url: msg.author.avatarURL
                            },
                            description: "You need to be at least rank " + rank_names[5] + " to use this."
                        }
                    });
                }

                else if (args.length == 0) {
                    not_paid = 0;
                    server_data.forEach(member => {
                        member_difference = member.messagecount - member.previousmessagecount;
                        if (member_difference > 200) {
                            db.run(`Update "${db_userdata}" Set balance = ${member.balance + (10 * 250)}, previousmessagecount = messagecount Where userid = ${member.userid}`);
                        }
                        else if (member_difference > 150) {
                            db.run(`Update "${db_userdata}" Set balance = ${member.balance + (8 * 250)}, previousmessagecount = messagecount Where userid = ${member.userid}`);
                        }
                        else if (member_difference > 100) {
                            db.run(`Update "${db_userdata}" Set balance = ${member.balance + (5 * 250)}, previousmessagecount = messagecount Where userid = ${member.userid}`);
                        }
                        else if (member_difference > 80) {
                            db.run(`Update "${db_userdata}" Set balance = ${member.balance + (4 * 250)}, previousmessagecount = messagecount Where userid = ${member.userid}`);
                        }
                        else if (member_difference > 50) {
                            db.run(`Update "${db_userdata}" Set balance = ${member.balance + (3 * 250)}, previousmessagecount = messagecount Where userid = ${member.userid}`);
                        }
                        else if (member_difference > 20) {
                            db.run(`Update "${db_userdata}" Set balance = ${member.balance + 250}, previousmessagecount = messagecount Where userid = ${member.userid}`);
                        }
                        else if (member_difference > 0) {
                            db.run(`Update "${db_userdata}" Set balance = ${member.balance + (100)}, previousmessagecount = messagecount Where userid = ${member.userid}`);
                        }
                        else not_paid++;
                    });
                    msg.channel.send({
                        embed: {
                            color: 0x00FF00,
                            author: {
                                name: msg.author.username,
                                icon_url: msg.author.avatarURL
                            },
                            description: "Everyone who has sent a message since the last payday has been paid!\nA total of " + (server_data.length - not_paid) + " members were paid and " + not_paid + " were neglected."
                        }
                    });
                }

                else if (args.length == 1) {
                    temp = args[0];
                    var to_pay = "";
                    for (var i = 0; i < temp.length; i++)
                        if (!isNaN(parseInt(temp.charAt(i))))
                            to_pay += temp.charAt(i);
                    db.run(`Update "${db_userdata}" Set balance = (balance + 500), previousmessagecount = messagecount Where userid = ${to_pay}`);
                    msg.channel.send({
                        embed: {
                            color: 0x00FF00,
                            author: {
                                name: msg.author.username,
                                icon_url: msg.author.avatarURL
                            },
                            description: "<@" + to_pay + "> has been paid!"
                        }
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
                            description: "Whoops! Something went wrong!"
                        }
                    });
                    console.log(args);
                }

            });


        });
    });
}

module.exports.config = {
    command: "pay"
};