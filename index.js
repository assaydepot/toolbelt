const toolbelt = require('./src/objects');
toolbelt.extend(toolbelt, require('./src/dates'), require('./src/strings'), require('./src/system'), require('sprintf-js'));
module.exports = toolbelt;
