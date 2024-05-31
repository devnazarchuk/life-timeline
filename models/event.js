const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    type: { type: String, required: true },
    content: { type: String, required: true }
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
