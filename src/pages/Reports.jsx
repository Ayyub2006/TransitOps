import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { getReport } from '../services/reportsService';
import Papa from 'papaparse';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

import TopBar from '../components/TopBar';

export default function Reports() {
  const [reportType, setReportType] = useState('vehicle');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ status: 'All', vehicle: 'All' });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await getReport(reportType, filters);
        setData(result);
      } catch (error) {
        console.error("Failed to fetch report", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [reportType, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (e) => {
    setReportType(e.target.value);
    setFilters({ status: 'All', vehicle: 'All' });
  };

  // Extract table headers dynamically based on data keys
  const headers = data.length > 0 ? Object.keys(data[0]) : [];

  const handleExportCSV = () => {
    if (!data || data.length === 0) return;
    
    const csv = Papa.unparse(data);
    const date = new Date().toISOString().split('T')[0];
    const filename = `${reportType}-${date}.csv`;
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    if (!data || data.length === 0) return;
    
    const doc = new jsPDF();
    const date = new Date().toISOString().split('T')[0];
    const filename = `${reportType}-report-${date}.pdf`;

    doc.setFontSize(18);
    doc.text(`TransitOps ${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`, 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated on: ${date}`, 14, 22);

    const tableColumn = headers;
    const tableRows = data.map(row => headers.map(header => row[header]));

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 28,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [98, 243, 236], textColor: [14, 21, 20] }
    });

    doc.save(filename);
  };

  return (
    <div className="min-h-screen overflow-x-hidden dark text-on-surface bg-background font-body-md">
      <Sidebar />
      <main className="ml-0 lg:ml-[var(--spacing-sidebar-width)] flex-1 flex flex-col overflow-hidden relative">
        <header className="min-h-topbar-height w-full flex flex-wrap justify-between items-center px-gutter py-3 gap-4 bg-surface/95 backdrop-blur-md border-b border-outline-variant z-30">
          <div className="flex items-center gap-6">
            <h1 className="font-headline-md text-headline-md font-bold text-primary tracking-tighter">REPORTS &amp; ANALYTICS</h1>
            <div className="hidden md:flex items-center gap-2 bg-surface-container border border-outline-variant px-3 py-1.5 rounded">
              <span className="material-symbols-outlined text-on-surface-variant text-sm">calendar_month</span>
              <span className="font-label-caps text-on-surface-variant whitespace-nowrap">OCT 1, 2023 - OCT 31, 2023</span>
              <span className="material-symbols-outlined text-on-surface-variant text-sm">expand_more</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={handleExportPDF} className="flex items-center gap-2 border border-outline px-4 py-2 rounded font-label-caps hover:bg-surface-variant/30 transition-colors whitespace-nowrap">
              <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
              EXPORT PDF
            </button>
            <button onClick={handleExportCSV} className="flex items-center gap-2 bg-primary-container text-on-primary-container px-4 py-2 rounded font-label-caps font-bold hover:opacity-90 transition-opacity whitespace-nowrap">
              <span className="material-symbols-outlined text-sm">table_view</span>
              EXPORT CSV
            </button>
            <div className="h-6 w-[1px] bg-outline-variant mx-2"></div>
            <div className="w-8 h-8 rounded-full border border-primary/50 p-0.5 overflow-hidden">
              <img className="w-full h-full object-cover rounded-full" alt="Commander Profile" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCH-f-Ds0EHTxC76Ef1c3mL0gDYwpt3DUl3DFk1DUnhSXteG5KuvrKJGFCKZObmYRY0PLpxqYEOkwW3b4XBF78trJBAglB0FdLCdASJBqfMmeQg2iXTj0Z9V3TmEyQZxUN4JqQATOJ3FtGZ6VsFqLWC2anTcklvklPcxq8I5OvU4wmUQA1e0zqtfELmHNZ06RHyekOojACvBieToc45Q30jTVSFTZHK-xJl7q2DczvOm7xwcGBFuF6fiQ" />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div className="max-w-[1600px] mx-auto space-y-6">

            <div className="bg-surface-container border border-outline-variant rounded p-5 flex flex-col card-glow transition-all">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface uppercase tracking-wider">Dynamic Report Generator</h3>
                  <p className="text-xs text-on-surface-variant font-label-caps opacity-60">SELECT A REPORT TYPE TO VIEW DATA</p>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <select
                    value={reportType}
                    onChange={handleTypeChange}
                    className="bg-surface border border-outline-variant text-on-surface text-sm font-label-caps rounded px-4 py-2 focus:ring-1 focus:ring-primary outline-none"
                  >
                    <option value="vehicle">Vehicle Report</option>
                    <option value="driver">Driver Report</option>
                    <option value="trip">Trip Report</option>
                    <option value="maintenance">Maintenance Report</option>
                    <option value="fuel">Fuel Report</option>
                    <option value="expense">Expense Report</option>
                  </select>

                  {['vehicle', 'driver', 'trip'].includes(reportType) && (
                    <select
                      name="status"
                      value={filters.status}
                      onChange={handleFilterChange}
                      className="bg-surface border border-outline-variant text-on-surface text-sm font-label-caps rounded px-4 py-2 focus:ring-1 focus:ring-primary outline-none"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Active">Active</option>
                      <option value="Available">Available</option>
                      <option value="En Route">En Route</option>
                      <option value="In Shop">In Shop</option>
                    </select>
                  )}

                  <input
                    type="text"
                    name="vehicle"
                    value={filters.vehicle === 'All' ? '' : filters.vehicle}
                    onChange={(e) => handleFilterChange({ target: { name: 'vehicle', value: e.target.value || 'All' } })}
                    placeholder="Filter ID/Vehicle..."
                    className="bg-surface border border-outline-variant text-on-surface text-sm rounded px-4 py-2 focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
              </div>

              <div className="overflow-x-auto min-h-[400px]">
                {loading ? (
                  <div className="w-full flex flex-col space-y-3 py-4">
                    <div className="w-full h-10 bg-surface-container-high border border-outline-variant/30 rounded animate-pulse mb-2"></div>
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="w-full h-12 bg-surface-container border border-outline-variant/20 rounded animate-pulse"></div>
                    ))}
                  </div>
                ) : data.length === 0 ? (
                  <div className="w-full h-full flex items-center justify-center py-20">
                    <p className="font-label-caps text-on-surface-variant tracking-widest uppercase">No data found matching criteria.</p>
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-outline-variant bg-surface-container-high">
                        {headers.map(header => (
                          <th key={header} className="py-4 px-4 font-label-caps text-[11px] text-on-surface-variant uppercase tracking-widest">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="font-mono-technical text-sm">
                      {data.map((row, index) => (
                        <tr key={index} className="border-b border-outline-variant/30 hover:bg-primary/5 transition-colors group">
                          {headers.map(header => (
                            <td key={header} className="py-4 px-4 text-on-surface">
                              {row[header]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
