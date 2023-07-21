const { Thought, User } = require('../models');

const thoughtController = {
  // get all Thoughts
  async getAllThoughts(req, res) {
    try {
      const dbThoughtData = await Thought.find({})
        .populate({
          path: 'reactions',
          select: '-__v'
        })
        .select('-__v')
        .sort({ _id: -1 });

      res.json(dbThoughtData);
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  },

  // get one Thought by id
  async getThoughtById({ params }, res) {
    try {
      const dbThoughtData = await Thought.findOne({ _id: params.id })
        .populate({
          path: 'reactions',
          select: '-__v'
        })
        .select('-__v');
  
      if (!dbThoughtData) {
        res.status(404).json({ message: 'No thought found with this id!' });
        return;
      }
  
      res.json(dbThoughtData);
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  },

  // create Thought
  async createThought({ body }, res) {
    try {
      const thought = await Thought.create(body);
      const dbUserData = await User.findOneAndUpdate(
        { _id: body.userId },
        { $push: { thoughts: thought._id } },
        { new: true }
      );
  
      if (!dbUserData) {
        res.status(404).json({ message: 'No user found with this id!' });
        return;
      }
  
      res.json(dbUserData);
    } catch (err) {
      res.json(err);
    }
  },

  // update Thought by id
  async updateThought({ params, body }, res) {
    try {
      const dbThoughtData = await Thought.findOneAndUpdate(
        { _id: params.id },
        body,
        { new: true, runValidators: true }
      );
  
      if (!dbThoughtData) {
        res.status(404).json({ message: 'No thought found with this id!' });
        return;
      }
      res.json(dbThoughtData);
    } catch (err) {
      res.status(400).json(err);
    }
  },

  // delete Thought
  async deleteThought({ params }, res) {
    try {
      const dbThoughtData = await Thought.findOneAndDelete({ _id: params.id });
  
      if (!dbThoughtData) {
        res.status(404).json({ message: 'No thought found with this id!' });
        return;
      }
  
      res.json(dbThoughtData);
    } catch (err) {
      res.status(400).json(err);
    }
  },

  // Add reaction
  async addReaction({ params, body }, res) {
    try {
      const dbThoughtData = await Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        { $push: { reactions: body } },
        { new: true, runValidators: true }
      )

      if (!dbThoughtData) {
          res.status(404).json({ message: 'No thought found with this id!' });
          return;
      }

      res.json(dbThoughtData);
    } catch(err) {
      res.status(400).json(err);
    };
  },

  // Delete reaction
  async removeReaction({ params }, res) {
    try {
      const dbThoughtData = await Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        { $pull: { reactions: { _id: params.reactionId } } },
        { new: true }
      )

      if (!dbThoughtData) {
        res.status(404).json({ message: 'No reaction found with this id!' });
        return;
      }
      
      res.json(dbThoughtData);
    } catch(err) {
      res.status(400).json(err);
    };
  }
};

module.exports = thoughtController;
