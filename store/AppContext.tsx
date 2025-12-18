
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AppState, CreationType, DanmeiStyle, Theme, HistoryItem, DanmeiContent, CollectionItem, DanmeiKeywords } from '../types';

type Action =
  | { type: 'SET_THEME'; payload: Theme }
  | { type: 'SET_TYPE'; payload: CreationType }
  | { type: 'SET_STYLE'; payload: DanmeiStyle }
  | { type: 'SET_PROMPT'; payload: string }
  | { type: 'SET_KEYWORDS'; payload: Partial<DanmeiKeywords> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_RESULT'; payload: DanmeiContent | null }
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
      return { ...state, activeType: action.payload, result: null, prompt: '', keywords: {} };
    case 'SET_STYLE':
      return { ...state, activeStyle: action.payload };
    case 'SET_PROMPT':
      return { ...state, prompt: action.payload };
    case 'SET_KEYWORDS':
      return { ...state, keywords: { ...state.keywords, ...action.payload } };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_RESULT':
      return { ...state, result: action.payload };
    case 'ADD_HISTORY':
      return { ...state, history: [action.payload, ...state.history].slice(0, 20) };
    case 'DELETE_HISTORY':
      return { ...state, history: state.history.filter(i => i.id !== action.payload) };
    case 'SET_COLLECTIONS':
      return { ...state, collections: action.payload };
    case 'LOAD_STORAGE':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const saved = localStorage.getItem('danmei_app_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        dispatch({ type: 'LOAD_STORAGE', payload: {
          history: parsed.history || [],
          collections: parsed.collections || [],
          theme: parsed.theme || 'light',
          activeStyle: parsed.activeStyle || 'ancient',
          activeType: parsed.activeType || 'writing',
          keywords: parsed.keywords || {}
        }});
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('danmei_app_state', JSON.stringify({
      history: state.history,
      collections: state.collections,
      theme: state.theme,
      activeStyle: state.activeStyle,
      activeType: state.activeType,
      keywords: state.keywords
    }));
    document.documentElement.classList.toggle('dark', state.theme === 'dark');
  }, [state.history, state.collections, state.theme, state.activeStyle, state.activeType, state.keywords]);

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
