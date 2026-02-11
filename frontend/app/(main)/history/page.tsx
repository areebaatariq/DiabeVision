"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getAnalyses, getAnalysisImageBlobUrl, type AnalysisResult } from "@/lib/api";
import { Search, Filter, ArrowRight, Calendar, User } from "lucide-react";

export default function HistoryPage() {
  const [analyses, setAnalyses] = useState<AnalysisResult[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  const blobUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    getAnalyses()
      .then((data) => {
        if (cancelled) return [];
        setAnalyses(data);
        return data;
      })
      .then((data) => {
        if (cancelled || !data.length) return;
        return Promise.all(
          data.map((a) =>
            getAnalysisImageBlobUrl(a.id)
              .then((url) => [a.id, url] as const)
              .catch(() => [a.id, ""] as const)
          )
        ).then((pairs) => {
          if (cancelled || !pairs) return;
          blobUrlsRef.current.forEach(URL.revokeObjectURL);
          const urls = pairs.map(([, u]) => u).filter(Boolean);
          blobUrlsRef.current = urls;
          setImageUrls(Object.fromEntries(pairs));
        });
      })
      .catch(() => { if (!cancelled) setAnalyses([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => {
      cancelled = true;
      blobUrlsRef.current.forEach(URL.revokeObjectURL);
      blobUrlsRef.current = [];
    };
  }, []);

  const filteredAnalyses = analyses.filter(analysis => 
    analysis.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    analysis.prediction.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Analysis History</h1>
          <p className="text-slate-500 mt-1">View and manage your past retinal screenings.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search patient ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-full md:w-64"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-medium transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      {filteredAnalyses.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-slate-200 border-dashed">
          <div className="bg-slate-50 p-4 rounded-full inline-block mb-4">
            <Search className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-1">No analyses found</h3>
          <p className="text-slate-500 mb-6">
            {searchTerm ? "Try adjusting your search terms." : "You haven't performed any analyses yet."}
          </p>
          {!searchTerm && (
            <Link
              href="/analyze"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all"
            >
              Start New Analysis
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAnalyses.map((analysis) => (
            <Link
              key={analysis.id}
              href={`/results/${analysis.id}`}
              className="group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col"
            >
              <div className="relative h-48 bg-slate-900 overflow-hidden">
                <img
                  src={imageUrls[analysis.id] || analysis.imageUrl}
                  alt={`Scan for ${analysis.patientId}`}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute top-3 right-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${
                    analysis.severityScore === 0 
                      ? 'bg-green-500 text-white' 
                      : analysis.severityScore < 3 
                        ? 'bg-amber-500 text-white' 
                        : 'bg-red-500 text-white'
                  }`}>
                    {analysis.prediction}
                  </span>
                </div>
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-slate-600 text-sm">
                    <User className="w-4 h-4" />
                    <span className="font-medium">{analysis.patientId}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 text-xs">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(analysis.date).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-sm">
                    <span className="text-slate-500">Confidence:</span>
                    <span className="ml-1 font-bold text-slate-900">{analysis.confidence}%</span>
                  </div>
                  <span className="text-blue-600 text-sm font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    View Details <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

