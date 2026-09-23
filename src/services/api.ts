import { QuickCaptureClassification, CitationData, CitationResult, QuizQuestion } from "../types";

export interface SummarizeResponse {
  summary: string;
  generatedAt: string;
  simpler?: boolean;
  isSimulated?: boolean;
}

export interface MathSolveResponse {
  problem: string;
  topic: string;
  finalAnswer: string;
  steps: Array<{
    stepNumber: number;
    title: string;
    latex?: string;
    explanation: string;
  }>;
  examTips?: string[];
  generatedAt: string;
  isSimulated?: boolean;
}

export interface RecommendationItem {
  topicName: string;
  urgency: string;
  scoreAnalysis: string;
  actionableAdvice: string;
  recommendedResourceIds?: string[];
}

export interface RecommendationsResponse {
  generalGuidance: string;
  recommendations: RecommendationItem[];
  generatedAt: string;
  isSimulated?: boolean;
}

export interface GenerateQuizResponse {
  quizTitle: string;
  questions: QuizQuestion[];
  generatedAt: string;
  isSimulated?: boolean;
}

export async function summarizeResource(
  title: string,
  content: string,
  type: string,
  unitName?: string,
  unitCode?: string,
  simpler: boolean = false
): Promise<SummarizeResponse> {
  const res = await fetch("/api/ai/summarize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content, type, unitName, unitCode, simpler }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Summarization failed" }));
    throw new Error(err.error || "Failed to generate summary");
  }
  return res.json();
}

export async function solveMathProblem(
  problem: string,
  unitName?: string,
  unitCode?: string,
  topic?: string
): Promise<MathSolveResponse> {
  const res = await fetch("/api/ai/math-solve", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ problem, unitName, unitCode, topic }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Math solve request failed" }));
    throw new Error(err.error || "Failed to solve problem");
  }
  return res.json();
}

export async function fetchAIRecommendations(
  weakTopics: Array<{ topicName: string; avgScore: number; assessmentsCount: number }>,
  unitName: string,
  availableResources: Array<{ id: string; title: string; type: string; topicName: string }>,
  unitCode?: string
): Promise<RecommendationsResponse> {
  const res = await fetch("/api/ai/recommendations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      weakTopics,
      unitName,
      courseName: unitName,
      unitCode,
      availableResources,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Recommendation query failed" }));
    throw new Error(err.error || "Failed to generate recommendations");
  }
  return res.json();
}

export async function generateAIQuiz(
  title: string,
  content: string,
  unitName: string,
  topicName: string,
  questionCount: number = 4,
  unitCode?: string
): Promise<GenerateQuizResponse> {
  const res = await fetch("/api/ai/generate-quiz", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title,
      content,
      unitName,
      courseName: unitName,
      unitCode,
      topicName,
      questionCount,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Quiz generation failed" }));
    throw new Error(err.error || "Failed to generate quiz");
  }
  return res.json();
}

export async function classifyQuickCaptureInput(
  input: string,
  units: Array<{
    id: string;
    code?: string;
    unitCode?: string;
    title?: string;
    name?: string;
    topics?: Array<{ id: string; name: string }>;
  }>
): Promise<QuickCaptureClassification> {
  const res = await fetch("/api/ai/quick-capture-classify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      input,
      units,
      courses: units.map((u) => ({
        id: u.id,
        code: u.unitCode || u.code || "",
        title: u.title || u.name || "",
        topics: u.topics || [],
      })),
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Quick capture classification failed" }));
    throw new Error(err.error || "Failed to auto-sort quick capture");
  }
  return res.json();
}

export async function generateAICitation(data: CitationData): Promise<CitationResult> {
  const res = await fetch("/api/ai/citation", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Citation generation failed" }));
    throw new Error(err.error || "Failed to generate citation");
  }
  return res.json();
}
