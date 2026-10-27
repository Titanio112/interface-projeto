export interface ProcessResult {
  original_text: string;
  translated_text: string;
  detected_language: string; // código, ex.: "pt"
}

export interface TranslateResult {
  translated_text: string;
  translation_notice: string; // aviso (vazio quando a tradução saiu inteira)
}
