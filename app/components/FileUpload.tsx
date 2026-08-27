"use client";

import { useCallback, useId, useRef, useState } from "react";
import { formatFileSize, readFileAsDataUrl } from "../lib/userProfile";

export interface UploadedFile {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
}

interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
  variant?: "dropzone" | "button" | "avatar";
  files?: UploadedFile[];
  onChange?: (files: UploadedFile[]) => void;
  onError?: (message: string) => void;
  label?: string;
  hint?: string;
  buttonLabel?: string;
  className?: string;
  previewUrl?: string | null;
  onPreviewChange?: (url: string | null, file?: File) => void;
  emptyIcon?: string;
  compact?: boolean;
}

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function FileUpload({
  accept = "image/*",
  multiple = false,
  maxSize = 2 * 1024 * 1024,
  maxFiles = 10,
  variant = "dropzone",
  files = [],
  onChange,
  onError,
  label = "Upload files",
  hint,
  buttonLabel = "Select Files",
  className = "",
  previewUrl,
  onPreviewChange,
  emptyIcon = "person",
  compact = false,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const [dragging, setDragging] = useState(false);

  const reportError = useCallback(
    (message: string) => {
      onError?.(message);
    },
    [onError]
  );

  const processFiles = useCallback(
    async (fileList: FileList | File[]) => {
      const incoming = Array.from(fileList);
      if (!incoming.length) return;

      if (variant === "avatar") {
        const file = incoming[0];
        if (!file.type.startsWith("image/")) {
          reportError("Please select an image file (JPG, PNG, or GIF).");
          return;
        }
        if (file.size > maxSize) {
          reportError(`Image must be smaller than ${formatFileSize(maxSize)}.`);
          return;
        }
        try {
          const url = await readFileAsDataUrl(file);
          onPreviewChange?.(url, file);
        } catch {
          reportError("Failed to read the image. Please try again.");
        }
        return;
      }

      const next = [...files];
      for (const file of incoming) {
        if (next.length >= maxFiles) {
          reportError(`You can upload up to ${maxFiles} files.`);
          break;
        }
        if (file.size > maxSize) {
          reportError(`${file.name} exceeds ${formatFileSize(maxSize)}.`);
          continue;
        }
        try {
          const url = await readFileAsDataUrl(file);
          next.push({
            id: makeId(),
            name: file.name,
            url,
            size: file.size,
            type: file.type,
          });
        } catch {
          reportError(`Failed to read ${file.name}.`);
        }
      }
      onChange?.(next);
    },
    [files, maxFiles, maxSize, onChange, onPreviewChange, reportError, variant]
  );

  function openPicker() {
    inputRef.current?.click();
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) void processFiles(e.target.files);
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length) void processFiles(e.dataTransfer.files);
  }

  function removeFile(id: string) {
    onChange?.(files.filter((f) => f.id !== id));
  }

  const hiddenInput = (
    <input
      ref={inputRef}
      id={inputId}
      type="file"
      accept={accept}
      multiple={multiple && variant !== "avatar"}
      className="sr-only"
      onChange={handleInputChange}
    />
  );

  if (variant === "avatar") {
    return (
      <div className={`flex items-center gap-6 ${className}`}>
        {hiddenInput}
        <div className="w-24 h-24 rounded-full bg-surface-container-high overflow-hidden shrink-0 border-2 border-outline-variant">
          {previewUrl ? (
            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[32px]">{emptyIcon}</span>
            </div>
          )}
        </div>
        <div>
          <button
            type="button"
            onClick={openPicker}
            className="px-4 py-2 bg-surface-container border border-outline-variant rounded-lg text-label-md text-on-surface hover:bg-surface-container-high transition-colors mb-2"
          >
            {buttonLabel}
          </button>
          {hint && <p className="text-body-sm text-on-surface-variant">{hint}</p>}
        </div>
      </div>
    );
  }

  if (variant === "button") {
    return (
      <div className={className}>
        {hiddenInput}
        <button
          type="button"
          onClick={openPicker}
          className="px-4 py-2 border border-outline-variant rounded-lg text-label-md text-on-surface hover:bg-surface-container transition-colors"
        >
          {buttonLabel}
        </button>
        {hint && <p className="text-body-sm text-secondary mt-2">{hint}</p>}
        {files.length > 0 && (
          <ul className="mt-3 space-y-2">
            {files.map((file) => (
              <li
                key={file.id}
                className="flex items-center justify-between gap-3 px-3 py-2 bg-surface-container-low rounded-lg border border-outline-variant/50"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="material-symbols-outlined text-primary text-[18px] shrink-0">description</span>
                  <span className="text-body-sm text-on-surface truncate">{file.name}</span>
                  <span className="text-body-sm text-outline shrink-0">{formatFileSize(file.size)}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(file.id)}
                  className="p-1 text-outline hover:text-error rounded transition-colors"
                  aria-label={`Remove ${file.name}`}
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  return (
    <div className={className}>
      {hiddenInput}
      <div
        role="button"
        tabIndex={0}
        onClick={openPicker}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openPicker();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl text-center transition-all cursor-pointer ${
          compact ? "p-4" : "p-8"
        } ${
          dragging
            ? "border-primary bg-primary/5 scale-[1.01]"
            : "border-outline-variant hover:bg-surface-bright hover:border-primary/40"
        }`}
      >
        <div className={`bg-surface-container-highest rounded-full flex items-center justify-center mx-auto text-primary ${
          compact ? "w-12 h-12 mb-2" : "w-16 h-16 mb-4"
        }`}>
          <span className={`material-symbols-outlined ${compact ? "text-[24px]" : "text-[32px]"}`}>cloud_upload</span>
        </div>
        <h3 className={`text-label-md text-on-surface ${compact ? "mb-0.5" : "mb-1"}`}>{label}</h3>
        <p className={`text-body-sm text-secondary ${compact ? "mb-2" : "mb-4"}`}>
          {hint || "Drag and drop files here, or click to browse"}
        </p>
        <span className="inline-flex px-4 py-2 border border-outline-variant rounded-lg text-label-md text-on-surface hover:bg-surface-container transition-colors">
          {buttonLabel}
        </span>
      </div>

      {files.length > 0 && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {files.map((file) => (
            <div key={file.id} className="relative group rounded-xl overflow-hidden border border-outline-variant/50 aspect-[4/3] bg-surface-container-low">
              {file.type.startsWith("image/") ? (
                <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center">
                  <span className="material-symbols-outlined text-primary text-[28px] mb-1">description</span>
                  <p className="text-body-sm text-on-surface truncate w-full">{file.name}</p>
                </div>
              )}
              <button
                type="button"
                onClick={() => removeFile(file.id)}
                className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label={`Remove ${file.name}`}
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
