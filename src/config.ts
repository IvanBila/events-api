const CONNECTION_URI = process.env.CONNECTION_URI || 'mongodb://localhost:27017/events_db';
const PORT = process.env.PORT || 8083;
export { CONNECTION_URI, PORT };
