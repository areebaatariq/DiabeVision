"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { getAnalyses, type AnalysisResult } from "@/lib/api";
import { Upload, History, Activity, ArrowRight, FileText, AlertCircle } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const [recentAnalyses, setRecentAnalyses] = useState<AnalysisResult[]>([]);
  const [stats, setStats] = useState({ total: 0, flagged: 0, thisMonth: 0 });

  useEffect(() => {
    getAnalyses()
      .then((data) => {
        setRecentAnalyses(data.slice(0, 5));
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const thisMonth = data.filter((a) => new Date(a.date) >= startOfMonth).length;
        const flagged = data.filter((a) => a.severityScore > 0).length;
        setStats({ total: data.length, flagged, thisMonth });
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1">Welcome back, {user?.name}. Here's your daily overview.</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/analyze"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-lg shadow-blue-600/20"
          >
            <Upload className="w-4 h-4" />
            New Analysis
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">This month</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">{stats.thisMonth}</h3>
          <p className="text-sm text-slate-500">Total Analyses This Month</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-teal-100 p-3 rounded-lg">
              <FileText className="w-6 h-6 text-teal-600" />
            </div>
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">Last 30 days</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">{stats.flagged}</h3>
          <p className="text-sm text-slate-500">Cases Flagged for Review</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <History className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">Total</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">{stats.total}</h3>
          <p className="text-sm text-slate-500">Lifetime Scans</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Recent Analyses</h2>
          <Link href="/history" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium">
              <tr>
                <th className="px-6 py-4">Patient ID</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Prediction</th>
                <th className="px-6 py-4">Confidence</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {recentAnalyses.map((analysis) => (
                <tr key={analysis.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{analysis.patientId}</td>
                  <td className="px-6 py-4 text-slate-500">{new Date(analysis.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      analysis.prediction === "No DR"
                        ? "bg-green-100 text-green-800"
                        : "bg-amber-100 text-amber-800"
                    }`}>
                      {analysis.prediction}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${analysis.confidence}%` }}
                        />
                      </div>
                      {analysis.confidence}%
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                      Pending
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/results/${analysis.id}`} className="text-slate-400 hover:text-blue-600 transition-colors inline-block">
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-500 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-start gap-4">
          <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
            <AlertCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold mb-1">Best Practices for Image Upload</h3>
            <p className="text-blue-50 text-sm leading-relaxed max-w-2xl">
              Ensure retinal images are well-focused and evenly illuminated. Avoid glare and shadows for the most accurate AI analysis results. Supported formats: JPG, PNG.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

