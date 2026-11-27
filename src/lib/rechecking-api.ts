import type { InspectionRecord } from './types';

export function configured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_GAS_REPORT_RECHECKING &&
    process.env.NEXT_PUBLIC_GAS_REPORT_RECHECKING.includes('/exec')
  );
}

export async function getHistory(): Promise<InspectionRecord[]> {
  const response = await fetch('/api/history', {
    cache: 'no-store',
  });

  const result = await response.json();

  if (!response.ok || !result.ok) {
    throw new Error(result.error || 'Gagal mengambil History');
  }

  return result.records || [];
}

export async function postAction(payload: unknown) {
  const response = await fetch('/api/history', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok || !result.ok) {
    throw new Error(result.error || 'Permintaan gagal');
  }

  return result;
}
