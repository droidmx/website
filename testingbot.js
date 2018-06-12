const Discord = require("discord.js");
const config = require("./testingconfig.json");

const db = require("sqlite");
db.open("./testingdb/testing.db");

const client = new Discord.Client();
let fs = require('fs');
let now = require("now.js");

// Office themed ranks? Sure!  0		1		2		 3		   4       5		6
var default_rank_names = ["Checker", "Pawn", "Knight", "Rook", "Bishop", "Queen", "King"];
// Emojis for slots      0           1          2          3
var default_emojis = [":poop:", ":pensive:", ":joy:", ":money_mouth:"];
// Default prefix
var default_prefix = "!";

var afk_users = {};
var afk_emojis = {};
var afk_messages = {};


/* 
* 
* Some general information about this bot:
* 
* Coded from scratch completely by Vincent
* 
* This is the invite link:
* https://discordapp.com/oauth2/authorize?&client_id=405115309419134989&scope=bot&permission=8
* (assuming administraive permission for maximum features)
* 
* 
* And, it isn't done!
* 
*/





client.commands = new Discord.Collection();
fs.readdir('./testingcommands/', (err, files) => {
	if (err)
		console.error(err);
	var jsfiles = files.filter(f => f.split('.').pop() === 'js');
	if (jsfiles.length <= 0)
		return console.log('No commands found...')
	else
		console.log(jsfiles.length + ' commands found.')
	jsfiles.forEach((f, i) => {
		var cmds = require(`./testingcommands/${f}`);
		//console.log(`Command ${f} loading...`);
		client.commands.set(cmds.config.command, cmds);
	});
});

// TODO: Commands Array for each command to reduce number of files when the command should do the same thing?
// Or not depending on how difficult imgur albums would be to make mailable

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
	console.log("A.2.0.bot is now running.");
});

client.on("guildCreate", server => {
	var db_userdata = server.id + "d";
	var db_settings = server.id + "s";
	db.run(`CREATE TABLE IF NOT EXISTS "${db_settings}" (
		prefix TEXT,
		slotemojis TEXT,
		ranknames TEXT,
		salary INTEGER,
		salaryrate INTEGER,
		serverinfo BLOB
		)`).then(() => {
			db.run(`Insert Into "${db_settings}"(prefix, slotemojis, ranknames, salary, salaryrate, serverinfo)
				VALUES (?, ?, ?, ?, ?, ?)`,
				[default_prefix, default_emojis.toString(), default_rank_names.toString(), 250, 2, "{ }"]);

			db.run(`CREATE TABLE IF NOT EXISTS "${db_userdata}" (
			userid TEXT,
			userrank INTEGER,
			username TEXT,
			balance INTEGER,
			messagecount INTEGER,
			previousmessagecount INTEGER,
			togglehelp INTEGER,
			gameinfo BLOB,
			personalinfo BLOB,
			otherservers BLOB
			)`).then(() => {
					server.members.forEach(member => {
						if (server.ownerID == member.id) {
							db.run(`Insert Into "${db_userdata}"(userid, username, userrank, balance, messagecount, previousmessagecount, togglehelp, gameinfo, personalinfo, otherservers)
							VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
								[member.id, "Name", 6, 500, 0, 0, 1, "{ }", "{ }", "{ }"]);
						}
						else {
							db.run(`Insert Into "${db_userdata}"(userid, username, userrank, balance, messagecount, previousmessagecount, togglehelp, gameinfo, personalinfo, otherservers)
							VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
								[member.id, "Name", 0, 250, 0, 0, 1, "{ }", "{ }", "{ }"]);
						}
					});
					/*
					* This does not work
					*
					server.roles.forEach(role => {
						if (role.hasPermission("MANAGE_GUILD") || role.hasPermission("ADMINISTRATOR")) {
							role.members.forEach(member => {
								member.send({
									embed: {
										color: 0x000000,
										author: {
											name: server.name,
											icon_url: server.iconURL
										},
										title: "Thank you for letting me join your server!",
										description: "I will cover some basics about my functionality below.",
										fields: [{
											name: "What can you do?",
											value: "I come with many features which you can discover using `!help`\n" +
												"I strive to be the most convenient server-management bot as a fun distraction for your server members."
										},
										{
											name: "How do I work with you?",
											value: "A key aspect of what I do is based around a ranking system numbered 0-6.\n" +
												"The server owner is automatically the highest rank and can use `!promote` and `!demoted` to adjust other members' ranks" +
												"Higher ranking members can use `!settings` at any time to see what can be modified.\n" +
												"Some of these modifications include changing the prefix, colors, and which features are available to members."
										},
										{
											name: "Is that all?",
											value: "For now, yes. As more information and features become available I will keep in touch.\n" +
												"In the mean time, enjoy!"
										}
										]
									}
								});
							});
						}
					});
					*/
				});

		});
	server.owner.send({
		embed: {
			color: 0x000000,
			author: {
				name: server.name,
				icon_url: server.iconURL
			},
			title: "Thank you for letting me join your server!",
			description: "I will cover some basics about my functionality below.",
			fields: [{
				name: "What can I do?",
				value: "I come with many features which you can discover using `!help`\n" +
					"I strive to be the most convenient server-management bot as a fun distraction for your server members."
			},
			{
				name: "How do I work with you?",
				value: "A key aspect of what I do is based around a ranking system numbered 0-6.\n" +
					"The server owner is automatically the highest rank and can use `!promote` and `!demoted` to adjust other members' ranks" +
					"Higher ranking members can use `!settings` at any time to see what can be modified.\n" +
					"Some of these modifications include changing the prefix, colors, and which features are available to members."
			},
			{
				name: "Is that all?",
				value: "For now, yes. As more information and features become available I will keep in touch.\n" +
					"In the mean time, enjoy!"
			}
			]
		}
	});
});

client.on("guildMemberRemove", member => {
	console.log("  " + member.user.username + " has left " + member.guild.name);

	var to_channel;
    member.guild.channels.array().forEach(channel =>{
        if (channel.id == "448650830032404480"){
            to_channel = channel;
        }

    });
	to_channel.send("**USER LEFT -->**  <@" + member.id + ">");
});


client.on("guildMemberAdd", member => {
	var db_userdata = member.guild.id + "d";
	
	var to_channel;
    member.guild.channels.array().forEach(channel =>{
        if (channel.id == "448650830032404480"){
            to_channel = channel;
        }

    });

	db.get(`Select userid From "${db_userdata}" where userid = '${member.id}'`).then(row=>{
		if (!row){
			db.run(`Insert Into "${db_userdata}"(userid, username, userrank, balance, messagecount, previousmessagecount, togglehelp, gameinfo, personalinfo, otherservers)
							VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
				[member.id, "Name", 0, 250, 0, 0, 1, "{ }", "{ }", "{ }"]);
				
			to_channel.send("**USER JOINED -->**  <@" + member.id + "> || Joined and added to the database (new member).");
			console.log("  " + member.user.username + " has joined " + member.guild.name);
			member.addRole("447950991141109770");
		}
		else {
			console.log("  " + member.user.username + " rejoined " + member.guild.name);
			var _personalinfo = JSON.parse("{}");
			try{
				_personalinfo = JSON.parse(row.personalinfo);
			}
			catch (err){
				console.log("A database error occurred ");
			}			
			var timeout = "448313389354188840";

			if (!_personalinfo.suspend){
				_personalinfo.suspend = 0;
			}

			var time = ((_personalinfo.suspend - new Date().getTime()) / (60 * 60 * 1000));

			if (_personalinfo.suspend == -1){
				to_channel.send("**USER JOINED -->**  <@" + member.id + "> || Joined and added timeout role (still under suspension).");
				member.addRole(timeout);
			}
			else if (time <= 0){
				to_channel.send("**USER JOINED -->**  <@" + member.id + "> || Joined and added member role (previous, if any, suspension is over).");
				member.addRole("447950991141109770");
			}
			else {
				to_channel.send("**USER JOINED -->**  <@" + member.id + "> || Joined and added timeout role (still under suspension).");
				member.addRole(timeout);
			}
		}
	});
});

client.on('message', msg => {
	var bot_logs = client.channels.get("448650830032404480");

	if (msg.author.bot) { }
	else {
		try {
			var db_userdata = msg.guild.id + "d";
			var db_settings = msg.guild.id + "s";
		}
		catch (err) {
			msg.reply({
				embed: {
					color: 0xFF0000,
					author: {
						name: msg.author.username,
						icon_url: msg.author.avatarURL
					},
					description: "Sorry, I don't respond well to DMs.\n\n" + 
					"If you're trying to verify, please send messages in the verification channel."
				}
			});
		}
		db.get(`Select messagecount From "${db_userdata}" Where userid = ${msg.author.id}`).then(author_row => {
			db.run(`Update "${db_userdata}" Set messagecount = messagecount + 1 Where userid = ${msg.author.id}`)
		}).catch(err => {
			if (msg.content.startsWith(config.default_prefix))
				msg.channel.send({
					embed: {
						color: 0x888888,
						author: {
							name: msg.author.username,
							icon_url: msg.author.avatarURL
						},
						description: "Preparing this server's database for first-time use.\n" +
							"I will be ready to execute the next command you type."
					}
				});
			console.log("User or server (" + msg.author.username + " : " + msg.guild.name + ") not found in database");
			db.run(`CREATE TABLE IF NOT EXISTS "${db_settings}" (
				prefix TEXT,
				slotemojis TEXT,
				ranknames TEXT,
				salary INTEGER,
				salaryrate INTEGER,
				serverinfo BLOB
				)`).then(() => {
					db.run(`Insert Into "${db_settings}"(prefix, slotemojis, ranknames, salary, salaryrate, serverinfo)
						VALUES (?, ?, ?, ?, ?, ?)`,
						[default_prefix, default_emojis.toString(), default_rank_names.toString(), 250, 2, "{ }"]);

					db.run(`CREATE TABLE IF NOT EXISTS "${db_userdata}" (
					userid TEXT,
					userrank INTEGER,
					username TEXT,
					balance INTEGER,
					messagecount INTEGER,
					previousmessagecount INTEGER,
					togglehelp INTEGER,
					gameinfo BLOB,
					personalinfo BLOB,
					otherservers BLOB
					)`).then(() => {
							msg.guild.members.forEach(member => {
								if (msg.guild.ownerID == member.id) {
									db.run(`Insert Into "${db_userdata}"(userid, username, userrank, balance, messagecount, previousmessagecount, togglehelp, gameinfo, personalinfo, otherservers)
										VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
										[member.id, "Name", 6, 500, 0, 0, 1, "{ }", "{ }", "{ }"]);
								}
								else {
									db.run(`Insert Into "${db_userdata}"(userid, username, userrank, balance, messagecount, previousmessagecount, togglehelp, gameinfo, personalinfo, otherservers)
										VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
										[member.id, "Name", 0, 250, 0, 0, 1, "{ }", "{ }", "{ }"]);
								}
							});
							/*
							* This does not work
							*
							server.roles.forEach(role => {
								if (role.hasPermission("MANAGE_GUILD") || role.hasPermission("ADMINISTRATOR")) {
									role.members.forEach(member => {
										member.send({
											embed: {
												color: 0x000000,
												author: {
													name: server.name,
													icon_url: server.iconURL
												},
												title: "Thank you for letting me join your server!",
												description: "I will cover some basics about my functionality below.",
												fields: [{
													name: "What can you do?",
													value: "I come with many features which you can discover using `!help`\n" +
														"I strive to be the most convenient server-management bot as a fun distraction for your server members."
												},
												{
													name: "How do I work with you?",
													value: "A key aspect of what I do is based around a ranking system numbered 0-6.\n" +
														"The server owner is automatically the highest rank and can use `!promote` and `!demoted` to adjust other members' ranks" +
														"Higher ranking members can use `!settings` at any time to see what can be modified.\n" +
														"Some of these modifications include changing the prefix, colors, and which features are available to members."
												},
												{
													name: "Is that all?",
													value: "For now, yes. As more information and features become available I will keep in touch.\n" +
														"In the mean time, enjoy!"
												}
												]
											}
										});
									});
								}
							});
							*/
						});
				});
		});


		module.exports.db_settings = db_settings;
		module.exports.db_userdata = db_userdata;
		module.exports.database_path = "./testingdb/testing.db";
		
		db.get(`SELECT * FROM "${db_userdata}" WHERE userid ="${msg.author.id}"`).then(row => {
			if (!row) {
				console.log("User not in database, adding now.");
				msg.channel.send({
					embed: {
						color: 0x888888,
						author: {
							name: msg.author.username,
							icon_url: msg.author.avatarURL
						},
						description: "Looks like you weren't in the database, I'll add you now."
					}
				}).then(message=>{
					message.delete(10000);
				});;
				db.run(`Insert Into "${db_userdata}"(userid, username, userrank, balance, messagecount, previousmessagecount, togglehelp, gameinfo, personalinfo, otherservers)
					VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
					[member.id, "Name", 0, 250, 0, 0, 1, "{ }", "{ }", "{ }"]);
			}
			else {
				db.run(`Update "${db_userdata}" Set messagecount = ${row.messagecount + 1} Where userid = ${msg.author.id}`);
			}
		}).catch(err => {
			console.log("A database error occured. That's an 'Oops'");
		});

		db.get(`Select * From "${db_settings}"`).then(settings => {
			/*if (msg.content.includes(client.user.id))
				msg.channel.send({
					embed: {
						color: 0x888888,
						author: {
							name: msg.author.username,
							icon_url: msg.author.avatarURL
						},
						description: "Hello "
					}
				});
				*/
			if (msg.content.startsWith("!help"))
				msg.channel.send({
					embed: {
						color: 0x888888,
						author: {
							name: msg.author.username,
							icon_url: msg.author.avatarURL
						},
						description: "The prefix for this server is: " + settings.prefix + 
						"\nThe help function is incomplete, please try again in a few days."
					}
				});
			var cont = msg.content.slice(settings.prefix.length).split(" ");
			var cmd = client.commands.get(cont[0].toLowerCase());
			var args = cont.slice(1);
			if (msg.content.slice(0, settings.prefix.length) === settings.prefix && cmd && !msg.author.bot)
				cmd.run(client, msg, args);

			else if (msg.content.startsWith(settings.prefix)){
				if (msg.channel.id == "447950929761665026") msg.delete();
				db.get(`Select * From "${db_userdata}" Where userid = ${msg.author.id}`).then(row =>{
// STARTAFK
					if ((msg.content.toLowerCase().includes("startafk") || msg.content.toLowerCase().includes("afkcheck")) && row.userrank >= 3) {
						msg.delete();
						bot_logs.send("**AFK STARTED --> ** <@" + msg.author.id + "> || Started afk check.");
						var _serverinfo = JSON.parse("{ }");
						try {
							_serverinfo = JSON.parse(settings.serverinfo);
						}
						catch (err) {
							bot_logs.send("**AFK FAILED --> ** <@" + msg.author.id + "> || JSON error.");
							console.log("JSON file unreadable for " + msg.guild.name + " serverinfo");
							msg.channel.send({
								embed: {
									color: 0xFF0000,
									author: {
										name: msg.author.username,
										icon_url: msg.author.avatarURL
									},
									description: "A database error occured, this server's data has been reset."
								}
							}).then(message => {
								message.delete(15000);
							});
						}
						if (!_serverinfo.afk_reactions) {
							bot_logs.send("**AFK FAILED --> ** <@" + msg.author.id + "> || Emoji error, none set.");
							msg.channel.send({
								embed: {
									color: 0xFF0000,
									author: {
										name: msg.author.username,
										icon_url: msg.author.avatarURL
									},
									description: "You are required to set at least 1 emoji to use in AFK checks.\n" +
										"Use `" + settings.prefix + "settings afk` for first-time setup."
								}
							}).then(message => {
								message.delete(15000);
							});
						}
						else if (!_serverinfo.afk_voice_channel || !_serverinfo.queue_voice_channel || !_serverinfo.to_voice_channel) {
							bot_logs.send("**AFK FAILED --> ** <@" + msg.author.id + "> || Error with one or more voice channels.");
							msg.channel.send({
								embed: {
									color: 0xFF0000,
									author: {
										name: msg.author.username,
										icon_url: msg.author.avatarURL
									},
									description: "I could not find the voice channels you want me to use, try `" + settings.prefix + "settings afk voice`.\n" +
										"Use `" + settings.prefix + "settings afk` for first-time setup."
								}
							}).then(message => {
								message.delete(15000);
							});
						}

						else try {
							var fails = 4;
							msg.guild.channels.forEach(element => {
								if (element.id.includes(_serverinfo.to_voice_channel)) {
									fails--;
								}
								if (element.id.includes(_serverinfo.queue_voice_channel)) {
									fails--;
								}
								if (element.id.includes(_serverinfo.afk_voice_channel)) {
									fails--;
								}
								if (element.id.includes(_serverinfo.afk_text_channel)) {
									fails--;
								}
							});
							
							if (fails > 0) {
								bot_logs.send("**AFK FAILED --> ** <@" + msg.author.id + "> || Error with one or more channels.");
								msg.channel.send({
									embed: {
										color: 0xFF0000,
										author: {
											name: msg.author.username,
											icon_url: msg.author.avatarURL
										},
										description: "There was an issue with one or more of the channels in your AFK check.\n" +
											"Use `" + settings.prefix + "settings afk` to review current settings and adjust the channels as requested."
									}
								}).then(message => {
									message.delete(15000);
								});
							}
							else {
								if (!_serverinfo.afk_text_channel) {
									_serverinfo.afk_text_channel = msg.channel.id;
									bot_logs.send("**AFK INFO --> ** <@" + msg.author.id + "> || Default channel set.");
									msg.channel.send({
										embed: {
											color: 0xFF0000,
											author: {
												name: msg.author.username,
												icon_url: msg.author.avatarURL
											},
											description: "I set this channel as the default for AFK checks, you can change this in `" + settings.prefix + "settings afk channel`."
										}
									}).then(message => {
										message.delete(15000);
									});
								}
								if (!_serverinfo.afk_text)
									_serverinfo.afk_text = "This is a temporary AFK check message, you can customize this message by using `" + settings.prefix + "settings afk message`.";
								if (!_serverinfo.afk_title)
									_serverinfo.afk_title = "An AFK check has started, you can change this in `" + settings.prefix + "settings afk title`."
								if (!_serverinfo.text_edit){
									_serverinfo.text_edit = "The afk check has ended";
								}
								
								client.channels.get(_serverinfo.afk_text_channel).send(_serverinfo.afk_text).then(message => {
									message.delete(150);
								});

								
								client.channels.get(_serverinfo.afk_text_channel).send({
									embed: {
										title: _serverinfo.afk_title,
										color: 0x00FF00,
										author: {
											name: msg.author.username,
											icon_url: msg.author.avatarURL
										},
										description: _serverinfo.afk_text
									}
								}).then(message => {

									afk_messages[`${db_userdata}`] = message.id;

									_serverinfo = JSON.parse(_serverinfo);
									var emojis = _serverinfo.afk_reactions;
									var iteration = 1;
									emojis.forEach(emote => {
											setTimeout(function () {
												try {
													var temp = "";
													for (var i = emote.length; i > 0; i--) {
														if (emote.charAt(i) == ':')
															break;
														else if (!isNaN(emote.charAt(i)))
															temp = emote.charAt(i) + temp;
													}
													message.react(temp).catch(err => {
														bot_logs.send("**AFK FAILED --> ** <@" + msg.author.id + "> || Error with one or more emojis.");
														console.log("emoji error");
														message.delete();
														msg.channel.send({
															embed: {
																color: 0xFF0000,
																author: {
																	name: msg.author.username,
																	icon_url: msg.author.avatarURL
																},
																description: "There was an issue with one or more of your emojis in the AFK check.\n" +
																	"Use `" + settings.prefix + "settings afk emojis` to fix this error.\n"
															}
														});
													});
												}
												catch (err1) {
													message.react(emote).catch(err => {
														
														bot_logs.send("**AFK FAILED --> ** <@" + msg.author.id + "> || Error with one or more emojis.");
														console.log("emoji error");
														message.delete();
														msg.channel.send({
															embed: {
																color: 0xFF0000,
																author: {
																	name: msg.author.username,
																	icon_url: msg.author.avatarURL
																},
																description: "There was an issue with one or more of your emojis in the AFK check.\n" +
																	"Use `" + settings.prefix + "settings afk emojis` to fix this error.\n"
															}
														});
													});
												}
											}, 500 * iteration++);
										});
									});
									}
						}
						catch (err) {
							bot_logs.send("**AFK FAILED --> ** <@" + msg.author.id + "> || Unknown error.");
							msg.channel.send({
								embed: {
									color: 0xFF0000,
									author: {
										name: msg.author.username,
										icon_url: msg.author.avatarURL
									},
									description: "Looks like something went wrong."
								}
							}).then(message => {
								message.delete(15000);
							});
						};
						_serverinfo = ((JSON.stringify(_serverinfo)).toString());
						db.run(`Update "${db_settings}" Set serverinfo = '${_serverinfo}'`);

					}
// STOPAFK
					else if ((msg.content.toLowerCase().includes("stopafk") || msg.content.toLowerCase().includes("endafk")) && row.userrank >= 3){
						msg.delete();
						var _serverinfo = JSON.parse("{ }");
						try {
							_serverinfo = JSON.parse(settings.serverinfo);
						}
						catch (err) {
							bot_logs.send("**STOP AFK FAILED --> ** <@" + msg.author.id + "> || JSON error.");
							console.log("JSON file unreadable for " + msg.guild.name + " serverinfo");
							msg.channel.send({
								embed: {
									color: 0xFF0000,
									author: {
										name: msg.author.username,
										icon_url: msg.author.avatarURL
									},
									description: "A database error occured, this server's data has been reset."
								}
							}).then(message => {
								message.delete(15000);
							});
						}

						var message = afk_messages[db_userdata];
						var _serverinfo = JSON.parse(settings.serverinfo);
						
						if (message == null){
							bot_logs.send("**STOP AFK FAILED --> ** <@" + msg.author.id + "> || No afk check in progress.");
							msg.channel.send({
								embed: {
									color: 0xFF0000,
									author: {
										name: msg.author.username,
										icon_url: msg.author.avatarURL
									},
									description: "I could not find an active AFK check, use `" + settings.prefix + "startafk` to begin one."
								}
							}).then(message => {
								message.delete(15000);
							});
						}
						else {
							try {
								var emojis = afk_emojis[db_userdata].split(",");
								var users = [];
								var iteration = 0;
								emojis.forEach(emoji => {
									try{
										users[iteration] = afk_users[db_userdata][emoji].split(",");
									}
									catch (err){
										
										bot_logs.send("**STOP AFK INFO --> ** <@" + msg.author.id + "> || No reactions to one or more emojis.");
										console.log(emoji + " has 0 reactions."); // TODO: Fix source of this issue (blank emoji)
									}
									iteration++;
								});
								try {
									var orig_msg = "";
									msg.guild.channels.forEach(channel => {
										

										if (channel.id == _serverinfo.afk_text_channel){
											console.log("correct channel");
											
											bot_logs.send("**AFK ENDED --> ** <@" + msg.author.id + "> || Stopped the afk check.");
											channel.fetchMessage(message).then(message => {
												console.log("I found the message");
												var new_msg = new Discord.RichEmbed()
													.setAuthor(msg.author.username, msg.author.avatarURL)
													.setColor(0x888888)
													.setDescription("The AFK Check has ended. Join queue and you may be moved if we don't have enough members."); // TODO: make edited text editable
												message.edit(new_msg);
											}).catch (err => {
												console.log(err);
											});
										}
									});
								}
								catch (err) {
									console.log(err);
								}
									

								users[0].forEach(user=>{
									var member;
									if (!user == "")
										member = msg.guild.members.get(user);
									if (member == null) { 
										console.log("Null member"); // TODO: Fix source of this issue (blank member)
									}
									else if (member.voiceChannelID == _serverinfo.queue_voice_channel || member.voiceChannelID == _serverinfo.to_voice_channel){
										member.setVoiceChannel(_serverinfo.to_voice_channel);
									}
								});
								var members = msg.guild.members.array();
								members.forEach(member=>{
									if (member.voiceChannelID == _serverinfo.to_voice_channel)
										var move = true;
										users[0].forEach(user => {
											try {
												if (user == member.id) {
													move = false;
												}
											}
											catch (err) {}
										});
										if (move){
											member.setVoiceChannel(_serverinfo.afk_voice_channel);
										}
								});

							}
							catch (err) {
								msg.channel.send({
									embed: {
										color: 0xFF0000,
										author: {
											name: msg.author.username,
											icon_url: msg.author.avatarURL
										},
										description: "No reactions to the afk check."
									}
								}).then(message => {
									message.delete(15000);
								});
							}
						}
						delete afk_emojis[db_userdata];
						delete afk_messages[db_userdata];
						delete afk_users[db_userdata];
						_serverinfo = ((JSON.stringify(_serverinfo)).toString());
						db.run(`Update "${db_settings}" Set serverinfo = '${_serverinfo}'`);
					}	
					/*				
// ABORTAFK
					else if (msg.content.toLowerCase().includes("abortafk") && row.userrank >= 17){ 
						
						// TODO: fix this

						var _serverinfo = JSON.parse("{}");
						try {
							_serverinfo = JSON.parse(settings.serverinfo);
						}
						catch (err) {
							console.log("JSON file unreadable for " + msg.guild.name + " serverinfo");
							msg.channel.send({
								embed: {
									color: 0xFF0000,
									author: {
										name: msg.author.username,
										icon_url: msg.author.avatarURL
									},
									description: "A database error occured, this server's data has been reset."
								}
							}).then(message => {
								message.delete(15000);
							});
						}

						_serverinfo = JSON.parse(settings.serverinfo);

						var channels = msg.guild.channels.array();
						var message;
						var flag = false;
						try {
							var orig_msg = "";
							var flag = false;
							for (var i = 0; i < channels.length && !flag; i++) {
								if (channels[i].id == _serverinfo.afk_text_channel) {
									console.log(channels[i]);
									channels[i].fetchMessage(message).then(message => {
										flag = true;
										console.log("I found the message");
										var new_msg = new Discord.RichEmbed()
											.setAuthor(msg.author.username, msg.author.avatarURL)
											.setColor(0x888888)
											.setDescription("The AFK Check has been aborted!");
										message.edit(new_msg).then(message2 => {
											message2.clearReactions();
										});;
									}).catch(err => {
										console.log(err);
									});
								}
							}
						}
						catch (err) {
							console.log(err);
						}
						message.edit("The AFK check has been aborted.");
						
						delete afk_emojis[db_userdata];
						delete afk_messages[db_userdata];
						delete afk_users[db_userdata];
					}
					*/

// Fix roles
					else if (msg.content.toLowerCase().includes("fix roles")) {
						
						msg.delete();
						msg.channel.startTyping();
						var members = msg.guild.members.array();
						var role_less_users = [];
						var role_less = 0;
						members.forEach(member=>{
							if (member.roles.array().length == 1){
								role_less++;
								member.addRole("447950991141109770");
								db.run(`Update "${db_userdata}" Set userrank = 0 Where userid = ${member.id}`).catch(err =>{
									console.log(err);
								});
								role_less_users.push(member.id);
							}
						});
						var optional = "";
						if (role_less < 10 && role_less > 1){
							optional += "Including: ";
							var i = 0;
							for (i; i < role_less_users.length - 1; i++)
								optional += "<@" + role_less_users[i] + ">, "
							optional += "and <@" + role_less_users[++i] + ">";
						}
						if (role_less <= 1) {
							msg.channel.send({
								embed: {
									color: 0x888888,
									author: {
										name: msg.author.username,
										icon_url: msg.author.avatarURL
									},
									description: "No members required fixing."
								}
							}).then(message => {
								message.delete(15000);
							});
						}
						else {
							bot_logs.send("**FIXED ROLES --> ** " + role_less - 1 + " roles corrected.");
							msg.channel.send({
								embed: {
									color: 0x888888,
									author: {
										name: msg.author.username,
										icon_url: msg.author.avatarURL
									},
									description: role_less + " members have been re-assigned the Unverified member role.\n\n" + optional
								}
							}).then(message => {
								message.delete(15000);
							});
						}
						msg.channel.stopTyping();
					}


// Assistant
					else if (msg.content.toLowerCase().includes("assistant") && msg.channel.id == "447950977509883905") {
						var role_names = settings.ranknames.split(",");
						//				unverified				member					assistant			RL						Mod					Admin
						//				0						1						2					3						4					5
						var roles = ["447950991141109770", "447950560419643402", "447950559086116864", "447949904128507905", "447949022355783690", "426609665422524417"];


						if (msg.member.roles.some(r => ["Assistant"].includes(r.name))) {
							
							var new_rank = 1;
							if (row.userrank > 2) 
								new_rank = row.userrank;

							db.run(`Update "${db_userdata}" Set userrank = '${new_rank}' Where userid = ${msg.author.id}`).then(() => {
								bot_logs.send("**ROLE REMOVED --> ** <@" + msg.author.id + "> || Assistant role taken.");
								msg.member.removeRole("447950559086116864");
								msg.channel.send({
									embed: {
										color: 0x888888,
										author: {
											name: msg.author.username,
											icon_url: msg.author.avatarURL
										},
										description: "You no longer have the Assistant role."
									}
								});
							}).catch(err=>{
								console.log(err);
								console.log("Error removing assistant role");
							});
						}
						else {

							var new_rank = 2;
							if (row.userrank > 2) 
								new_rank = row.userrank;
							db.run(`Update "${db_userdata}" Set userrank = '${new_rank}' Where userid = ${msg.author.id}`).then(() => {
								bot_logs.send("**ROLE ADDED --> ** <@" + msg.author.id + "> || Assistant role given.");
								msg.member.addRole("447950559086116864");
								msg.channel.send({
									embed: {
										color: 0x888888,
										author: {
											name: msg.author.username,
											icon_url: msg.author.avatarURL
										},
										description: "You now have the Assistant role."
									}
								});
							}).catch(err=>{
								console.log(err);
								console.log("Error adding assistant role");
							});
						}
					}

					
// Member count
					else if (msg.content.toLowerCase().includes("count")) {
						var role_names = settings.ranknames.split(",");
						//				unverified				member					assistant			RL						Mod					Admin
						//				0						1						2					3						4					5
						var roles = ["447950991141109770", "447950560419643402", "447950559086116864", "447949904128507905", "447949022355783690", "426609665422524417"];

						msg.delete();

						members = msg.guild.members.array();
						var count = 0;
						members.forEach(member =>{
							if (member.roles.some(r => ["Member"].includes(r.name))) {
								count++;
							}
						});
						db.get(`Select Count(*) From "${db_userdata}" Where userrank >= 1`).then(num=>{
							if (count != num){
								msg.channel.send({
									embed: {
										color: 0x888888,
										author: {
											name: msg.author.username,
											icon_url: msg.author.avatarURL
										},
										description: "There are " + count + " members with the member role, and " + num.count + " members *registered* in the database.\n" +
										"There are " + msg.guild.memberCount + " members total in " + msg.guild.name + "."
									}
								}).then(message =>{
									message.delete(15000);
								});
							}
							else {
								msg.channel.send({
									embed: {
										color: 0x888888,
										author: {
											name: msg.author.username,
											icon_url: msg.author.avatarURL
										},
										description: "There are " + msg.guild.memberCount + " members in " + msg.guild.name
									}
								}).then(message => {
									message.delete(15000);
								});
							}
						});;
					}
					

// End if, all commands should be above these brackets

				});
			}
			else if (msg.channel.id == "447950929761665026") msg.delete();
			else if (msg.content.includes("discord.gg/")){
				db.get(`Select userrank From "${db_userdata}" Where userid = ${msg.author.id}`).then(row =>{
					if (row.userrank < 4){
						msg.delete();
						msg.channel.send({
							embed: {
								color: 0x888888,
								author: {
									name: msg.author.username,
									icon_url: msg.author.avatarURL
								},
								description: "Please don't advertise discords."
							}
						}).then(message =>{
							message.delete(15000);
						});;
					}
				});
			}
			else if (msg.content.includes("nigger") || msg.content.includes("nigga") || msg.content.includes("nogger") || msg.content.includes("niggr")) {
				msg.delete();
			}
		});

		console.log("In " + msg.channel.name + ", " + msg.author.username + " said: " + msg.content);

		
		/*
		if (msg.content === "listemojis") {
			const emojiList = msg.guild.emojis.map(e=>e.toString()).join(" ");
			msg.channel.send(emojiList);
		}
		*/
	}
});

client.on("messageReactionAdd", (reaction, user) =>{
	var afk_server_name = reaction.message.channel.guild.id + "d";

	//var db_settings = reaction.guild.id + "s";
	if (afk_messages[afk_server_name]){
		if (reaction.message.id == afk_messages[afk_server_name]){
			if (!afk_emojis[afk_server_name] && reaction.me){
				afk_emojis[afk_server_name] = (reaction.emoji.id == null ? reaction.emoji.name : reaction.emoji.id) + ",";
			}
			else if (user.id == client.user.id){
				afk_emojis[afk_server_name] += (reaction.emoji.id == null ? reaction.emoji.name : reaction.emoji.id) + ",";
			}
			else if (!user.bot) {
				var emojis = afk_emojis[afk_server_name].split(",");
				emojis.forEach(emoji => {
					if (emoji == (reaction.emoji.id == null ? reaction.emoji.name : reaction.emoji.id)){
						if (!afk_users[afk_server_name])
							afk_users[afk_server_name] = {};
						afk_users[afk_server_name][emoji] = (!afk_users[afk_server_name][emoji] ? user.id : afk_users[afk_server_name][emoji] + user.id) + ",";
					}
				});
			}
			else {
				console.log("Bot reacted? lol");
			}
		}
	}
});

client.on("messageReactionRemove", (reaction, user) =>{
	var afk_server_name = reaction.message.channel.guild.id + "d";

	//var db_settings = reaction.guild.id + "s";
	if (afk_messages[afk_server_name]){
		if (reaction.message.id == afk_messages[afk_server_name]){
			if (!user.bot) {
				var emojis = afk_emojis[afk_server_name].split(",");
				emojis.forEach(emoji => {
					if (emoji == (reaction.emoji.id == null ? reaction.emoji.name : reaction.emoji.id)){
						var arr = afk_users[afk_server_name][emoji].split(",");
						
						arr = arr.filter(e => e != user.id && e != "");

						afk_users[afk_server_name][emoji] = "";
						arr.forEach(element => {
							afk_users[afk_server_name][emoji] += element + ",";
						});
					}
				});
			}
			else {
				console.log("Bot unreacted? lol");
			}
		}
	}
});


client.login(config.token);

client.on('uncaughtException', () => {
	console.log(err);
});




/*
if (guildMember.roles.some(r => ["Admin"].includes(r.name))) {
    message.channel.send('You have role.');
} else {
    message.channel.send('You do not have this role.');
}*/

// TODO: Check if user has role before removing it?

// TODO: Fix where commands can be used (not in the timeout channel!)
// Fix mute command breaking database
// Ensure crashing is not possible?
// Restrict verification on timeout role / while suspension is active in database

// Start runs