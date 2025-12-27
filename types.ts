
export interface GeneratedPrompt {
  id: string;
  originalQuery: string;
  engineeredPrompt: string;
  timestamp: number;
  tags: string[];
}

export enum PromptFramework {
  COSTAR = 'CO-STAR',
  ROLE_CONTEXT_TASK = 'Role-Context-Task',
  STRUCTURED_CHAIN = 'Structured Chain',
  FEW_SHOT = 'Few-Shot'
}

export interface PromptConfig {
  framework: PromptFramework;
  tone: 'Professional' | 'Creative' | 'Technical' | 'Concise';
  includeFlow: boolean;
}
