exports.commands = {
	r: 'remind',
	remind: function (target, room, user) {
		if (!target) return;
		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser || !targetUser.connected) {
			return this.sendReply("User " + this.targetUsername + " not found.");
		}
		if (!this.can('warn', targetUser, room)) return false;
		targetUser.popup("You have a tournament match to play. ");
