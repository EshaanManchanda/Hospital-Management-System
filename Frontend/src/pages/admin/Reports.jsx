
import React, { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/admin/ui/table";
import { Input } from "@/components/admin/ui/input";
import { Button } from "@/components/admin/ui/button";
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/admin/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/admin/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/admin/ui/select";
import { Badge } from "@/components/admin/ui/badge";
import { toast } from "@/components/admin/ui/use-toast";
import { 
  Search,
  FileText,
  BarChart3,
  Filter,
  ChevronDown,
  Download,
  Calendar,
  LineChart,
  PieChart,
  Printer,
  Share2
} from "lucide-react";
import { cn } from "@/lib/utils";
import GenerateReportForm from "@/components/admin/reports/GenerateReportForm";

// Mock reports data
const reports = [
  {
    id: "RPT001",
    name: "Monthly Patient Analytics",
    category: "Analytics",
    date: "2023-12-01",
    author: "Admin",
    type: "chart",
    status: "generated",
  },
  {
    id: "RPT002",
    name: "Financial Summary Q4",
    category: "Financial",
    date: "2023-11-30",
    author: "Finance Team",
    type: "document",
    status: "pending",
  },
  {
    id: "RPT003",
    name: "Staff Performance Review",
    category: "HR",
    date: "2023-12-15",
    author: "HR Manager",
    type: "document",
    status: "generated",
  },
  {
    id: "RPT004",
    name: "Inventory Status",
    category: "Pharmacy",
    date: "2023-12-10",
    author: "Pharmacy Lead",
    type: "chart",
    status: "generated",
  },
  {
    id: "RPT005",
    name: "Patient Satisfaction Survey",
    category: "Feedback",
    date: "2023-12-05",
    author: "Quality Assurance",
    type: "chart",
    status: "generated",
  },
];

const reportIcons = {
  chart: <BarChart3 className="h-4 w-4" />,
  document: <FileText className="h-4 w-4" />,
};

const reportTypeClasses = {
  chart: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  document: "bg-purple-100 text-purple-800 hover:bg-purple-100",
};

const statusStyles = {
  generated: "bg-green-100 text-green-800 hover:bg-green-100",
  pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
};

const Reports = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [reportsData, setReportsData] = useState(reports);
  const [filterStatus, setFilterStatus] = useState("all");
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isViewReportOpen, setIsViewReportOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const filteredReports = reportsData.filter(
    (report) => {
      const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === "all" || report.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    }
  );

  const handleStatusChange = (reportId, newStatus) => {
    setReportsData(prevData => 
      prevData.map(report => 
        report.id === reportId 
          ? { ...report, status: newStatus } 
          : report
      )
    );
    
    toast({
      title: "Status Updated",
      description: "Report status has been updated successfully.",
    });
  };

  const handleAddReport = (newReport) => {
    setReportsData(prev => [
      ...prev,
      { 
        ...newReport, 
        id: `RPT00${prev.length + 1}`,
        date: new Date().toISOString().split('T')[0],
        author: "Current User",
      }
    ]);
    setIsGenerateModalOpen(false);
    
    toast({
      title: "Report Generated",
      description: "New report has been created successfully.",
    });
  };

  const downloadReport = (report) => {
    // In a real app, this would download the report
    toast({
      title: "Download Started",
      description: `Downloading ${report.name} as a PDF file.`,
    });

    // Simulate print dialog
    setTimeout(() => {
      setSelectedReport(report);
      setIsViewReportOpen(true);
    }, 500);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Reports</h1>
          <p className="text-gray-600">Generate and view hospital analytics reports</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search reports..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filter</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                All Reports
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("generated")}>
                Generated
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("pending")}>
                Pending
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-hospital-primary hover:bg-hospital-accent">
                <BarChart3 className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsGenerateModalOpen(true)}>
                <LineChart className="mr-2 h-4 w-4" />
                <span>Patient Analytics</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsGenerateModalOpen(true)}>
                <FileText className="mr-2 h-4 w-4" />
                <span>Financial Report</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsGenerateModalOpen(true)}>
                <PieChart className="mr-2 h-4 w-4" />
                <span>Department Performance</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsGenerateModalOpen(true)}>
                <Calendar className="mr-2 h-4 w-4" />
                <span>Appointment Summary</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Total Reports</h3>
          <div className="text-3xl font-bold">24</div>
          <div className="text-sm text-gray-500 mt-1">This month</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Generated</h3>
          <div className="text-3xl font-bold">18</div>
          <div className="text-sm text-gray-500 mt-1">75% of total</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Pending</h3>
          <div className="text-3xl font-bold">6</div>
          <div className="text-sm text-gray-500 mt-1">25% of total</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead className="hidden md:table-cell">Author</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">{report.id}</TableCell>
                    <TableCell>{report.name}</TableCell>
                    <TableCell className="hidden md:table-cell">{report.category}</TableCell>
                    <TableCell className="hidden md:table-cell">{report.date}</TableCell>
                    <TableCell className="hidden md:table-cell">{report.author}</TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          "font-normal capitalize flex items-center gap-1 w-fit",
                          reportTypeClasses[report.type]
                        )}
                      >
                        {reportIcons[report.type]}
                        <span className="hidden sm:inline">{report.type}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Select
                        defaultValue={report.status}
                        onValueChange={(value) => handleStatusChange(report.id, value)}
                      >
                        <SelectTrigger className="w-28">
                          <Badge
                            className={cn(
                              "font-normal capitalize",
                              statusStyles[report.status]
                            )}
                          >
                            {report.status}
                          </Badge>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="generated">Generated</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8"
                          onClick={() => downloadReport(report)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          <span className="hidden sm:inline">Download</span>
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8 px-2 sm:px-3">
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Printer className="mr-2 h-4 w-4" />
                              <span>Print</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Share2 className="mr-2 h-4 w-4" />
                              <span>Share via Email</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No reports found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Generate Report Modal */}
      <Dialog open={isGenerateModalOpen} onOpenChange={setIsGenerateModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <GenerateReportForm 
            onGenerate={handleAddReport}
            onCancel={() => setIsGenerateModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* View/Print Report Modal */}
      <Dialog open={isViewReportOpen} onOpenChange={setIsViewReportOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Report Preview</DialogTitle>
          </DialogHeader>
          {selectedReport && (
            <div className="p-4">
              <h3 className="text-xl font-bold mb-4">{selectedReport.name}</h3>
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <p>Report preview content would be displayed here.</p>
                <p className="text-gray-500 mt-2">ID: {selectedReport.id}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Reports;
