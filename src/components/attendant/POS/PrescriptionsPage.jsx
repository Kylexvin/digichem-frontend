import React, { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Calendar,
  User,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";

const PrescriptionsPage = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const tabs = [
    { id: "pending", label: "Pending", count: 12 },
    { id: "ready", label: "Ready", count: 8 },
    { id: "completed", label: "Completed", count: 45 },
    { id: "all", label: "All Prescriptions", count: 65 },
  ];

  const statuses = [
    { id: "all", label: "All Status" },
    { id: "pending", label: "Pending" },
    { id: "processing", label: "Processing" },
    { id: "ready", label: "Ready" },
    { id: "completed", label: "Completed" },
    { id: "cancelled", label: "Cancelled" },
  ];

  const mockPrescriptions = [
    {
      id: "PRX001",
      patientName: "John Kamau",
      doctorName: "Dr. Sarah Wanjiku",
      date: "2024-01-15",
      status: "pending",
      items: 3,
      total: "KES 2,450",
      medications: ["Amoxicillin 500mg", "Paracetamol 500mg", "Vitamin D3"],
    },
    {
      id: "PRX002",
      patientName: "Mary Njeri",
      doctorName: "Dr. James Mwangi",
      date: "2024-01-15",
      status: "ready",
      items: 2,
      total: "KES 1,800",
      medications: ["Metformin 500mg", "Lisinopril 10mg"],
    },
    {
      id: "PRX003",
      patientName: "Peter Ochieng",
      doctorName: "Dr. Grace Akinyi",
      date: "2024-01-14",
      status: "completed",
      items: 4,
      total: "KES 3,200",
      medications: ["Ibuprofen 400mg", "Omeprazole 20mg", "Aspirin 100mg", "Simvastatin 20mg"],
    },
    {
      id: "PRX004",
      patientName: "Alice Wambui",
      doctorName: "Dr. Michael Kiprotich",
      date: "2024-01-14",
      status: "processing",
      items: 1,
      total: "KES 850",
      medications: ["Insulin Glargine"],
    },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock size={16} className="status-icon pending" />;
      case "processing":
        return <AlertCircle size={16} className="status-icon processing" />;
      case "ready":
        return <CheckCircle size={16} className="status-icon ready" />;
      case "completed":
        return <CheckCircle size={16} className="status-icon completed" />;
      default:
        return <Clock size={16} className="status-icon" />;
    }
  };

  const getStatusClass = (status) => {
    return `status-badge ${status}`;
  };

  const filteredPrescriptions = mockPrescriptions.filter(prescription => {
    const matchesTab = activeTab === "all" || prescription.status === activeTab;
    const matchesSearch = prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prescription.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || prescription.status === selectedStatus;
    
    return matchesTab && matchesSearch && matchesStatus;
  });

  return (
    <div className="prescriptions-page">
      {/* Header Section */}
      <div className="prescriptions-header">
        <div className="prescriptions-title-section">
          <h1 className="prescriptions-title">Prescription Management</h1>
          <p className="prescriptions-subtitle">Manage and track patient prescriptions</p>
        </div>
        
        <button className="add-prescription-btn">
          <Plus size={18} />
          New Prescription
        </button>
      </div>

      {/* Tabs */}
      <div className="prescriptions-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            <span className="tab-count">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="prescriptions-filters">
        <div className="search-container">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search prescriptions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="status-filter"
        >
          {statuses.map(status => (
            <option key={status.id} value={status.id}>{status.label}</option>
          ))}
        </select>

        <button className="filter-btn">
          <Filter size={18} />
          More Filters
        </button>
      </div>

      {/* Prescriptions List */}
      <div className="prescriptions-list">
        {filteredPrescriptions.length === 0 ? (
          <div className="empty-state">
            <FileText size={48} className="empty-icon" />
            <h3>No prescriptions found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          filteredPrescriptions.map(prescription => (
            <div key={prescription.id} className="prescription-card">
              <div className="prescription-header">
                <div className="prescription-id">
                  <FileText size={16} />
                  {prescription.id}
                </div>
                <div className={getStatusClass(prescription.status)}>
                  {getStatusIcon(prescription.status)}
                  {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                </div>
              </div>

              <div className="prescription-content">
                <div className="patient-info">
                  <div className="patient-name">
                    <User size={16} />
                    {prescription.patientName}
                  </div>
                  <div className="doctor-name">
                    Prescribed by {prescription.doctorName}
                  </div>
                </div>

                <div className="prescription-details">
                  <div className="detail-item">
                    <Calendar size={14} />
                    {prescription.date}
                  </div>
                  <div className="detail-item">
                    <FileText size={14} />
                    {prescription.items} items
                  </div>
                  <div className="detail-item total">
                    {prescription.total}
                  </div>
                </div>
              </div>

              <div className="medications-list">
                <h4>Medications:</h4>
                <div className="medications">
                  {prescription.medications.map((med, index) => (
                    <span key={index} className="medication-tag">
                      {med}
                    </span>
                  ))}
                </div>
              </div>

              <div className="prescription-actions">
                <button className="action-btn secondary">
                  <Eye size={16} />
                  View
                </button>
                <button className="action-btn secondary">
                  <Edit size={16} />
                  Edit
                </button>
                {prescription.status === "pending" && (
                  <button className="action-btn primary">
                    Process
                  </button>
                )}
                {prescription.status === "ready" && (
                  <button className="action-btn success">
                    Complete
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PrescriptionsPage;