
export type CreationType = 'writing' | 'drawing' | 'inspiration';
export type DanmeiStyle = 'ancient' | 'modern' | 'fantasy' | 'cyberpunk' | 'campus';
export type Theme = 'light' | 'dark';

export interface DanmeiKeywords {
  seme?: string;
  uke?: string;
  era?: string;
  relationship?: string;
  plot?: string;
  length?: string;
}

export interface DanmeiContent {
  title?: string;
  body?: string;
  pairings?: string;
  traits?: string[];
  imageUrl?: string;
  description?: string;
  plotHooks?: string[];
}

export interface HistoryItem {
  id: string;
  type: CreationType;
  style?: DanmeiStyle;
  prompt: string;
  keywords?: DanmeiKeywords;
  content: DanmeiContent;
  timestamp: number;
}

export interface CollectionItem extends HistoryItem {
  collectedAt: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error?: string;
  status: number;
}

export interface AppState {
  theme: Theme;
  activeType: CreationType;
  activeStyle: DanmeiStyle;
  prompt: string;
  keywords: DanmeiKeywords;
  loading: boolean;
  result: DanmeiContent | null;
  history: HistoryItem[];
  collections: CollectionItem[];
}
