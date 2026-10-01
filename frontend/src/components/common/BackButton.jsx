import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const BackButton = ({ to, label = 'Back' }) => {
  const navigate = useNavigate();

  if (to) {
    return (
      <Link
        to={to}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 text-sm font-medium transition-colors mb-6 group w-fit"
      >
        <ArrowLeft className="w-4 h-4 text-sky-400 group-hover:-translate-x-1 transition-transform" />
        <span>{label}</span>
      </Link>
    );
  }

  return (
    <button
      onClick={() => navigate(-1)}
      type="button"
      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 text-sm font-medium transition-colors mb-6 group w-fit"
    >
      <ArrowLeft className="w-4 h-4 text-sky-400 group-hover:-translate-x-1 transition-transform" />
      <span>{label}</span>
    </button>
  );
};
