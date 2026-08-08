export type ThemeMode = 'dark' | 'light';

export interface CurriculumDay {
  day: number;
  module: string;
  topic: string;
  description: string;
  learningObjectives: string[];
  tools: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  keyConcepts: string[];
}

export interface CandidateProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  cohort: string;
  completedDays: number[]; // e.g. [1, 2, 3, ... 24]
  skippedDays: number[];
  attemptsCount: number;
  avgScore: number; // 0-100
  strengths: string[];
  areasToImprove: string[];
  interviewFocus: string[];
  learningSignals: {
    ragMastery: number;
    vectorDbProficiency: number;
    promptEngineeringScore: number;
    agenticAiScore: number;
    mcpUnderstanding: number;
    deploymentReadiness: number;
  };
}

export interface InterviewQuestion {
  id: string;
  day: number;
  module: string;
  topic: string;
  questionText: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  type: 'Conceptual' | 'Coding' | 'System Design' | 'Practical';
  expectedKeyPoints: string[];
  sampleIdealAnswer: string;
}

export interface QuestionAnswerRecord {
  questionId: string;
  questionNumber: number;
  day: number;
  module: string;
  topic: string;
  questionText: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  type: 'Conceptual' | 'Coding' | 'System Design' | 'Practical';
  candidateAnswer: string;
  score: number; // 0-100
  evaluationLabel: 'Excellent' | 'Good Answer' | 'Partial Answer' | 'Needs Improvement';
  feedback: string;
  followUpTriggered: boolean;
  idealKeyPointsCovered: string[];
  idealKeyPointsMissed: string[];
  errorsIdentified?: string[];
  penaltyApplied?: boolean;
  sampleIdealAnswer?: string;
}

export interface InterviewSession {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateAvatar: string;
  startTime: string;
  endTime?: string;
  status: 'in_progress' | 'completed';
  currentQuestionIndex: number; // 0-indexed (1 to 8+)
  totalQuestions: number; // Minimum 8
  daysCovered: number[];
  visited_curriculum_days?: number[];
  currentQuestion?: InterviewQuestion;
  transcript: QuestionAnswerRecord[];
  interviewerNotes: string;
  activeSteerConstraint?: string;
  overallScore?: number;
}

export interface FinalReport {
  interviewId: string;
  candidateName: string;
  completedAt: string;
  overallScore: number; // e.g. 85
  gradeLabel: 'Mastery' | 'Excellent' | 'Competent' | 'Needs Revision';
  scoreBreakdown: {
    technicalKnowledge: number;
    conceptualUnderstanding: number;
    problemSolving: number;
    systemDesign: number;
    communication: number;
  };
  strengths: string[];
  areasToImprove: string[];
  recommendedActionPlan: string[];
  questionPerformance: QuestionAnswerRecord[];
  daysEvaluated: number[];
  visited_curriculum_days?: number[];
  summaryParagraph: string;
}

export interface ApiTechSpec {
  version: string;
  title: string;
  description: string;
  endpoints: {
    method: string;
    path: string;
    description: string;
    requestBody?: object;
    responseExample: object;
  }[];
}
