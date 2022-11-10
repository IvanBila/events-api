import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    startDate: {type: Date, required: true},
    endDate: {type: Date, required: true},
}, {
    versionKey: false
})

const Event = mongoose.model('events', eventSchema);
export {
    Event
}
