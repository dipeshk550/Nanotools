import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { FiUploadCloud, FiFile, FiFolderPlus } from "react-icons/fi";
import api from "../../utils/api";
import toast from "react-hot-toast";

export default function FileUpload({ onUpload, accept, maxSizeMB = 50 }) {
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback(async (accepted) => {
    const f = accepted[0];
    if (!f) return;
    setFile(f);
    setUploading(true);
    setProgress(0);
    try {
      const formData = new FormData();
      formData.append("file", f);
      const { data } = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => setProgress(Math.round((e.loaded / e.total) * 100)),
      });
      onUpload?.(data);
      toast.success("File uploaded!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
      setFile(null);
    }
    setUploading(false);
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept || undefined,
    maxSize: maxSizeMB * 1024 * 1024,
    multiple: false,
  });

  return (
    <div>
      <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${isDragActive ? "border-brand bg-brand-light" : "border-gray-200 hover:border-brand hover:bg-gray-50"}`}>
        <input {...getInputProps()} />
        {isDragActive ? <FiFolderPlus size={32} className="mx-auto mb-2 text-brand" /> : <FiUploadCloud size={32} className="mx-auto mb-2 text-gray-400" />}
        <p className="text-sm text-gray-600 mb-1">{isDragActive ? "Drop it here!" : "Drop a file or click to browse"}</p>
        <p className="text-xs text-gray-400">Max {maxSizeMB} MB</p>
      </div>

      {file && (
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <FiFile size={14} className="text-gray-500" />
            <span className="text-xs font-medium flex-1 truncate">{file.name}</span>
            <span className="text-xs text-gray-400">{(file.size / 1024).toFixed(0)} KB</span>
          </div>
          {uploading && (
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-brand rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
