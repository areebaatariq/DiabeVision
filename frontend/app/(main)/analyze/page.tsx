"use client";

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, X, FileImage, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { analyzeImage } from "@/lib/api";
import { toast } from 'sonner';

export default function AnalyzePage() {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile: File) => {
    // Validate file type
    if (!selectedFile.type.startsWith('image/')) {
      toast.error('Please upload an image file (JPG, PNG)');
      return;
    }

    // Validate file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error('File size too large. Max 5MB allowed.');
      return;
    }

    setFile(selectedFile);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    try {
      const result = await analyzeImage(file);
      toast.success("Analysis complete");
      router.push(`/results/${result.id}`);
    } catch (error) {
      console.error(error);
      toast.error('Analysis failed. Please try again.');
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">New Analysis</h1>
        <p className="text-slate-500 mt-1">Upload a retinal fundus image for instant AI assessment.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8">
          {!preview ? (
            <div
              className={`border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                isDragging
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="bg-blue-100 p-4 rounded-full mb-4">
                <Upload className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Click to upload or drag and drop
              </h3>
              <p className="text-slate-500 max-w-sm mx-auto mb-6">
                Supported formats: JPEG, PNG. High resolution images recommended for best results.
              </p>
              <button className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-50 transition-colors">
                Select Image
              </button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileSelect}
              />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative rounded-xl overflow-hidden bg-slate-900 aspect-video flex items-center justify-center group">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-full max-w-full object-contain"
                />
                <button
                  onClick={clearFile}
                  className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                  <div className="flex items-center gap-3">
                    <FileImage className="w-5 h-5 text-blue-400" />
                    <span className="font-medium truncate">{file?.name}</span>
                    <span className="text-slate-300 text-sm">
                      ({(file!.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">Ready for Analysis</h4>
                    <p className="text-sm text-blue-700">
                      Our ResNet model will scan for signs of diabetic retinopathy including microaneurysms and hemorrhages.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  onClick={clearFile}
                  className="px-6 py-3 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors"
                  disabled={isAnalyzing}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg shadow-blue-600/20 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      Analyze Image
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-xl border border-slate-200">
          <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-600 mb-4">1</div>
          <h3 className="font-semibold text-slate-900 mb-2">Upload Image</h3>
          <p className="text-sm text-slate-500">Upload a clear, focused retinal fundus image. Ensure the macula and optic disc are visible.</p>
        </div>
        <div className="p-6 bg-white rounded-xl border border-slate-200">
          <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-600 mb-4">2</div>
          <h3 className="font-semibold text-slate-900 mb-2">AI Processing</h3>
          <p className="text-sm text-slate-500">Our deep learning model analyzes the image for pathological features in seconds.</p>
        </div>
        <div className="p-6 bg-white rounded-xl border border-slate-200">
          <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-600 mb-4">3</div>
          <h3 className="font-semibold text-slate-900 mb-2">Review Results</h3>
          <p className="text-sm text-slate-500">Get a detailed report with severity grading and confidence scores to aid your diagnosis.</p>
        </div>
      </div>
    </div>
  );
}

