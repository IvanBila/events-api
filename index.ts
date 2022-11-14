import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import { PORT } from './config';
import mongoose from 'mongoose';
import { Event as EventModel } from './Models';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import { Event } from './types';
import { SERVER_ERROR, NOT_FOUND, CREATED, BAD_REQUEST, OK } from './http';
import { body, validationResult } from 'express-validator'

dotenv.config();
const app: Express = express();
mongoose.connect(process.env.CONNECTION_URI);
app.use(express.json());
app.use(morgan('common'));

const allowedOrigins = [
  'http://localhost:8080',
  'http://localhost:1234',
  'http://localhost:3000',
];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const message = `The CORS policy for this application does not allow access from origin ${origin}`;
        return callback(new Error(message), false);
      }
      return callback(null, true);
    },
  })
);

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Event API',
      version: '1.0.0',
      description: 'Event API with autogenerated swagger doc',
      contact: {
        name: 'Swagger',
        url: 'https://swagger.io',
        email: '',
      },
      servers: ['http://localhost:3000'],
    },
  },
  apis: ['index.ts'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get('/events', async (request: Request, response: Response) => {
  const { eventId } = request.query;
  try {
    if (eventId) {
      const _event = await EventModel.find({ _id: eventId }).select('-__v');
      if (!_event) {
        response.status(NOT_FOUND).send({
          message: 'No events found',
          code: NOT_FOUND,
        });
      } else {
        response.status(OK).send({
          code: OK,
          data: [_event],
        });
      }
    }
    const _events = await EventModel.find({}).select('-__v');
    const events: Event[] = _events.map((event) => ({
      id: event._id.toString(),
      title: event.title,
      description: event.description,
      start: new Date(event.startDate).toLocaleDateString('en-CA'),
      end: new Date(event.endDate).toLocaleDateString('en-CA'),
    }));
    if (!events) {
      response.status(NOT_FOUND).send({
        message: 'No events found',
        code: NOT_FOUND,
      });
    } else {
      response.status(OK).send({
        code: OK,
        data: events,
      });
    }
  } catch (error) {
    response.status(SERVER_ERROR).send({
      code: SERVER_ERROR,
      message: 'Unable to fetch events',
    });
  }
});

app.post(
  '/event',
  body('title', 'Event title is required')
    .isString()
    .isLength({ min: 6 })
    .trim()
    .escape(),
  body('description', 'Event description is required')
    .isString()
    .isLength({ min: 6 })
    .trim()
    .escape(),
  body('startDate', 'Event startDate is required')
    .isString()
    .isLength({ min: 6 })
    .trim()
    .escape(),
  body('endDate', 'Event endDate is required')
    .isString()
    .isLength({ min: 6 })
    .trim()
    .escape(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(BAD_REQUEST).json({
        errors: errors.array(),
        code: BAD_REQUEST,
      });
    }
    const body = req.body;
    if (!body) {
      return res.status(BAD_REQUEST).json({
        code: BAD_REQUEST,
        message: 'You must provide a event',
      });
    }

    try {
      const result = await EventModel.create(body);
      res.status(CREATED).send({
        data: result,
        code: CREATED,
      });
    } catch (error) {
      return res.status(SERVER_ERROR).json({
        error: error.message,
        code: SERVER_ERROR,
      });
    }
  }
);

app.put(
  '/event/:eventId',
  body('title', 'Event title is required')
    .isString()
    .isLength({ min: 6 })
    .trim()
    .escape(),
  (req: Request, res: Response) => {
    EventModel.findByIdAndUpdate(
      req.params.eventId,
      req.body,
      { new: true },
      (err, event) => {
        if (err) {
          res.status(BAD_REQUEST).send({
            code: BAD_REQUEST,
            message: 'Unable to update event',
          });
        }
        res.status(OK).json({
          code: OK,
          data: event,
        });
      }
    );
  }
);

app.delete('/event/:eventId', async (req: Request, res: Response) => {
  try {
    const result = await EventModel.findByIdAndRemove(
      req.params.eventId,
      (err, event) => {
        if (err) {
          res.status(BAD_REQUEST).send({
            code: BAD_REQUEST,
            message: 'Unable to delete event',
          });
        }
        res
          .status(OK)
          .json({ code: OK, message: 'Successfully deleted event!' });
      }
    );
  } catch (error) {
    res.status(SERVER_ERROR).send({
      code: SERVER_ERROR,
      message: "Couldn't delete event",
    });
  }
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
