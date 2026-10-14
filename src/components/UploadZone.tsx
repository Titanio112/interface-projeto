import { useEffect, useMemo, useRef, useState } from "react";

const ACCEPTED = ["image/png", "image/jpeg", "application/pdf"];
const MAX_MB = 10;

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface Props {
  file: File | null;
  disabled: boolean;
  onFile: (file: File) => void;
  onRemove: () => void;
}

export default function UploadZone({ file, disabled, onFile, onRemove }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const previewUrl = useMemo(
    () => (file && file.type.startsWith("image/") ? URL.createObjectURL(file) : null),
    [file]
  );
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function accept(f: File | undefined) {
    if (!f) return;
    if (!ACCEPTED.includes(f.type)) {
      setError("Formato não aceito. Envie um PDF, JPG ou PNG.");
      return;
    }
    if (f.size > MAX_MB * 1024 * 1024) {
      setError(`O arquivo passa de ${MAX_MB} MB. Envie um arquivo menor.`);
      return;
    }
    setError(null);
    onFile(f);
  }

  function remove() {
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
    onRemove();
  }

  return (
    <div>
      <div
        className={`dropzone${dragging ? " is-dragging" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (!disabled) accept(e.dataTransfer.files[0]);
        }}
      >
        <svg className="dropzone__icon" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M7 18a4 4 0 0 1-.6-7.96A6 6 0 0 1 18 9.5a4.25 4.25 0 0 1-.5 8.5M12 21v-9m0 0-3 3m3-3 3 3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <p className="dropzone__text">Arraste e solte o arquivo aqui ou</p>
        <button
          type="button"
          className="link-button"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
        >
          Clique para selecionar
        </button>
        <p className="dropzone__hint">PDF, JPG ou PNG, até {MAX_MB} MB</p>
        <input
          ref={inputRef}
          type="file"
          hidden
          accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
          onChange={(e) => accept(e.target.files?.[0])}
        />
      </div>

      {error && (
        <p className="message message--error" role="alert">
          {error}
        </p>
      )}

      {file && (
        <div className="file-chip">
          {previewUrl ? (
            <img className="file-chip__thumb" src={previewUrl} alt="" />
          ) : (
            <span className="file-chip__thumb file-chip__thumb--pdf">PDF</span>
          )}
          <span className="file-chip__name">{file.name}</span>
          <span className="file-chip__size">{formatSize(file.size)}</span>
          <button
            type="button"
            className="text-button"
            onClick={remove}
            disabled={disabled}
            aria-label={`Remover ${file.name}`}
          >
            Remover
          </button>
        </div>
      )}
    </div>
  );
}
