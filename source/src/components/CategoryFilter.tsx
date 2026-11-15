import React from 'react';
import { Category, PromptGroup } from '../types';
import { ArrowLeft, Layers } from 'lucide-react';

interface CategoryFilterProps {
  categories: Category[];
  prompts: PromptGroup[];
  selectedCategory: string | null;
  onSelectCategory: (catName: string | null) => void;
  accentColors: string[];
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  prompts,
  selectedCategory,
  onSelectCategory,
  accentColors,
}) => {
  const getPromptCount = (catName: string) => {
    return prompts.filter((p) => p.cat === catName).length;
  };

  const getAccentColor = (index: number, cat?: Category) => {
    return cat?.accentColor || accentColors[index % accentColors.length];
  };

  if (selectedCategory) {
    return (
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => onSelectCategory(null)}
          className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-800 shadow-2xs hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5 text-slate-600" />
          <span>전체 카테고리</span>
        </button>
        <span className="text-slate-300">/</span>
        <span className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
          <Layers className="h-4 w-4 text-cyan-600" />
          <span>{selectedCategory}</span>
        </span>
        <span className="rounded-full bg-slate-200/80 px-2 py-0.5 text-xs font-semibold text-slate-700">
          {getPromptCount(selectedCategory)}개
        </span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-6">
      {categories.map((cat, idx) => {
        const count = getPromptCount(cat.name);
        const color = getAccentColor(idx, cat);
        return (
          <button
            key={cat.name}
            onClick={() => onSelectCategory(cat.name)}
            className="group flex flex-col justify-between text-left rounded-2xl bg-white p-4 border border-slate-200 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all"
            style={{
              borderTopWidth: '4px',
              borderTopColor: color,
            }}
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xl">{cat.icon || '📁'}</span>
                <span
                  className="rounded-full px-2 py-0.5 text-[11px] font-bold text-white shadow-2xs"
                  style={{ backgroundColor: color }}
                >
                  {count}개
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-cyan-800 transition-colors">
                {cat.name}
              </h3>
              {cat.desc && (
                <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {cat.desc}
                </p>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};
