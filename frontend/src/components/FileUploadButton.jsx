import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { ACCEPTED_FILE_TYPES, MAX_FILE_BYTES } from "../constants.js";

/** Client-side check matching the backend's rules, so users get instant feedback. */
function validateFile(file) {
  if (!ACCEPTED_FILE_TYPES.split(",").includes(file.type)) return "Only PDF, JPG or PNG files are accepted";
  if (file.size > MAX_FILE_BYTES) return "Files must be smaller than 5 MB";
  if (file.size === 0) return "The file is empty";
  return null;
}

/** A small button that opens a file picker and calls `onFile(file)` with a validated file. */
export default function FileUploadButton({ label = "Upload", onFile, onError, disabled }) {
  const input = useRef(null);
  const [busy, setBusy] = useState(false);

  const handleChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const problem = validateFile(file);
    if (problem) {
      onError?.(problem);
      return;
    }
    setBusy(true);
    try {
      await onFile(file);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <input ref={input} type="file" accept={ACCEPTED_FILE_TYPES} className="hidden" onChange={handleChange} />
      <button
        type="button"
        disabled={disabled || busy}
        onClick={() => input.current?.click()}
        className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline disabled:text-slate-400 disabled:no-underline"
      >
        <Upload size={13} /> {busy ? "Uploading…" : label}
      </button>
    </>
  );
}
