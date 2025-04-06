import mongoose from 'mongoose';

const revenueSchema = mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    amount: {
      type: Number,
      required: true,
      default: 0,
    },
    source: {
      type: String,
      required: true,
      enum: ['Appointment', 'Medicine', 'Lab', 'Bed', 'Surgery', 'Other'],
    },
    description: {
      type: String,
      default: '',
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      default: null,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      default: null,
    },
    referenceId: {
      type: String,
      default: null,
    },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'Card', 'Insurance', 'Bank Transfer', 'Other'],
      default: 'Cash',
    },
    status: {
      type: String,
      enum: ['Paid', 'Pending', 'Cancelled', 'Refunded'],
      default: 'Paid',
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for faster queries
revenueSchema.index({ date: 1 });
revenueSchema.index({ source: 1 });
revenueSchema.index({ patient: 1 });
revenueSchema.index({ status: 1 });

// Static method to get daily revenue for a date range
revenueSchema.statics.getDailyRevenue = async function(startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        date: { $gte: startDate, $lte: endDate },
        status: 'Paid',
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);
};

// Static method to get monthly revenue for a year
revenueSchema.statics.getMonthlyRevenue = async function(year) {
  const startDate = new Date(year, 0, 1); // January 1st of the year
  const endDate = new Date(year, 11, 31, 23, 59, 59); // December 31st of the year
  
  return this.aggregate([
    {
      $match: {
        date: { $gte: startDate, $lte: endDate },
        status: 'Paid',
      },
    },
    {
      $group: {
        _id: { $month: '$date' },
        month: { $first: { $dateToString: { format: '%m', date: '$date' } } },
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
    {
      $project: {
        _id: 0,
        month: 1,
        totalAmount: 1,
        count: 1,
      },
    },
  ]);
};

// Static method to get revenue by source
revenueSchema.statics.getRevenueBySource = async function(startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        date: { $gte: startDate, $lte: endDate },
        status: 'Paid',
      },
    },
    {
      $group: {
        _id: '$source',
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { totalAmount: -1 },
    },
  ]);
};

// Static method to get current month revenue summary
revenueSchema.statics.getCurrentMonthSummary = async function() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  
  // Get the previous month for comparison
  const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
  
  const [currentMonthData, previousMonthData, sourceData] = await Promise.all([
    this.aggregate([
      {
        $match: {
          date: { $gte: startOfMonth, $lte: endOfMonth },
          status: 'Paid',
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]),
    this.aggregate([
      {
        $match: {
          date: { $gte: startOfPrevMonth, $lte: endOfPrevMonth },
          status: 'Paid',
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]),
    this.getRevenueBySource(startOfMonth, endOfMonth),
  ]);
  
  const currentTotal = currentMonthData.length > 0 ? currentMonthData[0].totalAmount : 0;
  const previousTotal = previousMonthData.length > 0 ? previousMonthData[0].totalAmount : 0;
  
  // Calculate growth percentage
  let growthPercentage = 0;
  if (previousTotal > 0) {
    growthPercentage = ((currentTotal - previousTotal) / previousTotal) * 100;
  }
  
  return {
    currentMonth: {
      total: currentTotal,
      count: currentMonthData.length > 0 ? currentMonthData[0].count : 0,
      month: now.toLocaleString('default', { month: 'long' }),
    },
    previousMonth: {
      total: previousTotal,
      count: previousMonthData.length > 0 ? previousMonthData[0].count : 0,
      month: new Date(startOfPrevMonth).toLocaleString('default', { month: 'long' }),
    },
    growth: Math.round(growthPercentage * 100) / 100, // Round to 2 decimal places
    bySource: sourceData,
  };
};

export const Revenue = mongoose.model('Revenue', revenueSchema); 