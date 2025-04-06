
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  IndianRupee, 
  ArrowLeft, 
  TrendingUp, 
  Calendar,
  CreditCard,
  BadgeIndianRupee,
  BarChart3
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
} from "recharts";

const monthlyData = [
  { name: "Jan", revenue: 125000, expenses: 82000, profit: 43000 },
  { name: "Feb", revenue: 136000, expenses: 86000, profit: 50000 },
  { name: "Mar", revenue: 147000, expenses: 91000, profit: 56000 },
  { name: "Apr", revenue: 159000, expenses: 94000, profit: 65000 },
  { name: "May", revenue: 142000, expenses: 89000, profit: 53000 },
  { name: "Jun", revenue: 151000, expenses: 92000, profit: 59000 },
  { name: "Jul", revenue: 163000, expenses: 95000, profit: 68000 },
  { name: "Aug", revenue: 171000, expenses: 99000, profit: 72000 },
  { name: "Sep", revenue: 185000, expenses: 104000, profit: 81000 },
  { name: "Oct", revenue: 198000, expenses: 109000, profit: 89000 },
  { name: "Nov", revenue: 192000, expenses: 107000, profit: 85000 },
  { name: "Dec", revenue: 210000, expenses: 115000, profit: 95000 },
];

const paymentMethodData = [
  { name: "Insurance", value: 45 },
  { name: "Credit Card", value: 30 },
  { name: "Cash", value: 15 },
  { name: "UPI", value: 10 },
];

const departmentRevenueData = [
  { name: "Cardiology", value: 35000 },
  { name: "Orthopedics", value: 28000 },
  { name: "Pediatrics", value: 22000 },
  { name: "Neurology", value: 30000 },
  { name: "Radiology", value: 25000 },
];

const revenueByServiceData = [
  { name: "Consultations", value: 42000 },
  { name: "Surgeries", value: 68000 },
  { name: "Laboratory", value: 35000 },
  { name: "Radiology", value: 29000 },
  { name: "Pharmacy", value: 36000 },
];

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
  
  const currentMonthData = monthlyData[new Date().getMonth()];
  
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
              <div className="text-2xl font-bold">₹48,590</div>
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
              <div className="text-2xl font-bold">{formattedINR(currentMonthData.revenue)}</div>
              <div className="text-sm text-green-500 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" /> +8.3%
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
                {formattedINR(monthlyData.reduce((sum, item) => sum + item.revenue, 0))}
              </div>
              <div className="text-sm text-green-500 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" /> +15.7%
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
                    data={monthlyData}
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
              Revenue by Payment Method
            </CardTitle>
            <CardDescription>Distribution of payment methods</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={paymentMethodData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tickFormatter={(value) => `${value}%`} />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" /> 
              Revenue by Department
            </CardTitle>
            <CardDescription>Departmental revenue breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={departmentRevenueData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `₹${value/1000}K`} />
                  <Tooltip formatter={(value) => [formattedINR(Number(value)), 'Revenue']} />
                  <Bar dataKey="value" fill="#82ca9d" />
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
