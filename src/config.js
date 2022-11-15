"use strict";
exports.__esModule = true;
exports.PORT = exports.CONNECTION_URI = void 0;
var CONNECTION_URI = process.env.CONNECTION_URI || 'mongodb://localhost:27017/events_db';
exports.CONNECTION_URI = CONNECTION_URI;
var PORT = process.env.PORT || 8083;
exports.PORT = PORT;
