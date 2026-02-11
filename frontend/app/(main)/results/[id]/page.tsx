"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getAnalysis, getAnalysisImageBlobUrl, type AnalysisResult } from "@/lib/api";
import { ArrowLeft, Download, Share2, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import Link from 'next/link';

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const blobUrlRef = useRef<string>("");

  useEffect(() => {
    if (!params.id) return;
    let cancelled = false;
    getAnalysis(params.id as string)
      .then((result) => {
        if (cancelled) return;
        setAnalysis(result);
        return getAnalysisImageBlobUrl(result.id).then((url) => {
          if (!cancelled) {
            blobUrlRef.current = url;
            setImageUrl(url);
          } else {
            URL.revokeObjectURL(url);
          }
        });
      })
      .catch(() => { if (!cancelled) router.push("/history"); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => {
      cancelled = true;
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
    };
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!analysis) return null;

  // Data for charts
  const confidenceData = [
    { name: 'Confidence', value: analysis.confidence },
    { name: 'Uncertainty', value: 100 - analysis.confidence },
  ];
  
  const COLORS = ['#2563eb', '#e2e8f0'];

  const severityData = [
    { name: 'No DR', value: analysis.severityScore === 0 ? 100 : 10 },
    { name: 'Mild', value: analysis.severityScore === 1 ? 100 : 20 },
    { name: 'Moderate', value: analysis.severityScore === 2 ? 100 : 30 },
    { name: 'Severe', value: analysis.severityScore === 3 ? 100 : 40 },
    { name: 'Proliferative', value: analysis.severityScore === 4 ? 100 : 50 },
  ];

  const getSeverityColor = (score: number) => {
    if (score === 0) return 'text-green-600 bg-green-50 border-green-200';
    if (score === 1) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (score === 2) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/history" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-slate-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Analysis Results</h1>
            <p className="text-slate-500 text-sm">Patient ID: {analysis.patientId} • {new Date(analysis.date).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-medium transition-colors">
            <Share2 className="w-4 h-4" />
            Share
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-lg shadow-blue-600/20">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Result Card */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image and Prediction Banner */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-200">
              <h2 className="font-semibold text-slate-900">Retinal Scan Analysis</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-0">
              <div className="bg-slate-900 flex items-center justify-center p-4 min-h-[300px]">
                <img
                  src={imageUrl || analysis.imageUrl}
                  alt="Retinal Scan"
                  className="max-w-full max-h-[300px] object-contain"
                />
              </div>
              
              <div className="p-8 flex flex-col justify-center bg-slate-50">
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">AI Prediction</p>
                <div className={`inline-block px-4 py-2 rounded-lg border mb-6 self-start ${getSeverityColor(analysis.severityScore)}`}>
                  <span className="text-2xl font-bold">{analysis.prediction}</span>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600 font-medium">Model Confidence</span>
                      <span className="text-slate-900 font-bold">{analysis.confidence}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-1000" 
                        style={{ width: `${analysis.confidence}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-slate-200 text-sm text-slate-600">
                    <div className="flex items-start gap-2">
                      <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                      <p>
                        The AI model has detected patterns consistent with <strong>{analysis.prediction}</strong>. 
                        Clinical correlation is recommended.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Findings */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-bold text-slate-900 mb-6">Detailed Findings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-lg border flex items-center justify-between ${analysis.details.microaneurysms ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-100'}`}>
                <span className="font-medium text-slate-700">Microaneurysms</span>
                {analysis.details.microaneurysms ? <AlertTriangle className="text-red-500 w-5 h-5" /> : <CheckCircle className="text-green-500 w-5 h-5" />}
              </div>
              <div className={`p-4 rounded-lg border flex items-center justify-between ${analysis.details.hemorrhages ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-100'}`}>
                <span className="font-medium text-slate-700">Hemorrhages</span>
                {analysis.details.hemorrhages ? <AlertTriangle className="text-red-500 w-5 h-5" /> : <CheckCircle className="text-green-500 w-5 h-5" />}
              </div>
              <div className={`p-4 rounded-lg border flex items-center justify-between ${analysis.details.exudates ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-100'}`}>
                <span className="font-medium text-slate-700">Hard Exudates</span>
                {analysis.details.exudates ? <AlertTriangle className="text-red-500 w-5 h-5" /> : <CheckCircle className="text-green-500 w-5 h-5" />}
              </div>
              <div className={`p-4 rounded-lg border flex items-center justify-between ${analysis.details.cottonWoolSpots ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-100'}`}>
                <span className="font-medium text-slate-700">Cotton Wool Spots</span>
                {analysis.details.cottonWoolSpots ? <AlertTriangle className="text-red-500 w-5 h-5" /> : <CheckCircle className="text-green-500 w-5 h-5" />}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar / Charts */}
        <div className="space-y-6">
          {/* Severity Scale */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-bold text-slate-900 mb-4">Severity Scale</h3>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={severityData} layout="vertical" margin={{ left: 40 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 12}} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#cbd5e1" radius={[0, 4, 4, 0]}>
                    {severityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === analysis.severityScore ? '#2563eb' : '#e2e8f0'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-slate-500 mt-2 text-center">
              Comparison against standard DR severity scale
            </p>
          </div>

          {/* Confidence Distribution */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-bold text-slate-900 mb-4">Confidence Metrics</h3>
            <div className="h-[200px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={confidenceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {confidenceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                <span className="text-3xl font-bold text-slate-900">{analysis.confidence}%</span>
                <span className="text-xs text-slate-500">Confidence</span>
              </div>
            </div>
          </div>

          {/* Action Card */}
          <div className="bg-slate-900 rounded-xl shadow-lg p-6 text-white">
            <h3 className="font-bold mb-2">Next Steps</h3>
            <p className="text-slate-300 text-sm mb-4">
              Based on the analysis result of <strong>{analysis.prediction}</strong>, the recommended action is:
            </p>
            <div className="bg-white/10 rounded-lg p-3 mb-4 backdrop-blur-sm border border-white/10">
              <p className="font-medium text-sm">
                {analysis.severityScore > 1 
                  ? "Refer to ophthalmologist for comprehensive eye exam within 2-4 weeks." 
                  : "Schedule follow-up screening in 12 months."}
              </p>
            </div>
            <button className="w-full bg-white text-slate-900 font-semibold py-2 rounded-lg hover:bg-slate-100 transition-colors">
              Generate Referral Letter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

