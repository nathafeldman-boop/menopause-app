"use client";

import { useRef, useState } from "react";
import { Camera, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";

async function resizeImage(file: File, maxDim = 1280, quality = 0.82): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Votre navigateur ne permet pas de traiter cette image.");
  ctx.drawImage(bitmap, 0, 0, width, height);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Échec de la compression de l'image."))),
      "image/jpeg",
      quality
    );
  });
}

export function PhotoPicker({
  label,
  helper,
  onReady,
  onClear,
}: {
  label: string;
  helper?: string;
  onReady: (file: Blob, previewUrl: string) => void;
  onClear?: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setBusy(true);
    setError(null);
    try {
      const resized = await resizeImage(file);
      const url = URL.createObjectURL(resized);
      setPreview(url);
      onReady(resized, url);
    } catch {
      setError("Impossible de lire cette image. Essayez une autre photo.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {preview ? (
        <div className="w-full overflow-hidden rounded-2xl border border-border">
          {/* Aperçu local (blob URL) avant envoi — next/image non pertinent ici */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Photo sélectionnée" className="max-h-96 w-full object-cover" />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="flex w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border bg-muted/40 py-14 text-center transition-colors hover:border-primary/50 disabled:opacity-60"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Camera className="h-8 w-8 text-primary" />
          </div>
          <p className="font-medium">{busy ? "Chargement…" : label}</p>
          <p className="px-6 text-sm text-muted-foreground">
            {helper ?? "Appuyez pour prendre ou importer une photo"}
          </p>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />

      {error && <p className="text-sm text-destructive">{error}</p>}

      {preview && (
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setPreview(null);
            onClear?.();
            inputRef.current?.click();
          }}
          className="w-full"
        >
          <RotateCcw className="h-4 w-4" /> Reprendre une autre photo
        </Button>
      )}
    </div>
  );
}
