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
            // Can't find the caller in DB, this should never happen
            if (!row) {
                msg.channel.send("Whoops! Something went wrong!");
                return;
            }

            // Not enough perms
            // TODO: per server config on what rank can use this?
            else if (row.userrank < 6) {
                msg.channel.send("You do not have sufficient permissions for this.\nPermissions required: " + rank_names[6]);
            }

            else if (args.length == 0) {
                msg.channel.send("You must specify a new balance.");
                return;
            }

            else if (args.length > 0) {
                new_bal = parseInt(args[0]);
                if (isNaN(new_bal)) {
                    msg.channel.send("You must specify an integer to set as your new balance.");
                    return;
                }
                else {
                    db.run(`Update "${db_userdata}" Set balance = ${new_bal} Where userid = ${row.userid}`);
                    msg.channel.send({embed:{
                        color: 0x00FF00,
                        description: "Your balance has been updated to: $" + new_bal}});
                }
            }

            // Something else?
            else msg.channel.send("Whoops! Something went wrong!");
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
    command: "setbal"
};