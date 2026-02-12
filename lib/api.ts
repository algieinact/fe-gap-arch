import type { AnalysisRequest, AnalysisResponse, ApiError } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export class ApiClient {
  static async analyzeGap(data: AnalysisRequest, signal?: AbortSignal): Promise<AnalysisResponse> {
    const response = await fetch(`${API_URL}/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      signal,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error((result as ApiError).error || "Analysis failed");
    }

    // ✅ Wrap result sesuai struktur yang diharapkan AnalysisForm
    return {
      data: result,
      cached: result.cached ?? false,
    } as AnalysisResponse;
  }
}