module.exports.run = async (bot, msg, args) => { // this is what will run when the command is called
    

    // Purge Command
    const user = msg.mentions.users.first();
    const amount = !!parseInt(msg.content.split(' ')[1]) ? parseInt(msg.content.split(' ')[1]) : parseInt(msg.content.split(' ')[2])
    const config = require("../config.json");
    var prefix = config.prefix // Prefix for commands
    
    var cando = false;
    config.adminID.forEach(user => {
        if (msg.author.id === user){
            cando = true;
        }
    });
    if (cando){
        if (msg.content.startsWith(prefix + 'purge') && !amount)
            return msg.reply('Must specify an amount to delete!');
        else if (msg.content.startsWith(prefix + 'purge')){
            msg.channel.fetchMessages({
                limit: amount,
            }).then((msgs) => {
                if (user) {
                    const filterBy = user ? user.id : bot.user.id;
                    msgs = msgs.filter(m => m.author.id === filterBy).array().slice(0, amount);
                }
                msg.channel.bulkDelete(msgs).catch(error => console.log(error.stack));
            });
        }
    }
    else msg.channel.send("You do not have sufficient permission to do this.").then(message => {message.delete(5000);});
}
module.exports.config = {
    command: "purge"
};
