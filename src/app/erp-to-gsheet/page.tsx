"use client";

import { ChangeEvent, DragEvent, useRef, useState } from "react";
import ExcelJS from "exceljs";
import {
    ArrowDownToLine,
    CheckCircle2,
    RefreshCw,
    ShieldCheck,
    UploadCloud,
    X,
} from "lucide-react";
import Navbar from "@/components/Navbar";

type OutputRow = {
    date: string;
    materialDesc: string;
    materialCode: string;
    materialModel: string;
    incomingQty: number | string;
    sampleQty: number | string;
    ngQty: number | string;
    defectName: string;
    inspectorName: string;
    customerName: string;
};

const OUTPUT_HEADERS = [
    "Date",
    "Material Desc",
    "Material Code",
    "Material Model",
    "Incoming/Inspection Qty",
    "Sample Qty",
    "NG Qty",
    "Defect Name",
    "Inspector Name",
    "Customer Name",
];

const HEADER_ALIASES: Record<keyof OutputRow, string[]> = {
    date: ["date"],
    materialDesc: ["material desc", "material description"],
    materialCode: ["material code", "material part code", "part code"],
    materialModel: ["material model", "model"],
    incomingQty: [
        "incoming/inspection qty",
        "incoming inspection qty",
        "inspection qty",
    ],
    sampleQty: ["sample qty", "sampling qty"],
    ngQty: ["ng qty", "reject qty"],
    defectName: ["defect name", "defect"],
    inspectorName: ["inspector name", "inspector"],
    customerName: ["customer name", "customer"],
};

const REQUIRED_KEYS: (keyof OutputRow)[] = [
    "date",
    "materialDesc",
    "materialCode",
    "materialModel",
    "incomingQty",
    "sampleQty",
    "ngQty",
    "defectName",
    "inspectorName",
    "customerName",
];

function normalizeHeader(value: unknown): string {
    return String(value ?? "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");
}

function cleanNumber(value: number): number {
    return Number(value.toFixed(6));
}

function normalizeQty(value: unknown): number | string {
    if (value === null || value === undefined || value === "") {
        return 0;
    }

    if (typeof value === "number") {
        return Number.isFinite(value)
            ? cleanNumber(Math.abs(value) >= 1000 ? value / 1000 : value)
            : "";
    }

    if (typeof value === "object" && value !== null && "result" in value) {
        return normalizeQty(
            (value as { result: unknown }).result
        );
    }

    let raw = String(value).trim();

    if (!raw) {
        return 0;
    }

    raw = raw.replace(/\s/g, "").replace(/[^\d,.-]/g, "");

    // Format Indonesia: titik sebagai pemisah ribuan, koma sebagai desimal.
    if (raw.includes(".") && raw.includes(",")) {
        raw = raw.replace(/\./g, "").replace(",", ".");
    } else if (raw.includes(",")) {
        raw = raw.replace(",", ".");
    } else if (/^-?\d{1,3}(\.\d{3})+$/.test(raw)) {
        // Contoh: 150.000 atau 1.250.000.
        raw = raw.replace(/\./g, "");
    }

    const parsed = Number(raw);

    if (!Number.isFinite(parsed)) {
        return String(value);
    }

    return cleanNumber(parsed / 1000);
}

function cellToText(value: unknown): string {
    if (value === null || value === undefined) {
        return "";
    }

    if (value instanceof Date) {
        const yyyy = value.getFullYear();
        const mm = String(value.getMonth() + 1).padStart(2, "0");
        const dd = String(value.getDate()).padStart(2, "0");

        return `${yyyy}-${mm}-${dd}`;
    }

    if (typeof value === "object") {
        if ("text" in value) {
            return String(
                (value as { text: unknown }).text ?? ""
            );
        }

        if ("result" in value) {
            return cellToText(
                (value as { result: unknown }).result
            );
        }

        if ("richText" in value) {
            return (
                (value as {
                    richText: { text: string }[];
                }).richText ?? []
            )
                .map((part) => part.text)
                .join("");
        }
    }

    return String(value).trim();
}

// Mengosongkan Defect Name jika nilainya NO DEFECT atau NO DEFFECT.
function normalizeDefectName(value: unknown): string {
    const text = cellToText(value).trim();

    if (/^NO\s+DEF{1,2}ECT$/i.test(text)) {
        return "";
    }

    return text;
}

// Menghilangkan desimal nol di belakang, misalnya 0.000 menjadi 0.
function normalizeNgQty(value: unknown): number | string {
    if (value === null || value === undefined || value === "") {
        return 0;
    }

    if (typeof value === "number") {
        return Number.isFinite(value) ? value : "";
    }

    if (typeof value === "object" && value !== null && "result" in value) {
        return normalizeNgQty(
            (value as { result: unknown }).result
        );
    }

    const text = cellToText(value).trim();

    if (!text) {
        return 0;
    }

    // Hanya menghapus bagian desimal jika seluruh digit setelah titik adalah nol.
    return text.replace(/(\.0+)$/, "");
}

const CUSTOMER_NAME_MAP: Record<string, string> = {
    "PT.HYUNDAI MOTOR MANUFACTURING INDONESIA": "HMMI",
    "PT.APM HYUNDAI TRANSYS INDONESIA": "AHTI",
    "PT.ROBERT BOSCH AUTOMOTIVE": "BOSCH",
    "PT.APM ARMADA AUTOPARTS": "AAA",
    "PT.DAECHANG AUTOMOTIVE INDONESIA": "DAECHANG",
};

function normalizeCustomerName(value: unknown): string {
    const customerName = cellToText(value)
        .replace(/\s+/g, " ")
        .trim();

    const normalized = customerName
        .toUpperCase()
        .replace(/^PT\.\s*/, "PT.");

    return CUSTOMER_NAME_MAP[normalized] ?? customerName;
}

function findHeaderRow(sheet: ExcelJS.Worksheet) {
    const scanLimit = Math.min(sheet.rowCount, 30);

    for (let rowNumber = 1; rowNumber <= scanLimit; rowNumber++) {
        const row = sheet.getRow(rowNumber);
        const values = row.values as unknown[];
        const normalized = values.map(normalizeHeader);

        const hasDate = normalized.includes("date");
        const hasMaterialCode = normalized.includes("material code");
        const hasDefect = normalized.includes("defect name");

        if (hasDate && hasMaterialCode && hasDefect) {
            return { rowNumber, row };
        }
    }

    return null;
}

function makeHeaderMap(headerRow: ExcelJS.Row) {
    const map: Partial<Record<keyof OutputRow, number>> = {};

    headerRow.eachCell((cell, columnNumber) => {
        const header = normalizeHeader(cell.value);

        (Object.keys(HEADER_ALIASES) as (keyof OutputRow)[]).forEach(
            (key) => {
                if (HEADER_ALIASES[key].includes(header)) {
                    map[key] = columnNumber;
                }
            }
        );
    });

    return map;
}

function getCell(row: ExcelJS.Row, column?: number): unknown {
    if (!column) {
        return "";
    }

    return row.getCell(column).value;
}

function formatDate(value: unknown): string {
    if (value instanceof Date) {
        return cellToText(value);
    }

    if (typeof value === "number") {
        // Konversi tanggal serial Excel.
        const date = new Date(
            Date.UTC(1899, 11, 30) + value * 86400000
        );

        return date.toISOString().slice(0, 10);
    }

    return cellToText(value);
}

function dateToTimestamp(value: string): number {
    const text = String(value ?? "").trim();

    if (!text) {
        return Number.POSITIVE_INFINITY;
    }

    let year: number;
    let month: number;
    let day: number;

    // Format YYYY-MM-DD.
    let match = text.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);

    if (match) {
        year = Number(match[1]);
        month = Number(match[2]);
        day = Number(match[3]);
    } else {
        // Format DD/MM/YYYY atau DD-MM-YYYY.
        match = text.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/);

        if (match) {
            day = Number(match[1]);
            month = Number(match[2]);
            year = Number(match[3]);
        } else {
            const parsed = new Date(text);

            return Number.isNaN(parsed.getTime())
                ? Number.POSITIVE_INFINITY
                : parsed.getTime();
        }
    }

    const timestamp = new Date(year, month - 1, day).getTime();
    const check = new Date(timestamp);

    // Tolak tanggal yang tidak valid, misalnya 31/02/2026.
    if (
        Number.isNaN(timestamp) ||
        check.getFullYear() !== year ||
        check.getMonth() !== month - 1 ||
        check.getDate() !== day
    ) {
        return Number.POSITIVE_INFINITY;
    }

    return timestamp;
}

async function parseWorkbook(file: File): Promise<OutputRow[]> {
    const workbook = new ExcelJS.Workbook();
    const buffer = await file.arrayBuffer();

    await workbook.xlsx.load(buffer);

    const worksheet = workbook.worksheets[0];

    if (!worksheet) {
        throw new Error("File Excel tidak memiliki worksheet.");
    }

    const header = findHeaderRow(worksheet);

    if (!header) {
        throw new Error(
            "Header tidak ditemukan. Pastikan file memiliki kolom Date, Material Code, dan Defect Name."
        );
    }

    const headerMap = makeHeaderMap(header.row);
    const missing = REQUIRED_KEYS.filter((key) => !headerMap[key]);

    if (missing.length) {
        const labels: Record<keyof OutputRow, string> = {
            date: "Date",
            materialDesc: "Material Desc",
            materialCode: "Material Code",
            materialModel: "Material Model",
            incomingQty: "Incoming/Inspection Qty",
            sampleQty: "Sample Qty",
            ngQty: "NG Qty",
            defectName: "Defect Name",
            inspectorName: "Inspector Name",
            customerName: "Customer Name",
        };

        throw new Error(
            `Kolom wajib tidak ditemukan: ${missing
                .map((key) => labels[key])
                .join(", ")}`
        );
    }

    const rows: OutputRow[] = [];

    for (
        let rowNumber = header.rowNumber + 1;
        rowNumber <= worksheet.rowCount;
        rowNumber++
    ) {
        const row = worksheet.getRow(rowNumber);

        const materialCode = cellToText(
            getCell(row, headerMap.materialCode)
        );
        const materialDesc = cellToText(
            getCell(row, headerMap.materialDesc)
        );

        // Abaikan baris yang tidak memiliki Material Code dan Material Desc.
        if (!materialCode && !materialDesc) {
            continue;
        }

        rows.push({
            date: formatDate(getCell(row, headerMap.date)),
            materialDesc,
            materialCode,
            materialModel: cellToText(
                getCell(row, headerMap.materialModel)
            ),
            incomingQty: normalizeQty(
                getCell(row, headerMap.incomingQty)
            ),
            sampleQty: normalizeQty(
                getCell(row, headerMap.sampleQty)
            ),
            ngQty: normalizeNgQty(
                getCell(row, headerMap.ngQty)
            ),
            defectName: normalizeDefectName(
                getCell(row, headerMap.defectName)
            ),
            inspectorName: cellToText(
                getCell(row, headerMap.inspectorName)
            ),
            customerName: normalizeCustomerName(
                getCell(row, headerMap.customerName)
            ),
        });
    }

    if (!rows.length) {
        throw new Error("Tidak ada baris data yang bisa dikonversi.");
    }

    const customerPriority: Record<string, number> = {
        AHTI: 1,
        DAECHANG: 2,
        AAA: 3,
        BOSCH: 4,
        HMMI: 5,
    };

    rows.sort((a, b) => {
        const dateDifference =
            dateToTimestamp(a.date) - dateToTimestamp(b.date);

        if (dateDifference !== 0) {
            return dateDifference;
        }

        return (
            (customerPriority[a.customerName] ?? 999) -
            (customerPriority[b.customerName] ?? 999)
        );
    });

    return rows;
}

function displayValue(value: string | number): string {
    if (typeof value === "number") {
        return new Intl.NumberFormat("id-ID", {
            maximumFractionDigits: 6,
        }).format(value);
    }

    return value;
}

export default function Home() {
    const inputRef = useRef<HTMLInputElement>(null);

    const [file, setFile] = useState<File | null>(null);
    const [rows, setRows] = useState<OutputRow[]>([]);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const [dragging, setDragging] = useState(false);
    const [sheetName] = useState("Converted Data");

    const previewRows = rows;

    async function processFile(selectedFile: File) {
        setError("");
        setRows([]);

        if (!selectedFile.name.toLowerCase().endsWith(".xlsx")) {
            setFile(null);
            setError(
                "Format belum didukung. Silakan upload file .xlsx (Excel Workbook)."
            );
            return;
        }

        setFile(selectedFile);
        setBusy(true);

        try {
            const result = await parseWorkbook(selectedFile);
            setRows(result);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Terjadi kesalahan saat membaca file."
            );
            setFile(null);
        } finally {
            setBusy(false);
        }
    }

    function onInputChange(event: ChangeEvent<HTMLInputElement>) {
        const selected = event.target.files?.[0];

        if (selected) {
            void processFile(selected);
        }

        event.target.value = "";
    }

    function onDrop(event: DragEvent<HTMLDivElement>) {
        event.preventDefault();
        setDragging(false);

        const selected = event.dataTransfer.files?.[0];

        if (selected) {
            void processFile(selected);
        }
    }

    async function downloadExcel() {
        if (!rows.length) {
            return;
        }

        const workbook = new ExcelJS.Workbook();

        workbook.creator = "Excel Converter";
        workbook.created = new Date();

        const worksheet = workbook.addWorksheet(sheetName);

        worksheet.columns = [
            { header: OUTPUT_HEADERS[0], key: "date", width: 14 },
            { header: OUTPUT_HEADERS[1], key: "materialDesc", width: 30 },
            { header: OUTPUT_HEADERS[2], key: "materialCode", width: 22 },
            { header: OUTPUT_HEADERS[3], key: "materialModel", width: 16 },
            { header: OUTPUT_HEADERS[4], key: "incomingQty", width: 24 },
            { header: OUTPUT_HEADERS[5], key: "sampleQty", width: 15 },
            { header: OUTPUT_HEADERS[6], key: "ngQty", width: 12 },
            { header: OUTPUT_HEADERS[7], key: "defectName", width: 20 },
            { header: OUTPUT_HEADERS[8], key: "inspectorName", width: 18 },
            { header: OUTPUT_HEADERS[9], key: "customerName", width: 42 },
        ];

        // Data sudah diurutkan dari tanggal terlama ke terbaru.
        rows.forEach((item) => {
            worksheet.addRow(item);
        });

        const headerRow = worksheet.getRow(1);
        headerRow.height = 25;

        headerRow.eachCell((cell) => {
            cell.font = {
                bold: true,
                color: { argb: "FFFFFFFF" },
            };

            cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FF173B67" },
            };

            cell.alignment = {
                vertical: "middle",
                horizontal: "center",
                wrapText: true,
            };

            cell.border = {
                bottom: {
                    style: "thin",
                    color: { argb: "FFCBD5E1" },
                },
            };
        });

        worksheet.views = [{ state: "frozen", ySplit: 1 }];
        worksheet.autoFilter = { from: "A1", to: "J1" };

        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) {
                return;
            }

            row.alignment = { vertical: "middle" };

            row.eachCell((cell) => {
                cell.border = {
                    bottom: {
                        style: "hair",
                        color: { argb: "FFE2E8F0" },
                    },
                };
            });
        });

        ["E", "F"].forEach((column) => {
            worksheet.getColumn(column).numFmt = "#,##0.######";
        });

        const buffer = await workbook.xlsx.writeBuffer();

        const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");

        anchor.href = url;
        anchor.download = `${
            file?.name.replace(/\.xlsx$/i, "") ?? "data"
        }_converted.xlsx`;

        anchor.click();

        // Beri waktu browser memulai download sebelum URL dilepas.
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    function reset() {
        setFile(null);
        setRows([]);
        setError("");

        if (inputRef.current) {
            inputRef.current.value = "";
        }
    }

    return (
        <>
            <Navbar />

            <main className="page-shell">
                <section className="hero">
                    <div className="eyebrow">DATA TRANSFORMATION TOOLS</div>

                    <h1>
                        Rapikan data ERP
                        <br />
                        <span>dalam hitungan detik.</span>
                    </h1>
                </section>

                <section className="workspace">
                    <div className="section-heading">
                        <div>
                            <h2>Upload file Excel</h2>
                            <p>
                                Upload file Excel dan konversi kolom secara
                                otomatis.
                            </p>
                        </div>

                        <span className="step-pill">STEP 01</span>
                    </div>

                    <div
                        className={`dropzone ${
                            dragging ? "dragging" : ""
                        } ${file ? "has-file" : ""}`}
                        onDragOver={(event) => {
                            event.preventDefault();
                            setDragging(true);
                        }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={onDrop}
                    >
                        <input
                            ref={inputRef}
                            type="file"
                            accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                            onChange={onInputChange}
                            hidden
                        />

                        {busy ? (
                            <div className="upload-content">
                                <div className="upload-icon spinning">
                                    <RefreshCw size={27} />
                                </div>

                                <strong>
                                    Membaca dan mengolah Excel...
                                </strong>

                                <span>Mohon tunggu sebentar.</span>
                            </div>
                        ) : file && rows.length ? (
                            <div className="upload-content">
                                <div className="upload-icon success">
                                    <CheckCircle2 size={28} />
                                </div>

                                <strong>{file.name}</strong>

                                <span>
                                    {rows.length.toLocaleString("id-ID")} baris
                                    data berhasil dibaca.
                                </span>

                                <div className="file-actions">
                                    <button
                                        className="secondary-button"
                                        onClick={() =>
                                            inputRef.current?.click()
                                        }
                                    >
                                        Ganti file
                                    </button>

                                    <button
                                        className="text-button"
                                        onClick={reset}
                                    >
                                        <X size={15} /> Hapus
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="upload-content">
                                <div className="upload-icon">
                                    <UploadCloud size={29} />
                                </div>

                                <strong>
                                    Drag &amp; drop file Excel di sini
                                </strong>

                                <span>atau pilih file dari komputer</span>

                                <button
                                    className="primary-button"
                                    onClick={() =>
                                        inputRef.current?.click()
                                    }
                                >
                                    Pilih file Excel
                                </button>

                                <small>
                                    Format .xlsx · Maksimum mengikuti batas
                                    memori browser
                                </small>
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="error-message">
                            <X size={17} /> {error}
                        </div>
                    )}

                    <div className="info-strip">
                        <ShieldCheck size={18} />
                        <span>
                            Data tidak dikirim ke server atau disimpan ke
                            database.
                        </span>
                    </div>
                </section>

                {rows.length > 0 && (
                    <section className="workspace preview-section">
                        <div className="section-heading">
                            <div>
                                <h2>Preview hasil</h2>
                                <p>
                                    Menampilkan {previewRows.length} dari{" "}
                                    {rows.length.toLocaleString("id-ID")} baris
                                    pertama. Urutan tanggal: paling lama ke
                                    paling baru; customer mengikuti prioritas.
                                </p>
                            </div>

                            <span className="step-pill">STEP 02</span>
                        </div>

                        <div className="table-wrap">
                            <table>
                                <thead>
                                    <tr>
                                        {OUTPUT_HEADERS.map((header) => (
                                            <th key={header}>{header}</th>
                                        ))}
                                    </tr>
                                </thead>

                                <tbody>
                                    {previewRows.map((row, index) => (
                                        <tr
                                            key={`${row.materialCode}-${index}`}
                                        >
                                            <td>{row.date}</td>
                                            <td>{row.materialDesc}</td>
                                            <td>{row.materialCode}</td>
                                            <td>{row.materialModel}</td>
                                            <td className="numeric">
                                                {displayValue(row.incomingQty)}
                                            </td>
                                            <td className="numeric">
                                                {displayValue(row.sampleQty)}
                                            </td>
                                            <td>{row.ngQty}</td>
                                            <td>{row.defectName}</td>
                                            <td>{row.inspectorName}</td>
                                            <td>{row.customerName}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="download-row">
                            <div>
                                <strong>File siap di-download</strong>
                                <span>
                                    {rows.length.toLocaleString("id-ID")} baris
                                    · 10 kolom · 1 worksheet
                                </span>
                            </div>

                            <button
                                className="download-button"
                                onClick={() => void downloadExcel()}
                            >
                                <ArrowDownToLine size={18} />
                                Download Excel
                            </button>
                        </div>
                    </section>
                )}

                <footer>
                    Excel Converter <span>•</span> BEI Quality Tools
                    <span>•</span> by Roby S
                </footer>
            </main>
        </>
    );
}
