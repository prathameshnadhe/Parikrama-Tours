const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  tourId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'Booking must belong to a Tour!'],
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Booking must belong to a User!'],
  },
  tourName: {
    type: String,
    required: [true, 'Booking must belong to a tour name.'],
  },
  members: {
    type: Number,
    require: [true, 'Booking must have a members.'],
  },
  price: {
    type: Number,
    require: [true, 'Booking must have a price.'],
  },
  totalPrice: {
    type: Number,
    require: [true, 'Booking must have a total price.'],
  },
  startDate: {
    type: String,
    required: [true, 'Booking must belong to a start date.'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  paid: {
    type: Boolean,
    default: true,
  },
});

bookingSchema.pre(/^find/, function (next) {
  this.populate('user').populate({
    path: 'tour',
    select: 'name',
  });
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
