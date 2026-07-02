import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { FiUploadCloud, FiFile, FiDownload, FiX, FiCheckCircle, FiAlertTriangle } from "react-icons/fi";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function PDFToWord() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | converting | done | error
  const [errorMsg, setErrorMsg] = useState("");
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [outputName, setOutputName] = useState("");
  const [pages, setPages] = useState(null);

  const onDrop = useCallback((accepted, rejected) => {
    if (rejected.length > 0) {
      setErrorMsg(rejected[0].errors[0]?.message || "Invalid file");
      setStatus("error");
      return;
    }
    const f = accepted[0];
    if (!f) return;
    // Clear old download
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl(null);
    setFile(f);
    setStatus("idle");
    setErrorMsg("");
  }, [downloadUrl]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxSize: 20 * 1024 * 1024,
    multiple: false,
  });

  const convert = async () => {
    if (!file) return;
    setStatus("converting");
    setErrorMsg("");

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const response = await axios.post(`${API}/pdf/to-word`, formData, {
        responseType: "blob",
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 60000,
      });

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      const url = URL.createObjectURL(blob);
      const name = file.name.replace(/\.pdf$/i, "") + ".docx";
      const pagesConverted = response.headers["x-pages-converted"];

      setDownloadUrl(url);
      setOutputName(name);
      setPages(pagesConverted);
      setStatus("done");
    } catch (err) {
      const msg =
        err.response?.data instanceof Blob
          ? await err.response.data.text().then((t) => {
              try { return JSON.parse(t).message; } catch { return t; }
            })
          : err.message || "Conversion failed";
      setErrorMsg(msg);
      setStatus("error");
    }
  };

  const reset = () => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setFile(null);
    setStatus("idle");
    setErrorMsg("");
    setDownloadUrl(null);
    setOutputName("");
    setPages(null);
  };

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      {!file && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors select-none ${
            isDragActive
              ? "border-brand bg-brand-light"
              : "border-gray-200 hover:border-brand hover:bg-gray-50"
          }`}
        >
          <input {...getInputProps()} />
          <FiUploadCloud
            size={36}
            className={`mx-auto mb-3 ${isDragActive ? "text-brand" : "text-gray-400"}`}
          />
          <p className="text-sm font-medium text-gray-700 mb-1">
            {isDragActive ? "Drop your PDF here" : "Drop a PDF or click to browse"}
          </p>
          <p className="text-xs text-gray-400">Max 20 MB · PDF files only</p>
        </div>
      )}

      {/* File chip once selected */}
      <AnimatePresence>
        {file && status !== "done" && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl"
          >
            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
              <FiFile size={20} className="text-red-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
              <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(0)} KB</p>
            </div>
            {status !== "converting" && (
              <button onClick={reset} className="text-gray-400 hover:text-gray-600">
                <FiX size={16} />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Convert button */}
      {file && status === "idle" && (
        <motion.button
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={convert}
          className="w-full py-3 bg-brand text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Convert to Word
        </motion.button>
      )}

      {/* Converting spinner */}
      {status === "converting" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-3 py-6"
        >
          <div className="w-10 h-10 border-4 border-brand-light border-t-brand rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Converting your PDF...</p>
          <p className="text-xs text-gray-400">This usually takes a few seconds</p>
        </motion.div>
      )}

      {/* Success state */}
      {status === "done" && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-3 p-4 bg-accent-light border border-accent/30 rounded-xl">
            <FiCheckCircle size={22} className="text-accent shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">Conversion complete!</p>
              <p className="text-xs text-gray-500">
                {pages ? `${pages} page${pages > 1 ? "s" : ""} converted · ` : ""}
                {outputName}
              </p>
            </div>
          </div>

          <a
            href={downloadUrl}
            download={outputName}
            className="flex items-center justify-center gap-2 w-full py-3 bg-brand text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <FiDownload size={16} /> Download {outputName}
          </a>

          <button
            onClick={reset}
            className="w-full py-2.5 border border-gray-200 text-gray-500 rounded-xl text-sm hover:bg-gray-50 transition-colors"
          >
            Convert another PDF
          </button>
        </motion.div>
      )}

      {/* Error state */}
      {status === "error" && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
            <FiAlertTriangle size={18} className="text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-700">Conversion failed</p>
              <p className="text-xs text-red-500 mt-0.5">{errorMsg}</p>
            </div>
          </div>
          <button
            onClick={reset}
            className="w-full py-2.5 border border-gray-200 text-gray-500 rounded-xl text-sm hover:bg-gray-50 transition-colors"
          >
            Try again
          </button>
        </motion.div>
      )}

      {/* How it works */}
      {status === "idle" && !file && (
        <div className="grid grid-cols-3 gap-3 pt-2">
          {[
            ["1. Upload", "Drop your PDF into the box above"],
            ["2. Convert", "We extract text and structure"],
            ["3. Download", "Get your editable .docx file"],
          ].map(([title, desc]) => (
            <div key={title} className="text-center p-3 bg-gray-50 rounded-xl">
              <p className="text-xs font-medium text-gray-700 mb-1">{title}</p>
              <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
