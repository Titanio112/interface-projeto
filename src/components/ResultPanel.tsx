import { useState } from "react";
import type { ProcessResult } from "../types";
import { languageName } from "../languages";

interface Props {
  result: ProcessResult;
  originalLang: string;
  targetLang: string;
  fileName: string;
}

export default function ResultPanel({
  result,
  originalLang,
  targetLang,
  fileName,
}: Props) {
  const [tab, setTab] = useState<"original" | "translated">("original");

  const originalLabel = originalLang
    ? `Texto original (${languageName(originalLang)})`
    : "Texto original";

  function download() {
    const content =
      `${originalLabel}\n` +
      `${"-".repeat(40)}\n${result.original_text}\n\n` +
      `Texto traduzido (${languageName(targetLang)})\n` +
      `${"-".repeat(40)}\n${result.translated_text}\n`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName.replace(/\.[^.]+$/, "")}-traduzido.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="tabs" role="tablist" aria-label="Texto">
        <button
          role="tab"
          aria-selected={tab === "original"}
          className="tabs__tab"
          onClick={() => setTab("original")}
        >
          Texto original
        </button>
        <button
          role="tab"
          aria-selected={tab === "translated"}
          className="tabs__tab"
          onClick={() => setTab("translated")}
        >
          Texto traduzido
        </button>
      </div>

      <div className="result" data-tab={tab}>
        <section className="result__col result__col--original">
          <h3 className="result__title">{originalLabel}</h3>
          <pre className="result__text">{result.original_text}</pre>
        </section>
        <section className="result__col result__col--translated">
          <h3 className="result__title">Texto traduzido ({languageName(targetLang)})</h3>
          <pre className="result__text">{result.translated_text}</pre>
        </section>
      </div>

      <button type="button" className="button button--secondary" onClick={download}>
        Baixar em .txt
      </button>
    </div>
  );
}