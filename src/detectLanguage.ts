import * as pdfjs from "pdfjs-dist";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { franc } from "franc-min";

pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

// Códigos do franc (ISO 639-3) -> códigos usados na lista de idiomas do app
const CODE_MAP: Record<string, string> = {
  por: "pt",
  eng: "en",
  spa: "es",
  fra: "fr",
  deu: "de",
  ita: "it",
  jpn: "ja",
  cmn: "zh",
};

async function readPdfText(file: File): Promise<string> {
  const data = new Uint8Array(await file.arrayBuffer());
  const pdf = await pdfjs.getDocument({ data }).promise;
  const pages = Math.min(pdf.numPages, 3);
  let text = "";
  for (let i = 1; i <= pages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text +=
      content.items
        .map((item) => ("str" in item ? item.str : ""))
        .join(" ") + "\n";
    if (text.length > 3000) break;
  }
  return text;
}

/**
 * Detecta o idioma de um arquivo.
 * Devolve o código ("pt", "en"...) ou "" quando não consegue
 * (imagem, PDF escaneado sem texto, idioma fora da lista).
 */
export async function detectLanguage(file: File): Promise<string> {
  if (file.type !== "application/pdf") return "";
  try {
    const text = await readPdfText(file);
    if (text.trim().length < 20) return "";
    const code = franc(text, { minLength: 20 });
    return CODE_MAP[code] ?? "";
  } catch {
    return "";
  }
}