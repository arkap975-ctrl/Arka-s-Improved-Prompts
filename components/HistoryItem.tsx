
import React from 'react';
import { GeneratedPrompt } from '../types';

interface HistoryItemProps {
  item: GeneratedPrompt;
  onSelect: (item: GeneratedPrompt) => void;
  onDelete: (id: string) => void;
}

export const HistoryItem: React.FC<HistoryItemProps> = ({ item, onSelect, onDelete }) => {
  return (
    <div className="group relative bg-slate-800/50 border border-slate-700 p-3 rounded-lg hover:border-blue-500/50 cursor-pointer transition-colors">
      <div onClick={() => onSelect(item)} className="pr-8">
        <p className="text-sm font-medium text-slate-200 truncate">{item.originalQuery}</p>
        <p className="text-xs text-slate-500 mt-1">
          {new Date(item.timestamp).toLocaleDateString()}
        </p>
      </div>
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onDelete(item.id);
        }}
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-opacity"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
      </button>
    </div>
  );
};
