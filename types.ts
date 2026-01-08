
export enum Difficulty {
  EASY = '入门 (Easy)',
  MEDIUM = '进阶 (Medium)',
  HARD = '挑战 (Hard)'
}

export interface Mountain {
  id: string;
  name: string;
  englishName: string;
  description: string;
  difficulty: Difficulty;
  height: string;
  estimatedTime: string;
  imageUrl: string;
  features: string[];
}

export interface WeatherInfo {
  condition: string;
  temp: number;
  description: string;
}

export interface AIAdvice {
  equipment: string[];
  food: string[];
  tips: string;
}

export interface UserStats {
  climbedIds: string[];
  points: number;
  rank: string;
}

export interface Guide {
  title: string;
  content: string;
  category: 'safety' | 'spot' | 'etiquette';
}
