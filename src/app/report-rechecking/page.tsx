'use client';
import { useEffect, useMemo, useState } from 'react';
import Navbar from '@/components/Navbar';
import { Activity, CheckCircle2, ClipboardList, Download, ExternalLink, FileSpreadsheet, FolderOpen, History, LoaderCircle, MessageCircle, Plus, Search, Trash2, X, } from 'lucide-react';
import { createReport, bufferToBase64 } from '@/lib/rechecking-excel';
import { getHistory, postAction, configured } from '@/lib/rechecking-api';
import { MODEL_PREFIX, type InspectionRecord, type Model, } from '@/lib/rechecking-types';
import "./report-rechecking.css";

type InspectionItem = {
    model: Model;
    partNumber: string;
    sampleQty: number;
    ngQty: number;
    totalQty: number;
    detailNg: string;
};
type HistoryRecord = InspectionRecord & {
    items?: InspectionItem[];
};
const models: Model[] = [
    'SU2ID LH',
    'SU2ID RH',
    'KS LH',
    'KS RH',
    'Cover Engine',
];
const COVER_ENGINE_PART_NUMBER = '29240-2M020';
function getFullPartNumber(model: Model, partNumber: string): string {
    if (model === 'Cover Engine') {
        return COVER_ENGINE_PART_NUMBER;
    }
    return `${MODEL_PREFIX[model]}${partNumber}`;
}
const MAX_ITEMS = 20;
const DRAFT_STORAGE_KEY = 'rechecking-fg-inspection-draft';
const today = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
const id = () => `RFG-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
const fmt = (v: string) => v
    ? new Date(`${v}T00:00:00`).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    })
    : '-';
const createEmptyItem = (): InspectionItem => ({
    model: 'SU2ID LH',
    partNumber: '',
    sampleQty: 0,
    ngQty: 0,
    totalQty: 0,
    detailNg: 'Check 100%',
});
export default function Home() {
    const [tab, setTab] = useState<'form' | 'history'>('form');
    const [inspector, setInspector] = useState('');
    const [inspectionDate, setInspectionDate] = useState(today());
    const [inspectionLine, setInspectionLine] = useState<'LH' | 'RH'>('LH');
    const [shift, setShift] = useState<'1' | '2' | '3'>('1');
    const [items, setItems] = useState<InspectionItem[]>([
        createEmptyItem(),
    ]);
    const [records, setRecords] = useState<HistoryRecord[]>([]);
    const [search, setSearch] = useState('');
    const [filterStartDate, setFilterStartDate] = useState('');
    const [filterEndDate, setFilterEndDate] = useState('');
    const [filterShift, setFilterShift] = useState('');
    const [filterLine, setFilterLine] = useState('');
    const [filterModel, setFilterModel] = useState('');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [notice, setNotice] = useState('');
    const [successModal, setSuccessModal] = useState(false);
    const [successFilename, setSuccessFilename] = useState('');
    const [pendingShareFile, setPendingShareFile] = useState<File | null>(null);
    const [pendingShareText, setPendingShareText] = useState('');
    const [pendingShareName, setPendingShareName] = useState('');
    const [pendingShareUrl, setPendingShareUrl] = useState('');
    const [preparingShare, setPreparingShare] = useState(false);
    const [shareModal, setShareModal] = useState(false);
    const [confirm, setConfirm] = useState<'one' | 'all' | null>(null);
    const [selected, setSelected] = useState<HistoryRecord | null>(null);
    // Menandai bahwa proses pemulihan draft sudah selesai.
    const [draftHydrated, setDraftHydrated] = useState(false);
    const totalOk = useMemo(() => items.reduce((sum, item) => sum + Number(item.sampleQty || 0), 0), [items]);
    const totalNg = useMemo(() => items.reduce((sum, item) => sum + Number(item.ngQty || 0), 0), [items]);
    const total = totalOk + totalNg;
    const filtered = useMemo(() => records.filter((r) => {
        const historyItems = r.items || [];
        const itemModels = historyItems.map((item) => item.model);
        const itemPartNumbers = historyItems.map((item) => item.partNumber);
        const modelsToSearch = itemModels.length ? itemModels : [r.model];
        const partsToSearch = itemPartNumbers.length ? itemPartNumbers : [r.partNumber];
        const searchable = [r.inspector, r.inspectionDate, r.model, r.partNumber, ...modelsToSearch, ...partsToSearch]
            .filter(Boolean).join(' ').toLowerCase();
        return (searchable.includes(search.trim().toLowerCase()) &&
            (!filterStartDate || r.inspectionDate >= filterStartDate) &&
            (!filterEndDate || r.inspectionDate <= filterEndDate) &&
            (!filterShift || String(r.shift) === filterShift) &&
            (!filterLine || r.inspectionLine === filterLine) &&
            (!filterModel || modelsToSearch.some((model) => model === filterModel)));
    }), [records, search, filterStartDate, filterEndDate, filterShift, filterLine, filterModel]);
    function resetHistoryFilters() {
        setSearch('');
        setFilterStartDate('');
        setFilterEndDate('');
        setFilterShift('');
        setFilterLine('');
        setFilterModel('');
    }
    async function refresh() {
        if (!configured())
            return;
        setLoading(true);
        setError('');
        try {
            const data = await getHistory();
            setRecords(data);
        }
        catch (e) {
            setError(e instanceof Error
                ? e.message
                : 'Gagal memuat data History.');
        }
        finally {
            setLoading(false);
        }
    }
    // Pulihkan draft ketika halaman dibuka atau di-refresh.
    useEffect(() => {
        try {
            const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
            if (savedDraft) {
                const draft = JSON.parse(savedDraft);
                setInspector(typeof draft.inspector === 'string' ? draft.inspector : '');
                setInspectionDate(typeof draft.inspectionDate === 'string' ? draft.inspectionDate : today());
                setInspectionLine(draft.inspectionLine === 'RH' ? 'RH' : 'LH');
                setShift(['1', '2', '3'].includes(String(draft.shift)) ? String(draft.shift) as '1' | '2' | '3' : '1');
                if (Array.isArray(draft.items) && draft.items.length > 0) {
                    const restoredItems: InspectionItem[] = draft.items.slice(0, MAX_ITEMS).map((item: Partial<InspectionItem>) => ({
                        model: models.includes(item.model as Model) ? item.model as Model : 'SU2ID LH',
                        partNumber: typeof item.partNumber === 'string' ? item.partNumber : '',
                        sampleQty: Number.isFinite(Number(item.sampleQty)) ? Number(item.sampleQty) : 0,
                        ngQty: Number.isFinite(Number(item.ngQty)) ? Number(item.ngQty) : 0,
                        totalQty: Number.isFinite(Number(item.totalQty)) ? Number(item.totalQty) : 0,
                        detailNg: typeof item.detailNg === 'string' ? item.detailNg : 'Check 100%',
                    }));
                    setItems(restoredItems.length ? restoredItems : [createEmptyItem()]);
                }
            }
        }
        catch (draftError) {
            console.error('Gagal memulihkan draft Rechecking FG:', draftError);
        }
        finally {
            setDraftHydrated(true);
        }
    }, []);
    // Simpan perubahan form secara otomatis ke browser.
    useEffect(() => {
        if (!draftHydrated)
            return;
        const draft = {
            inspector,
            inspectionDate,
            inspectionLine,
            shift,
            items,
            updatedAt: new Date().toISOString(),
        };
        try {
            localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
        }
        catch (draftError) {
            console.error('Gagal menyimpan draft Rechecking FG:', draftError);
        }
    }, [draftHydrated, inspector, inspectionDate, inspectionLine, shift, items]);
    useEffect(() => {
        if (configured()) {
            refresh();
        }
    }, []);
    function addItem() {
        setError('');
        if (items.length >= MAX_ITEMS) {
            setError(`Maksimal ${MAX_ITEMS} Inspection Item sesuai kapasitas template Excel.`);
            return;
        }
        setItems((prev) => {
            const previousItem = prev[prev.length - 1] ?? createEmptyItem();
            return [
                ...prev,
                {
                    model: previousItem.model,
                    partNumber: previousItem.model === 'Cover Engine'
                        ? COVER_ENGINE_PART_NUMBER
                        : previousItem.partNumber,
                    sampleQty: 0,
                    ngQty: 0,
                    totalQty: 0,
                    detailNg: 'Check 100%',
                },
            ];
        });
    }
    function changeItemModel(index: number, model: Model) {
        setItems((prev) => prev.map((item, i) => {
            if (i !== index)
                return item;
            return {
                ...item,
                model,
                partNumber: model === 'Cover Engine'
                    ? COVER_ENGINE_PART_NUMBER
                    : item.model === 'Cover Engine'
                        ? ''
                        : item.partNumber,
            };
        }));
        setError('');
    }
    function removeItem(index: number) {
        setError('');
        if (items.length <= 1) {
            setError('Minimal harus ada satu Inspection Item.');
            return;
        }
        setItems((prev) => prev.filter((_, i) => i !== index));
    }
    function updateItem<K extends keyof InspectionItem>(index: number, field: K, value: InspectionItem[K]) {
        setItems((prev) => prev.map((item, i) => {
            if (i !== index)
                return item;
            const updated = {
                ...item,
                [field]: value,
            };
            return {
                ...updated,
                totalQty: Number(updated.sampleQty) +
                    Number(updated.ngQty),
            };
        }));
    }
    function reset() {
        setInspector('');
        setInspectionDate(today());
        setInspectionLine('LH');
        setShift('1');
        setItems([
            createEmptyItem(),
        ]);
        setError('');
    }
    async function generate() {
        setError('');
        setNotice('');
        if (!configured()) {
            setError('Integrasi Google belum dikonfigurasi. Periksa NEXT_PUBLIC_GAS_REPORT_RECHECKING.');
            return;
        }
        if (!inspector.trim() || !inspectionDate) {
            setError('Lengkapi Inspector Name dan Inspection Date.');
            return;
        }
        if (items.length === 0 || items.length > MAX_ITEMS) {
            setError(`Jumlah Inspection Item harus antara 1 sampai ${MAX_ITEMS}.`);
            return;
        }
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const partNumber = item.partNumber.trim().toUpperCase();
            if (item.model !== 'Cover Engine' &&
                !/^\d{3}[A-Z0-9]{3}$/.test(partNumber)) {
                setError(`Part Number Item ${i + 1} harus terdiri dari 6 karakter. Contoh: 020NB9.`);
                return;
            }
            if (!Number.isInteger(Number(item.sampleQty)) ||
                !Number.isInteger(Number(item.ngQty)) ||
                Number(item.sampleQty) < 0 ||
                Number(item.ngQty) < 0) {
                setError(`SAMPLE QTY dan NG pada Item ${i + 1} harus berupa bilangan bulat positif atau nol.`);
                return;
            }
        }
        setSaving(true);
        try {
            const reportItems = items.map((item) => ({
                ...item,
                partNumber: item.model === 'Cover Engine'
                    ? COVER_ENGINE_PART_NUMBER
                    : item.partNumber.trim().toUpperCase(),
                sampleQty: Number(item.sampleQty),
                ngQty: Number(item.ngQty),
                totalQty: Number(item.sampleQty) + Number(item.ngQty),
            }));
            const firstItem = reportItems[0];
            const totalSampleQty = reportItems.reduce((sum, item) => sum + item.sampleQty, 0);
            const totalNgQty = reportItems.reduce((sum, item) => sum + item.ngQty, 0);
            const totalInspectionQty = totalSampleQty + totalNgQty;
            const combinedDetailNg = reportItems
                .map((item, index) => item.detailNg.trim() ? `Item ${index + 1}: ${item.detailNg.trim()}` : '')
                .filter(Boolean)
                .join('; ');
            const reportPayload = {
                inspector: inspector.trim(),
                inspectionDate,
                inspectionLine,
                inspectionLot: '',
                shift,
                items: reportItems,
                model: firstItem.model,
                partNumber: firstItem.partNumber,
                sampleQty: totalSampleQty,
                ngQty: totalNgQty,
                totalQty: totalInspectionQty,
                detailNg: combinedDetailNg,
            };
            const { buffer, filename } = await createReport(reportPayload);
            const base64 = bufferToBase64(buffer);
            const recordId = id();
            const result = await postAction({
                action: 'save',
                record: {
                    ...reportPayload,
                    id: recordId,
                },
                filename,
                base64,
            });
            if (!result?.ok) {
                throw new Error(result?.error || 'Gagal menyimpan laporan ke Google Drive.');
            }
        
            try {
                localStorage.removeItem(DRAFT_STORAGE_KEY);
            }
            catch (draftError) {
                console.error('Gagal menghapus draft:', draftError);
            }
            setSuccessFilename(filename);
            reset();
            setSuccessModal(true);
        }
        catch (e) {
            setError(e instanceof Error ? e.message : 'Gagal membuat laporan.');
        }
        finally {
            setSaving(false);
        }
    }
    async function deleteOne() {
        if (!selected)
            return;
        setLoading(true);
        setError('');
        try {
            await postAction({
                action: 'delete',
                id: selected.id,
            });
            setRecords((prev) => prev.filter((x) => x.id !== selected.id));
            setNotice('Data History berhasil dihapus. File Excel di Google Drive tetap tersimpan.');
            setSelected(null);
            setConfirm(null);
        }
        catch (e) {
            setError(e instanceof Error
                ? e.message
                : 'Gagal menghapus History.');
        }
        finally {
            setLoading(false);
        }
    }
    async function deleteAll() {
        setLoading(true);
        setError('');
        try {
            await postAction({
                action: 'deleteAll',
            });
            setRecords([]);
            setNotice('Seluruh History berhasil dihapus. Semua file Excel di Google Drive tetap tersimpan.');
            setConfirm(null);
        }
        catch (e) {
            setError(e instanceof Error
                ? e.message
                : 'Gagal menghapus seluruh History.');
        }
        finally {
            setLoading(false);
        }
    }
    async function share(r: HistoryRecord) {
        if (!r.fileId) {
            setError('File Excel tidak ditemukan. Periksa data fileId pada History.');
            return;
        }
        setError('');
        setNotice('');
        setPreparingShare(true);
        const itemDetails = (r.items || [])
            .map((item, index) => `${index + 1}. ${item.model}\n` +
            `Part Number: ${getFullPartNumber(item.model, item.partNumber)}\n` +
            `SAMPLE QTY: ${item.sampleQty}\n` +
            `NG: ${item.ngQty}\n` +
            `Total Qty: ${item.totalQty}`)
            .join('\n\n');
        const msg = `LAPORAN RECHECKING FG Shift: ${r.shift}\n\n` +
            `Inspector: ${r.inspector}\n` +
            `Inspection Line: ${r.inspectionLine}\n` +
            `Total Sample QTY: ${r.sampleQty}\n` +
            `Total NG: ${r.ngQty}\n` +
            `Total QTY: ${r.totalQty}\n\n` +
            `Download File Excel: https://drive.google.com/uc?export=download&id=${r.fileId}`;
        try {
            const filename = `${(r.inspector || 'Rechecking-FG').replace(/[\\/:*?"<>|]/g, '-')}-${r.inspectionDate || 'Report'}.xlsx`;
            const params = new URLSearchParams({ fileId: r.fileId, filename });
            const response = await fetch(`/api/excel-download?${params.toString()}`, {
                cache: 'no-store',
            });
            if (!response.ok) {
                const message = await response.text();
                throw new Error(message || 'Gagal mengambil file Excel dari Google Drive.');
            }
            const blob = await response.blob();
            if (!blob.size)
                throw new Error('File Excel yang diterima kosong.');
            const excelFile = new File([blob], filename, {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
            setPendingShareFile(excelFile);
            setPendingShareText(msg);
            setPendingShareName(filename);
            setPendingShareUrl(`/api/excel-download?${params.toString()}`);
            setShareModal(true);
        }
        catch (e) {
            setError(e instanceof Error ? e.message : 'Gagal menyiapkan file Excel.');
        }
        finally {
            setPreparingShare(false);
        }
    }
    async function sendPreparedFile() {
        if (!pendingShareFile)
            return;
        setError('');
        setNotice('');
        const whatsappUrl = `https://web.whatsapp.com/send?text=${encodeURIComponent(pendingShareText)}`;
        const whatsappWindow = window.open('about:blank', '_blank');
        try {
            const objectUrl = URL.createObjectURL(pendingShareFile);
            const link = document.createElement('a');
            link.href = objectUrl;
            link.download = pendingShareFile.name;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.setTimeout(() => URL.revokeObjectURL(objectUrl), 10000);
            if (whatsappWindow) {
                whatsappWindow.location.href = whatsappUrl;
            }
            else {
                window.location.href = whatsappUrl;
            }
            setShareModal(false);
            setPendingShareFile(null);
        }
        catch (e) {
            if (whatsappWindow && !whatsappWindow.closed)
                whatsappWindow.close();
            setError(e instanceof Error ? e.message : 'Gagal mengunduh file Excel. Coba gunakan tombol Download pada History.');
        }
    }
    return (
      <main className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-5 py-7">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <div className="text-sm text-blue-700 font-semibold">
              QUALITY CONTROL / OQC
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mt-1 text-slate-900">
              Rechecking FG Inspection
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Buat laporan inspeksi dan kelola arsip Excel.
            </p>
          </div>
          <div className="flex gap-2">
            <button type="button" className={`btn ${tab === 'form'
            ? 'btn-primary'
            : 'btn-secondary'}`} onClick={() => setTab('form')}>
              <Plus size={16}/>
              Form Inspection
            </button>
            <button type="button" className={`btn ${tab === 'history'
            ? 'btn-primary'
            : 'btn-secondary'}`} onClick={() => {
            setTab('history');
            refresh();
        }}>
              <History size={16}/>
              History
              <span className="ml-1 inline-flex min-w-6 h-6 px-2 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                {records.length}
              </span>
            </button>
          </div>
        </div>
        {!configured() && (<div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            Integrasi Google belum dikonfigurasi.
            Tambahkan <b>NEXT_PUBLIC_GAS_REPORT_RECHECKING_URL</b> pada
            Environment Variables setelah deploy Apps Script.
          </div>)}
        {error && (<div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 flex items-start justify-between gap-3">
            <span>{error}</span>
            <button type="button" onClick={() => setError('')}>
              <X size={16}/>
            </button>
          </div>)}
        {notice && (<div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 flex items-start justify-between gap-3">
            <span className="flex gap-2">
              <CheckCircle2 size={17}/>
              {notice}
            </span>
            <button type="button" onClick={() => setNotice('')}>
              <X size={16}/>
            </button>
          </div>)}
        {tab === 'form' ? (<section className="grid lg:grid-cols-[minmax(0,1fr)_300px] gap-5">
            <div className="card p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-5">
                <ClipboardList className="text-blue-700"/>
                <h2 className="font-bold text-lg">
                  Inspection Information
                </h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">
                    Inspector Name *
                  </label>
                  <input className="field" placeholder="Nama inspector" value={inspector} onChange={(e) => setInspector(e.target.value)}/>
                </div>
                <div>
                  <label className="label">
                    Inspection Date *
                  </label>
                  <input type="date" className="field" value={inspectionDate} onChange={(e) => setInspectionDate(e.target.value)}/>
                </div>
                <div>
                  <label className="label">
                    Inspection Line *
                  </label>
                  <select className="field" value={inspectionLine} onChange={(e) => setInspectionLine(e.target.value as 'LH' | 'RH')}>
                    <option value="LH">LH</option>
                    <option value="RH">RH</option>
                  </select>
                </div>
                <div>
                  <label className="label">
                    Shift *
                  </label>
                  <select className="field" value={shift} onChange={(e) => setShift(e.target.value as '1' | '2' | '3')}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 border-t border-slate-100 pt-5">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                  <div>
                    <h3 className="font-bold text-lg">
                      A. Inspection Item
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Tambahkan item sesuai kebutuhan inspeksi.
                      Maksimal 20 item.
                    </p>
                  </div>
                  <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-3 py-2 rounded-lg">
                    {items.length} / {MAX_ITEMS} Items
                  </span>
                </div>
                <div className="space-y-4">
                  {items.map((item, index) => (<div key={index} className="rounded-xl border border-slate-200 p-4 bg-white">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-100 text-blue-700 font-bold text-sm">
                            {index + 1}
                          </span>
                          <h4 className="font-bold text-slate-800">
                            Inspection Item {index + 1}
                          </h4>
                        </div>
                        <button type="button" onClick={() => removeItem(index)} disabled={items.length === 1} className="flex items-center gap-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 px-3 py-2 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed">
                          <Trash2 size={15}/>
                          Hapus
                        </button>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="label">
                            Model *
                          </label>
                          <select className="field" value={item.model} onChange={(e) => changeItemModel(index, e.target.value as Model)}>
                            {models.map((m) => (<option key={m} value={m}>
                                {m}
                              </option>))}
                          </select>
                        </div>
                        <div>
                          <label className="label">
                            Part Number *
                          </label>
                          {item.model === 'Cover Engine' ? (<>
                              <input className="field font-mono font-bold bg-slate-100" value={COVER_ENGINE_PART_NUMBER} readOnly/>
                            </>) : (<>
                              <div className="flex items-center gap-2">
                                <div className="shrink-0 rounded-lg bg-slate-100 border border-slate-200 px-3 py-3 font-mono font-bold text-xs">
                                  {MODEL_PREFIX[item.model]}
                                </div>
                                <input className="field font-mono uppercase" maxLength={6} placeholder="020NB9" value={item.partNumber} onChange={(e) => updateItem(index, 'partNumber', e.target.value
                        .toUpperCase()
                        .replace(/[^A-Z0-9]/g, ''))}/>
                              </div>
                              <p className="text-xs text-slate-500 mt-1">
                                Masukkan 6 karakter: 3 kode produk + 3 kode warna.
                              </p>
                            </>)}
                        </div>
                        <div>
                          <label className="label">
                            SAMPLE QTY (OK) *
                          </label>
                          <input type="number" min="0" step="1" className="field" placeholder="0" value={item.sampleQty} onChange={(e) => updateItem(index, 'sampleQty', e.target.value === ''
                    ? 0
                    : Number(e.target.value))}/>
                        </div>
                        <div>
                          <label className="label">
                            NG *
                          </label>
                          <input type="number" min="0" step="1" className="field" placeholder="0" value={item.ngQty} onChange={(e) => updateItem(index, 'ngQty', e.target.value === ''
                    ? 0
                    : Number(e.target.value))}/>
                        </div>
                        <div>
                          <label className="label">
                            Total QTY (Otomatis)
                          </label>
                          <input className="field bg-slate-50 font-bold" readOnly value={item.totalQty}/>
                        </div>
                        <div>
                          <label className="label">
                            Detail NG
                          </label>
                          <textarea className="field min-h-12 resize-y" placeholder="Tuliskan detail defect / NG..." value={item.detailNg} onChange={(e) => updateItem(index, 'detailNg', e.target.value)}/>
                        </div>
                      </div>
                    </div>))}
                </div>
                <button type="button" onClick={addItem} disabled={items.length >= MAX_ITEMS} className="mt-4 w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-blue-300 text-blue-700 font-semibold px-5 py-3 hover:bg-blue-50 transition disabled:opacity-40 disabled:cursor-not-allowed">
                  <Plus size={18}/>
                  Tambah Inspection Item
                </button>
                <div className="mt-5 rounded-xl bg-slate-50 border border-slate-200 p-4">
                  <h4 className="font-bold text-sm mb-3">
                    Total QTY Summary
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <p className="text-xs text-slate-500">
                        Total Qty
                      </p>
                      <p className="text-xl font-bold text-blue-800">
                        {total}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">
                        SAMPLE QTY
                      </p>
                      <p className="text-xl font-bold text-emerald-700">
                        {totalOk}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">
                        Total NG
                      </p>
                      <p className="text-xl font-bold text-rose-700">
                        {totalNg}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
                <button type="button" className="btn btn-secondary" onClick={reset} disabled={saving}>
                  Reset Form
                </button>
                <button type="button" className="btn btn-primary" onClick={generate} disabled={saving}>
                  {saving ? (<>
                      <LoaderCircle size={16} className="animate-spin"/>
                      Menyimpan...
                    </>) : (<>
                      <FileSpreadsheet size={16}/>
                      Generate & Simpan Excel
                    </>)}
                </button>
              </div>
            </div>
            <aside className="space-y-4">
              <div className="card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Activity className="text-blue-700"/>
                  <h3 className="font-bold">
                    Inspection Summary
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-emerald-50 p-3">
                    <div className="text-xs text-emerald-700">
                      Total Sample QTY
                    </div>
                    <div className="text-2xl font-bold text-emerald-800">
                      {totalOk}
                    </div>
                  </div>
                  <div className="rounded-xl bg-rose-50 p-3">
                    <div className="text-xs text-rose-700">
                      Total NG
                    </div>
                    <div className="text-2xl font-bold text-rose-800">
                      {totalNg}
                    </div>
                  </div>
                </div>
                <div className="mt-3 rounded-xl bg-blue-50 p-3">
                  <div className="text-xs text-blue-700">
                    Total QTY
                  </div>
                  <div className="text-2xl font-bold text-blue-900">
                    {total}
                  </div>
                </div>
                <div className="mt-3 text-xs text-slate-500">
                  Jumlah Inspection Item: {items.length} / {MAX_ITEMS}
                </div>
              </div>
              <div className="card p-5">
                <h3 className="font-bold mb-3">
                  Report Configuration
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-500">
                      Template
                    </span>
                    <span className="font-medium">
                      OQC rev.3
                    </span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-500">
                      Prepared
                    </span>
                    <span className="font-medium">
                      {inspector || 'Inspector Name'}
                    </span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-500">
                      Inspection Item
                    </span>
                    <span className="font-medium">
                      {items.length} / {MAX_ITEMS}
                    </span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-500">
                      Format
                    </span>
                    <span className="font-medium">
                      .xlsx
                    </span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-500">
                      Auto Save
                    </span>
                    <span className="font-medium text-emerald-700">
                      Google Drive
                    </span>
                  </div>
                </div>
              </div>
            </aside>
          </section>) : (<section className="card p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div>
                <h2 className="font-bold text-lg">
                  History Inspection
                </h2>
                <p className="text-sm text-slate-500">
                  {records.length} laporan tersimpan di database.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" className="btn btn-secondary" onClick={refresh} disabled={loading}>
                  {loading ? (<LoaderCircle size={15} className="animate-spin"/>) : (<Activity size={15}/>)}
                  Refresh
                </button>
                <button type="button" className="btn btn-danger" disabled={!records.length || loading} onClick={() => setConfirm('all')}>
                  <Trash2 size={15}/>
                  Hapus Semua History
                </button>
              </div>
            </div>
            <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
                <div>
                  <label className="label">Dari Tanggal</label>
                  <input type="date" className="field" value={filterStartDate} max={filterEndDate || undefined} onChange={(e) => setFilterStartDate(e.target.value)}/>
                </div>
                <div>
                  <label className="label">Sampai Tanggal</label>
                  <input type="date" className="field" value={filterEndDate} min={filterStartDate || undefined} onChange={(e) => setFilterEndDate(e.target.value)}/>
                </div>
                <div>
                  <label className="label">Shift</label>
                  <select className="field" value={filterShift} onChange={(e) => setFilterShift(e.target.value)}>
                    <option value="">Semua Shift</option><option value="1">Shift 1</option><option value="2">Shift 2</option><option value="3">Shift 3</option>
                  </select>
                </div>
                <div>
                  <label className="label">Inspection Line</label>
                  <select className="field" value={filterLine} onChange={(e) => setFilterLine(e.target.value)}>
                    <option value="">Semua Line</option><option value="LH">LH</option><option value="RH">RH</option>
                  </select>
                </div>
                <div>
                  <label className="label">Model</label>
                  <select className="field" value={filterModel} onChange={(e) => setFilterModel(e.target.value)}>
                    <option value="">Semua Model</option>
                    {models.map((model) => <option key={model} value={model}>{model}</option>)}
                  </select>
                </div>
              </div>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <div className="relative min-w-0 flex-1">
                  <Search size={17} className="absolute left-3 top-3 text-slate-400"/>
                  <input className="field pl-10" placeholder="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Cari inspector, tanggal, model, atau part number..." value={search} onChange={(e) => setSearch(e.target.value)}/>
                </div>
                <button type="button" className="btn btn-secondary whitespace-nowrap" onClick={resetHistoryFilters}>
                  <X size={15}/> Reset Filter
                </button>
              </div>
              <p className="mt-3 text-sm font-medium text-slate-600">
                Menampilkan <span className="font-bold text-slate-900">{filtered.length}</span> dari <span className="font-bold text-slate-900">{records.length}</span> data histori.
              </p>
            </div>
            {loading ? (<div className="py-12 text-center text-slate-500">
                <LoaderCircle className="animate-spin mx-auto mb-2"/>
                Memuat data...
              </div>) : filtered.length === 0 ? (<div className="py-12 text-center text-slate-500">
                <History className="mx-auto mb-2" size={28}/>
                {records.length
                    ? 'Data tidak ditemukan.'
                    : 'Belum ada laporan yang tersimpan.'}
              </div>) : (<div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[950px]">
                  <thead>
                    <tr className="text-left text-xs text-slate-500 border-b">
                      <th className="py-3 pr-3">
                        INSPECTOR / FILE
                      </th>
                      <th className="py-3 pr-3">
                        INSPECTION DATE
                      </th>
                      <th className="py-3 pr-3">
                        INSPECTION ITEMS
                      </th>
                      <th className="py-3 pr-3">
                        SHIFT / LINE
                      </th>
                      <th className="py-3 pr-3">
                        OK / NG
                      </th>
                      <th className="py-3">
                        ACTIONS
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((r) => {
                    const historyItems = r.items && r.items.length > 0
                        ? r.items
                        : [];
                    return (<tr key={r.id} className="border-b border-slate-100 align-top">
                          <td className="py-4 pr-3">
                            <div className="font-semibold">
                              {r.inspector}
                            </div>
                            <div className="text-xs text-slate-500 mb-1">
                              {r.fileUrl ? (<a className="text-blue-700 hover:underline" href={r.fileUrl} target="_blank" rel="noreferrer">
                                  Buka file Excel{' '}
                                  <ExternalLink size={11} className="inline"/>
                                </a>) : ('File URL tidak tersedia')}
                            </div>
                            <div className="text-xs text-slate-400">
                              {historyItems.length || 1} Inspection Item
                            </div>
                          </td>
                          <td className="py-4 pr-3 whitespace-nowrap">
                            {fmt(r.inspectionDate)}
                          </td>
                          <td className="py-4 pr-3">
                            {historyItems.length > 0 ? (<div className="space-y-2">
                                {historyItems.map((item, index) => (<div key={index} className="text-xs">
                                    <div className="font-semibold">
                                      {index + 1}. {item.model}
                                    </div>
                                    <div className="font-mono text-slate-500">
                                      {getFullPartNumber(item.model, item.partNumber)}
                                    </div>
                                  </div>))}
                              </div>) : (<div>
                                <div>{r.model}</div>
                                <div className="font-mono text-xs text-slate-500">
                                  {getFullPartNumber(r.model, r.partNumber)}
                                </div>
                              </div>)}
                          </td>
                          <td className="py-4 pr-3 whitespace-nowrap">
                            {r.shift} / {r.inspectionLine}
                          </td>
                          <td className="py-4 pr-3 whitespace-nowrap">
                            <span className="text-emerald-700">
                              {r.sampleQty} OK
                            </span>
                            <span className="text-slate-300 mx-1">
                              /
                            </span>
                            <span className="text-rose-700">
                              {r.ngQty} NG
                            </span>
                            <div className="text-xs text-slate-400 mt-1">
                              Total: {r.totalQty}
                            </div>
                          </td>
                          <td className="py-4">
                            <div className="flex gap-1.5">
                              <button type="button" title="Lihat file" className="rounded-lg border p-2 hover:bg-slate-50" disabled={!r.fileUrl} onClick={() => window.open(r.fileUrl, '_blank', 'noopener,noreferrer')}>
                                <ExternalLink size={15}/>
                              </button>
                              <button type="button" title="Download Excel" className="rounded-lg border p-2 hover:bg-slate-50" disabled={!r.fileId} onClick={() => {
                            const filename = `${(r.inspector || 'Rechecking-FG').replace(/[\\/:*?"<>|]/g, '-')}-${r.inspectionDate || 'Report'}.xlsx`;
                            const params = new URLSearchParams({
                                fileId: r.fileId,
                                filename,
                            });
                            window.open(`/api/excel-download?${params.toString()}`, '_blank', 'noopener,noreferrer');
                        }}>
                                <Download size={15}/>
                              </button>
                              <button type="button" title="Buka folder" className="rounded-lg border p-2 hover:bg-slate-50" disabled={!r.folderUrl} onClick={() => window.open(r.folderUrl, '_blank', 'noopener,noreferrer')}>
                                <FolderOpen size={15}/>
                              </button>
                              <button type="button" title="Siapkan file untuk WhatsApp" className="rounded-lg border p-2 hover:bg-slate-50 text-emerald-700 disabled:opacity-50" disabled={preparingShare} onClick={() => share(r)}>
                                {preparingShare ? <LoaderCircle size={15} className="animate-spin"/> : <MessageCircle size={15}/>}
                              </button>
                              <button type="button" title="Hapus dari History" className="rounded-lg border p-2 hover:bg-rose-50 text-rose-700" onClick={() => {
                            setSelected(r);
                            setConfirm('one');
                        }}>
                                <Trash2 size={15}/>
                              </button>
                            </div>
                          </td>
                        </tr>);
                })}
                  </tbody>
                </table>
              </div>)}
          </section>)}
        <footer className="text-center text-xs text-slate-400 py-8">
          Rechecking FG Inspection System · Quality Control
        </footer>
      </div>
      {shareModal && pendingShareFile && (<div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="share-file-title">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
              <FileSpreadsheet size={30} className="text-emerald-700"/>
            </div>
            <div className="text-center">
              <h2 id="share-file-title" className="text-lg font-bold text-slate-900">File Excel Siap Dibagikan</h2>
              <p className="mt-2 text-sm text-slate-600">Tekan tombol di bawah. File Excel akan diunduh dan WhatsApp dibuka dengan teks laporan beserta link Google Drive. Lampirkan file Excel dari folder Downloads jika ingin mengirim dokumennya juga.</p>
              <div className="mt-4 rounded-lg bg-slate-50 p-3 text-left">
                <p className="break-all text-sm font-semibold text-slate-800">{pendingShareName}</p>
                <p className="mt-1 text-xs text-slate-500">Lampiran Excel (.xlsx)</p>
              </div>
              <a href={pendingShareUrl} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50" download={pendingShareName}>
                <Download size={16}/> Download File Excel
              </a>
              <button type="button" className="btn btn-primary mt-3 w-full justify-center" onClick={sendPreparedFile}>
                <MessageCircle size={16}/> Bagikan File ke WhatsApp
              </button>
              <button type="button" className="btn btn-secondary mt-2 w-full justify-center" onClick={() => { setShareModal(false); setPendingShareFile(null); setPendingShareUrl(''); }}>
                Batal
              </button>
            </div>
          </div>
        </div>)}
      {successModal && (<div className="fixed inset-0 z-[60] bg-slate-950/50 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="success-modal-title">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 size={34} className="text-emerald-600"/>
            </div>
            <div className="text-center">
              <h2 id="success-modal-title" className="text-xl font-bold text-slate-900">
                Proses Berhasil!
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Laporan Rechecking FG berhasil dibuat dan disimpan ke Google Drive.
              </p>
              {successFilename && (<div className="mt-4 rounded-lg bg-slate-50 px-3 py-2 text-left">
                  <p className="text-xs text-slate-500">Nama file:</p>
                  <p className="mt-1 break-all text-sm font-semibold text-slate-800">
                    {successFilename}
                  </p>
                </div>)}
              <p className="mt-4 text-xs text-slate-500">
                Buka menu History secara manual Untuk melihat laporan tersimpan.&#x20;
              </p>
              <button type="button" className="btn btn-primary mt-6 w-full justify-center" onClick={() => setSuccessModal(false)}>
                Tutup
              </button>
            </div>
          </div>
        </div>)}
      {confirm && (<div className="fixed inset-0 z-50 bg-slate-950/40 flex items-center justify-center p-4">
          <div className="card w-full max-w-md p-5">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg">
                {confirm === 'all'
                ? 'Hapus Semua History?'
                : 'Hapus History?'}
              </h3>
              <button type="button" onClick={() => {
                setConfirm(null);
                setSelected(null);
            }}>
                <X size={18}/>
              </button>
            </div>
            <p className="text-sm text-slate-600 mt-3">
              {confirm === 'all'
                ? 'Seluruh catatan History akan dihapus dari Google Sheets. File Excel di Google Drive tidak akan dihapus.'
                : 'Catatan ini akan dihapus dari History. File Excel di Google Drive tetap tersimpan.'}
            </p>
            <div className="flex justify-end gap-2 mt-5">
              <button type="button" className="btn btn-secondary" onClick={() => {
                setConfirm(null);
                setSelected(null);
            }}>
                Batal
              </button>
              <button type="button" className="btn btn-danger" onClick={confirm === 'all'
                ? deleteAll
                : deleteOne} disabled={loading}>
                {loading ? (<LoaderCircle size={15} className="animate-spin"/>) : (<Trash2 size={15}/>)}
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>)}
    </main>);
}
