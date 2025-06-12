const ChitId = require('../Models/ChitId');

// Create a new ChitId
exports.createChitId = async (req, res) => {
  try {
    const { chitId } = req.body;
    const newChit = new ChitId({ chitId });
    await newChit.save();
    res.status(201).json(newChit);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create Chit ID', error });
  }
};

// Get all ChitIds
exports.getChitIds = async (req, res) => {
  try {
    const chits = await ChitId.find();
    res.json(chits);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch Chit IDs', error });
  }
};