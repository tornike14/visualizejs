export interface TheoryMistake {
  title: string;
  explanation: string;
  fix: string;
}

export interface TheoryCodeExample {
  code: string;
  language?: string;
}

export interface TheoryInterviewQuestion {
  question: string;
  answer: string;
  codeExample?: TheoryCodeExample;
}

export interface TopicTheoryContent {
  summary: string;
  whatItIs: string[];
  howItWorks: string[];
  commonMistakes: TheoryMistake[];
  interviewQuestions: TheoryInterviewQuestion[];
  relatedTopicIds: string[];
}
