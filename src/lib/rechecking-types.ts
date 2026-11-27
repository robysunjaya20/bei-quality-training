
export type Model =
  | 'SU2ID LH'
  | 'SU2ID RH'
  | 'KS LH'
  | 'KS RH'
  | 'Cover Engine';

export type InspectionItem = {
  model: Model;
  partNumber: string;
  sampleQty: number;
  ngQty: number;
  totalQty: number;
  detailNg: string;
};

export type InspectionRecord = {
  id: string;
  inspector: string;
  inspectionDate: string;
  inspectionLine: 'LH' | 'RH';
  inspectionLot: string;
  shift: '1' | '2' | '3';

  // Data seluruh item
  items?: InspectionItem[];

  // Ringkasan untuk kompatibilitas History
  model: Model;
  partNumber: string;
  sampleQty: number;
  ngQty: number;
  totalQty: number;
  detailNg: string;

  fileId: string;
  fileUrl: string;
  folderUrl: string;
  createdAt: string;
};

export type ReportPayload = {
  inspector: string;
  inspectionDate: string;
  inspectionLine: 'LH' | 'RH';
  inspectionLot: string;
  shift: '1' | '2' | '3';
  items: InspectionItem[];

  model: Model;
  partNumber: string;
  sampleQty: number;
  ngQty: number;
  totalQty: number;
  detailNg: string;
};

export const MODEL_PREFIX: Record<
  Exclude<Model, 'Cover Engine'>,
  string
> = {
  'SU2ID LH': '87610-I7',
  'SU2ID RH': '87620-I7',
  'KS LH': '87610-I6',
  'KS RH': '87620-I6',
};
