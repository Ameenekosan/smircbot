var math = require("mathjs");

module.exports = function (core) {
    var plugin = {};

    plugin.help = {
        math: "$math expression\n" +
              "Print the result of a mathematical expression.",
        mathclear: "$mathclear\n" +
                   "Clear the current math context.",
    };

    var mathTrigger = "$math ";
    var clearTrigger = "$mathclear";
    var parser = math.parser();

    function pubListener(nick, text) {
        if (core.util.beginsIgnoreCase(text, mathTrigger)) {
            var expr = text.substring(mathTrigger.length);
            try {
                var result = parser.eval(expr);
                core.irc.sayFmt("result: %s", math.format(result));
            } catch (err) {
                core.irc.sayPub(err);
            }
        } else if (core.util.eqIgnoreCase(text, clearTrigger)) {
            parser.clear();
            core.irc.sayPub("Math context cleared.");
        }
    }

    plugin.load = function () {
        core.irc.on("pub", pubListener);
    };

    plugin.unload = function () {
        core.irc.removeListener("pub", pubListener);
    };

    return plugin;
};
