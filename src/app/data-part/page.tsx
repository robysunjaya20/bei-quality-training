
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toJpeg } from "html-to-image";
import * as XLSX from "xlsx";
import Navbar from "@/components/Navbar";

type Model =
  | "SU2ID LH"
  | "SU2ID RH"
  | "KS LH"
  | "KS RH"
  | "Engine Cover";

type PartRecord = {
  id: string;
  model: Model;
  partCode: string;
  stampDate: string;
  qty: number;
};

type FormData = {
  model: Model;
  suffix: string;
  stampDate: string;
  qty: string;
};

type Notification = {
  type: "success" | "error";
  message: string;
};

const STORAGE_KEY = "bei-quality-data-part";
const TITLE_KEY = "bei-quality-data-part-title";
const SUBTITLE_KEY = "bei-quality-data-part-subtitle";

const MODELS: { name: Model; prefix: string }[] = [
  { name: "SU2ID LH", prefix: "87610-I7" },
  { name: "SU2ID RH", prefix: "87620-I7" },
  { name: "KS LH", prefix: "87610-I6" },
  { name: "KS RH", prefix: "87620-I6" },
  { name: "Engine Cover", prefix: "29240-2M020" },
];

const MONTH_CODES: Record<number, string> = {
  0: "A",
  1: "B",
  2: "C",
  3: "D",
  4: "E",
  5: "F",
  6: "G",
  7: "H",
  8: "J",
  9: "K",
  10: "L",
  11: "M",
};

const emptyForm: FormData = {
  model: "SU2ID LH",
  suffix: "",
  stampDate: "",
  qty: "4",
};

function getStampCode(date: string): string {
  if (!date) return "";

  const [year, month, day] = date.split("-");
  const monthCode = MONTH_CODES[Number(month) - 1];

  if (!monthCode || !year || !day) return "";

  return `${monthCode}${day}${year.slice(-2)}`;
}

function getRecordTimestamp(record: PartRecord): number {
  const timestamp = Number(record.id.split("-")[0]);
  return Number.isFinite(timestamp) ? timestamp : 0;
}

export default function DataPartPage() {
  const [records, setRecords] = useState<PartRecord[]>([]);
  const [isReady, setIsReady] = useState(false);

  const [form, setForm] = useState<FormData>({ ...emptyForm });
  const [showAddModal, setShowAddModal] = useState(false);

  const [notification, setNotification] =
    useState<Notification | null>(null);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set()
  );

  const [search, setSearch] = useState("");
  const [filterModel, setFilterModel] = useState("All");

  // Date filters kosong secara default
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [tableTitle, setTableTitle] = useState("BEI QUALITY");
  const [tableSubtitle, setTableSubtitle] =
    useState("PART DATA RECORD");

  const [rowEditingId, setRowEditingId] = useState<string | null>(
    null
  );

  const [rowEditData, setRowEditData] = useState({
    partCode: "",
    stampDate: "",
    qty: "4",
  });

  const tableRef = useRef<HTMLDivElement>(null);

  // LOAD DATA
  useEffect(() => {
    try {
      const savedRecords = localStorage.getItem(STORAGE_KEY);

      if (savedRecords) {
        const parsed: PartRecord[] = JSON.parse(savedRecords);

        if (Array.isArray(parsed)) {
          setRecords(
            [...parsed].sort(
              (a, b) =>
                getRecordTimestamp(a) - getRecordTimestamp(b)
            )
          );
        }
      }

      const savedTitle = localStorage.getItem(TITLE_KEY);
      const savedSubtitle = localStorage.getItem(SUBTITLE_KEY);

      if (savedTitle !== null) setTableTitle(savedTitle);
      if (savedSubtitle !== null) setTableSubtitle(savedSubtitle);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setIsReady(true);
    }
  }, []);

  // SAVE RECORDS
  useEffect(() => {
    if (!isReady) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch (error) {
      console.error("Failed to save records:", error);
    }
  }, [records, isReady]);

  // SAVE TITLES
  useEffect(() => {
    if (!isReady) return;

    try {
      localStorage.setItem(TITLE_KEY, tableTitle);
      localStorage.setItem(SUBTITLE_KEY, tableSubtitle);
    } catch (error) {
      console.error("Failed to save titles:", error);
    }
  }, [tableTitle, tableSubtitle, isReady]);

  // SORT RECORDS
  const orderedRecords = useMemo(() => {
    return [...records].sort(
      (a, b) =>
        getRecordTimestamp(a) - getRecordTimestamp(b)
    );
  }, [records]);

  // SELECTED MODEL
  const selectedModel = MODELS.find(
    (item) => item.name === form.model
  );

  // PART CODE PREVIEW
  const partCode =
    form.model === "Engine Cover"
      ? "29240-2M020"
      : `${selectedModel?.prefix ?? ""}${form.suffix.toUpperCase()}`;

  // FILTER RECORDS
  const filteredRecords = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return orderedRecords.filter((record) => {
      const matchSearch =
        record.partCode.toLowerCase().includes(keyword) ||
        getStampCode(record.stampDate)
          .toLowerCase()
          .includes(keyword);

      const matchModel =
        filterModel === "All" || record.model === filterModel;

      const matchFrom =
        !dateFrom ||
        (record.stampDate !== "" && record.stampDate >= dateFrom);

      const matchTo =
        !dateTo ||
        (record.stampDate !== "" && record.stampDate <= dateTo);

      return matchSearch && matchModel && matchFrom && matchTo;
    });
  }, [orderedRecords, search, filterModel, dateFrom, dateTo]);

  // TOTAL QTY
  const totalQty = filteredRecords.reduce(
    (total, record) => total + record.qty,
    0
  );

  // RECORD NUMBER
  const getRecordNumber = (id: string) => {
    return (
      orderedRecords.findIndex(
        (record) => record.id === id
      ) + 1
    );
  };

  // NOTIFICATION
  const showNotification = (
    type: "success" | "error",
    message: string
  ) => {
    setNotification({ type, message });
  };

  // OPEN ADD MODAL
  const openAddModal = () => {
    setForm({ ...emptyForm });
    setNotification(null);
    setShowAddModal(true);
  };

  // CLOSE ADD MODAL
  const closeAddModal = () => {
    setShowAddModal(false);
    setForm({ ...emptyForm });
    setNotification(null);
  };

  // ADD DATA
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setNotification(null);

    const qty = Number(form.qty);

    if (!Number.isInteger(qty) || qty <= 0) {
      showNotification(
        "error",
        "Qty harus berupa bilangan bulat lebih dari 0."
      );
      return;
    }

    if (
      form.model !== "Engine Cover" &&
      !/^[A-Z0-9]{6}$/.test(form.suffix)
    ) {
      showNotification(
        "error",
        "Kode Part harus terdiri dari 6 karakter huruf atau angka."
      );
      return;
    }

    const newRecord: PartRecord = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      model: form.model,
      partCode,
      stampDate: form.stampDate,
      qty,
    };

    try {
      const updatedRecords = [...records, newRecord];

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedRecords)
      );

      setRecords(updatedRecords);

      showNotification(
        "success",
        `${newRecord.partCode} berhasil ditambahkan!`
      );
    } catch (error) {
      console.error("Failed to add data:", error);

      showNotification(
        "error",
        "Gagal menyimpan data. Periksa kapasitas penyimpanan browser."
      );
    }
  };

  // INLINE EDIT
  const startRowEdit = (record: PartRecord) => {
    setRowEditingId(record.id);

    setRowEditData({
      partCode: record.partCode,
      stampDate: record.stampDate,
      qty: String(record.qty),
    });
  };

  // SAVE EDIT
  const saveRowEdit = (id: string) => {
    const qty = Number(rowEditData.qty);
    const editedPartCode = rowEditData.partCode.trim().toUpperCase();

    if (!editedPartCode) {
      alert("Kode Part tidak boleh kosong.");
      return;
    }

    if (!Number.isInteger(qty) || qty <= 0) {
      alert("Qty harus berupa bilangan bulat lebih dari 0.");
      return;
    }

    const updatedRecords = records.map((record) =>
      record.id === id
        ? {
            ...record,
            partCode: editedPartCode,
            stampDate: rowEditData.stampDate,
            qty,
          }
        : record
    );

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedRecords)
      );

      setRecords(updatedRecords);
      setRowEditingId(null);
      showNotification("success", "Data berhasil diperbarui!");
    } catch (error) {
      console.error(error);
      showNotification("error", "Gagal memperbarui data.");
    }
  };

  // CANCEL EDIT
  const cancelRowEdit = () => {
    setRowEditingId(null);
  };

  // DELETE ONE
  const handleDelete = (id: string) => {
    const confirmed = window.confirm(
      "Apakah kamu yakin ingin menghapus data ini?"
    );

    if (!confirmed) return;

    const updatedRecords = records.filter(
      (record) => record.id !== id
    );

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedRecords)
      );

      setRecords(updatedRecords);

      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });

      if (rowEditingId === id) setRowEditingId(null);

      showNotification("success", "Data berhasil dihapus!");
    } catch (error) {
      console.error(error);
      showNotification("error", "Gagal menghapus data.");
    }
  };

  // SELECT / UNSELECT ONE
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  };

  // SELECT / UNSELECT ALL VISIBLE
  const allVisibleSelected =
    filteredRecords.length > 0 &&
    filteredRecords.every((record) =>
      selectedIds.has(record.id)
    );

  const toggleSelectAll = () => {
    const visibleIds = filteredRecords.map(
      (record) => record.id
    );

    setSelectedIds((prev) => {
      const next = new Set(prev);

      if (
        visibleIds.length > 0 &&
        visibleIds.every((id) => next.has(id))
      ) {
        visibleIds.forEach((id) => next.delete(id));
      } else {
        visibleIds.forEach((id) => next.add(id));
      }

      return next;
    });
  };

  // DELETE SELECTED
  const handleDeleteSelected = () => {
    if (selectedIds.size === 0) {
      showNotification(
        "error",
        "Pilih minimal satu data yang ingin dihapus."
      );
      return;
    }

    const confirmed = window.confirm(
      `Apakah kamu yakin ingin menghapus ${selectedIds.size} data yang dipilih?`
    );

    if (!confirmed) return;

    const selectedCount = selectedIds.size;

    const updatedRecords = records.filter(
      (record) => !selectedIds.has(record.id)
    );

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedRecords)
      );

      setRecords(updatedRecords);
      setSelectedIds(new Set());
      setRowEditingId(null);

      showNotification(
        "success",
        `${selectedCount} data berhasil dihapus!`
      );
    } catch (error) {
      console.error(error);
      showNotification(
        "error",
        "Gagal menghapus data yang dipilih."
      );
    }
  };

  // DELETE ALL
  const handleDeleteAll = () => {
    if (records.length === 0) {
      showNotification("error", "Tidak ada data untuk dihapus.");
      return;
    }

    const confirmed = window.confirm(
      `PERINGATAN!\n\nKamu akan menghapus seluruh ${records.length} data part.\n\nData yang dihapus tidak dapat dikembalikan. Lanjutkan?`
    );

    if (!confirmed) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));

      setRecords([]);
      setSelectedIds(new Set());
      setRowEditingId(null);

      showNotification(
        "success",
        "Seluruh Data Part berhasil dihapus!"
      );
    } catch (error) {
      console.error(error);
      showNotification(
        "error",
        "Gagal menghapus seluruh data."
      );
    }
  };

  // RESET FILTER
  const resetFilters = () => {
    setSearch("");
    setFilterModel("All");
    setDateFrom("");
    setDateTo("");
  };

  // EXPORT EXCEL
  const exportExcel = () => {
    if (filteredRecords.length === 0) {
      alert("Tidak ada data untuk diekspor.");
      return;
    }

    const data = filteredRecords.map((record) => ({
      No: getRecordNumber(record.id),
      "Kode Part": record.partCode,
      "Stamp Date": getStampCode(record.stampDate) || "",
      Qty: record.qty,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);

    worksheet["!cols"] = [
      { wch: 6 },
      { wch: 25 },
      { wch: 18 },
      { wch: 10 },
    ];

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Data Part"
    );

    XLSX.writeFile(
      workbook,
      `Data-Part-${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  };

  // EXPORT JPEG
  const exportJPEG = async () => {
    if (!tableRef.current || filteredRecords.length === 0) {
      alert("Tidak ada data untuk diekspor.");
      return;
    }

    const totalLabelCell =
      tableRef.current.querySelector<HTMLTableCellElement>(
        '[data-export-total-label="true"]'
      );

    const originalColSpan = totalLabelCell?.colSpan;

    try {
      // Kolom Selection dihilangkan saat export.
      if (totalLabelCell) {
        totalLabelCell.colSpan = 3;
      }

      const dataUrl = await toJpeg(tableRef.current, {
        quality: 0.95,
        backgroundColor: "#ffffff",
        pixelRatio: 2,
        filter: (node) =>
          !(
            node instanceof HTMLElement &&
            node.dataset.excludeExport === "true"
          ),
      });

      const link = document.createElement("a");

      link.download = `Data-Part-${new Date()
        .toISOString()
        .slice(0, 10)}.jpg`;

      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error(error);
      alert("Gagal mengekspor JPEG.");
    } finally {
      // Kembalikan colspan untuk tampilan tabel.
      if (totalLabelCell && originalColSpan !== undefined) {
        totalLabelCell.colSpan = originalColSpan;
      }
    }
  };

  return (
    <main className="min-h-screen bg-[#f6f7f9] text-[#0b1220]">
      <Navbar />

      {/* NOTIFICATION */}
      {notification && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed right-5 top-5 z-[200] flex w-[calc(100%-40px)] max-w-sm items-start gap-3 rounded-xl border bg-white p-4 shadow-xl ${
            notification.type === "success"
              ? "border-emerald-200"
              : "border-red-200"
          }`}
        >
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg font-bold ${
              notification.type === "success"
                ? "bg-emerald-100 text-emerald-600"
                : "bg-red-100 text-red-600"
            }`}
          >
            {notification.type === "success" ? "✓" : "!"}
          </div>

          <div className="min-w-0 flex-1">
            <p
              className={`text-sm font-bold ${
                notification.type === "success"
                  ? "text-emerald-700"
                  : "text-red-700"
              }`}
            >
              {notification.type === "success"
                ? "Berhasil!"
                : "Gagal!"}
            </p>

            <p className="mt-1 break-words text-xs leading-relaxed text-slate-600">
              {notification.message}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setNotification(null)}
            className="text-lg leading-none text-slate-400 hover:text-slate-700"
            aria-label="Tutup notifikasi"
          >
            ×
          </button>
        </div>
      )}

      <div className="mx-auto max-w-[1400px] space-y-7 px-6 pb-16 pt-8 lg:px-10">

        {/* SUMMARY */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Total Records
            </p>

            <h2 className="mt-2 text-3xl font-black text-slate-900">
              {records.length.toLocaleString("id-ID")}
            </h2>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Total Quantity
            </p>

            <h2 className="mt-2 text-3xl font-black text-blue-600">
              {totalQty.toLocaleString("id-ID")}
            </h2>
          </div>
        </div>

        {/* DATA TABLE SECTION */}
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

          {/* TOOLBAR */}
          <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-bold text-slate-900">
                  Data Part Record
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Edit, Delete, dan kelola data langsung melalui tabel.
                </p>
              </div>

              <div className="hidden flex-wrap gap-2 sm:flex">
                <button
                  type="button"
                  onClick={exportExcel}
                  disabled={!filteredRecords.length}
                  className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 disabled:opacity-40"
                >
                  ↓ Export Excel
                </button>

                <button
                  type="button"
                  onClick={exportJPEG}
                  disabled={!filteredRecords.length}
                  className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-xs font-bold text-blue-700 hover:bg-blue-100 disabled:opacity-40"
                >
                  ↓ Export JPEG
                </button>
              </div>
            </div>
          </div>

          {/* FILTER */}
          <div className="grid grid-cols-2 gap-3 border-b border-slate-100 bg-slate-50/70 p-4 sm:p-5 lg:grid-cols-4">

            {/* SEARCH */}
            <div>
              <label className="mb-2 block text-xs font-bold text-slate-600">
                Search Part Code / Stamp Code
              </label>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search code..."
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              />
            </div>

            {/* FILTER MODEL */}
            <div>
              <label className="mb-2 block text-xs font-bold text-slate-600">
                Filter Model
              </label>

              <select
                value={filterModel}
                onChange={(e) => setFilterModel(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              >
                <option value="All">All Models</option>

                {MODELS.map((item) => (
                  <option key={item.name} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            {/* DATE FROM */}
            <div>
              <label className="mb-2 block text-xs font-bold text-slate-600">
                Date From
              </label>

              <input
                type="date"
                value={dateFrom}
                max={dateTo || undefined}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              />
            </div>

            {/* DATE TO */}
            <div>
              <label className="mb-2 block text-xs font-bold text-slate-600">
                Date To
              </label>

              <input
                type="date"
                value={dateTo}
                min={dateFrom || undefined}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              />
            </div>

            {/* RESET FILTER & EXPORT MOBILE */}
            <div className="col-span-2 lg:col-span-4">
              <div className="flex flex-col items-start gap-3">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800"
                >
                  Reset All Filters
                </button>

                {/* EXPORT BUTTONS - MOBILE */}
                <div className="grid w-full grid-cols-2 gap-2 sm:hidden">
                  <button
                    type="button"
                    onClick={exportExcel}
                    disabled={!filteredRecords.length}
                    className="rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-2.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 disabled:opacity-40"
                  >
                    ↓ Export Excel
                  </button>

                  <button
                    type="button"
                    onClick={exportJPEG}
                    disabled={!filteredRecords.length}
                    className="rounded-lg border border-blue-200 bg-blue-50 px-2 py-2.5 text-xs font-bold text-blue-700 hover:bg-blue-100 disabled:opacity-40"
                  >
                    ↓ Export JPEG
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto p-4 sm:p-6">
            <div
              ref={tableRef}
              className="min-w-[900px] bg-white p-4 sm:p-5"
            >

              {/* TITLE + ACTION BUTTONS */}
              <div className="mb-5 flex flex-col gap-4 border-b-2 border-slate-900 pb-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <h3
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      setTableTitle(e.currentTarget.textContent || "")
                    }
                    className="cursor-text rounded-sm text-lg font-black text-slate-900 outline-none focus:bg-blue-50"
                    title="Klik untuk mengedit judul"
                  >
                    {tableTitle}
                  </h3>

                  <p
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      setTableSubtitle(e.currentTarget.textContent || "")
                    }
                    className="mt-1 cursor-text rounded-sm text-xs font-semibold tracking-widest text-slate-500 outline-none focus:bg-blue-50"
                    title="Klik untuk mengedit subjudul"
                  >
                    {tableSubtitle}
                  </p>
                </div>

                {/* ACTION BUTTONS */}
                <div
                  data-exclude-export="true"
                  className="flex flex-wrap items-center justify-end gap-2"
                >
                  <button
                    type="button"
                    onClick={handleDeleteSelected}
                    disabled={selectedIds.size === 0}
                    className="rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 text-xs font-bold text-orange-700 transition hover:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Delete Selected ({selectedIds.size})
                  </button>

                  <button
                    type="button"
                    onClick={handleDeleteAll}
                    disabled={records.length === 0}
                    className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Delete All
                  </button>

                  <button
                    type="button"
                    onClick={openAddModal}
                    title="Add Data Part"
                    aria-label="Add Data Part"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-900 text-xl font-bold leading-none text-white transition hover:bg-blue-600"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* DATA TABLE */}
              <table className="w-full table-fixed border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-slate-100 text-xs font-bold uppercase text-slate-700">
                    <th
                      data-exclude-export="true"
                      className="w-[38px] border border-slate-300 px-1 py-3 text-center"
                    >
                      <input
                        type="checkbox"
                        checked={allVisibleSelected}
                        onChange={toggleSelectAll}
                        className="h-3.5 w-3.5 cursor-pointer accent-blue-600"
                        title="Select All"
                      />
                    </th>

                    <th className="w-[55px] border border-slate-300 px-2 py-3 text-center">
                      No
                    </th>

                    <th className="border border-slate-300 px-3 py-3">
                      Kode Part
                    </th>

                    <th className="border border-slate-300 px-3 py-3">
                      Stamp Date
                    </th>

                    <th className="w-[90px] border border-slate-300 px-2 py-3 text-center">
                      Qty
                    </th>

                    <th
                      data-exclude-export="true"
                      className="w-[135px] border border-slate-300 px-2 py-3 text-center"
                    >
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {!isReady ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="border border-slate-200 px-4 py-8 text-center text-slate-400"
                      >
                        Loading data...
                      </td>
                    </tr>
                  ) : filteredRecords.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="border border-slate-200 px-4 py-12 text-center text-slate-400"
                      >
                        No data found.
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map((record) => {
                      const isEditing = rowEditingId === record.id;

                      return (
                        <tr key={record.id} className="text-slate-700">

                          {/* CHECKBOX */}
                          <td
                            data-exclude-export="true"
                            className="w-[38px] border border-slate-300 px-1 py-3 text-center"
                          >
                            <input
                              type="checkbox"
                              checked={selectedIds.has(record.id)}
                              onChange={() => toggleSelect(record.id)}
                              className="h-3.5 w-3.5 cursor-pointer accent-blue-600"
                            />
                          </td>

                          {/* NO */}
                          <td className="w-[55px] border border-slate-300 px-1.5 py-3 text-center text-xs">
                            {getRecordNumber(record.id)}
                          </td>

                          {/* PART CODE */}
                          <td className="border border-slate-300 px-3 py-2">
                            {isEditing ? (
                              <input
                                type="text"
                                value={rowEditData.partCode}
                                onChange={(e) =>
                                  setRowEditData((prev) => ({
                                    ...prev,
                                    partCode: e.target.value.toUpperCase(),
                                  }))
                                }
                                className="w-full min-w-[150px] rounded border border-blue-300 bg-blue-50 px-2 py-2 text-xs font-bold uppercase outline-none focus:ring-2 focus:ring-blue-200"
                              />
                            ) : (
                              <span className="break-all text-xs font-bold uppercase">
                                {record.partCode}
                              </span>
                            )}
                          </td>

                          {/* STAMP DATE */}
                          <td className="border border-slate-300 px-3 py-2">
                            {isEditing ? (
                              <div className="min-w-[130px]">
                                <input
                                  type="date"
                                  value={rowEditData.stampDate}
                                  onChange={(e) =>
                                    setRowEditData((prev) => ({
                                      ...prev,
                                      stampDate: e.target.value,
                                    }))
                                  }
                                  className="w-full rounded border border-blue-300 bg-blue-50 px-2 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-200"
                                />

                                <p className="mt-1 text-xs font-bold text-blue-700">
                                  {getStampCode(rowEditData.stampDate) || "-"}
                                </p>
                              </div>
                            ) : (
                              <span className="text-xs font-bold">
                                {getStampCode(record.stampDate) || "-"}
                              </span>
                            )}
                          </td>

                          {/* QTY */}
                          <td className="w-[90px] border border-slate-300 px-2 py-2 text-center">
                            {isEditing ? (
                              <input
                                type="number"
                                min="1"
                                step="1"
                                value={rowEditData.qty}
                                onChange={(e) =>
                                  setRowEditData((prev) => ({
                                    ...prev,
                                    qty: e.target.value,
                                  }))
                                }
                                className="w-full rounded border border-blue-300 bg-blue-50 px-1 py-2 text-center text-xs font-bold outline-none focus:ring-2 focus:ring-blue-200"
                              />
                            ) : (
                              <span className="text-xs font-bold">
                                {record.qty.toLocaleString("id-ID")}
                              </span>
                            )}
                          </td>

                          {/* ACTION */}
                          <td
                            data-exclude-export="true"
                            className="w-[135px] border border-slate-300 px-1.5 py-2"
                          >
                            <div className="flex items-center justify-center gap-1">
                              {isEditing ? (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => saveRowEdit(record.id)}
                                    className="rounded bg-emerald-600 px-2 py-1.5 text-[10px] font-bold text-white hover:bg-emerald-700"
                                  >
                                    Save
                                  </button>

                                  <button
                                    type="button"
                                    onClick={cancelRowEdit}
                                    className="rounded border border-slate-300 px-2 py-1.5 text-[10px] font-bold text-slate-600 hover:bg-slate-100"
                                  >
                                    Cancel
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => startRowEdit(record)}
                                    disabled={rowEditingId !== null}
                                    className="rounded border border-blue-200 bg-blue-50 px-2 py-1.5 text-[10px] font-bold text-blue-700 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-40"
                                  >
                                    Edit
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleDelete(record.id)}
                                    disabled={rowEditingId !== null}
                                    className="rounded border border-red-200 bg-red-50 px-2 py-1.5 text-[10px] font-bold text-red-600 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40"
                                  >
                                    Delete
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>

                {filteredRecords.length > 0 && (
                  <tfoot>
                    <tr className="bg-slate-100 font-black text-slate-900">
                      <td
                        data-export-total-label="true"
                        colSpan={4}
                        className="border border-slate-300 px-3 py-3 text-right text-xs"
                      >
                        TOTAL QTY
                      </td>

                      <td className="w-[90px] border border-slate-300 px-2 py-3 text-center text-xs">
                        {totalQty.toLocaleString("id-ID")}
                      </td>

                      <td
                        data-exclude-export="true"
                        className="w-[135px] border border-slate-300 px-2 py-3"
                      />
                    </tr>
                  </tfoot>
                )}
              </table>

              <p className="mt-4 text-[10px] text-slate-400">
                OQC - Data Part Management
              </p>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <p className="pb-5 text-center text-xs text-slate-400">
          Data Part Management · by Roby S
        </p>
      </div>

      {/* ADD DATA MODAL */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              closeAddModal();
            }
          }}
        >
          <div className="w-full max-w-xl overflow-hidden rounded-xl bg-white shadow-2xl">

            {/* MODAL HEADER */}
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="text-lg font-black text-slate-900">
                  Add Data Part
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Masukkan informasi part baru.
                </p>
              </div>

              <button
                type="button"
                onClick={closeAddModal}
                aria-label="Close modal"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                ×
              </button>
            </div>

            {/* MODAL FORM */}
            <form
              onSubmit={handleSubmit}
              className="max-h-[80vh] space-y-5 overflow-y-auto p-5"
            >

              {/* MODEL */}
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Model Part
                </label>

                <select
                  value={form.model}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      model: e.target.value as Model,
                      suffix: "",
                    }))
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none focus:border-blue-500"
                >
                  {MODELS.map((item) => (
                    <option key={item.name} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* PART CODE */}
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Kode Part
                </label>

                {form.model === "Engine Cover" ? (
                  <input
                    type="text"
                    value="29240-2M020"
                    readOnly
                    className="w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-3 text-sm font-bold text-slate-700"
                  />
                ) : (
                  <div className="flex overflow-hidden rounded-lg border border-slate-200 focus-within:border-blue-500">
                    <div className="flex shrink-0 items-center bg-slate-100 px-3 text-sm font-bold text-slate-600">
                      {selectedModel?.prefix}
                    </div>

                    <input
                      type="text"
                      value={form.suffix}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          suffix: e.target.value
                            .toUpperCase()
                            .replace(/[^A-Z0-9]/g, "")
                            .slice(0, 6),
                        }))
                      }
                      maxLength={6}
                      placeholder="010NB9"
                      required
                      className="min-w-0 w-full px-3 py-3 text-sm font-bold uppercase outline-none"
                    />
                  </div>
                )}

                <p className="mt-1 text-xs text-slate-400">
                  {form.model === "Engine Cover"
                    ? "Kode part otomatis."
                    : "Masukkan 6 karakter huruf atau angka."}
                </p>
              </div>

              {/* STAMP DATE */}
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Stamp Date
                </label>

                <input
                  type="date"
                  value={form.stampDate}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      stampDate: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none focus:border-blue-500"
                />

                <p className="mt-2 text-xs text-slate-500">
                  Stamp Code:{" "}
                  <span className="font-bold text-blue-700">
                    {getStampCode(form.stampDate) || "-"}
                  </span>
                  {" · "}
                </p>
              </div>

              {/* QTY */}
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Qty
                </label>

                <input
                  type="number"
                  min="1"
                  step="1"
                  value={form.qty}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      qty: e.target.value,
                    }))
                  }
                  required
                  className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none focus:border-blue-500"
                />
              </div>

              {/* PREVIEW */}
              <div className="rounded-lg border border-blue-100 bg-blue-50 p-3">
                <p className="text-xs font-bold uppercase text-blue-600">
                  Preview
                </p>

                <div className="mt-2 grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-slate-500">
                      Kode Part
                    </p>

                    <p className="mt-1 break-all text-sm font-black text-slate-900">
                      {partCode}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Stamp Code
                    </p>

                    <p className="mt-1 text-sm font-black text-blue-700">
                      {getStampCode(form.stampDate) || "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* MODAL BUTTONS */}
              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={closeAddModal}
                  className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50"
                >
                  Close
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-600"
                >
                  + Add Data Part
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
