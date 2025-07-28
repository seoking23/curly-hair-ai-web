export interface HairAnalysis {
  curlPattern: {
    assessment: string;
    confidence: number;
    evidence: string;
    alternatives: string[];
  };
  porosity: {
    assessment: string;
    confidence: number;
    evidence: string;
    testSuggestions: string[];
  };
  density: {
    assessment: string;
    confidence: number;
    evidence: string;
  };
  healthScore: {
    score: number;
    confidence: number;
    factors: string[];
  };
  specificIssues: Array<{
    issue: string;
    severity: string;
    confidence: number;
    evidence: string;
  }>;
  topPainPoints: string[];
}

export interface HairCareResource {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'youtube' | 'tiktok' | 'blog' | 'product' | 'scientific';
  relevance: number; // 0-1 score
  tags: string[];
  thumbnail?: string;
  duration?: string; // for videos
  author?: string;
  source?: string;
}

export interface HairRoutine {
  routine: {
    washDay: {
      frequency: string;
      steps: RoutineStep[];
    };
    daily: {
      steps: RoutineStep[];
    };
    weekly: {
      steps: RoutineStep[];
    };
  };
  productCategories: Array<{
    category: string;
    why: string;
    ingredients: string[];
    source: string;
  }>;
  techniques: Array<{
    name: string;
    description: string;
    benefit: string;
    source: string;
  }>;
}

export interface RoutineStep {
  step: string;
  product: string;
  why: string;
  source: string;
}

export interface PhotoData {
  id: string;
  title: string;
  instruction: string;
  validation: string;
  file?: string;
  preview?: string;
}