import {Event as EventModel, Event} from './Models';
import {Event as _Event} from './types';
import {BAD_REQUEST, OK} from "./http";

const EventService = {
  getAllEvents: async () => {
    try {
      const events = await Event.find({}).select('-__v');
      return events.map((event) => ({
        id: event._id.toString(),
        title: event.title,
        description: event.description,
        start: new Date(event.startDate).toLocaleDateString('en-CA'),
        end: new Date(event.endDate).toLocaleDateString('en-CA'),
      }));
    } catch (error) {
      return {};
    }
  },
  createEvent: async (event: _Event) => {
    try {
      return await Event.create(event);
    } catch (error) {
      return {};
    }
  },
  updateEvent: async (id: string, event: _Event) => {
    EventModel.findByIdAndUpdate(
      id,
      event,
      { new: true },
      (err, event) => {
        if (err) {
          return 'Unable to update event';
        }
        return event;
      }
    );
  }
};
