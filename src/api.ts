import type { ProcessResult } from "./types";

// URL do backend, definida no build (VITE_API_URL). Vazia = mesma origem.
const API_URL = import.meta.env.VITE_API_URL ?? "";

/**
 * Envia o arquivo para o backend (POST /ocr) e devolve
 * { original_text, translated_text, detected_language }.
 * O idioma de destino é enviado, mas a tradução ainda não está habilitada.
 */
export async function processDocument(
  file: File,
  targetLang: string,
  sourceLang: string
): Promise<ProcessResult> {
  const body = new FormData();
  body.append("file", file);
  body.append("source_lang", sourceLang);
  body.append("target_lang", targetLang);

  let res: Response;
  try {
    res = await fetch(`${API_URL}/ocr`, { method: "POST", body });
  } catch {
    throw new Error("Não foi possível conectar ao servidor. Tente de novo.");
  }

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.detail ?? `Erro ${res.status} ao processar o arquivo.`);
  }
  return data as ProcessResult;
}
