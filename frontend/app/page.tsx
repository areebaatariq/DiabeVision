"use client";

import React from 'react';
import Link from 'next/link';
import { Eye, ShieldCheck, Activity, ArrowRight, Zap, CheckCircle, BarChart3, Lock } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden selection:bg-blue-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <div className="bg-blue-600 p-1.5 rounded-lg shadow-lg shadow-blue-500/20">
              <Eye className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
              RetinaCheck
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">How it Works</a>
            <a href="#testimonials" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Testimonials</a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-white hover:text-blue-400 transition-colors hidden sm:block">
              Log in
            </Link>
            <Link
              href="/register"
              className="bg-white text-slate-950 px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg shadow-white/10"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-teal-500/10 rounded-full blur-[120px] animate-pulse delay-1000" />
          <div className="absolute top-[40%] left-[30%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[100px]" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 animate-fade-in-up">
              <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-pulse"></span>
              <span className="text-sm font-medium text-blue-200">New: Advanced AI Model v2.0 Live</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight">
              Instant Retinal Analysis <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-300 to-purple-400">
                Powered by AI
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl leading-relaxed">
              Empowering medical professionals with hospital-grade diabetic retinopathy screening in seconds. HIPAA-compliant, accurate, and easy to use.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link
                href="/register"
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-teal-500 rounded-full font-semibold text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all hover:scale-105 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Start Free Trial <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
              
              <Link
                href="/login"
                className="px-8 py-4 bg-white/5 border border-white/10 rounded-full font-semibold text-white hover:bg-white/10 backdrop-blur-md transition-all hover:scale-105"
              >
                View Demo
              </Link>
            </div>

            {/* Mockup */}
            <div className="mt-20 relative w-full max-w-5xl mx-auto perspective-1000">
              <div className="relative bg-slate-900 rounded-2xl border border-white/10 shadow-2xl shadow-blue-900/20 overflow-hidden transform rotate-x-12 hover:rotate-x-0 transition-transform duration-700 ease-out">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                <img 
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop" 
                  alt="App Dashboard" 
                  className="w-full h-auto opacity-80"
                />
                
                {/* Floating Elements */}
                <div className="absolute top-10 right-10 bg-slate-900/90 backdrop-blur-xl p-4 rounded-xl border border-white/10 shadow-xl animate-float">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-xs font-medium text-slate-300">Analysis Complete</span>
                  </div>
                  <div className="text-2xl font-bold text-white">98.5%</div>
                  <div className="text-xs text-slate-500">Confidence Score</div>
                </div>

                <div className="absolute bottom-10 left-10 bg-slate-900/90 backdrop-blur-xl p-4 rounded-xl border border-white/10 shadow-xl animate-float" style={{ animationDelay: '1s' }}>
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-blue-400" />
                    <div>
                      <div className="text-sm font-bold text-white">Mild NPDR</div>
                      <div className="text-xs text-slate-500">Detected</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Clinical-Grade Precision</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Our advanced deep learning algorithms are trained on millions of retinal images to provide instant, accurate assessments.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Instant Results",
                desc: "Get detailed analysis reports in under 5 seconds. No more waiting for manual grading.",
                color: "text-yellow-400",
                bg: "bg-yellow-400/10"
              },
              {
                icon: ShieldCheck,
                title: "HIPAA Compliant",
                desc: "Enterprise-grade security with end-to-end encryption for all patient data and images.",
                color: "text-green-400",
                bg: "bg-green-400/10"
              },
              {
                icon: BarChart3,
                title: "Detailed Analytics",
                desc: "Track patient history and disease progression with comprehensive longitudinal data.",
                color: "text-blue-400",
                bg: "bg-blue-400/10"
              }
            ].map((feature, i) => (
              <div key={i} className="group p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all hover:-translate-y-2 duration-300">
                <div className={`w-14 h-14 ${feature.bg} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-7 h-7 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-32 bg-slate-900/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/5 to-transparent" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold mb-8">Streamlined Workflow for Busy Clinics</h2>
              <div className="space-y-8">
                {[
                  {
                    step: "01",
                    title: "Upload Retinal Image",
                    desc: "Drag and drop fundus images directly from your fundus camera or local storage."
                  },
                  {
                    step: "02",
                    title: "AI Analysis",
                    desc: "Our neural networks analyze microaneurysms, hemorrhages, and exudates instantly."
                  },
                  {
                    step: "03",
                    title: "Review & Save",
                    desc: "Get a severity score, confidence metrics, and save the report to patient history."
                  }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="text-3xl font-bold text-blue-500/50 font-mono">{item.step}</div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                      <p className="text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-10">
                <Link href="/register" className="text-blue-400 font-semibold hover:text-blue-300 flex items-center gap-2 group">
                  Start your workflow <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-teal-500 rounded-2xl blur-2xl opacity-20 animate-pulse" />
              <div className="relative bg-slate-950 border border-white/10 rounded-2xl p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="text-xs text-slate-500 font-mono">analysis_result.json</div>
                </div>
                
                <div className="space-y-4 font-mono text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">"prediction":</span>
                    <span className="text-green-400">"Mild NPDR"</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">"confidence":</span>
                    <span className="text-blue-400">0.985</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">"severity_score":</span>
                    <span className="text-purple-400">1</span>
                  </div>
                  <div className="pl-4 border-l-2 border-white/10 mt-4">
                    <div className="text-slate-500 mb-2">"features_detected": [</div>
                    <div className="pl-4 text-yellow-400">"microaneurysms",</div>
                    <div className="pl-4 text-yellow-400">"hard_exudates"</div>
                    <div className="text-slate-500">]</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600/10" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/30 rounded-full blur-[100px]" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-500/30 rounded-full blur-[100px]" />
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-8">Ready to modernize your screening?</h2>
          <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
            Join leading ophthalmology clinics using RetinaCheck to improve patient outcomes.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-10 py-5 bg-white text-slate-950 rounded-full font-bold text-lg hover:bg-blue-50 transition-all transform hover:scale-105 shadow-xl shadow-white/10"
          >
            Get Started Now <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="mt-6 text-sm text-slate-500">No credit card required for trial.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-white/10 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2 font-bold text-xl">
              <Eye className="h-6 w-6 text-blue-500" />
              <span>RetinaCheck</span>
            </div>
            <div className="text-slate-500 text-sm">
              © 2024 RetinaCheck AI. All rights reserved.
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

