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
            var rank_names = settings.ranknames.split(",");
            var emojis = settings.slotemojis.split(",");
            var to_bet = 0;

            // Can't find the caller in DB, this should never happen
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

            else if (row.userrank < 1){
                msg.channel.send("You do not have sufficient permissions for this.\nPermissions required: " + rank_names[1]);
            }
            // No bet amount placed
            else if (args.length == 0) {
                msg.channel.send({
                    embed: {
                        color: 0xFF0000,
                        author: {
                            name: msg.author.username,
                            icon_url: msg.author.avatarURL
                        },
                        description: "You must specify an amount to bet.\nExample: `" + settings.prefix + "slots 50`\n" +
                            "Alternatively use `" + settings.prefix + "slots info` to receive a DM of the chances of winning."
                    }
                });
                return;
            }

            // Bet is not an integer
            else if (args.length > 0) {
                if (args[0].toLowerCase() == "info"){
                    msg.author.send({
                        embed: {
                            color: 0x888888,
                            author: {
                                name: msg.author.username,
                                icon_url: msg.author.avatarURL
                            },
                            description: "Out of courtesy to other members of this server who may not want to know, please do not share this information.\n\n" +
                            "**Loss: ** 65%\n" +
                            "**Double: ** 24%\n" +
                            "**Triple: ** 10.9%\n" +
                            "**Jackpot: ** 0.1%\n"
                        } // TODO: make this variable and adjust to the actual slot values below
                    });
                    return;
                }
                for (var i = 0; i < args[0].length; i++)
                    if (!isNaN(parseInt(args[0].charAt(i))))
                        to_bet += args[0].charAt(i);
                to_bet = parseInt(to_bet);
                if (isNaN(to_bet)) {
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
                                description: "You must bet at least $50."}
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
                    else {
                        var emojis = [`${emojis[0]}`, 
                            `${emojis[1]}`, 
                            `${emojis[2]}`, 
                            `${emojis[3]}`];
                            // Define your own emojis here
                            // An example would be:  `:wink:` 
                            // Mine come directly from a database (settings.slotemoji1, etc.)
                        var border_top = "**==========**";
                        var border_bottom = "**==========**";
                        var possible_fails = [
                            `${emojis[0]} ${emojis[1]} ${emojis[2]}`,
                            `${emojis[0]} ${emojis[1]} ${emojis[3]}`,
                            `${emojis[0]} ${emojis[2]} ${emojis[3]}`,
                            `${emojis[0]} ${emojis[2]} ${emojis[1]}`,
                            `${emojis[0]} ${emojis[3]} ${emojis[2]}`,
                            `${emojis[0]} ${emojis[3]} ${emojis[1]}`,

                            `${emojis[1]} ${emojis[0]} ${emojis[2]}`,
                            `${emojis[1]} ${emojis[0]} ${emojis[3]}`,
                            `${emojis[1]} ${emojis[2]} ${emojis[0]}`,
                            `${emojis[1]} ${emojis[2]} ${emojis[3]}`,
                            `${emojis[1]} ${emojis[3]} ${emojis[0]}`,
                            `${emojis[1]} ${emojis[3]} ${emojis[2]}`,

                            `${emojis[2]} ${emojis[0]} ${emojis[3]}`,
                            `${emojis[2]} ${emojis[0]} ${emojis[1]}`,
                            `${emojis[2]} ${emojis[1]} ${emojis[0]}`,
                            `${emojis[2]} ${emojis[1]} ${emojis[3]}`,
                            `${emojis[2]} ${emojis[3]} ${emojis[0]}`,
                            `${emojis[2]} ${emojis[3]} ${emojis[1]}`,

                            `${emojis[0]} ${emojis[3]} ${emojis[2]}`,
                            `${emojis[0]} ${emojis[3]} ${emojis[1]}`,
                            `${emojis[0]} ${emojis[1]} ${emojis[2]}`,
                            `${emojis[0]} ${emojis[1]} ${emojis[3]}`,
                            `${emojis[0]} ${emojis[2]} ${emojis[3]}`,
                            `${emojis[0]} ${emojis[2]} ${emojis[1]}`
                        ];
                        var possible_doubles = [
                            `${emojis[0]} ${emojis[0]} ${emojis[2]}`,
                            `${emojis[0]} ${emojis[0]} ${emojis[1]}`,
                            `${emojis[0]} ${emojis[0]} ${emojis[3]}`,
                            `${emojis[0]} ${emojis[1]} ${emojis[0]}`,
                            `${emojis[0]} ${emojis[3]} ${emojis[0]}`,
                            `${emojis[0]} ${emojis[2]} ${emojis[0]}`,
                            `${emojis[3]} ${emojis[0]} ${emojis[0]}`,
                            `${emojis[2]} ${emojis[0]} ${emojis[0]}`,
                            `${emojis[1]} ${emojis[0]} ${emojis[0]}`,

                            `${emojis[2]} ${emojis[2]} ${emojis[0]}`,
                            `${emojis[2]} ${emojis[2]} ${emojis[1]}`,
                            `${emojis[2]} ${emojis[2]} ${emojis[3]}`,
                            `${emojis[2]} ${emojis[1]} ${emojis[2]}`,
                            `${emojis[2]} ${emojis[0]} ${emojis[2]}`,
                            `${emojis[2]} ${emojis[3]} ${emojis[2]}`,
                            `${emojis[0]} ${emojis[2]} ${emojis[2]}`,
                            `${emojis[1]} ${emojis[2]} ${emojis[2]}`,
                            `${emojis[3]} ${emojis[2]} ${emojis[2]}`,

                            `${emojis[0]} ${emojis[0]} ${emojis[3]}`,
                            `${emojis[0]} ${emojis[0]} ${emojis[1]}`,
                            `${emojis[0]} ${emojis[0]} ${emojis[2]}`,
                            `${emojis[0]} ${emojis[1]} ${emojis[0]}`,
                            `${emojis[0]} ${emojis[2]} ${emojis[0]}`,
                            `${emojis[0]} ${emojis[3]} ${emojis[0]}`,
                            `${emojis[1]} ${emojis[0]} ${emojis[0]}`,
                            `${emojis[2]} ${emojis[0]} ${emojis[0]}`,
                            `${emojis[3]} ${emojis[0]} ${emojis[0]}`,
                            
                            `${emojis[1]} ${emojis[1]} ${emojis[0]}`,
                            `${emojis[1]} ${emojis[1]} ${emojis[3]}`,
                            `${emojis[1]} ${emojis[1]} ${emojis[2]}`,
                            `${emojis[1]} ${emojis[0]} ${emojis[1]}`,
                            `${emojis[1]} ${emojis[2]} ${emojis[1]}`,
                            `${emojis[1]} ${emojis[3]} ${emojis[1]}`,
                            `${emojis[0]} ${emojis[1]} ${emojis[1]}`,
                            `${emojis[2]} ${emojis[1]} ${emojis[1]}`,
                            `${emojis[3]} ${emojis[1]} ${emojis[1]}`
                        ];
                        var possible_triple = [
                            `${emojis[2]} ${emojis[2]} ${emojis[2]}`,
                            `${emojis[0]} ${emojis[0]} ${emojis[0]}`,
                            `${emojis[1]} ${emojis[1]} ${emojis[1]}`,
                        ];
                        var jackpot = `${emojis[3]} ${emojis[3]} ${emojis[3]}`;
                        var message = ``;
                        var roll = Math.random() * 100;
                        if (roll <= 65){ // Failed
                            message += "**You lost your bet of $" + format(to_bet) + "**\nYour roll:\n\n";
                            message += border_top + "\n";
                            message += possible_fails[Math.floor(Math.random() * (possible_fails.length))] + "   <\n";
                            message += border_bottom + "\n\n";
                            db.run(`Update "${db_userdata}" Set balance = ${row.balance - to_bet} Where userid = ${row.userid}`).then(run=>{
                                message += "You have $" + format(row.balance - (to_bet)) + " left.";
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
                        else if (roll > 99.9) { // Jackpot!
                            message += "**You Hit the Jackpot!! **\nYour roll:\n\n";
                            message += border_top + "\n";
                            message += jackpot + "   <\n";
                            message += border_bottom + "\n\n";
                            var rand_jackpot = Math.floor((Math.random() * 100) + 50);
                            message += "You earned $" + format(to_bet * rand_jackpot) + "!\n";
                            db.run(`Update "${db_userdata}" Set balance = ${row.balance + to_bet * rand_jackpot} Where userid = ${row.userid}`).then(run => {
                                message += "You have $" + format(row.balance + (to_bet * rand_jackpot)) + " left.";
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
                        else if (roll > 89){ // Triples
                            message += "**You Rolled a Triple!**\nYour roll:\n\n";
                            message += border_top + "\n";
                            message += possible_triple[Math.floor(Math.random() * (possible_triple.length))] + "   <\n";
                            message += border_bottom + "\n\n";
                            message += "You earned $" + format(to_bet * 2) + "!\n";
                            db.run(`Update "${db_userdata}" Set balance = ${row.balance + to_bet * 2} Where userid = ${row.userid}`).then(run=>{
                                message += "You have $" + format(row.balance + (to_bet * 2)) + " left.";
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
                        else { // Doubles
                            message += "**You rolled a double!**\nYour roll:\n\n";
                            message += border_top + "\n";
                            message += possible_doubles[Math.floor(Math.random() * (possible_doubles.length))] + "   <\n";
                            message += border_bottom + "\n\n";
                            message += "You earned $" + format(to_bet) + "!\n";
                            db.run(`Update "${db_userdata}" Set balance = ${row.balance + to_bet} Where userid = ${row.userid}`).then(run=>{
                                message += "You have $" + format(row.balance + to_bet) + " left.";
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
            }
        }); // End User DB
    }); // End Settings DB
}

function format(input) {
    while (/(\d+)(\d{3})/.test(input.toString())) {
        input = input.toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
    }
    return input;
}

module.exports.config = {
    command: "slots"
};