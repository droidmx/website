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
    db.get(`Select * From "${db_settings}"`).then(settings=>{
        db.get(`Select * From "${db_userdata}" Where userid = ${msg.author.id}`).then(row =>{
            var rank_names = settings.ranknames.split(",");
            if (row.userrank < 1){
                msg.channel.send("You need to be at least rank " + rank_names[1] + " to use this.");
            }

            else {
                var album_list = [
                    "3OMii",
                    "Hj7Aw",
                    "lAAov",
                    "layZq",
                    "EzRfQ",
                    "7J0Wh"
                ];
                var album_random = Math.floor(Math.random() * (album_list.length));
                var options = {
                    "method": "GET",
                    "host": `api.imgur.com`,
                    "path": `/3/album/${album_list[album_random]}/images`,
                    "headers": {
                        "Authorization": `Client-ID ${imgur_client_id}`
                    }
                };

                var req = http.request(options, function (res) {
                    var chunks = [];

                    res.on("data", function (chunk) {
                        chunks.push(chunk);
                    });

                    res.on("end", function () {
                        var body = Buffer.concat(chunks);
                        let info = JSON.parse(body);
                        var random2 = Math.floor(Math.random() * (info.data.length));
                        var to_send_image = info.data[random2].link.toString();
                        const embed = new Discord.RichEmbed()
                            .setTitle("I found a catto for you!")
                            .setAuthor(msg.author.username, msg.author.avatarURL)
                            .setColor(0xBDB76B)
                            .setImage(to_send_image);
                        msg.channel.send({ embed });
                    });
                });
                req.end();              
            }
        }); // End User DB
    }); // End Settings DB
}
module.exports.config = {
    command: "catto"
};
