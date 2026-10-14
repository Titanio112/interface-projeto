import { useState } from "react";
import UploadZone from "./components/UploadZone";
import ResultPanel from "./components/ResultPanel";
import { LANGUAGES, languageName } from "./languages";
import { processDocument } from "./api";
import type { ProcessResult } from "./types";

type Status = "idle" | "loading" | "done" | "error";

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [target, setTarget] = useState("en");
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<ProcessResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loading = status === "loading";

  function reset() {
    setResult(null);
    setError(null);
    setStatus("idle");
  }

  async function handleProcess() {
    if (!file) return;
    setStatus("loading");
    setError(null);
    try {
      const data = await processDocument(file, target);
      setResult(data);
      setStatus("done");
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Não foi possível processar o arquivo. Tente de novo."
      );
      setStatus("error");
    }
  }

  return (
    <div className="page">
      <header className="header">
        <h1 className="header__name">Transcritor</h1>
      </header>

      <main>
        <section className="step">
          <h2 className="step__title">Envie seu arquivo</h2>
          <UploadZone
            file={file}
            disabled={loading}
            onFile={(f) => {
              setFile(f);
              reset();
            }}
            onRemove={() => {
              setFile(null);
              reset();
            }}
          />
        </section>

        <section className="step">
          <h2 className="step__title">Idiomas e processamento</h2>

          <div className="lang-row">
            <div className="field">
              <span className="field__label">Idioma original</span>
              <span className="field__static">
                {result
                  ? `Detectado: ${languageName(result.detected_language)}`
                  : "Detectado automaticamente"}
              </span>
            </div>
            <label className="field">
              <span className="field__label">Traduzir para</span>
              <select
                className="select"
                value={target}
                disabled={loading}
                onChange={(e) => {
                  setTarget(e.target.value);
                  reset();
                }}
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <button
            type="button"
            className="button"
            disabled={!file || loading}
            onClick={handleProcess}
          >
            {loading ? (
              <>
                <span className="spinner" aria-hidden="true" /> Processando...
              </>
            ) : (
              "Transcrever e traduzir"
            )}
          </button>

          {loading && (
            <p className="message" role="status">
              Enviando o arquivo e extraindo o texto. Isso pode levar alguns segundos.
            </p>
          )}
          {error && (
            <p className="message message--error" role="alert">
              {error}
            </p>
          )}
        </section>

        {result && file && (
          <section className="step">
            <h2 className="step__title">Resultado</h2>
            <ResultPanel result={result} targetLang={target} fileName={file.name} />
          </section>
        )}
      </main>
    </div>
  );
}