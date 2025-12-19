
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AppState, CreationType, DanmeiStyle, Theme, HistoryItem, CollectionItem, DanmeiKeywords, DanmeiImageKeywords } from '../types';

type Action =
  | { type: 'SET_THEME'; payload: Theme }
  | { type: 'SET_TYPE'; payload: CreationType }
  | { type: 'SET_STYLE'; payload: DanmeiStyle }
  | { type: 'SET_PROMPT'; payload: string }
  | { type: 'SET_KEYWORDS'; payload: Partial<DanmeiKeywords> }
  | { type: 'SET_IMAGE_KEYWORDS'; payload: Partial<DanmeiImageKeywords> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_RESULT'; payload: HistoryItem | null }
  | { type: 'ADD_HISTORY'; payload: HistoryItem }
  | { type: 'DELETE_HISTORY'; payload: string }
  | { type: 'SET_COLLECTIONS'; payload: CollectionItem[] }
  | { type: 'LOAD_STORAGE'; payload: Partial<AppState> };

const initialState: AppState = {
  theme: 'light',
  activeType: 'writing',
  activeStyle: 'ancient',
  prompt: '',
  keywords: {},
  imageKeywords: {},
  loading: false,
  result: null,
  history: [],
  collections: [],
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
} | undefined>(undefined);

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'SET_TYPE':
      return { 
        ...state, 
        activeType: action.payload, 
        result: null, 
        prompt: '', 
        keywords: {}, 
        imageKeywords: {} 
      };
    case 'SET_STYLE':
      return { ...state, activeStyle: action.payload };
    case 'SET_PROMPT':
      return { ...state, prompt: action.payload };
    case 'SET_KEYWORDS':
      return { ...state, keywords: { ...state.keywords, ...action.payload } };
    case 'SET_IMAGE_KEYWORDS':
      return { ...state, imageKeywords: { ...state.imageKeywords, ...action.payload } };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_RESULT':
      return { ...state, result: action.payload };
    case 'ADD_HISTORY':
      // 保持历史记录最多为 10 条
      return { 
        ...state, 
        history: [action.payload, ...state.history].slice(0, 10) 
      };
    case 'DELETE_HISTORY':
      return { 
        ...state, 
        history: state.history.filter(i => i.id !== action.payload) 
      };
    case 'SET_COLLECTIONS':
      return { ...state, collections: action.payload };
    case 'LOAD_STORAGE':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // 初始化加载
  useEffect(() => {
    const saved = localStorage.getItem('danmei_app_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        dispatch({ 
          type: 'LOAD_STORAGE', 
          payload: {
            history: (parsed.history || []).slice(0, 10),
            collections: parsed.collections || [],
            theme: parsed.theme || 'light',
            activeStyle: parsed.activeStyle || 'ancient',
            activeType: parsed.activeType || 'writing',
            keywords: parsed.keywords || {},
            imageKeywords: parsed.imageKeywords || {}
          }
        });
      } catch (e) {
        console.error("Failed to load state:", e);
      }
    }
  }, []);

  // 状态同步到本地存储
  useEffect(() => {
    localStorage.setItem('danmei_app_state', JSON.stringify({
      history: state.history,
      collections: state.collections,
      theme: state.theme,
      activeStyle: state.activeStyle,
      activeType: state.activeType,
      keywords: state.keywords,
      imageKeywords: state.imageKeywords
    }));
    document.documentElement.classList.toggle('dark', state.theme === 'dark');
  }, [
    state.history, 
    state.collections, 
    state.theme, 
    state.activeStyle, 
    state.activeType, 
    state.keywords, 
    state.imageKeywords
  ]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
