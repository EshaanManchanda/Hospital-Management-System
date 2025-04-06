import { Revenue } from '../models/Revenue.js';

// @desc    Create a new revenue record
// @route   POST /api/revenue
// @access  Private/Admin
export const createRevenue = async (req, res) => {
  try {
    const { amount, source, description, patient, doctor, referenceId, paymentMethod, status, date } = req.body;
    
    const revenue = await Revenue.create({
      amount,
      source,
      description,
      patient,
      doctor,
      referenceId,
      paymentMethod,
      status,
      date: date || new Date(),
    });
    
    res.status(201).json(revenue);
  } catch (error) {
    console.error('Error in createRevenue:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all revenue records
// @route   GET /api/revenue
// @access  Private/Admin
export const getAllRevenue = async (req, res) => {
  try {
    const { 
      source, 
      status, 
      startDate, 
      endDate, 
      paymentMethod,
      page = 1,
      limit = 10
    } = req.query;
    
    // Build query
    const query = {};
    
    if (source) {
      query.source = source;
    }
    
    if (status) {
      query.status = status;
    }
    
    if (paymentMethod) {
      query.paymentMethod = paymentMethod;
    }
    
    if (startDate && endDate) {
      query.date = { 
        $gte: new Date(startDate), 
        $lte: new Date(endDate) 
      };
    } else if (startDate) {
      query.date = { $gte: new Date(startDate) };
    } else if (endDate) {
      query.date = { $lte: new Date(endDate) };
    }
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get total count for pagination
    const total = await Revenue.countDocuments(query);
    
    // Get revenue records
    const revenue = await Revenue.find(query)
      .populate('patient', 'name contactNumber')
      .populate('doctor', 'name specialty')
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    res.status(200).json({
      records: revenue,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error in getAllRevenue:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get revenue record by ID
// @route   GET /api/revenue/:id
// @access  Private/Admin
export const getRevenueById = async (req, res) => {
  try {
    const revenue = await Revenue.findById(req.params.id)
      .populate('patient', 'name gender age contactNumber')
      .populate('doctor', 'name specialty contactNumber');
    
    if (!revenue) {
      return res.status(404).json({ message: 'Revenue record not found' });
    }
    
    res.status(200).json(revenue);
  } catch (error) {
    console.error('Error in getRevenueById:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update revenue record
// @route   PUT /api/revenue/:id
// @access  Private/Admin
export const updateRevenue = async (req, res) => {
  try {
    const { amount, source, description, patient, doctor, referenceId, paymentMethod, status, date } = req.body;
    
    const revenue = await Revenue.findById(req.params.id);
    
    if (!revenue) {
      return res.status(404).json({ message: 'Revenue record not found' });
    }
    
    // Update fields
    revenue.amount = amount !== undefined ? amount : revenue.amount;
    revenue.source = source || revenue.source;
    revenue.description = description !== undefined ? description : revenue.description;
    revenue.patient = patient !== undefined ? patient : revenue.patient;
    revenue.doctor = doctor !== undefined ? doctor : revenue.doctor;
    revenue.referenceId = referenceId !== undefined ? referenceId : revenue.referenceId;
    revenue.paymentMethod = paymentMethod || revenue.paymentMethod;
    revenue.status = status || revenue.status;
    revenue.date = date || revenue.date;
    
    const updatedRevenue = await revenue.save();
    
    res.status(200).json(updatedRevenue);
  } catch (error) {
    console.error('Error in updateRevenue:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Delete revenue record
// @route   DELETE /api/revenue/:id
// @access  Private/Admin
export const deleteRevenue = async (req, res) => {
  try {
    const revenue = await Revenue.findById(req.params.id);
    
    if (!revenue) {
      return res.status(404).json({ message: 'Revenue record not found' });
    }
    
    await revenue.remove();
    
    res.status(200).json({ message: 'Revenue record removed' });
  } catch (error) {
    console.error('Error in deleteRevenue:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get daily revenue for a date range
// @route   GET /api/revenue/daily
// @access  Private/Admin
export const getDailyRevenue = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const dailyRevenue = await Revenue.getDailyRevenue(start, end);
    
    res.status(200).json(dailyRevenue);
  } catch (error) {
    console.error('Error in getDailyRevenue:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get monthly revenue for a year
// @route   GET /api/revenue/monthly
// @access  Private/Admin
export const getMonthlyRevenue = async (req, res) => {
  try {
    const { year } = req.query;
    
    if (!year) {
      return res.status(400).json({ message: 'Year is required' });
    }
    
    const monthlyRevenue = await Revenue.getMonthlyRevenue(parseInt(year));
    
    res.status(200).json(monthlyRevenue);
  } catch (error) {
    console.error('Error in getMonthlyRevenue:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get revenue by source
// @route   GET /api/revenue/by-source
// @access  Private/Admin
export const getRevenueBySource = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const revenueBySource = await Revenue.getRevenueBySource(start, end);
    
    res.status(200).json(revenueBySource);
  } catch (error) {
    console.error('Error in getRevenueBySource:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get current month revenue summary
// @route   GET /api/revenue/summary
// @access  Private/Admin
export const getRevenueSummary = async (req, res) => {
  try {
    const summary = await Revenue.getCurrentMonthSummary();
    
    res.status(200).json(summary);
  } catch (error) {
    console.error('Error in getRevenueSummary:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
}; 