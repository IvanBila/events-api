"use strict";
exports.__esModule = true;
exports.Event = void 0;
var mongoose_1 = require("mongoose");
var xss_1 = require("xss");
var eventSchema = new mongoose_1["default"].Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true }
}, {
    versionKey: false
});
eventSchema.statics.serialize = function (event) { return ({
    _id: event._id,
    title: (0, xss_1["default"])(event.title),
    description: (0, xss_1["default"])(event.description),
    start: (0, xss_1["default"])(event.start),
    end: (0, xss_1["default"])(event.end)
}); };
var Event = mongoose_1["default"].model('events', eventSchema);
exports.Event = Event;
