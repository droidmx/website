module.exports.run = async (bot, msg, args) => {
    const Discord = require("discord.js");
    var db_path = require("../testingbot.js").database_path;
    var db_userdata = require("../testingbot.js").db_userdata;
    var db_settings = require("../testingbot.js").db_settings;

    const db = require("sqlite");
    db.open(db_path);

    var imgur_client_id = "5d6f7ad41da19dc";
    var http = require("https");

    if (msg.channel.id != "447950977509883905"){
        msg.delete();
        return;
    }
    db.get(`Select * From "${db_settings}"`).then(settings => {
        db.get(`Select * From "${db_userdata}" Where userid = ${msg.author.id}`).then(row => {
            var rank_names = settings.ranknames.split(",");
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

            else if (row.userrank < 1) {
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

            else if (args.length < 1) {
                msg.channel.send({
                    embed: {
                        color: 0xFF0000,
                        author: {
                            name: msg.author.username,
                            icon_url: msg.author.avatarURL
                        },
                        description: "You must supply a search word or phrase."
                    }
                });
            }

            else {
                var search_phrase = ""
                args.forEach(element => {
                    search_phrase += "+" + element
                });
                search_phrase = search_phrase.substr(1);
                //console.log(search_phrase);
                var options = {
                    "method": "GET",
                    "host": `api.imgur.com`,
                    "path": `/3/gallery/search?q=${search_phrase}`,
                    "headers": {
                        "Authorization": `Client-ID ${imgur_client_id}`
                    }
                };
                try {
                    var req = http.request(options, function (res) {
                        var chunks = [];

                        res.on("data", function (chunk) {
                            chunks.push(chunk);
                        });

                        res.on("end", function () {
                            var body = Buffer.concat(chunks);
                            let info = JSON.parse(body);
                            //console.log(info);
                            try {
                                if (!info.data) {
                                    msg.channel.send({
                                        embed: {
                                            color: 0xFF0000,
                                            author: {
                                                name: msg.author.username,
                                                icon_url: msg.author.avatarURL
                                            },
                                            description: "Could not find anything with that search!"
                                        }
                                    });
                                }
                                else {
                                    var to_send_image;
                                    var random2 = Math.floor(Math.random() * (info.data.length));
                                    if (!info.data[random2].images) {
                                        to_send_image = info.data[random2].link.toString();
                                        if (info.data[random2].nsfw && !msg.channel.nsfw) {
                                            msg.channel.send({
                                                embed: {
                                                    color: 0xFF0000,
                                                    author: {
                                                        name: msg.author.username,
                                                        icon_url: msg.author.avatarURL
                                                    },
                                                    description: "The image I found is nsfw, unfortunately, this channel is not suitable for this content."
                                                }
                                            });
                                            return;
                                        }
                                        else {
                                            console.log("  A search for " + search_phrase + " gave me: " + to_send_image);
                                            const embed = new Discord.RichEmbed()
                                                .setTitle("I found something for you!")
                                                .setAuthor(msg.author.username, msg.author.avatarURL)
                                                .setColor(0x0000FF)
                                                .setImage(to_send_image);
                                            msg.channel.send({ embed });
                                        }
                                    }
                                    else {
                                        to_send_image = info.data[random2].images[0].link.toString();
                                        if (info.data[random2].images[0].nsfw && !msg.channel.nsfw) {
                                            msg.channel.send({
                                                embed: {
                                                    color: 0xFF0000,
                                                    author: {
                                                        name: msg.author.username,
                                                        icon_url: msg.author.avatarURL
                                                    },
                                                    description: "The image I found is nsfw, unfortunately, this channel is not suitable for this content."
                                                }
                                            });
                                            return;
                                        }
                                        else {
                                            console.log("  A search for " + search_phrase + " gave me: " + to_send_image);
                                            const embed = new Discord.RichEmbed()
                                                .setTitle("I found something for you!")
                                                .setAuthor(msg.author.username, msg.author.avatarURL)
                                                .setColor(0x0000FF)
                                                .setImage(to_send_image);
                                            msg.channel.send({ embed });
                                        }
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
                        });
                    });
                    req.end();
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
                    console.log("An image search error occurred.");
                }
            }
        }); // End User DB
    }); // End Settings DB
}
module.exports.config = {
    command: "search"
};
