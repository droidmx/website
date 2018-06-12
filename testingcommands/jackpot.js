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
        db.get(`Select * From "${db_userdata}" Where userid = ${msg.author.id}`).then(row =>{
            
            var to_bet = 0;

            // Can't find the caller in DB, this should never happen
            if (!row){
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
                return;
            }

            // No bet amount placed
            else if (args.length == 0){
                msg.channel.send({
                    embed: {
                        color: 0xFF0000,
                        author: {
                            name: msg.author.username,
                            icon_url: msg.author.avatarURL
                        },
                        description: "You must specify an integer to bet."
                    }
                });
                return;
            }

            // Bet is not an integer
            else if (args.length > 0){
                to_bet = parseInt(args[0]);
                if (isNaN(to_bet)){
                    msg.channel.send({
                        embed: {
                            color: 0xFF0000,
                            author: {
                                name: msg.author.username,
                                icon_url: msg.author.avatarURL
                            },
                            description: "You must specify an integer to bet."
                        }
                    });
                    return;
                }
                else {

                    // Minimum bet TODO: Change to server-config?
                    if (to_bet < 50) {
                        msg.channel.send({
                            embed: {
                                color: 0xFF0000,
                                author: {
                                    name: msg.author.username,
                                    icon_url: msg.author.avatarURL
                                },
                                description: "You must bet at least $50."
                            }
                        });
                    }

                    // Not enough money in your account
                    else if (to_bet > row.balance) {
                        msg.channel.send({
                            embed: {
                                color: 0xFF0000,
                                author: {
                                    name: msg.author.username,
                                    icon_url: msg.author.avatarURL
                                },
                                description: "You do not have that much money!\nCurrent balance: " + row.balance
                            }
                        });
                    }

                    // I guess they passed all the tests
                    // This is where the actual slot machine happens
                    else if (row.userrank < 6) {
                        msg.channel.send({
                            embed: {
                                color: 0xFF0000,
                                author: {
                                    name: msg.author.username,
                                    icon_url: msg.author.avatarURL
                                },
                                description: "Sorry, you cannot use this."
                            }
                        });
                    }
                    else {
                        ///////////////////////// SELECT EMOJIS
                        var border_top = "**==========**";
                        var border_bottom = "**==========**";
                        var emojis = [`${settings.slotemoji0}`, 
                            `${settings.slotemoji1}`, 
                            `${settings.slotemoji2}`, 
                            `${settings.slotemoji3}`];
                        var jackpot = `${emojis[3]} ${emojis[3]} ${emojis[3]}`;
                        var message = ``;

                        message += "**You Hit the Jackpot!! **\nYour roll:\n\n";
                        message += border_top + "\n";
                        message += jackpot + "   <\n";
                        message += border_bottom + "\n\n";
                        message += "You earned " + (to_bet * 205) + "!\n";
                        db.run(`Update "${db_userdata}" Set balance = ${row.balance + to_bet * 205} Where userid = ${row.userid}`).then(run => {
                            message += "You have $" + (row.balance + (to_bet * 205)) + " left.";
                            msg.channel.send({
                                embed: {
                                    color: 000000,
                                    author: {
                                        name: msg.author.username,
                                        icon_url: msg.author.avatarURL
                                    },
                                    description: message
                                }
                            });
                        });
                    }
                }
            }
        }); // End User DB
    }); // End Settings DB
}

module.exports.config = {
    command: "jackpot"
};