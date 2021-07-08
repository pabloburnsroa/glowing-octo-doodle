const Campground = require('../models/Campground');
const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const connectDB = require('../config/db');

// Connect to MongoDB
connectDB();

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 5; i++) {
    const randomCity = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 30) + 10;
    const camp = new Campground({
      author: '60e5745b23e34c5bf44d740f',
      location: `${cities[randomCity].city}, ${cities[randomCity].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: 'https://source.unsplash.com/collection/483251/',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas quam labore eos amet incidunt vero asperiores iste, adipisci cumque reprehenderit libero magnam laborum, officiis eum aliquam consequatur impedit obcaecati quidem, pariatur harum nostrum commodi corporis fuga.',
      price,
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
