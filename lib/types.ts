export interface AnalysisRequest {
  resumeText: string;
  jobDescriptionText: string;
}

export interface AnalysisResult {
  id: string;
  missingSkills: string[];
  learningSteps: string[];
  interviewQuestions: string[];
  roadmapMarkdown: string;
  createdAt: string;
}

export interface AnalysisResponse {
  success: boolean;
  cached: boolean;
  data: AnalysisResult;
}

export interface ApiError {
  success: false;
  error: string;
  details?: unknown;
}
