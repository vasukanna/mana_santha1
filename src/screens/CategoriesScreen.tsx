import React from 'react';
import { useApp } from '../context/AppContext';
import { DEFAULT_CATEGORIES } from '../data/categories';
import { CategoryIcon } from '../components/CategoryIcon';
import { ArrowLeft, ChevronRight } from 'lucide-react';

export const CategoriesScreen: React.FC = () => {
  const { lang, t, setSelectedCategory, setActiveTab } = useApp();

  const handleSelectCategory = (catId: string) => {
    setSelectedCategory(catId);
    setActiveTab('home');
  };

  return (
    <div className="pb-24 pt-2">
      <div className="max-w-3xl mx-auto px-3 sm:px-4 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('home')}
            className="p-2 rounded-xl text-stone-600 hover:bg-stone-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-extrabold text-stone-900">
              {t.navCategories}
            </h1>
            <p className="text-xs text-stone-500">
              {lang === 'te' ? 'మీకు కావలసిన సరుకు లేదా పశువుల కేటగిరీని ఎంచుకోండి' : 'Browse listings by specific agricultural & rural category'}
            </p>
          </div>
        </div>

        {/* Categories List */}
        <div className="space-y-3">
          {DEFAULT_CATEGORIES.map((cat) => {
            return (
              <div
                key={cat.id}
                className="bg-white rounded-3xl border border-stone-200/90 shadow-xs overflow-hidden"
              >
                {/* Main Category Header Button */}
                <button
                  onClick={() => handleSelectCategory(cat.id)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-stone-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                      <CategoryIcon name={cat.icon} className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-stone-900 text-sm sm:text-base">
                        {lang === 'te' ? cat.nameTe : cat.nameEn}
                      </h3>
                      <p className="text-xs text-stone-500">
                        {cat.subcategories.length} {lang === 'te' ? 'రకాలు' : 'Subcategories'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-orange-600 font-bold text-xs">
                    <span>{lang === 'te' ? 'చూడండి' : 'Explore'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </button>

                {/* Subcategories Chips */}
                <div className="px-4 pb-4 pt-1 flex flex-wrap gap-1.5 border-t border-stone-100 bg-stone-50/50">
                  {cat.subcategories.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => handleSelectCategory(cat.id)}
                      className="px-2.5 py-1 rounded-xl bg-white border border-stone-200 text-stone-700 text-xs font-semibold hover:border-orange-400 hover:text-orange-700 transition-colors cursor-pointer"
                    >
                      {lang === 'te' ? sub.nameTe : sub.nameEn}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
