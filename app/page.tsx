"use client";

import { useState, useEffect } from "react";
import { AnalysisForm } from "@/components/AnalysisForm";
import { AnalysisResults } from "@/components/AnalysisResults";
import type { AnalysisResult } from "@/lib/types";
import GradientText from "../components/GradientText";

const SESSION_STORAGE_KEY = "gap_analysis_session";
const MAX_SESSION_AGE = 1800000; // 30 minutes

export default function Home() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [cached, setCached] = useState(false);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SESSION_STORAGE_KEY);
      if (stored) {
        const { result: storedResult, cached: storedCached, timestamp } = JSON.parse(stored);

        // Check if session is not expired (30 minutes)
        if (Date.now() - timestamp < MAX_SESSION_AGE) {
          setResult(storedResult);
          setCached(storedCached);
        } else {
          // Session expired, clear it
          localStorage.removeItem(SESSION_STORAGE_KEY);
        }
      }
    } catch (error) {
      console.error("Failed to restore session:", error);
      localStorage.removeItem(SESSION_STORAGE_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleResult = (newResult: AnalysisResult, isCached: boolean) => {
    setResult(newResult);
    setCached(isCached);

    // Save to localStorage for session persistence
    try {
      localStorage.setItem(
        SESSION_STORAGE_KEY,
        JSON.stringify({
          result: newResult,
          cached: isCached,
          timestamp: Date.now(),
        }),
      );
    } catch (error) {
      console.error("Failed to save session:", error);
    }
  };

  const handleReset = () => {
    setResult(null);
    setCached(false);
    localStorage.removeItem(SESSION_STORAGE_KEY);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="text-slate-500">Loading session...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-200 py-12 px-4">
      <div className="container mx-auto">
        <header className="text-center mb-14 px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-purple-300/30 bg-purple-200/30 mb-6 mt-2">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-purple-500"></div>
            <GradientText colors={["#000fb3", "#75008f", "#330066"]} animationSpeed={10} showBorder={false} className="text-[10px] sm:text-xs uppercase tracking-wide">
              SOLVARA: POWERED ENGINE V1.0
            </GradientText>
          </div>
          <h1 className="bg-gradient-to-b from-slate-900 to-slate-700 text-transparent bg-clip-text text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-3">Career Gap Architect</h1>
          <p className="text-sm sm:text-base lg:text-lg text-slate-600 max-w-[650px] mx-auto px-4">AI-powered analysis to identify skill gaps and create your personalized learning roadmap</p>
        </header>

        {!result ? (
          <AnalysisForm onResult={handleResult} />
        ) : (
          <div className="w-full max-w-4xl mx-auto space-y-6">
            <button type="button" onClick={handleReset} className="text-sm text-blue-600 hover:text-blue-800 underline font-medium">
              ← Start New Analysis
            </button>
            <AnalysisResults result={result} cached={cached} />
          </div>
        )}
      </div>
    </main>
  );
}
