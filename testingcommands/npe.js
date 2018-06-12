module.exports.run = async (bot, msg, args) => {
    const Discord = require("discord.js");
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
            if (row.userrank < 1){
                msg.channel.send("You need to be at least rank " + rank_names[1] + " to use this.");
            }

            else {
                character_list = ["Wizard",
                    "Priest",
                    "Rogue",
                    "Archer",
                    "Warrior",
                    "Huntress",
                    "Ninja",
                    "Sorcerer",
                    "Knight",
                    "Paladin",
                    "Necromancer",
                    "Assassin",
                    "Trickster",
                    "Mystic"
                ];
                character_images = [
                    "https://www.realmeye.com/s/a/img/wiki/Wizard_0.PNG",
                    "https://www.realmeye.com/s/a/img/wiki/Priest_1.PNG",
                    "https://www.realmeye.com/s/a/img/wiki/Rogue.PNG",
                    "https://www.realmeye.com/s/a/img/wiki/Archer_0.PNG",
                    "https://www.realmeye.com/s/a/img/wiki/Warrior_1.PNG",
                    "https://www.realmeye.com/s/a/img/wiki/Huntress.png",
                    "https://www.realmeye.com/s/a/img/wiki/ninja_3.png",
                    "https://www.realmeye.com/s/a/img/wiki/Sorcerer_0.png",
                    "https://www.realmeye.com/s/a/img/wiki/Knight_1.PNG",
                    "https://www.realmeye.com/s/a/img/wiki/Paladin.PNG",
                    "https://www.realmeye.com/s/a/img/wiki/Necromancer.png",
                    "https://www.realmeye.com/s/a/img/wiki/assassin_0.PNG",
                    "https://www.realmeye.com/s/a/img/wiki/Trickster_0.PNG",
                    "https://www.realmeye.com/s/a/img/wiki/Mystic_0.png"
                ];

                var selection = [Math.floor(Math.random() * (character_list.length))];

                const embed = new Discord.RichEmbed()
                    .setTitle("You should npe... " + character_list[selection])
                    .setAuthor(msg.author.username, msg.author.avatarURL)
                    .setColor(0xFFFFFF)
                    .setThumbnail(character_images[selection]);
                msg.channel.send({embed});
            }
        }); // End User DB
    }); // End Settings DB
}
module.exports.config = {
    command: "npe"
};