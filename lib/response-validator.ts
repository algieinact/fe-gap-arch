import type { AnalysisResult } from "./types";

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Check if skills are relevant to job description
 */
const checkSkillsRelevance = (skills: string[], jobDescription: string): boolean => {
  if (skills.length === 0) return false;

  // Extract job keywords
  const jobKeywords = jobDescription.toLowerCase().match(/\b\w+\b/g) || [];

  const relevantSkills = skills.filter((skill) => {
    const skillWords = skill.toLowerCase().split(/\s+/);
    return skillWords.some((word) =>
      jobKeywords.some((keyword) => {
        // Check for similar keywords (not exact match, but related)
        return keyword.includes(word) || word.includes(keyword) || (word.length > 3 && keyword.includes(word));
      }),
    );
  });

  // At least 30% of skills should be relevant to job
  const relevanceRatio = relevantSkills.length / skills.length;
  return relevanceRatio >= 0.3;
};

/**
 * Check for duplicate items in array
 */
const findDuplicates = (items: string[]): string[] => {
  const seen = new Set<string>();
  const duplicates: string[] = [];

  items.forEach((item) => {
    const normalized = item.toLowerCase().trim();
    if (seen.has(normalized) && !duplicates.includes(normalized)) {
      duplicates.push(normalized);
    }
    seen.add(normalized);
  });

  return duplicates;
};

/**
 * Check if content is too generic
 */
const isGenericContent = (content: string): boolean => {
  const genericPatterns = [
    /^(improve|enhance|develop|learn|understand|master|gain)\s+\w+\s*(skills?|knowledge|understanding)$/i,
    /^(learn|study|read)\s+(about|the)\s+\w+$/i,
    /^improve\s+(your\s+)?general\s+(programming|coding)\s+(skills?|knowledge)$/i,
    /^take\s+a\s+(course|class)\s+(on|in)\s+\w+$/i,
  ];

  return genericPatterns.some((pattern) => pattern.test(content.trim()));
};

/**
 * Validate AI Response Quality
 */
export const validateAIResponse = (result: AnalysisResult, jobDescription: string): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 1. Check for missing fields
  if (!result.missingSkills || result.missingSkills.length === 0) {
    errors.push("Missing skills list is empty or invalid");
  }

  if (!result.learningSteps || result.learningSteps.length === 0) {
    errors.push("Learning steps list is empty or invalid");
  }

  if (!result.interviewQuestions || result.interviewQuestions.length === 0) {
    errors.push("Interview questions list is empty or invalid");
  }

  if (!result.roadmapMarkdown || result.roadmapMarkdown.trim().length < 100) {
    errors.push("Roadmap markdown is missing or too short");
  }

  if (!result.id || result.id.trim().length === 0) {
    warnings.push("Analysis ID is missing");
  }

  // 2. Check for duplicate items
  const duplicateSkills = findDuplicates(result.missingSkills || []);
  if (duplicateSkills.length > 0) {
    warnings.push(`Found ${duplicateSkills.length} duplicate skills in the list`);
  }

  const duplicateQuestions = findDuplicates(result.interviewQuestions || []);
  if (duplicateQuestions.length > 0) {
    warnings.push(`Found ${duplicateQuestions.length} duplicate interview questions`);
  }

  // 3. Check for generic learning steps
  const genericSteps = (result.learningSteps || []).filter((step) => isGenericContent(step));
  if (genericSteps.length > 0) {
    warnings.push(`Found ${genericSteps.length} generic or vague learning steps. Consider more specific actions.`);
  }

  // 4. Check skill relevance to job description
  if (result.missingSkills && result.missingSkills.length > 0 && !checkSkillsRelevance(result.missingSkills, jobDescription)) {
    warnings.push("Many identified skills may not be relevant to the target job. Please review the analysis.");
  }

  // 5. Check content length and quality
  if (result.missingSkills && result.missingSkills.length > 50) {
    warnings.push("Very large number of missing skills identified. Analysis may be too broad.");
  }

  // 6. Check for reasonable number of items
  if (result.interviewQuestions && result.interviewQuestions.length > 30) {
    warnings.push("Very large number of interview questions. May be overwhelming.");
  }

  // 7. Validate data types
  if (!Array.isArray(result.missingSkills)) {
    errors.push("Missing skills is not an array");
  }

  if (!Array.isArray(result.learningSteps)) {
    errors.push("Learning steps is not an array");
  }

  if (!Array.isArray(result.interviewQuestions)) {
    errors.push("Interview questions is not an array");
  }

  if (typeof result.roadmapMarkdown !== "string") {
    errors.push("Roadmap markdown is not a string");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

/**
 * Clean up and fix common issues in AI response
 */
export const cleanupAIResponse = (result: AnalysisResult): AnalysisResult => {
  return {
    ...result,
    missingSkills: Array.from(new Set((result.missingSkills || []).map((s) => s.trim()).filter((s) => s.length > 0))),
    learningSteps: Array.from(new Set((result.learningSteps || []).map((s) => s.trim()).filter((s) => s.length > 0))),
    interviewQuestions: Array.from(new Set((result.interviewQuestions || []).map((q) => q.trim()).filter((q) => q.length > 0))),
  };
};
