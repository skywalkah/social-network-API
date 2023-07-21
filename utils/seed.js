const connection = require('../config/connection');
const { Thought, User } = require('../models');

const seedData = require('./data');

connection.on('error', (err) => err);

connection.once('open', async () => {
    console.log('connected');
    await User.deleteMany({});
    await Thought.deleteMany({});
    // repeat for any additional collections

    await User.collection.insertMany(seedData.users);
    await Thought.collection.insertMany(seedData.thoughts);
    // repeat for any additional collections

    console.info('Seeding complete! 🌱');
    process.exit(0);
});
