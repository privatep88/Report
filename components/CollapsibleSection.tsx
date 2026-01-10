
import React from 'react';

interface CollapsibleSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={`h-6 w-6 text-white transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`} 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor" 
        strokeWidth="2"
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
);

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, isOpen, onToggle, children }) => {
    return (
        <section className="mb-6 print:mb-0">
            {/* The title for print media, styled to look like the old H2s */}
            <h2 className="hidden print:block text-xl font-bold text-gray-700">{title}</h2>
            
            {/* The interactive collapsible container for screen media */}
            <div className="rounded-lg shadow-md overflow-hidden no-print">
                <button
                    type="button"
                    onClick={onToggle}
                    className="w-full flex justify-between items-center p-4 text-right bg-slate-800 text-white font-bold text-xl transition-colors duration-300 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-expanded={isOpen}
                >
                    <span>{title}</span>
                    <ChevronIcon isOpen={isOpen} />
                </button>
                <div
                    className={`collapsible-content bg-white transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'}`}
                >
                    <div className="p-6 border-t border-slate-700">
                        {children}
                    </div>
                </div>
            </div>

            {/* Content for print media, always visible */}
            <div className="hidden print:block">
                {children}
            </div>
        </section>
    );
};
