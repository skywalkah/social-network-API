const { User, Thought } = require('../models');

const userController = {
  // Find all users
  async getAllUsers(req, res) {
    try {
      const dbUserData = await User.find({})
        .populate({
          path: 'thoughts',
          select: '-__v'
        })
        .select('-__v')
        .sort({ _id: -1 })

      res.json(dbUserData);
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    };
  },

  // Find a user by id
  async getUserById({ params }, res) {
    try {
      const dbUserData = await User.findOne({ _id: params.id })
        .populate({
          path: 'thoughts',
          select: '-__v'
        })
        .select('-__v')
      res.json(dbUserData);
      } catch(err) {
      console.log(err);
      res.status(400).json(err);
    };
  },

  // Create a user
  async createUser({ body }, res) {
    try {
      const dbUserData = await User.create(body)
      
      res.json(dbUserData);
    } catch(err) {
      res.status(400).json(err)
    };
  },

  // Update user by id
  async updateUser({ params, body }, res) {
    try {
      const dbUserData = await User.findOneAndUpdate(
        { _id: params.id },
        body,
        { new: true, runValidators: true }
      );

      if (!dbUserData) {
        res.status(404).json({ message: 'No user found with this id!' });
        return;
      }
    
      res.json(dbUserData);
    } catch(err) {
      res.status(400).json(err)
    };
  },

  // Delete user by id
  async deleteUser({ params }, res) {
    try {
      const dbUserData = await User.findOneAndDelete({ _id: params.id });
      
      if (!dbUserData) {
        res.status(404).json({ message: 'No user found with this id!' });
        return;
      }
      
      res.json(dbUserData);
    } catch(err) {
      res.status(400).json(err)
    };
  },

  // Add a friend to a user's friend list
  async addFriend({ params }, res) {
    try {
      const dbUserData = await User.findOneAndUpdate(
        { _id: params.userId },
        { $push: { friends: params.friendId } },
        {
          new: true,
          runValidators: true
        }
      );
      
      if (!dbUserData) {
        res.status(404).json({ message: 'No user found with this id!' });
        return;
      }
      
      res.json(dbUserData);
    } catch(err) {
      res.status(400).json(err)
    };
  },

  // Remove a friend from a user's friend list
  async removeFriend({ params }, res) {
    try {
      const dbUserData = await User.findOneAndUpdate(
        { _id: params.userId },
        { $pull: { friends: params.friendId } },
        { new: true }
      )
      
      res.json(dbUserData);
    } catch(err) {
      res.status(400).json(err)
    };
  }
};

module.exports = userController;
