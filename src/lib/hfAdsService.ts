export type HfAdRow = {
  id: string | number;
  imageUrl?: string;
  metadata: Record<string, any>;
};

type HfApiRow = {
  row: Record<string, any>;
  row_idx: number;
};

type HfApiResponse = {
  rows: HfApiRow[];
  features?: any[];
  num_rows_total?: number;
};

const HF_DATASET_URL =
  'https://datasets-server.huggingface.co/rows?dataset=PeterBrendan%2FAdImageNet&config=default&split=train';

function extractImageUrl(row: Record<string, any>): string | undefined {
  // AdImageNet provides file_name (string). Some datasets also expose structured image fields.
  const explicit = row.image ?? row.img ?? row.picture ?? undefined;
  if (explicit) {
    if (typeof explicit === 'string') return explicit;
    if (typeof explicit === 'object') return explicit.src || explicit.url || explicit.path || undefined;
  }

  const fileName: string | undefined = row.file_name || row.filename || row.name;
  if (!fileName) return undefined;

  // If fileName is already a URL
  if (/^https?:\/\//i.test(fileName)) return fileName;

  // Try common repo paths on Hugging Face
  const base = 'https://huggingface.co/datasets/PeterBrendan/AdImageNet/resolve/main';
  const candidates = [
    `${base}/${fileName}`,
    `${base}/images/${fileName}`,
    `${base}/data/${fileName}`,
  ];
  return candidates[0];
}

export async function fetchHfAds(offset = 0, length = 50): Promise<{ items: HfAdRow[]; total?: number; error?: string }>
{
  try {
    const token = import.meta.env.VITE_HF_TOKEN as string | undefined;
    if (!token) {
      return { items: [], error: 'Missing VITE_HF_TOKEN in environment' };
    }

    const url = `${HF_DATASET_URL}&offset=${offset}&length=${length}`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      const text = await res.text();
      // Helpful hint for gated datasets (403) per AdImageNet card
      const hint = res.status === 403
        ? 'Access denied. Visit the dataset page and accept the conditions, then retry with a valid VITE_HF_TOKEN.'
        : undefined;
      return { items: [], error: `HTTP ${res.status}: ${text}${hint ? ` — ${hint}` : ''}` };
    }
    const data = (await res.json()) as HfApiResponse;

    const items: HfAdRow[] = (data.rows || []).map((r) => {
      const imageUrl = extractImageUrl(r.row);
      return {
        id: r.row.id ?? r.row_idx,
        imageUrl,
        metadata: r.row,
      };
    });

    return { items, total: data.num_rows_total };
  } catch (err: any) {
    return { items: [], error: err?.message || 'Unknown error' };
  }
}


