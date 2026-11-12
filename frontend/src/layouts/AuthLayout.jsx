import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <Link to="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-[#315CF5] flex items-center justify-center text-white shadow-xs group-hover:bg-[#1F47DC] transition-all">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <span className="font-extrabold text-2xl text-[#172033] tracking-tight">StockLens</span>
        </Link>
        <h2 className="mt-4 text-xl font-bold text-[#172033] tracking-tight">
          AI Investment Due Diligence Platform
        </h2>
        <p className="mt-1 text-xs text-[#68758A]">
          Verify physical locations, audit financial health, and detect red flags.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-white border border-[#E6EAF0] py-8 px-6 shadow-card rounded-2xl sm:px-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
