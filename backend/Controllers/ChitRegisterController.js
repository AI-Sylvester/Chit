const ChitRegister = require('../Models/ChitRegister');

// Helper to format regId like CR202506130001
function formatRegId(date, count) {
  const prefix = 'CR';
  const dateStr = date.toISOString().split('T')[0].replace(/-/g, ''); // e.g., 20250613
  const sequence = String(count).padStart(4, '0');
  return `${prefix}${dateStr}${sequence}`;
}
function generateInstallmentMonths(startDate, period) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let start = new Date(startDate);
  let installments = {};

  for (let i = 1; i <= 12; i++) {
    if (i <= period) {
      let monthStr = `${months[start.getMonth()]}-${start.getFullYear()}`;
      installments[`month${i}`] = monthStr;
      start.setMonth(start.getMonth() + 1);
    } else {
      installments[`month${i}`] = null;
    }
  }

  return installments;
}
// ✅ Add this payId generator BEFORE it's used
async function generatePayId() {
  const lastChit = await ChitRegister.findOne({ payId: { $exists: true } })
    .sort({ payId: -1 })
    .lean()
    .exec();

  if (!lastChit || !lastChit.payId) return 'PY00001';

  const lastNumber = parseInt(lastChit.payId.slice(2), 10);
  const newNumber = lastNumber + 1;

  return 'PY' + String(newNumber).padStart(5, '0');
}
exports.createChitRegister = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    // Count existing records for today
    const countToday = await ChitRegister.countDocuments({
      createdAt: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    });

    const regId = formatRegId(new Date(), countToday + 1);

    // Generate monthly installments fields
    const period = Number(req.body.period) || 12;
    const startedOn = req.body.startedOn || today;
    const monthlyInstallments = generateInstallmentMonths(startedOn, period);

    const chit = new ChitRegister({
      regId,
      ...req.body,
      ...monthlyInstallments,  // Spread the generated month1..month12 fields here
    });

    await chit.save();
    res.status(201).json(chit);
  } catch (err) {
    console.error('Error creating chit register:', err);
    res.status(500).json({
      message: 'Failed to create chit register',
      error: err.message || err,
    });
  }
};
exports.getAllChitRegisters = async (req, res) => {
  try {
    const data = await ChitRegister.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({
      message: 'Error fetching chit register data',
      error: err.message || err,
    });
  }
};
exports.getByRegId = async (req, res) => {
  try {
    const regId = req.params.regId;

    // Find by regId AND status is "Open"
    const result = await ChitRegister.find({
      regId,
      status: 'Open',
    });

    if (!result.length) {
      return res.status(404).json({ message: 'No open chit found for this RegID' });
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({
      message: 'Error fetching by RegID',
      error: err.message || err,
    });
  }
};
exports.closeChitRegister = async (req, res) => {
  const { regId } = req.params;
  const { totalAmount, totalGrams, payMode, refNo, closedOn } = req.body;

  try {
    // Generate next Pay ID
    const payId = await generatePayId();

    const chit = await ChitRegister.findOneAndUpdate(
      { regId },
      {
        status: 'Closed',
        closedOn,
        totalAmount,
        totalGrams,
        payMode,
        refNo,
        payId,
      },
      { new: true }
    );

    if (!chit) {
      return res.status(404).json({ message: 'Chit not found for given RegID' });
    }

    res.json(chit);
  } catch (err) {
    console.error('Error closing chit register:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

exports.getOpenChitRegisters = async (req, res) => {
  try {
    const openChits = await ChitRegister.find({ status: 'Open' });
    res.json(openChits);
  } catch (err) {
    console.error('Error fetching open chit registers:', err);
    res.status(500).json({ message: 'Error fetching open chit registers', error: err.message });
  }
};
exports.getByRegIdAllStatus = async (req, res) => {
  try {
    const regId = req.params.regId;

    // Find chit registers matching regId with no status filter
    const result = await ChitRegister.find({ regId });

    if (!result.length) {
      return res.status(404).json({ message: 'No chit register found for this RegID' });
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({
      message: 'Error fetching chit register by RegID',
      error: err.message || err,
    });
  }
};
