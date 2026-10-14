import type { ProcessResult } from "./types";

/**
 * Ponto de conexão com o backend (a implementar).
 * Recebe o arquivo e o idioma de destino e deve devolver
 * { original_text, translated_text, detected_language }.
 */
export async function processDocument(
  _file: File,
  _targetLang: string
): Promise<ProcessResult> {
  // TODO: chamar o backend aqui.
  throw new Error("O backend ainda não está conectado.");
}
