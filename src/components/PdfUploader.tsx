import React, { useRef, useState } from 'react';
import { UploadCloud, File, X, Check, Loader2 } from 'lucide-react';

interface PdfUploaderProps {
  onFilesSelected: (files: { file: File; base64: string }[]) => void;
  acceptMimes?: string;
  multiple?: boolean;
}

export default function PdfUploader({ onFilesSelected, acceptMimes = 'application/pdf', multiple = true }: PdfUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; size: number }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const processSelectedFiles = async (fileList: FileList) => {
    setLoading(true);
    const loaded: { file: File; base64: string }[] = [];
    const meta: { name: string; size: number }[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      meta.push({ name: file.name, size: file.size });

      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve(e.target?.result as string || '');
        };
        reader.readAsDataURL(file);
      });

      loaded.push({ file, base64 });
      if (!multiple) break; // If only one file allowed, stop
    }

    setUploadedFiles(meta);
    onFilesSelected(loaded);
    setLoading(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processSelectedFiles(e.dataTransfer.files);
    }
  };

  const handleSelectFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await processSelectedFiles(e.target.files);
    }
  };

  const clearFiles = () => {
    setUploadedFiles([]);
    onFilesSelected([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-4">
      {uploadedFiles.length === 0 ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          id="dropzone"
          className={`border-2 border-dashed rounded-3xl p-10 text-center cursor-pointer transition-all ${
            isDragOver 
              ? 'border-red-500 bg-red-50/50 shadow-inner' 
              : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleSelectFiles}
            accept={acceptMimes}
            multiple={multiple}
            className="hidden"
          />

          <div className="max-w-md mx-auto flex flex-col items-center">
            <div className={`p-4 rounded-2xl mb-4 transition-transform ${isDragOver ? 'bg-red-500 text-white scale-110' : 'bg-red-50 text-red-500'}`}>
              <UploadCloud className="h-10 w-10" />
            </div>

            <h3 className="font-sans font-semibold text-lg text-slate-800 mb-1">
              Drag & drop your files here
            </h3>
            
            <p className="font-sans text-xs text-slate-500 mb-4 leading-normal">
              or click to browse local files. Supports {acceptMimes.split(',').join(', ')} files.
            </p>

            <span className="inline-flex items-center space-x-1 px-4 py-2 bg-white border border-slate-200 text-xs text-slate-600 rounded-xl hover:text-red-500 hover:border-red-100 shadow-sm transition-all font-semibold">
              Choose Files
            </span>
          </div>
        </div>
      ) : (
        <div className="border border-slate-100 bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-50 pb-4 mb-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                <Check className="h-4 w-4" />
              </div>
              <span className="text-sm font-semibold text-slate-800">
                {uploadedFiles.length} File{uploadedFiles.length > 1 ? 's' : ''} Loaded Successfully
              </span>
            </div>
            
            <button
              onClick={clearFiles}
              className="text-xs text-rose-500 hover:text-rose-600 font-semibold flex items-center space-x-1"
              id="clear-files-btn"
            >
              <X className="h-3 w-3" />
              <span>Clear files</span>
            </button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {uploadedFiles.map((f, i) => (
              <div 
                key={i} 
                className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-100 transition-colors"
              >
                <div className="flex items-center space-x-3 overflow-hidden mr-4">
                  <div className="p-1.5 bg-red-50 text-red-500 rounded-lg shrink-0">
                    <File className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-medium text-slate-700 truncate">{f.name}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 shrink-0">{formatSize(f.size)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-4 text-xs font-semibold text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin text-red-500 mr-2" />
          <span>Processing upload files...</span>
        </div>
      )}
    </div>
  );
}
