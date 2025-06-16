const ChitId = require('../Models/ChitId');

// Create a new ChitId
exports.createChitId = async (req, res) => {
  try {
    const { chitId, schemeName, period } = req.body;

    if (![6, 12].includes(period)) {
      return res.status(400).json({ message: 'Period must be either 6 or 12' });
    }

    const newChit = new ChitId({ chitId, schemeName, period });
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
exports.updateChitId = async (req, res) => {
  try {
    const { chitId, schemeName, period } = req.body;
    const updated = await ChitId.findByIdAndUpdate(
      req.params.id,
      { chitId, schemeName, period },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update Chit ID', error });
  }
};

// Delete ChitId
exports.deleteChitId = async (req, res) => {
  try {
    await ChitId.findByIdAndDelete(req.params.id);
    res.json({ message: 'Chit ID deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete Chit ID', error });
  }
};