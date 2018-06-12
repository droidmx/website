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
            
            else if (row.userrank < 1){
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

            else {
                prediction_list = ["It is certain",
                    "It is decidedly so",
                    "Without a doubt",
                    "Yes definitely",
                    "You may rely on it",
                    "As I see it, yes",
                    "Most likely",
                    "Outlook good",
                    "Yep",
                    "Signs point to yes",
                    "Reply hazy try again",
                    "Ask again later",
                    "Better not tell you now",
                    "Cannot predict now",
                    "Concentrate and ask again",
                    "Don't count on it",
                    "My reply is no",
                    "My sources say no",
                    "Outlook not so good",
                    "Very doubtful"];
                var t = "";
                if (args.length >= 1)
                    args.forEach(element => {
                        t += element + " ";
                    });
                if (t == "")
                    msg.channel.send({
                        embed: {
                            color: 000000,
                            author: {
                                name: msg.author.username,
                                icon_url: msg.author.avatarURL
                            },
                            description: ":8ball:  " + prediction_list[Math.floor(Math.random() * (prediction_list.length))]
                        } 
                    });
                else
                    msg.channel.send({
                        embed: {
                            title: t,
                            color: 000000,
                            author: {
                                name: msg.author.username,
                                icon_url: msg.author.avatarURL
                            },
                            description: ":8ball:  " + prediction_list[Math.floor(Math.random() * (prediction_list.length))]
                        } 
                    });
            }
        }); // End User DB
    }); // End Settings DB
}
module.exports.config = {
    command: "8ball"
};