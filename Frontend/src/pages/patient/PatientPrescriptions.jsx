import React, { useState, useEffect, useMemo } from "react";
import { 
  Calendar, 
  AlertCircle, 
  FileText, 
  Download, 
  Eye, 
  Printer, 
  Clock, 
  CheckCircle, 
  RotateCw,
  Filter,
  Search,
  Pill,
  ClipboardList,
  User
} from "lucide-react";
import { authService } from "../../services";
import prescriptionService from "../../services/prescriptionService";
import PrescriptionDetailsDialog from "../../components/dialogs/PrescriptionDetailsDialog";

const PatientPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Pagination (optional)
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Get patientId from auth
  const userData = authService.getUserData();
  const patientId = userData?.patientId;

  // Fetch prescriptions
  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        setLoading(true);
        setError(null);
        if (!patientId) throw new Error("Patient information not found");

        const params = { page, limit: 10 };
        const response = await prescriptionService.getPrescriptionsByPatient(patientId, params);

        if (response.success && response.data?.prescriptions) {
          setPrescriptions(response.data.prescriptions);
          setTotalPages(response.data.pagination.pages || 1);
        } else {
          setPrescriptions([]);
          setError(response.message || "Failed to load prescriptions");
        }
      } catch (err) {
        setError(err.message || "Failed to load prescriptions");
        setPrescriptions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPrescriptions();
  }, [patientId, page]);

  // Filter and search logic
  const filteredPrescriptions = useMemo(() => {
    let filtered = prescriptions;
    if (filterStatus !== "all") {
      filtered = filtered.filter((p) => p.status === filterStatus);
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.diagnosis?.toLowerCase().includes(term) ||
          p.doctor?.name?.toLowerCase().includes(term) ||
          p.medicines?.some((m) => m.medicine?.name?.toLowerCase().includes(term))
      );
    }
    return filtered;
  }, [prescriptions, filterStatus, searchTerm]);

  // Download as JSON (simulate PDF)
  const handleDownload = (prescription) => {
    const blob = new Blob([JSON.stringify(prescription, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `prescription_${prescription._id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Print prescription
  const handlePrint = (prescription) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write("<html><head><title>Prescription</title></head><body>");
    printWindow.document.write(`<h2>Prescription</h2>`);
    printWindow.document.write(`<p><strong>Date:</strong> ${prescription.createdAt ? new Date(prescription.createdAt).toLocaleString() : "N/A"}</p>`);
    printWindow.document.write(`<p><strong>Doctor:</strong> ${prescription.doctor?.name} (${prescription.doctor?.specialization})</p>`);
    printWindow.document.write(`<p><strong>Diagnosis:</strong> ${prescription.diagnosis}</p>`);
    printWindow.document.write(`<p><strong>Instructions:</strong> ${prescription.instructions}</p>`);
    printWindow.document.write(`<p><strong>Status:</strong> ${prescription.status}</p>`);
    printWindow.document.write(`<p><strong>Medicines:</strong></p><ul>`);
    prescription.medicines?.forEach((med) => {
      printWindow.document.write(`<li>${med.medicine?.name} (${med.dosage}, ${med.frequency}, ${med.duration})</li>`);
    });
    printWindow.document.write("</ul>");
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Prescriptions</h1>
        <p className="text-gray-600 mt-1">View, search, and manage your prescriptions</p>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <Search className="h-5 w-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search by diagnosis, doctor, or medicine"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          />
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 rounded-lg flex items-center text-red-700">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>{error}</span>
        </div>
      )}

      {/* Prescription List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Your Prescriptions</h2>
        </div>
        {filteredPrescriptions.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {filteredPrescriptions.map((prescription) => (
              <li
                key={prescription._id}
                className="p-6 hover:bg-gray-50 transition cursor-pointer"
                onClick={() => {
                  setSelectedPrescription(prescription);
                  setDetailsOpen(true);
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <ClipboardList className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">{prescription.diagnosis}</h3>
                      <p className="text-sm text-gray-500">
                        {prescription.doctor?.name} • {prescription.doctor?.specialization}
                      </p>
                      <p className="text-xs text-gray-400">
                        {prescription.createdAt ? new Date(prescription.createdAt).toLocaleDateString() : "N/A"}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">{prescription.status}</span>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {prescription.medicines?.length} medicines
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(prescription);
                      }}
                      className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition text-sm"
                      title="Download"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrint(prescription);
                      }}
                      className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition text-sm"
                      title="Print"
                    >
                      <Printer className="h-4 w-4 mr-1" />
                      Print
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-900">No prescriptions found</h3>
            <p className="mt-2 text-sm text-gray-500">
              You have no prescriptions yet.
            </p>
          </div>
        )}
      </div>

      {/* Pagination (optional) */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          <button
            className="px-3 py-1 rounded bg-gray-100"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </button>
          <span className="px-3 py-1">{page} / {totalPages}</span>
          <button
            className="px-3 py-1 rounded bg-gray-100"
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </button>
        </div>
      )}

      {/* Prescription Details Dialog */}
      <PrescriptionDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        prescription={selectedPrescription}
      />
    </div>
  );
};

export default PatientPrescriptions;