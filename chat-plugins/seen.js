const fs = require('fs');
const FILE_NAME = "config/lastseen.json";
 
var seen;
try {
        seen = JSON.parse(fs.readFileSync(FILE_NAME));
} catch (err) {
        fs.writeFileSync(FILE_NAME, '{}');
        seen = JSON.parse(fs.readFileSync(FILE_NAME));
}
 
function pluralFormat(target, word) {
        if (Math.floor(target) === 0) return '';
        if (Math.floor(target) !== 1) return target + ' ' + word + "s";
        return target + ' ' + word;
}
 
function writeLastSeen(user) {
        seen[toId(user)] = Date.now();
        fs.writeFileSync(FILE_NAME, JSON.stringify(seen));
}
exports.writeLastSeen = writeLastSeen;
 
function getLastSeen(user) {
        user = toId(user);
        if (!seen[user]) return false;
 
        var rawDate = Date.now() - Number(seen[user]);
        var seconds = Math.floor(rawDate / 1000);
        var mins = Math.floor(seconds / 60);
        var hours = Math.floor(mins / 60);
        var days = Math.floor(hours / 24);
 
        var total = [];
        if (pluralFormat(days, 'day')) total.push(pluralFormat(days, 'day'));
        if (pluralFormat(hours % 24, 'hour')) total.push(pluralFormat(hours % 24, 'hour'));
        if (pluralFormat(mins % 60, 'minute')) total.push(pluralFormat(mins % 60, 'minute'));
        if (!pluralFormat(days, 'day')) total.push(pluralFormat(seconds % 60, 'second'));
        return total.join(', ');
}
 
exports.commands = {
        seen: 'lastseen',
        lastseen: function (target, room, user, connection, cmd) {
                if (!this.canBroadcast()) return;
                if (toId(target).length > 18) return this.errorReply("That username is too long");
                target = Users.getExact(target) ? Users.getExact(target).name : target;
                if (!toId(target) || toId(target) === user.userid) target = user.name;
 
                var seen = getLastSeen(target);
                if (!seen) return this.sendReplyBox(target + ' has <font color = "red">never</font> been seen online.');
                if (Users.getExact(target) && Users.getExact(target).connected) return this.sendReplyBox(target + ' is currently <font color = "green">online</font>. This user has stayed online for ' + seen + '.');
                return this.sendReplyBox(target + ' was last seen ' + seen + ' ago.');
        }
}
