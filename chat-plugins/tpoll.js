exports.commands = {
        tierpoll: 'tpoll',
        tpoll: function (target, room, user) {
                return this.parse('/poll new Tournament Tier?, Anything Goes, Challenge Cup 1v1, Monotype, OU, Random Battle, Random Monotype Battle, VGC, UU, RU, NU, PU, LC, Ubers, OMM, Eights, Gen One Random, Capture and Evolve, Hackmons');
        }
}
