var fs = require('fs');
const FILE_NAME = "config/friends.json";
var friends;
try {
	friends = JSON.parse(fs.readFileSync(FILE_NAME));
} catch (err) {
	fs.writeFileSync(FILE_NAME, '{}');
	friends = JSON.parse(fs.readFileSync(FILE_NAME));
}

exports.commands = {
	friends: function(target, room, user, connection) {
		if (!this.canBroadcast()) return;
		if (!friends[user.userid] || !friends[user.userid].length) return this.sendReplyBox("You don't have any friends :c");

		var list = friends[user.userid].filter(function (friend) {
			return Users.get(friend);
		}).map(function (friend) {
			return Users.get(friend);
		});
		var buttons = '';
		list.forEach(function (friend) {
			buttons = buttons + '<button style="border-radius:5px; border: 2px inset black; background-color: darkblue; color:lightblue; padding:3px " name="parseCommand" value="/user ' + friend.userid + '">' + friend.name + '</button> ';
		}
		this.sendReplyBox('Your list of online friends:<br />' + buttons);
	},
	addfriend: function(target, room, user, connection) {
		if (!target || !target.trim()) return this.parse('/help friends');
		if (!Users.get(target)) return this.sendReply('User ' + target + ' not found...');

		targetUser = Users.get(target);
		if (targetUser.userid === user.userid) return this.sendReply(">Adding yourself to your friend list\nlol you loner");
		if (!friends[user.userid]) friends[user.userid] = [];
		else {
			for (var i in friends[user.userid]) {
				var friend = friends[user.userid][i];
				if (friend === targetUser.userid || friend === toId(target)) return this.sendReply(targetUser.name + ' is already in your friend list!');
				if (Users.get(friend) && Users.get(friend).userid === toId(target)) return this.sendReply(targetUser.name + ' is already in your friend list under the name "' + Users.get(friend).name + '".');
			}
		}
		friends[user.userid].push(targetUser.userid);
		fs.writeFileSync(FILE_NAME, JSON.stringify(friends, null, 1));
	},
	removefriend: function (target, room, user, connection) {
		if (!target || !target.trim()) return this.parse('/help friends');
		if (!friends[user.userid] || !friends[user.userid].length) return this.sendReplyBox("You don't have any friends yet :c");
		var targetUser = toId(target);
		target = Users.getExact(target) ? Users.getExact(target).name : target;
		var index;
		for (var i in friends[user.userid]) {
			var friend = toId(friends[user.userid][i]);
			if (friend === targetUser || Users.get(friend).userid === targetUser || friend in Users.get(friend).prevNames) {
				index = i;
				break;
			}
		}
		if (isNaN(index)) return this.sendReply(target + ' is not in your friend list...');
		friends[user.userid].splice(index, 1);
		fs.writeFileSync(FILE_NAME, JSON.stringify(friends, null, 1));
		this.sendReply('You have removed ' + target + ' from your friend list.');
	},
	friendshelp: [
		"/friends - Displays a list of your friends",
		"/addfriend [name] - Adds a user to your friend list",
		"/removefriend [name] - Removes a user from your friend list"
	]
};
