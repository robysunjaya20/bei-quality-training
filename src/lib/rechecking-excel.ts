
import ExcelJS from 'exceljs';
import type { ReportPayload, Model } from './types';
import { MODEL_PREFIX } from './types';

const TEMPLATE = '/rechecking-fg-template.xlsx';
const MAX_ITEMS = 20;
const COVER_ENGINE_PART_NUMBER = '29240-2M020';

function getFullPartNumber(model: Model, partNumber: string): string {
  if (model === 'Cover Engine') {
    return COVER_ENGINE_PART_NUMBER;
  }

  return `${MODEL_PREFIX[model]}${partNumber}`;
}

function excelDate(value: string): Date {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function formatDate(value: string): string {
  const [year, month, day] = value.split('-');
  return `${day}-${month}-${year}`;
}

function safeName(value: string): string {
  return value.trim().replace(/[\\/:*?"<>|]/g, '-').replace(/\s+/g, ' ');
}

export async function createReport(data: ReportPayload) {
  if (!data.items?.length || data.items.length > MAX_ITEMS) {
    throw new Error(
      `Jumlah Inspection Item harus antara 1 sampai ${MAX_ITEMS}.`
    );
  }

  const response = await fetch(TEMPLATE, { cache: 'no-store' });

  if (!response.ok) {
    throw new Error('Template Excel tidak ditemukan di folder public.');
  }

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(await response.arrayBuffer());

  const sheet = workbook.getWorksheet('OQC rev.3');

  if (!sheet) {
    throw new Error('Sheet "OQC rev.3" tidak ditemukan pada template Excel.');
  }

  sheet.getCell('D4').value = data.inspector;
  // sheet.getCell('M4').value = `: ${formatDate(data.inspectionLot)}`;
  sheet.getCell('M4').value = null;
  sheet.getCell('D5').value = excelDate(data.inspectionDate);
  sheet.getCell('M5').value = `: ${data.shift}`;
  sheet.getCell('D6').value =
  data.inspectionLine === 'LH'
    ? 'Rechecking O/S Rear View Mirror LH'
    : 'Rechecking O/S Rear View Mirror RH';

  const firstDataRow = 11;
  const lastDataRow = 30;

  for (let row = firstDataRow; row <= lastDataRow; row++) {
    const itemIndex = row - firstDataRow;
    const item = data.items[itemIndex];

    sheet.getCell(`C${row}`).value = item?.model ?? null;

    sheet.getCell(`D${row}`).value = item
      ? getFullPartNumber(item.model, item.partNumber)
      : null;

    sheet.getCell(`G${row}`).value = item
      ? Number(item.sampleQty) + Number(item.ngQty)
      : null;

    sheet.getCell(`I${row}`).value = item
      ? Number(item.sampleQty)
      : null;

    sheet.getCell(`K${row}`).value = item
      ? Number(item.ngQty)
      : null;

    sheet.getCell(`M${row}`).value = item?.detailNg?.trim() || null;
  }

  const totalSampleQty = data.items.reduce(
    (sum, item) => sum + Number(item.sampleQty || 0),
    0
  );

  const totalNgQty = data.items.reduce(
    (sum, item) => sum + Number(item.ngQty || 0),
    0
  );

  const totalQty = totalSampleQty + totalNgQty;

  // Posisi total tetap mengikuti kode Excel yang sekarang.
  // Hanya value yang diubah, tanpa mengubah style dan border.
  sheet.getCell('G31').value = totalQty;
  sheet.getCell('I31').value = totalSampleQty;
  sheet.getCell('K31').value = totalNgQty;

  sheet.getCell('J57').value = data.inspector;

  const buffer = await workbook.xlsx.writeBuffer();

  const filename =
    `${safeName(data.inspector)}-Rechecking FG-${formatDate(data.inspectionDate)}.xlsx`;

  return { buffer, filename };
}

export function bufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  const bytes =
    buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);

  let binary = '';
  const chunkSize = 0x8000;

  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    const chunk = bytes.subarray(offset, offset + chunkSize);
    binary += String.fromCharCode(...chunk);
  }

  return btoa(binary);
}
