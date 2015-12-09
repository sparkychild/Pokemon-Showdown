exports.commands = {
        tierpoll: 'tpoll',
        tpoll: function (target, room, user) {
                return this.parse('/poll new Tournament Tier?, Anything Goes, Challenge Cup 1v1, Monotype, OU, Random Battle, UU - LC, Eights/Capture and Evolve, Gen One Random/OMM');
        }
}
