import mongoose from "mongoose";
import xss from "xss";

const eventSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    startDate: {type: Date, required: true},
    endDate: {type: Date, required: true},
}, {
    versionKey: false
})

eventSchema.statics.serialize = (event) => ({
  _id: event._id,
  title: xss(event.title),
  description: xss(event.description),
  start: xss(event.start),
  end: xss(event.end)
})

const Event = mongoose.model('events', eventSchema);
export {
    Event
}
