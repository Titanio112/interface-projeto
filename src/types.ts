export interface ProcessResult {
  original_text: string;
  translated_text: string;
  detected_language: string; // código, ex.: "pt"
  suggested_language?: string; // idioma que o texto parece ter, se diferente do usado
  suggestion_confidence?: number; // 0 a 1
}

export interface TranslateResult {
  translated_text: string;
  translation_notice: string; // aviso (vazio quando a tradução saiu inteira)
}
