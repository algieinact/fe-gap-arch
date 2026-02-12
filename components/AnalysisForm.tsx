"use client";

import { useState, useEffect, useRef } from "react";
import { ApiClient } from "@/lib/api";
import type { AnalysisResult } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Upload, CheckCircle2, Zap, AlertCircle } from "lucide-react";
import { extractPdfText } from "@/lib/utils";
import { validateAIResponse, cleanupAIResponse } from "@/lib/response-validator";

interface AnalysisFormProps {
  onResult: (result: AnalysisResult, cached: boolean) => void;
}

export function AnalysisForm({ onResult }: AnalysisFormProps) {
  const [resumeText, setResumeText] = useState("");
  const [jobDescriptionText, setJobDescriptionText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loadingStage, setLoadingStage] = useState(0);
  const [isOnline, setIsOnline] = useState(true);
  const [responseValidation, setResponseValidation] = useState<{ errors: string[]; warnings: string[] } | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isSubmittingRef = useRef(false);
  const fileUploadCountRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  const componentMountedRef = useRef(true);

  const API_TIMEOUT = 120000; // 2 minutes timeout
  const MAX_RESUME_LENGTH = 10000; // 10k chars
  const MAX_JOB_DESC_LENGTH = 5000; // 5k chars
  const MAX_CONCURRENT_UPLOADS = 1; // Prevent multiple rapid uploads

  const loadingStages = [
    { label: "Parsing your resume", emoji: "📄" },
    { label: "Analyzing job requirements", emoji: "📋" },
    { label: "Identifying skill gaps", emoji: "🔍" },
    { label: "Generating learning steps", emoji: "📚" },
    { label: "Preparing interview questions", emoji: "💬" },
    { label: "Creating roadmap", emoji: "🗺️" },
  ];

  // Cleanup interval on component unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Cleanup on component unmount (prevent memory leaks)
  useEffect(() => {
    return () => {
      componentMountedRef.current = false;
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Detect online/offline status
  useEffect(() => {
    const handleOnline = () => {
      if (componentMountedRef.current) setIsOnline(true);
    };
    const handleOffline = () => {
      if (componentMountedRef.current) setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Validation helper functions
  const validateResumeFormat = (text: string): boolean => {
    // Resume should contain common sections or keywords
    const resumeKeywords = /(?:experience|education|skills|objective|summary|employment|qualification|achievement|project|technical|language|certification)/i;
    return resumeKeywords.test(text);
  };

  const validateJobDescriptionFormat = (text: string): boolean => {
    // Job description should contain job-related keywords
    const jobKeywords = /(?:responsibility|requirement|qualification|skill|experience|role|position|job|duty|candidate|apply|must|should|required|preferred)/i;
    return jobKeywords.test(text);
  };

  // Detect if resume and job description might be reversed
  const detectReversedInputs = (): { isReversed: boolean; confidence: number } => {
    // Strong resume indicators (more specific to resumes)
    const strongResumeIndicators = /(?:worked|developed|managed|designed|implemented|responsible for|achievements?|skills|technical|programming|languages?|certifications?|education|graduated|bachelor|master|diploma)/gi;

    // Strong job description indicators (more specific to job posts)
    const strongJobIndicators = /(?:we are looking|we seek|required|must have|must know|please apply|apply now|job duties|job responsibilities|must be|should be|preferred|we offer|salary|benefits|location|join our|become a|help us)/gi;

    const resumeStrongMatches = (resumeText.match(strongResumeIndicators) || []).length;
    const jobStrongMatches = (jobDescriptionText.match(strongJobIndicators) || []).length;

    const jobDescStrongMatches = (jobDescriptionText.match(strongResumeIndicators) || []).length;
    const resumeJobMatches = (resumeText.match(strongJobIndicators) || []).length;

    // Calculate probability of reversal
    const resumeScore = resumeStrongMatches;
    const jobScore = jobStrongMatches;
    const jobDescResumeScore = jobDescStrongMatches;
    const resumeJobScore = resumeJobMatches;

    // If job description has more resume indicators than actual resume, it might be reversed
    const reversalRatio = (jobDescResumeScore + resumeJobScore) / (resumeScore + jobScore + 1);

    return {
      isReversed: reversalRatio > 0.5 && (jobDescResumeScore > resumeScore || resumeJobScore > jobScore),
      confidence: Math.min(reversalRatio * 100, 100),
    };
  };

  const validateInputs = (): boolean => {
    // Check resume format
    if (resumeText.length < 50) {
      setError("❌ Resume is too short. Please provide at least 50 characters.");
      return false;
    }

    if (resumeText.length > MAX_RESUME_LENGTH) {
      setError(`❌ Resume exceeds maximum length of ${MAX_RESUME_LENGTH} characters.`);
      return false;
    }

    if (!validateResumeFormat(resumeText)) {
      setError("❌ Resume format invalid. Please include common resume sections like experience, education, or skills.");
      return false;
    }

    // Check job description format
    if (jobDescriptionText.length < 20) {
      setError("❌ Job description is too short. Please provide at least 20 characters.");
      return false;
    }

    if (jobDescriptionText.length > MAX_JOB_DESC_LENGTH) {
      setError(`❌ Job description exceeds maximum length of ${MAX_JOB_DESC_LENGTH} characters.`);
      return false;
    }

    if (!validateJobDescriptionFormat(jobDescriptionText)) {
      setError("❌ Job description format invalid. Please include job-related keywords like requirements, skills, or responsibilities.");
      return false;
    }

    // Check if resume and job description might be reversed
    const { isReversed, confidence } = detectReversedInputs();
    if (isReversed) {
      setError(`⚠️ Warning: Your inputs appear to be reversed (${confidence.toFixed(0)}% confidence). Resume should go in the Resume field, Job Description in the Job Description field.`);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check online status
    if (!isOnline) {
      setError("🔌 No internet connection. Please check your network and try again.");
      return;
    }

    // Prevent duplicate submissions
    if (isSubmittingRef.current || loading) {
      setError("❌ Analysis already in progress. Please wait...");
      return;
    }

    // Validate inputs before submitting
    if (!validateInputs()) {
      return;
    }

    isSubmittingRef.current = true;
    setError("");
    setLoading(true);
    setLoadingStage(0);

    // Create abort controller for cancellation
    abortControllerRef.current = new AbortController();

    // Simulate progress through stages with timeout
    let stageCount = 0;
    progressIntervalRef.current = setInterval(() => {
      stageCount++;
      setLoadingStage((prev) => {
        if (prev < loadingStages.length - 1) {
          return prev + 1;
        }
        return prev;
      });

      // Stop progress after 8 stages to prevent continuous loop
      if (stageCount >= loadingStages.length * 2) {
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
        }
      }
    }, 1200);

    // Set timeout for API request
    timeoutIdRef.current = setTimeout(() => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      setLoading(false);
      setError("⏱️ Request timeout. The analysis took too long. Please try again with a retry button.");
      isSubmittingRef.current = false;
    }, API_TIMEOUT);

    try {
      const response = await ApiClient.analyzeGap(
        {
          resumeText: resumeText.trim(),
          jobDescriptionText: jobDescriptionText.trim(),
        },
        abortControllerRef.current.signal,
      );

      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = null;
      }

      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }

      // Only proceed if component is still mounted
      if (!componentMountedRef.current) return;

      const data = response.data;

      // Validate AI response quality
      const validation = validateAIResponse(data, jobDescriptionText);

      // Clean up response (remove duplicates, etc.)
      const cleanedData = cleanupAIResponse(data);

      if (!validation.isValid) {
        // Show critical errors
        setError(`❌ AI response validation failed:\n${validation.errors.join("\n")}`);
        setResponseValidation({ errors: validation.errors, warnings: [] });
        return;
      }

      if (validation.warnings.length > 0) {
        // Show warnings but allow proceed
        setResponseValidation({ errors: [], warnings: validation.warnings });
      }

      onResult(
        {
          id: cleanedData.id,
          missingSkills: cleanedData.missingSkills,
          learningSteps: cleanedData.learningSteps,
          interviewQuestions: cleanedData.interviewQuestions,
          roadmapMarkdown: cleanedData.roadmapMarkdown,
          createdAt: typeof cleanedData.createdAt === "string" ? cleanedData.createdAt : (cleanedData.createdAt as Date).toISOString(),
        },
        response.cached,
      );
    } catch (err) {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = null;
      }

      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }

      // Check if component still mounted
      if (!componentMountedRef.current) return;

      // Check if error is from abort
      if (err instanceof Error && err.name === "AbortError") {
        setError("❌ Analysis cancelled. Feel free to try again.");
      } else if (!isOnline) {
        setError("🔌 Network error: You appear to be offline. Please check your connection and try again.");
      } else if (err instanceof Error && err.message.includes("404")) {
        setError("❌ API endpoint not found. Please check your configuration.");
      } else if (err instanceof Error && err.message.includes("502")) {
        setError("❌ Backend server error. Please try again later.");
      } else {
        const errorMessage = err instanceof Error ? err.message : "An error occurred";
        setError(`❌ ${errorMessage}`);
      }
    } finally {
      setLoading(false);
      setLoadingStage(0);
      isSubmittingRef.current = false;
      abortControllerRef.current = null;
    }
  };

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    setLoading(false);
    setLoadingStage(0);
    isSubmittingRef.current = false;
    setError("❌ Analysis cancelled.");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, setter: (text: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Prevent multiple rapid uploads
    if (fileUploadCountRef.current >= MAX_CONCURRENT_UPLOADS) {
      setError("❌ Please wait for the previous upload to complete");
      return;
    }

    fileUploadCountRef.current++;

    try {
      // Validate file type
      if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
        setError("❌ Only PDF files are allowed");
        return;
      }

      // Validate file size (2 MB limit)
      const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB
      if (file.size > MAX_FILE_SIZE) {
        setError(`❌ File size exceeds 2 MB limit. Your file is ${(file.size / (1024 * 1024)).toFixed(2)} MB`);
        return;
      }

      let text = "";

      // Extract text from PDF
      text = await extractPdfText(file);

      // Validate extracted text has reasonable content
      if (!text || text.trim().length < 20) {
        setError("❌ PDF appears to be empty or contains no readable text. Please check your PDF file.");
        return;
      }

      // Enforce max character limit
      if (setter === setResumeText && text.length > MAX_RESUME_LENGTH) {
        setError(`❌ Resume exceeds maximum length of ${MAX_RESUME_LENGTH} characters. Current: ${text.length} chars`);
        return;
      }

      if (setter === setJobDescriptionText && text.length > MAX_JOB_DESC_LENGTH) {
        setError(`❌ Job description exceeds maximum length of ${MAX_JOB_DESC_LENGTH} characters. Current: ${text.length} chars`);
        return;
      }

      setter(text);
      setError(""); // Clear any previous errors
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Failed to read file";

      // Specific error handling for encrypted PDF
      if (errorMsg.includes("encrypted") || errorMsg.includes("password")) {
        setError("🔐 PDF is encrypted or password-protected. Please provide an unencrypted PDF.");
      } else if (errorMsg.includes("Invalid PDF")) {
        setError("📄 Invalid PDF file. Please ensure the file is a valid PDF.");
      } else {
        setError(`❌ ${errorMsg}`);
      }
      console.error("File upload error:", error);
    } finally {
      fileUploadCountRef.current--;
    }
  };

  const isValid = resumeText.length >= 50 && jobDescriptionText.length >= 20 && validateResumeFormat(resumeText) && validateJobDescriptionFormat(jobDescriptionText);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Career Gap Analysis</CardTitle>
        <CardDescription>Upload or paste your resume and target job description to discover your learning path</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isOnline && (
            <div className="p-4 text-sm text-orange-800 bg-orange-50 border border-orange-200 rounded-md flex items-center gap-2">
              <span>🔌</span>
              <span>Offline mode - Some features may not work properly</span>
            </div>
          )}
          {error && <div className="p-4 text-sm text-red-800 bg-red-50 border border-red-200 rounded-md">{error}</div>}
          <div className="space-y-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold">Resume</label>
                <div>
                  <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById("resume-file")?.click()}>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload File
                  </Button>
                  <input id="resume-file" type="file" accept=".pdf" className="hidden" onChange={(e) => handleFileUpload(e, setResumeText)} />
                    <p className="text-[12px] text-slate-500 mt-1 text-center italic">File format: PDF</p>
                </div>
              </div>
            </div>
            <Textarea
              placeholder="Paste your resume here (minimum 50 characters)..."
              value={resumeText}
              onChange={(e) => {
                if (e.target.value.length <= MAX_RESUME_LENGTH) {
                  setResumeText(e.target.value);
                }
              }}
              className="min-h-[200px] font-mono text-sm"
            />
            <p className="text-xs text-slate-500">
              {resumeText.length} / {MAX_RESUME_LENGTH} characters
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold">Job Description</label>
            <Textarea
              placeholder="Paste target job description here (minimum 20 characters)..."
              value={jobDescriptionText}
              onChange={(e) => {
                if (e.target.value.length <= MAX_JOB_DESC_LENGTH) {
                  setJobDescriptionText(e.target.value);
                }
              }}
              className="min-h-[200px] font-mono text-sm"
            />
            <p className="text-xs text-slate-500">
              {jobDescriptionText.length} / {MAX_JOB_DESC_LENGTH} characters
            </p>
          </div>

          {loading && (
            <div className="p-6 bg-gradient-to-r from-gray-100 to-gray-100 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-5 h-5 text-gray-600 animate-pulse" />
                <h3 className="font-semibold text-gray-900">Analyzing your career gap...</h3>
              </div>

              {/* Progress Stages */}
              <div className="space-y-2">
                {loadingStages.map((stage, index) => (
                  <div key={index} className="flex items-center gap-3">
                    {index < loadingStage ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    ) : index === loadingStage ? (
                      <Loader2 className="w-5 h-5 text-blue-600 animate-spin flex-shrink-0" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0" />
                    )}
                    <span className={`text-sm ${index <= loadingStage ? "text-gray-700 font-medium" : "text-gray-500"}`}>
                      {stage.emoji} {stage.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Loading Bar */}
              <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${((loadingStage + 1) / loadingStages.length) * 100}%` }} />
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button type="submit" disabled={!isValid || loading} className="flex-1">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze Gap"
              )}
            </Button>
            {loading && (
              <Button type="button" variant="outline" onClick={handleCancel} className="px-6 text-red-600 hover:bg-red-50 hover:text-red-700">
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
