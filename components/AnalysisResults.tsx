import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SkillTags } from "./SkillTags";
import { MarkdownViewer } from "./MarkdownViewer";
import type { AnalysisResult } from "@/lib/types";
import { CheckCircle2, Target, MessageSquare, Map } from "lucide-react";

interface AnalysisResultsProps {
  result: AnalysisResult;
  cached: boolean;
}

export function AnalysisResults({ result, cached }: AnalysisResultsProps) {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {cached && (
        <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
          <span className="text-sm text-blue-800">
            Loaded from cache - identical analysis found
          </span>
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-slate-700" />
            <CardTitle>Missing Skills</CardTitle>
          </div>
          <CardDescription>
            Skills required in the job description but not present in your
            resume
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SkillTags skills={result.missingSkills} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Map className="w-5 h-5 text-slate-700" />
            <CardTitle>Learning Steps</CardTitle>
          </div>
          <CardDescription>Concrete actions to bridge the gap</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3">
            {result.learningSteps.map((step, index) => (
              <li key={index} className="flex gap-3">
                <Badge
                  variant="outline"
                  className="h-6 w-6 p-0 flex items-center justify-center shrink-0"
                >
                  {index + 1}
                </Badge>
                <p className="text-sm leading-relaxed text-slate-700">{step}</p>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-slate-700" />
            <CardTitle>Interview Questions</CardTitle>
          </div>
          <CardDescription>
            Practice questions targeting your skill gaps
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3">
            {result.interviewQuestions.map((question, index) => (
              <li key={index} className="flex gap-3">
                <Badge
                  variant="outline"
                  className="h-6 w-6 p-0 flex items-center justify-center shrink-0"
                >
                  {index + 1}
                </Badge>
                <p className="text-sm leading-relaxed text-slate-700">
                  {question}
                </p>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Learning Roadmap</CardTitle>
          <CardDescription>
            Detailed path to achieve your career goals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MarkdownViewer content={result.roadmapMarkdown} />
        </CardContent>
      </Card>
    </div>
  );
}
