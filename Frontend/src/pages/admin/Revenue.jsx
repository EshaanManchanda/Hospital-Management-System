import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  IndianRupee, 
  ArrowLeft, 
  TrendingUp, 
  Calendar,
  CreditCard,
  BadgeIndianRupee,
  BarChart3,
  Loader2
} from "lucide-react";
import { Button } from "@/components/admin/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/admin/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/admin/ui/select";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { adminService } from "@/services";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const formattedINR = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

const Revenue = () => {
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState(new Date().toLocaleString('default', { month: 'long' }));
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for API data
  const [revenueSummary, setRevenueSummary] = useState(null);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [revenueBySource, setRevenueBySource] = useState([]);
  
  // Calculate date range for this year
  const startOfYear = new Date(new Date().getFullYear(), 0, 1);
  const endOfYear = new Date(new Date().getFullYear(), 11, 31);

  useEffect(() => {
    const fetchRevenueData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch all revenue data in parallel
        const [summary, monthly, bySource] = await Promise.all([
          adminService.getRevenueSummary(),
          adminService.getMonthlyRevenue(new Date().getFullYear()),
          adminService.getRevenueBySource(startOfYear, endOfYear)
        ]);
        
        setRevenueSummary(summary);
        
        // Transform monthly data to match chart format
        const transformedMonthly = monthly.map(item => {
          const monthNames = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
          ];
          const monthIndex = parseInt(item.month) - 1;
          
          return {
            name: monthNames[monthIndex],
            revenue: item.totalAmount,
            // Estimated expenses (70% of revenue for demo)
            expenses: Math.round(item.totalAmount * 0.7),
            // Profit (30% of revenue for demo)
            profit: Math.round(item.totalAmount * 0.3)
          };
        });
        
        setMonthlyRevenue(transformedMonthly);
        
        // Transform source data to match chart format
        const transformedSourceData = bySource.map(item => ({
          name: item._id,
          value: item.totalAmount
        }));
        
        setRevenueBySource(transformedSourceData);
      } catch (err) {
        console.error("Error fetching revenue data:", err);
        setError("Failed to load revenue data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchRevenueData();
  }, []);
  
  // Calculate today's revenue (for demo purposes - random value)
  const todayRevenue = Math.floor(Math.random() * 10000) + 40000;
  
  // Calculate current month's revenue
  const currentMonthRevenue = revenueSummary?.currentMonth?.total || 0;
  const previousMonthRevenue = revenueSummary?.previousMonth?.total || 0;
  const growthPercentage = revenueSummary?.growth || 0;
  
  // Calculate total annual revenue
  const totalAnnualRevenue = monthlyRevenue.reduce((sum, item) => sum + item.revenue, 0) || 0;
  const annualGrowth = 15.7; // Placeholder for annual growth
  
  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <Loader2 className="h-12 w-12 animate-spin text-hospital-primary mb-4" />
        <p className="text-gray-600">Loading revenue data...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <div className="text-red-500 mb-4 text-center">
          <svg className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg font-semibold">{error}</p>
        </div>
        <Button 
          onClick={() => window.location.reload()}
          className="bg-hospital-primary hover:bg-hospital-accent"
        >
          Retry
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)} 
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
      </Button>

      <h1 className="text-3xl font-bold mb-8 flex items-center">
        <IndianRupee className="mr-2 h-8 w-8 text-hospital-primary" /> 
        Revenue Analytics
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Today's Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">₹{todayRevenue.toLocaleString()}</div>
              <div className="text-sm text-green-500 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" /> +12.5%
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">This Month's Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">{formattedINR(currentMonthRevenue)}</div>
              <div className={`text-sm flex items-center ${growthPercentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                <TrendingUp className="h-4 w-4 mr-1" /> {growthPercentage >= 0 ? '+' : ''}{growthPercentage.toFixed(1)}%
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Annual Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">
                {formattedINR(totalAnnualRevenue)}
              </div>
              <div className="text-sm text-green-500 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" /> +{annualGrowth}%
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" /> 
                Select Period
              </CardTitle>
              <CardDescription>Filter revenue data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="font-medium text-sm">Month</div>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    {["January", "February", "March", "April", "May", "June", 
                      "July", "August", "September", "October", "November", "December"].map((month) => (
                      <SelectItem key={month} value={month}>{month}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <div className="font-medium text-sm">Year</div>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {["2020", "2021", "2022", "2023", "2024"].map((year) => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full mt-4 bg-hospital-primary">
                Apply Filters
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BadgeIndianRupee className="h-5 w-5 mr-2" /> 
                Revenue Trends
              </CardTitle>
              <CardDescription>Monthly revenue, expenses, and profit</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={monthlyRevenue}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `₹${value/1000}K`} />
                    <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, undefined]} />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#3f51b5" name="Revenue" />
                    <Line type="monotone" dataKey="expenses" stroke="#f44336" name="Expenses" />
                    <Line type="monotone" dataKey="profit" stroke="#4caf50" name="Profit" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2" /> 
              Revenue by Source
            </CardTitle>
            <CardDescription>Distribution of revenue sources</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenueBySource}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {revenueBySource.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" /> 
              Revenue by Source Breakdown
            </CardTitle>
            <CardDescription>Detailed breakdown by revenue source</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={revenueBySource}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `₹${value/1000}K`} />
                  <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']} />
                  <Legend />
                  <Bar dataKey="value" name="Revenue" fill="#3f51b5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Revenue;
