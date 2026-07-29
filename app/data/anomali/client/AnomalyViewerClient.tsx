"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  BarChart2,
  CheckCircle,
  FileSearch,
  Layers,
  RefreshCw,
  Search,
  ShieldAlert,
  Edit2,
  Save,
  X,
  Check,
} from "lucide-react";

interface AnomalyItem {
  idDokumen: string;
  parameter: string;
  label: string;
  val: any;
  reason: string;
  severity: "high" | "medium";
}

interface ValuePoint {
  docId: string;
  val: any;
  isAnomaly: boolean;
}

interface StatItem {
  parameter: string;
  label: string;
  type: "numeric" | "categorical";
  fillCount: number;
  fillPercentage: number;
  nullCount: number;
  min?: number;
  max?: number;
  avg?: number;
  outliersCount?: number;
  uniqueValuesCount?: number;
  invalidCategoryCount?: number;
  values?: ValuePoint[];
}

// Helper untuk memformat angka dengan separator titik untuk ribuan ke atas
function formatNumber(val: any): string {
  if (val === null || val === undefined) return "-";
  const num = Number(val);
  if (isNaN(num)) return String(val);
  
  // Format ribuan dengan titik (contoh: 1.500)
  return num.toLocaleString("id-ID");
}

export default function AnomalyViewerClient() {
  const [anomalies, setAnomalies] = useState<AnomalyItem[]>([]);
  const [stats, setStats] = useState<StatItem[]>([]);
  const [summary, setSummary] = useState<{ totalDoc: number; totalVariables: number; anomalyCount: number }>({
    totalDoc: 0,
    totalVariables: 0,
    anomalyCount: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"deskriptif" | "anomali">("deskriptif");
  const [search, setSearch] = useState<string>("");
  const [selectedStat, setSelectedStat] = useState<StatItem | null>(null);

  // State untuk penanda manual status selesai per variabel (Parameter -> boolean)
  const [resolvedVars, setResolvedVars] = useState<Record<string, boolean>>({});

  // State untuk penampungan draf editan lokal (Key: "docId-parameter", Value: val)
  const [pendingEdits, setPendingEdits] = useState<Record<string, { docId: string; parameter: string; val: string }>>({});
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<string>("");
  const [isSavingBatch, setIsSavingBatch] = useState<boolean>(false);

  const fetchAnomalyData = async () => {
    setLoading(true);
    try {
      const [resAnomali, resStatus] = await Promise.all([
        fetch("/api/data/anomali"),
        fetch("/api/data/anomali-status"),
      ]);
      const json = await resAnomali.json();
      const statusJson = await resStatus.json();

      if (json.success) {
        setAnomalies(json.anomalies || []);
        setStats(json.descriptiveStats || []);
        setSummary(json.summary || { totalDoc: 0, totalVariables: 0, anomalyCount: 0 });
      }
      if (statusJson.success) {
        setResolvedVars(statusJson.statuses || {});
      }
    } catch (err) {
      console.error("Gagal memuat analisis anomali / status:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnomalyData();
  }, []);

  // Toggle status penyelesaian & simpan langsung ke database
  const handleToggleResolvedStatus = async (parameter: string) => {
    const nextVal = !resolvedVars[parameter];
    
    // Optimistic update di UI
    setResolvedVars((prev) => ({
      ...prev,
      [parameter]: nextVal,
    }));

    try {
      await fetch("/api/data/anomali-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parameter,
          isResolved: nextVal,
        }),
      });
    } catch (err) {
      console.error("Gagal menyimpan status penyelesaian:", err);
    }
  };

  // Mulai pengeditan lokal
  const handleStartEdit = (docId: string, parameter: string, currentVal: any) => {
    const key = `${docId}-${parameter}`;
    setEditingKey(key);
    // Jika sudah ada draf editan sebelumnya, pakai draf tersebut
    const existingDraft = pendingEdits[key];
    setEditingValue(existingDraft ? existingDraft.val : String(currentVal ?? ""));
  };

  // Simpan editan sementara ke state lokal (belum ke DB)
  const handleApplyLocalEdit = (docId: string, parameter: string) => {
    const key = `${docId}-${parameter}`;
    setPendingEdits((prev) => ({
      ...prev,
      [key]: { docId, parameter, val: editingValue },
    }));
    setEditingKey(null);
    setEditingValue("");
  };

  const handleCancelLocalEdit = () => {
    setEditingKey(null);
    setEditingValue("");
  };

  // Kirim seluruh draf editan pendingEdits ke database
  const saveAllPendingEdits = async () => {
    const editList = Object.values(pendingEdits);
    if (editList.length === 0) return true;

    setIsSavingBatch(true);
    try {
      const res = await fetch("/api/data/edit-batch", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ edits: editList }),
      });
      const json = await res.json();
      if (json.success) {
        setPendingEdits({});
        await fetchAnomalyData();
        return true;
      } else {
        alert(json.error || "Gagal menyimpan perubahan.");
        return false;
      }
    } catch (err) {
      console.error("Error batch saving:", err);
      alert("Gagal menyimpan perubahan ke database.");
      return false;
    } finally {
      setIsSavingBatch(false);
    }
  };

  // Toggle Buka/Tutup Rincian Data (Simpan otomatis ketika klik "Tutup Data")
  const handleToggleStatDetail = async (st: StatItem) => {
    if (selectedStat?.parameter === st.parameter) {
      // User mengeklik "Tutup Data"
      if (Object.keys(pendingEdits).length > 0) {
        const ok = await saveAllPendingEdits();
        if (!ok) return;
      }
      setSelectedStat(null);
    } else {
      // User membuka variabel lain
      if (Object.keys(pendingEdits).length > 0) {
        const ok = await saveAllPendingEdits();
        if (!ok) return;
      }
      setSelectedStat(st);
    }
  };

  const filteredAnomalies = anomalies.filter(
    (a) =>
      a.idDokumen.toLowerCase().includes(search.toLowerCase()) ||
      a.parameter.toLowerCase().includes(search.toLowerCase()) ||
      a.label.toLowerCase().includes(search.toLowerCase())
  );

  const filteredStats = stats.filter(
    (s) =>
      s.parameter.toLowerCase().includes(search.toLowerCase()) ||
      s.label.toLowerCase().includes(search.toLowerCase())
  );

  const pendingCount = Object.keys(pendingEdits).length;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#e6dfd8] pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#efe9de] border border-[#e6dfd8] text-[#cc785c] text-xs font-semibold uppercase tracking-wider">
            <ShieldAlert className="w-3.5 h-3.5 text-[#cc785c]" />
            <span>Audit &amp; Validasi Kualitas Data</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#141413]">
            Analisis Deskriptif &amp; Deteksi Anomali
          </h1>
          <p className="text-sm text-[#6c6a64] max-w-2xl">
            Inspeksi menyeluruh data tiap variabel untuk mengidentifikasi pencilan (outlier IQR), kode kategori tidak valid, dan seluruh titik nilai per dokumen. Anda dapat mengedit beberapa nilai sekaligus dan tersimpan saat mengeklik tombol <strong>Tutup Data</strong>.
          </p>
        </div>

        <button
          onClick={fetchAnomalyData}
          disabled={loading || isSavingBatch}
          className="px-4 py-2 text-xs font-bold bg-[#efe9de] text-[#141413] hover:bg-[#e8e0d2] border border-[#e6dfd8] rounded-xl transition-colors cursor-pointer inline-flex items-center gap-2 self-start md:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading || isSavingBatch ? "animate-spin" : ""}`} />
          <span>Analisis Ulang</span>
        </button>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#e6dfd8] rounded-2xl p-5 flex items-center justify-between shadow-2xs">
          <div>
            <p className="text-xs text-[#6c6a64] uppercase font-bold tracking-wider">Total Dokumen Master</p>
            <p className="text-2xl font-bold text-[#141413] mt-1">{formatNumber(summary.totalDoc)}</p>
          </div>
          <div className="p-3 bg-[#efe9de] rounded-xl text-[#cc785c]">
            <FileSearch className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-[#e6dfd8] rounded-2xl p-5 flex items-center justify-between shadow-2xs">
          <div>
            <p className="text-xs text-[#6c6a64] uppercase font-bold tracking-wider">Variabel Teranalisis</p>
            <p className="text-2xl font-bold text-[#141413] mt-1">{formatNumber(summary.totalVariables)}</p>
          </div>
          <div className="p-3 bg-[#efe9de] rounded-xl text-[#cc785c]">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-[#e6dfd8] rounded-2xl p-5 flex items-center justify-between shadow-2xs">
          <div>
            <p className="text-xs text-[#6c6a64] uppercase font-bold tracking-wider">Temuan Anomali &amp; Outlier</p>
            <p className="text-2xl font-bold text-amber-700 mt-1">{formatNumber(summary.anomalyCount)}</p>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl text-amber-700 border border-amber-200">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* ── Tab Switcher & Search Bar ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 p-1 rounded-xl bg-[#efe9de] border border-[#e6dfd8] w-full sm:w-auto">
          <button
            onClick={() => setActiveTab("deskriptif")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer flex-1 sm:flex-initial flex items-center justify-center gap-1.5 ${
              activeTab === "deskriptif"
                ? "bg-[#cc785c] text-white shadow-xs"
                : "text-[#141413] hover:bg-[#e8e0d2]"
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Statistik Deskriptif Variabel ({stats.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("anomali")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer flex-1 sm:flex-initial flex items-center justify-center gap-1.5 ${
              activeTab === "anomali"
                ? "bg-[#cc785c] text-white shadow-xs"
                : "text-[#141413] hover:bg-[#e8e0d2]"
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Daftar Ringkas Anomali ({anomalies.length})</span>
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6c6a64]" />
          <input
            type="text"
            placeholder="Filter parameter / ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-white border border-[#e6dfd8] focus:border-[#cc785c] focus:outline-none text-[#141413]"
          />
        </div>
      </div>

      {/* ── Main Content View ── */}
      {loading ? (
        <div className="p-16 bg-white border border-[#e6dfd8] rounded-2xl text-center text-xs text-[#6c6a64] space-y-3">
          <div className="w-7 h-7 border-2 border-[#cc785c] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-semibold">Menjalankan kalkulasi statistik IQR &amp; audit aturan metadata...</p>
        </div>
      ) : activeTab === "deskriptif" ? (
        /* TAB STATISTIK DESKRIPTIF VARIABEL */
        <div className="bg-white border border-[#e6dfd8] rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-[#e6dfd8] bg-[#efe9de] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-[#cc785c]" />
              <h2 className="text-xs font-bold text-[#141413] uppercase tracking-wider">
                Analisis Per Variabel &amp; Sebaran Titik Nilai Data
              </h2>
            </div>
            <span className="text-xs text-[#6c6a64] font-semibold">{filteredStats.length} Variabel</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#faf9f5] border-b border-[#e6dfd8] text-[#6c6a64] uppercase font-bold">
                  <th className="py-3 px-4 w-12">No</th>
                  <th className="py-3 px-4">Kode &amp; Nama Variabel</th>
                  <th className="py-3 px-4 text-center">Tipe</th>
                  <th className="py-3 px-4 text-center">Kelengkapan Data</th>
                  <th className="py-3 px-4">Metrik Statistik</th>
                  <th className="py-3 px-4 text-center">Status Anomali</th>
                  <th className="py-3 px-4 text-center">Penyelesaian</th>
                  <th className="py-3 px-4 text-right">Rincian Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e6dfd8]">
                {filteredStats.map((st, idx) => {
                  const isExpanded = selectedStat?.parameter === st.parameter;
                  const totalAnomali = (st.outliersCount || 0) + (st.invalidCategoryCount || 0);
                  const hasAnomali = totalAnomali > 0;
                  
                  // Hitung berapa anomali di variabel ini yang sudah diedit dalam pendingEdits
                  const resolvedCount = st.values
                    ? st.values.filter(
                        (v) => v.isAnomaly && pendingEdits[`${v.docId}-${st.parameter}`]
                      ).length
                    : 0;

                  const isFullyResolved = hasAnomali && resolvedCount >= totalAnomali;

                  return (
                    <React.Fragment key={st.parameter}>
                      <tr className="hover:bg-[#faf9f5] transition-colors">
                        <td className="py-3 px-4 font-bold text-[#6c6a64]">{idx + 1}</td>
                        <td className="py-3 px-4">
                          <span className="font-mono font-bold text-[#cc785c] block">{st.parameter}</span>
                          <span className="text-[11px] text-[#141413] font-semibold line-clamp-1">{st.label}</span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#efe9de] text-[#141413] border border-[#e6dfd8]">
                            {st.type === "numeric" ? "Angka" : "Kategori"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="space-y-1">
                            <span className="font-bold text-[#141413]">{st.fillPercentage}%</span>
                            <div className="w-20 bg-[#efe9de] h-1.5 rounded-full mx-auto overflow-hidden">
                              <div className="bg-[#cc785c] h-full" style={{ width: `${st.fillPercentage}%` }} />
                            </div>
                            <span className="text-[9px] text-[#6c6a64] block">({formatNumber(st.fillCount)} terisi)</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {st.type === "numeric" ? (
                            <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono">
                              <span>Min: <strong className="text-[#141413]">{formatNumber(st.min)}</strong></span>
                              <span>Max: <strong className="text-[#141413]">{formatNumber(st.max)}</strong></span>
                              <span>Rata-rata: <strong className="text-[#cc785c]">{formatNumber(st.avg)}</strong></span>
                            </div>
                          ) : (
                            <span className="text-[11px] text-[#6c6a64]">
                              Terdiri dari <strong className="text-[#141413]">{formatNumber(st.uniqueValuesCount)}</strong> variasi nilai unik
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {hasAnomali ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              <AlertTriangle className="w-3 h-3" />
                              {formatNumber(totalAnomali)} Anomali
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700">
                              <CheckCircle className="w-3 h-3 text-emerald-600" /> Normal
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => handleToggleResolvedStatus(st.parameter)}
                            className={`px-3 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors border inline-flex items-center gap-1 ${
                              resolvedVars[st.parameter]
                                ? "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100"
                                : "bg-red-50 text-red-700 border-red-300 hover:bg-red-100"
                            }`}
                          >
                            <CheckCircle className="w-3 h-3" />
                            <span>{resolvedVars[st.parameter] ? "Selesai" : "Belum Selesai"}</span>
                          </button>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleToggleStatDetail(st)}
                            disabled={isSavingBatch}
                            className={`px-3 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-colors inline-flex items-center gap-1.5 ${
                              isExpanded
                                ? "bg-[#cc785c] text-white shadow-xs"
                                : "bg-[#efe9de] text-[#141413] hover:bg-[#e8e0d2]"
                            }`}
                          >
                            {isSavingBatch && isExpanded ? (
                              <>
                                <RefreshCw className="w-3 h-3 animate-spin" />
                                <span>Menyimpan...</span>
                              </>
                            ) : isExpanded ? (
                              <>
                                <span>Tutup Data</span>
                                {pendingCount > 0 && (
                                  <span className="px-1.5 py-0.2 rounded-full bg-white text-[#cc785c] text-[9px] font-extrabold">
                                    {pendingCount} Editan Tersimpan
                                  </span>
                                )}
                              </>
                            ) : (
                              <span>Lihat Semua Data</span>
                            )}
                          </button>
                        </td>
                      </tr>

                      {/* Expandable Section: Tampilkan Seluruh Data Per Dokumen untuk Variabel Ini */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={7} className="p-4 bg-[#faf9f5] border-b border-[#e6dfd8]">
                            <div className="bg-white border border-[#e6dfd8] rounded-xl p-5 space-y-4 shadow-2xs">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#e6dfd8] pb-3 gap-2">
                                <div>
                                  <h4 className="text-xs font-bold text-[#141413] uppercase tracking-wider">
                                    Sebaran Nilai Seluruh Dokumen untuk Variabel: <span className="font-mono text-[#cc785c]">{st.parameter}</span>
                                  </h4>
                                  <p className="text-[11px] text-[#6c6a64] mt-0.5">
                                    {st.label} • ({formatNumber(st.values?.length || 0)} Data Terisi)
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  {pendingCount > 0 && (
                                    <span className="text-xs font-bold text-[#cc785c] bg-[#efe9de] px-3 py-1 rounded-full border border-[#e6dfd8]">
                                      {pendingCount} Perubahan Draf (Disimpan saat Tutup Data)
                                    </span>
                                  )}
                                  <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                                    {formatNumber((st.outliersCount || 0) + (st.invalidCategoryCount || 0))} Nilai Anomali
                                  </span>
                                </div>
                              </div>

                              {/* Data Points Grid */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-96 overflow-y-auto p-1">
                                {st.values?.map((pt, pIdx) => {
                                  const itemKey = `${pt.docId}-${st.parameter}`;
                                  const isEditing = editingKey === itemKey;
                                  const draftVal = pendingEdits[itemKey]?.val;
                                  const displayVal = draftVal !== undefined ? draftVal : pt.val;
                                  const isModified = draftVal !== undefined;

                                  return (
                                    <div
                                      key={pIdx}
                                      className={`p-3 rounded-xl border text-xs space-y-2 transition-all flex flex-col justify-between ${
                                        isModified
                                          ? "bg-amber-50 border-amber-300 text-amber-900 shadow-xs"
                                          : pt.isAnomaly
                                          ? "bg-red-50 border-red-300 text-red-900 shadow-xs"
                                          : "bg-[#faf9f5] border-[#e6dfd8] text-[#141413]"
                                      }`}
                                    >
                                      <div className="flex items-center justify-between border-b border-black/5 pb-1">
                                        <span className="font-mono text-[9px] font-bold text-[#6c6a64] truncate">
                                          ID: {pt.docId.slice(-8)}
                                        </span>
                                        {isModified ? (
                                          <span className="px-1.5 py-0.5 rounded bg-amber-600 text-white font-bold text-[8px]">
                                            DRAF EDIT
                                          </span>
                                        ) : pt.isAnomaly ? (
                                          <span className="px-1.5 py-0.5 rounded bg-red-600 text-white font-bold text-[8px]">
                                            ANOMALI
                                          </span>
                                        ) : null}
                                      </div>

                                      {isEditing ? (
                                        <div className="flex items-center gap-1">
                                          <input
                                            type="text"
                                            value={editingValue}
                                            onChange={(e) => setEditingValue(e.target.value)}
                                            className="px-2 py-1 text-xs border border-[#cc785c] rounded bg-white text-[#141413] w-full focus:outline-none"
                                            autoFocus
                                          />
                                          <button
                                            onClick={() => handleApplyLocalEdit(pt.docId, st.parameter)}
                                            className="p-1 rounded bg-[#cc785c] text-white hover:bg-[#a9583e] cursor-pointer shrink-0"
                                            title="Terapkan ke draf"
                                          >
                                            <Check className="w-3.5 h-3.5" />
                                          </button>
                                          <button
                                            onClick={handleCancelLocalEdit}
                                            className="p-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer shrink-0"
                                            title="Batal edit"
                                          >
                                            <X className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      ) : (
                                        <div className="flex items-center justify-between gap-2">
                                          <p className="font-mono font-bold text-xs">
                                            {formatNumber(displayVal)}
                                          </p>
                                          <button
                                            onClick={() => handleStartEdit(pt.docId, st.parameter, displayVal)}
                                            className="p-1 text-gray-400 hover:text-[#cc785c] hover:bg-black/5 rounded cursor-pointer transition-colors"
                                            title="Ubah Nilai"
                                          >
                                            <Edit2 className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* TAB TEMUAN ANOMALI RINGKAS */
        <div className="bg-white border border-[#e6dfd8] rounded-2xl overflow-hidden shadow-sm space-y-0">
          <div className="px-6 py-4 border-b border-[#e6dfd8] bg-[#efe9de] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#cc785c]" />
              <h2 className="text-xs font-bold text-[#141413] uppercase tracking-wider">
                Daftar Baris &amp; Variabel Yang Terdeteksi Anomali
              </h2>
            </div>
            <span className="text-xs text-[#6c6a64] font-semibold">{formatNumber(filteredAnomalies.length)} Kasus</span>
          </div>

          {filteredAnomalies.length === 0 ? (
            <div className="p-12 text-center text-xs text-[#6c6a64] space-y-2">
              <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
              <p className="font-bold text-[#141413]">Tidak Ditemukan Anomali Data</p>
              <p>Semua variabel berada dalam rentang wajar dan sesuai dengan aturan metadata.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#faf9f5] border-b border-[#e6dfd8] text-[#6c6a64] uppercase font-bold">
                    <th className="py-3 px-4 w-12">No</th>
                    <th className="py-3 px-4">ID Dokumen</th>
                    <th className="py-3 px-4">Variabel / Parameter</th>
                    <th className="py-3 px-4">Nilai Terdata</th>
                    <th className="py-3 px-4">Catatan Penyebab Anomali</th>
                    <th className="py-3 px-4 text-center">Tingkat Risiko</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e6dfd8]">
                  {filteredAnomalies.map((item, idx) => {
                    const itemKey = `${item.idDokumen}-${item.parameter}`;
                    const isEditing = editingKey === itemKey;
                    const draftVal = pendingEdits[itemKey]?.val;
                    const displayVal = draftVal !== undefined ? draftVal : item.val;
                    const isModified = draftVal !== undefined;

                    return (
                      <tr key={idx} className="hover:bg-[#faf9f5] transition-colors">
                        <td className="py-3 px-4 font-bold text-[#6c6a64]">{idx + 1}</td>
                        <td className="py-3 px-4 font-mono font-semibold text-[#cc785c]">{item.idDokumen}</td>
                        <td className="py-3 px-4">
                          <span className="font-mono font-bold text-[#141413] block">{item.parameter}</span>
                          <span className="text-[11px] text-[#6c6a64]">{item.label}</span>
                        </td>
                        <td className="py-3 px-4">
                          {isEditing ? (
                            <div className="flex items-center gap-1 max-w-[120px]">
                              <input
                                type="text"
                                value={editingValue}
                                onChange={(e) => setEditingValue(e.target.value)}
                                className="px-2 py-1 text-xs border border-[#cc785c] rounded bg-white text-[#141413] w-full focus:outline-none"
                                autoFocus
                              />
                              <button
                                onClick={() => handleApplyLocalEdit(item.idDokumen, item.parameter)}
                                className="p-1 rounded bg-[#cc785c] text-white hover:bg-[#a9583e] cursor-pointer shrink-0"
                                title="Terapkan ke draf"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={handleCancelLocalEdit}
                                className="p-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer shrink-0"
                                title="Batal edit"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <span
                              className={`font-bold px-2 py-0.5 rounded border font-mono text-[#141413] ${
                                isModified
                                  ? "bg-amber-100 border-amber-300 text-amber-900"
                                  : "bg-[#efe9de] border-[#e6dfd8]"
                              }`}
                            >
                              {formatNumber(displayVal)} {isModified && "(Draf)"}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-[#3d3d3a] font-medium">{item.reason}</td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                              item.severity === "high"
                                ? "bg-red-50 text-red-700 border-red-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}
                          >
                            {item.severity === "high" ? "Kategori Salah" : "Outlier Nilai"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {!isEditing && (
                            <button
                              onClick={() => handleStartEdit(item.idDokumen, item.parameter, displayVal)}
                              className="px-2.5 py-1 rounded bg-[#efe9de] text-[#141413] hover:bg-[#cc785c] hover:text-white transition-colors text-[11px] font-bold cursor-pointer inline-flex items-center gap-1"
                            >
                              <Edit2 className="w-3 h-3" /> Edit
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

