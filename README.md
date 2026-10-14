# Transcreve & Traduz

Interface do MVP: envio de PDF/JPG/PNG, escolha do idioma de destino, resultado lado a lado e download em .txt.

## Rodar

```
npm install
npm run dev
```

Abra o endereço que aparecer no terminal (normalmente http://localhost:5173).

## Backend

A conexão fica em `src/api.ts` (função `processDocument`), ainda sem implementação.
A resposta esperada é:

```
{ "original_text": "...", "translated_text": "...", "detected_language": "pt" }
```
