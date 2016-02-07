var fs = require('fs');
var badges = fs.createWriteStream('badges.txt', {'flags': 'a'});

exports.commands = {
	gdeclarered: 'gdeclare',
	gdeclaregreen: 'gdeclare',
	gdeclare: function (target, room, user, connection, cmd) {
		if (!target) return this.parse('/help gdeclare');
		if (!this.can('declare')) return false;
		if ((user.locked || user.mutedRooms[room.id]) && !user.can('bypassall')) return this.sendReply('You cannot do this while unable to talk.');

		var roomName = (room.isPrivate) ? 'a private room' : room.id;
		var colour = cmd.substr(8) || 'blue';
		for (var id in Rooms.rooms) {
			var tarRoom = Rooms.rooms[id];
			if (tarRoom.id !== 'global') {
				tarRoom.addRaw('<div class="broadcast-' + colour + '"><b><font size=1><i>Global declare from ' + roomName + '<br /></i></font size>' + target + '</b></div>');
				tarRoom.update();
			}
		}
		this.logModCommand(user.name + ' globally declared ' + target);
	},

	declaregreen: 'declarered',
	declarered: function (target, room, user, connection, cmd) {
		if (!target) return this.parse('/help declare');
		if (!this.can('declare', null, room)) return false;
		if ((user.locked || user.mutedRooms[room.id]) && !user.can('bypassall')) return this.sendReply('You cannot do this while unable to talk.');

		room.addRaw('<div class="broadcast-' + cmd.substr(7) + '"><b>' + target + '</b></div>');
		room.update();
		this.logModCommand(user.name + ' declared ' + target);
	},

	pdeclare: function (target, room, user, connection, cmd) {
		if (!target) return this.parse('/help declare');
		if (!this.can('declare', null, room)) return false;
		if ((user.locked || user.mutedRooms[room.id]) && !user.can('bypassall')) return this.sendReply('You cannot do this while unable to talk.');

		room.addRaw('<div class="broadcast-purple"><b>' + target + '</b></div>');
		room.update();
		this.logModCommand(user.name + ' declared ' + target);
	},

	sd: 'declaremod',
	staffdeclare: 'declaremod',
	modmsg: 'declaremod',
	moddeclare: 'declaremod',
	declaremod: function (target, room, user) {
		if (!target) return this.sendReply('/declaremod [message] - Also /moddeclare and /modmsg');
		if (!this.can('declare', null, room)) return false;
		if ((user.locked || user.mutedRooms[room.id]) && !user.can('bypassall')) return this.sendReply('You cannot do this while unable to talk.');

		this.privateModCommand('|raw|<div class="broadcast-red"><b><font size=1><i>Private Auth (Driver +) declare from ' + user.name + '<br /></i></font size>' + target + '</b></div>');
		room.update();
		this.logModCommand(user.name + ' mod declared ' + target);
	},
};
