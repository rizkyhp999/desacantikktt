"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Database,
  Search,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  Users,
  Layers,
  ChevronDown,
  ChevronUp,
  Download,
  Upload,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Trash2,
} from "lucide-react";

interface PerulanganItem {
  id: string;
  idDokumen: string;
  noKK: string | null;
  namaKRT: string | null;
  isianKe: number | null;
  data: Record<string, any>;
}

interface MasterItem {
  id: string;
  idDokumen: string;
  no: number | null;
  noKK: string | null;
  namaKRT: string | null;
  kecamatan: string | null;
  desa: string | null;
  sls: string | null;
  subSls: string | null;
  data: Record<string, any>;
  perulangan: PerulanganItem[];
}

export default function DataViewerClient() {
  const [data, setData] = useState<MasterItem[]>([]);
  const [metadataMap, setMetadataMap] = useState<Record<string, { label: string; options?: string | null }>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [selectedDoc, setSelectedDoc] = useState<MasterItem | null>(null);
  const [activeTab, setActiveTab] = useState<"master" | "perulangan" | "metadata">("master");

  // State untuk export/import/delete
  const [exporting, setExporting] = useState<boolean>(false);
  const [importing, setImporting] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // State untuk inline editing
  const [editingValues, setEditingValues] = useState<Record<string, string>>({});
  const [savingKey, setSavingKey] = useState<string | null>(null);

  const handleSaveVariable = async (
    idDokumen: string,
    idPerulangan: string | null,
    parameter: string,
    val: string
  ) => {
    const keyId = idPerulangan ? `${idPerulangan}_${parameter}` : `${idDokumen}_${parameter}`;
    setSavingKey(keyId);
    try {
      const res = await fetch("/api/data/edit-variabel", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idDokumen,
          idPerulangan,
          parameter,
          val,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setStatusMsg({
          type: "success",
          text: `Variabel ${parameter} berhasil disimpan!`,
        });
        // Update local state agar antarmuka ter-update seketika
        setData((prevData) =>
          prevData.map((doc) => {
            if (doc.idDokumen === idDokumen) {
              if (idPerulangan) {
                return {
                  ...doc,
                  perulangan: doc.perulangan.map((p) => {
                    if (p.id === idPerulangan) {
                      const updatedPData = { ...p.data };
                      if (val === "" || val === null) delete updatedPData[parameter];
                      else updatedPData[parameter] = val;
                      return { ...p, data: updatedPData };
                    }
                    return p;
                  }),
                };
              } else {
                const updatedMData = { ...doc.data };
                if (val === "" || val === null) delete updatedMData[parameter];
                else updatedMData[parameter] = val;
                return { ...doc, data: updatedMData };
              }
            }
            return doc;
          })
        );
      } else {
        throw new Error(json.error || "Gagal menyimpan perubahan.");
      }
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message || "Gagal menyimpan variabel" });
    } finally {
      setSavingKey(null);
    }
  };

  const sortKeys = (keys: string[]) => {
    return Array.from(new Set(keys)).sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" })
    );
  };

  const fetchData = async (p: number, q: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/data?page=${p}&limit=10&search=${encodeURIComponent(q)}`);
      const json = await res.json();
      if (json.success) {
        setData(json.data);
        setMetadataMap(json.metadataMap || {});
        setTotalPages(json.pagination.totalPages);
        setTotalRecords(json.pagination.total);
      }
    } catch (err) {
      console.error("Failed to load data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page, search);
  }, [page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchData(1, search);
  };

  // Handler Download Excel
  const handleDownload = async () => {
    setExporting(true);
    setStatusMsg(null);
    try {
      const res = await fetch("/api/data/export");
      if (!res.ok) throw new Error("Gagal mengunduh file Excel");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Data_Descan_Buong_Baru_2026.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setStatusMsg({ type: "success", text: "File Excel berhasil diunduh!" });
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message || "Gagal mendownload data" });
    } finally {
      setExporting(false);
    }
  };

  // Handler Upload Excel
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setStatusMsg(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/data/import", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (json.success) {
        setStatusMsg({
          type: "success",
          text: `Data berhasil ditimpa/diperbarui! (Master: ${json.summary.masterUpdated}, Perulangan: ${json.summary.repeatUpdated})`,
        });
        fetchData(page, search);
      } else {
        throw new Error(json.error || "Gagal mengunggah file");
      }
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message || "Gagal mengunggah file Excel" });
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Handler Hapus Semua Data
  const handleDeleteAll = async () => {
    setDeleting(true);
    setStatusMsg(null);
    try {
      const res = await fetch("/api/data/delete-all", {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        setStatusMsg({
          type: "success",
          text: "Seluruh data master, perulangan, & metadata telah berhasil dihapus!",
        });
        setShowDeleteModal(false);
        setPage(1);
        fetchData(1, search);
      } else {
        throw new Error(json.error || "Gagal menghapus data");
      }
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message || "Gagal menghapus seluruh data" });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".xlsx, .xls"
        className="hidden"
      />

      {/* Modal Konfirmasi Hapus Semua Data */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-[#e6dfd8] rounded-2xl p-6 max-w-md w-full shadow-xl space-y-4 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#141413]">Konfirmasi Hapus Seluruh Data</h3>
                <p className="text-xs text-[#6c6a64]">
                  Apakah Anda yakin ingin menghapus <span className="font-bold text-red-600">SEMUA DATA MASTER &amp; PERULANGAN</span> dari basis data? Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleting}
                  className="px-4 py-2 text-xs font-bold bg-[#efe9de] text-[#141413] rounded-xl hover:bg-[#e8e0d2] transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={handleDeleteAll}
                  disabled={deleting}
                  className="px-4 py-2 text-xs font-bold bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  {deleting ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  <span>{deleting ? "Menghapus..." : "Ya, Hapus Semua Data"}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#e6dfd8] pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#efe9de] border border-[#e6dfd8] text-[#cc785c] text-xs font-semibold uppercase tracking-wider">
            <Database className="w-3.5 h-3.5" />
            <span>Basis Data Desa Cantik</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#141413]">
            Data Master &amp; Perulangan Survei Desa
          </h1>
          <p className="text-sm text-[#6c6a64] max-w-2xl">
            Integrasi data survei mikro Desa Buong Baru 2026. Data master terhubung langsung secara presisi dengan data perulangan berdasarkan <span className="font-semibold text-[#141413]">ID_Dokumen</span>.
          </p>
        </div>

        {/* Tombol Aksi Download, Upload, & Form Pencarian */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Tombol Unduh / Download */}
          <button
            onClick={handleDownload}
            disabled={exporting}
            className="px-3.5 py-2 text-xs font-bold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-colors shadow-xs cursor-pointer inline-flex items-center gap-1.5"
          >
            {exporting ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>{exporting ? "Mengunduh..." : "Download XLSX"}</span>
          </button>

          {/* Tombol Ke Halaman Anomali */}
          <a
            href="/data/anomali"
            className="px-3.5 py-2 text-xs font-bold bg-[#efe9de] text-[#141413] border border-[#e6dfd8] hover:bg-[#e8e0d2] transition-colors shadow-xs cursor-pointer inline-flex items-center gap-1.5 rounded-xl"
          >
            <AlertCircle className="w-4 h-4 text-[#cc785c]" />
            <span>Analisis Anomali</span>
          </a>

          {/* Tombol Unggah / Upload */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={importing}
            className="px-3.5 py-2 text-xs font-bold bg-[#cc785c] text-white rounded-xl hover:bg-[#a9583e] disabled:opacity-50 transition-colors shadow-xs cursor-pointer inline-flex items-center gap-1.5"
          >
            {importing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            <span>{importing ? "Mengunggah..." : "Unggah & Timpa"}</span>
          </button>

          {/* Tombol Hapus Semua Data */}
          <button
            onClick={() => setShowDeleteModal(true)}
            disabled={deleting}
            className="px-3.5 py-2 text-xs font-bold bg-red-50 text-red-700 border border-red-200 hover:bg-red-600 hover:text-white disabled:opacity-50 transition-colors shadow-xs cursor-pointer inline-flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" />
            <span>Hapus Semua</span>
          </button>

          {/* Form Pencarian */}
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6c6a64]" />
              <input
                type="text"
                placeholder="Cari Nama KRT / ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-[#e6dfd8] focus:border-[#cc785c] focus:outline-none w-48 text-[#141413]"
              />
            </div>
            <button
              type="submit"
              className="px-3 py-2 text-xs font-bold bg-[#efe9de] text-[#141413] rounded-xl hover:bg-[#e8e0d2] transition-colors cursor-pointer border border-[#e6dfd8]"
            >
              Cari
            </button>
          </form>
        </div>
      </div>

      {/* Status Alert Notification */}
      {statusMsg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-xs font-semibold ${
            statusMsg.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMsg.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            )}
            <span>{statusMsg.text}</span>
          </div>
          <button
            onClick={() => setStatusMsg(null)}
            className="text-xs font-bold opacity-75 hover:opacity-100 cursor-pointer"
          >
            Tutup
          </button>
        </motion.div>
      )}

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#e6dfd8] rounded-2xl p-5 flex items-center justify-between shadow-2xs">
          <div>
            <p className="text-xs text-[#6c6a64] uppercase font-bold tracking-wider">Total Dokumen Master</p>
            <p className="text-2xl font-bold text-[#141413] mt-1">{totalRecords}</p>
          </div>
          <div className="p-3 bg-[#efe9de] rounded-xl text-[#cc785c]">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white border border-[#e6dfd8] rounded-2xl p-5 flex items-center justify-between shadow-2xs">
          <div>
            <p className="text-xs text-[#6c6a64] uppercase font-bold tracking-wider">Metrik Rincian Variabel</p>
            <p className="text-2xl font-bold text-[#141413] mt-1">{Object.keys(metadataMap).length}</p>
          </div>
          <div className="p-3 bg-[#efe9de] rounded-xl text-[#cc785c]">
            <Layers className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white border border-[#e6dfd8] rounded-2xl p-5 flex items-center justify-between shadow-2xs">
          <div>
            <p className="text-xs text-[#6c6a64] uppercase font-bold tracking-wider">Desa &amp; SLS</p>
            <p className="text-2xl font-bold text-[#141413] mt-1">Buong Baru</p>
          </div>
          <div className="p-3 bg-[#efe9de] rounded-xl text-[#cc785c]">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* ── Main Data View Table ── */}
      <div className="bg-white border border-[#e6dfd8] rounded-2xl overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e6dfd8] bg-[#efe9de]">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-[#cc785c]" />
            <h2 className="text-sm font-bold text-[#141413] uppercase tracking-wider">
              Tabel Integrasi Master &amp; Perulangan
            </h2>
          </div>
          <span className="text-xs text-[#6c6a64]">
            Halaman {page} dari {totalPages}
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-[#6c6a64] space-y-2">
            <div className="w-6 h-6 border-2 border-[#cc785c] border-t-transparent rounded-full animate-spin mx-auto" />
            <p>Memuat data dari database Postgres...</p>
          </div>
        ) : data.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#6c6a64]">
            Tidak ada data yang ditemukan.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#faf9f5] border-b border-[#e6dfd8] text-[#6c6a64] uppercase font-bold">
                  <th className="py-3 px-4 w-12">No</th>
                  <th className="py-3 px-4">ID Dokumen</th>
                  <th className="py-3 px-4">Nama KRT</th>
                  <th className="py-3 px-4">Desa / SLS</th>
                  <th className="py-3 px-4 text-center">Anggota (Perulangan)</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e6dfd8]">
                {data.map((item, idx) => (
                  <React.Fragment key={item.id}>
                    <tr className="hover:bg-[#faf9f5] transition-colors">
                      <td className="py-3 px-4 font-bold text-[#6c6a64]">
                        {item.no ?? (page - 1) * 10 + idx + 1}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] font-semibold text-[#cc785c]">
                        {item.idDokumen}
                      </td>
                      <td className="py-3 px-4 font-bold text-[#141413]">
                        {item.namaKRT || "-"}
                      </td>
                      <td className="py-3 px-4 text-[#6c6a64]">
                        {item.desa || "BUONG BARU"} (SLS: {item.sls || "-"})
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#efe9de] text-[#cc785c] font-bold text-[10px] border border-[#e6dfd8]">
                          <Users className="w-3 h-3" />
                          {item.perulangan.length} Jiwa
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedDoc(selectedDoc?.id === item.id ? null : item)}
                          className="px-3 py-1 rounded-lg bg-[#efe9de] text-[#141413] hover:bg-[#cc785c] hover:text-white transition-colors text-[11px] font-bold cursor-pointer inline-flex items-center gap-1"
                        >
                          {selectedDoc?.id === item.id ? (
                            <>
                              Tutup <ChevronUp className="w-3 h-3" />
                            </>
                          ) : (
                            <>
                              Detail <ChevronDown className="w-3 h-3" />
                            </>
                          )}
                        </button>
                      </td>
                    </tr>

                    {/* Detail Modal / Panel per baris */}
                    {selectedDoc?.id === item.id && (
                      <tr>
                        <td colSpan={6} className="p-4 bg-[#faf9f5] border-b border-[#e6dfd8]">
                          <div className="bg-white border border-[#e6dfd8] rounded-xl p-5 space-y-4 shadow-xs">
                            {/* Tab Switcher Internal */}
                            <div className="flex items-center gap-2 border-b border-[#e6dfd8] pb-3">
                              <button
                                onClick={() => setActiveTab("master")}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                                  activeTab === "master"
                                    ? "bg-[#cc785c] text-white"
                                    : "bg-[#efe9de] text-[#141413] hover:bg-[#e8e0d2]"
                                }`}
                              >
                                Variabel Master ({Object.keys(item.data).length})
                              </button>
                              <button
                                onClick={() => setActiveTab("perulangan")}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                                  activeTab === "perulangan"
                                    ? "bg-[#cc785c] text-white"
                                    : "bg-[#efe9de] text-[#141413] hover:bg-[#e8e0d2]"
                                }`}
                              >
                                Data Perulangan Anggota ({item.perulangan.length})
                              </button>
                            </div>

                            {/* View & Edit Variabel Master */}
                            {activeTab === "master" && (() => {
                              const masterKeys = sortKeys([
                                ...Object.keys(metadataMap).filter((k) => !k.startsWith("4")),
                                ...Object.keys(item.data),
                              ]);

                              return (
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <h4 className="text-xs font-bold text-[#141413] uppercase tracking-wider">
                                      Seluruh Variabel Data Master ({item.idDokumen}) — {masterKeys.length} Kolom
                                    </h4>
                                    <span className="text-[10px] text-[#6c6a64] font-medium">
                                      *Semua variabel ditampilkan (termasuk yang kosong). Ketik nilai baru &amp; klik simpan.
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-96 overflow-y-auto p-1 scrollbar-thin">
                                    {masterKeys.map((key) => {
                                      const meta = metadataMap[key];
                                      const rawVal = item.data[key];
                                      const fieldId = `${item.idDokumen}_${key}`;
                                      const displayVal = editingValues[fieldId] ?? (rawVal !== undefined && rawVal !== null ? String(rawVal) : "");
                                      const isSaving = savingKey === fieldId;
                                      const hasValue = rawVal !== undefined && rawVal !== null && String(rawVal).trim() !== "";

                                      return (
                                        <div
                                          key={key}
                                          className={`p-2.5 rounded-lg border space-y-1.5 transition-colors ${
                                            hasValue ? "border-[#e6dfd8] bg-[#faf9f5]" : "border-amber-200/60 bg-amber-50/30"
                                          }`}
                                        >
                                          <div className="flex items-center justify-between">
                                            <p className="text-[10px] font-bold text-[#cc785c] font-mono">{key}</p>
                                            <span
                                              className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                                                hasValue ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                                              }`}
                                            >
                                              {hasValue ? "Terisi" : "Kosong"}
                                            </span>
                                          </div>
                                          <p className="text-[11px] font-semibold text-[#141413] line-clamp-1" title={meta?.label || key}>
                                            {meta?.label || key}
                                          </p>
                                          <div className="flex items-center gap-1 pt-0.5">
                                            <input
                                              type="text"
                                              value={displayVal}
                                              onChange={(e) => setEditingValues((prev) => ({ ...prev, [fieldId]: e.target.value }))}
                                              placeholder="[Ketik nilai...]"
                                              className="w-full text-xs font-semibold text-[#141413] bg-white px-2 py-1 rounded border border-[#e6dfd8] focus:border-[#cc785c] focus:outline-none"
                                            />
                                            <button
                                              onClick={() => handleSaveVariable(item.idDokumen, null, key, displayVal)}
                                              disabled={isSaving}
                                              title="Simpan Nilai Variabel"
                                              className="px-2 py-1 rounded bg-[#cc785c] text-white hover:bg-[#a9583e] disabled:opacity-50 transition-colors text-xs font-bold shrink-0 cursor-pointer inline-flex items-center gap-1"
                                            >
                                              {isSaving ? (
                                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                              ) : (
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                              )}
                                            </button>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })()}

                            {/* View & Edit Data Perulangan */}
                            {activeTab === "perulangan" && (
                              <div className="space-y-3">
                                <h4 className="text-xs font-bold text-[#141413] uppercase tracking-wider">
                                  Anggota Keluarga (Terhubung via ID_Dokumen)
                                </h4>
                                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                                  {item.perulangan.map((p, pIdx) => {
                                    const perulanganKeys = sortKeys([
                                      ...Object.keys(metadataMap).filter((k) => k.startsWith("4") || k.startsWith("5")),
                                      ...Object.keys(p.data),
                                    ]);

                                    return (
                                      <div key={p.id} className="p-3.5 rounded-xl border border-[#e6dfd8] bg-[#faf9f5] space-y-3">
                                        <div className="flex items-center justify-between border-b border-[#e6dfd8] pb-2">
                                          <span className="text-xs font-bold text-[#141413]">
                                            Anggota Ke-{p.isianKe || pIdx + 1}: {p.namaKRT || item.namaKRT}
                                          </span>
                                          <span className="text-[10px] text-[#cc785c] font-mono font-bold">
                                            {perulanganKeys.length} Variabel Ditampilkan
                                          </span>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                          {perulanganKeys.map((pKey) => {
                                            const meta = metadataMap[pKey];
                                            const rawVal = p.data[pKey];
                                            const fieldId = `${p.id}_${pKey}`;
                                            const displayVal = editingValues[fieldId] ?? (rawVal !== undefined && rawVal !== null ? String(rawVal) : "");
                                            const isSaving = savingKey === fieldId;
                                            const hasValue = rawVal !== undefined && rawVal !== null && String(rawVal).trim() !== "";

                                            return (
                                              <div
                                                key={pKey}
                                                className={`p-2.5 rounded-lg border space-y-1 transition-colors ${
                                                  hasValue ? "border-[#e6dfd8] bg-white" : "border-amber-200/60 bg-amber-50/40"
                                                }`}
                                              >
                                                <div className="flex items-center justify-between">
                                                  <span className="text-[10px] font-bold text-[#cc785c] font-mono">{pKey}</span>
                                                  <span
                                                    className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                                                      hasValue ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                                                    }`}
                                                  >
                                                    {hasValue ? "Terisi" : "Kosong"}
                                                  </span>
                                                </div>
                                                <p className="text-[11px] font-semibold text-[#141413] line-clamp-1" title={meta?.label || pKey}>
                                                  {meta?.label || pKey}
                                                </p>
                                                <div className="flex items-center gap-1 pt-0.5">
                                                  <input
                                                    type="text"
                                                    value={displayVal}
                                                    onChange={(e) => setEditingValues((prev) => ({ ...prev, [fieldId]: e.target.value }))}
                                                    placeholder="[Kosong]"
                                                    className="w-full text-xs font-semibold text-[#141413] bg-[#faf9f5] px-2 py-1 rounded border border-[#e6dfd8] focus:border-[#cc785c] focus:outline-none"
                                                  />
                                                  <button
                                                    onClick={() => handleSaveVariable(item.idDokumen, p.id, pKey, displayVal)}
                                                    disabled={isSaving}
                                                    title="Simpan Perubahan"
                                                    className="px-2 py-1 rounded bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors text-xs font-bold shrink-0 cursor-pointer inline-flex items-center gap-1"
                                                  >
                                                    {isSaving ? (
                                                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                                    ) : (
                                                      <CheckCircle2 className="w-3.5 h-3.5" />
                                                    )}
                                                  </button>
                                                </div>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Pagination Controls ── */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#e6dfd8] bg-[#faf9f5]">
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1.5 rounded-lg border border-[#e6dfd8] bg-white text-xs font-bold text-[#141413] disabled:opacity-40 hover:bg-[#efe9de] transition-colors cursor-pointer inline-flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" /> Sebelumnya
          </button>
          <span className="text-xs text-[#6c6a64] font-semibold">
            Halaman {page} dari {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1.5 rounded-lg border border-[#e6dfd8] bg-white text-xs font-bold text-[#141413] disabled:opacity-40 hover:bg-[#efe9de] transition-colors cursor-pointer inline-flex items-center gap-1"
          >
            Selanjutnya <ChevronRight className="w-4 h-4 text-xs font-bold text-[#141413]" />
          </button>
        </div>
      </div>
    </div>
  );
}
