import React, { createContext, useContext, useState, useCallback } from 'react';
import { researchService } from '../services/researchService.js';

const ResearchContext = createContext(null);

export const ResearchProvider = ({ children }) => {
  const [currentReport, setCurrentReport] = useState(null);
  const [history, setHistory] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      const stats = await researchService.getDashboardStats();
      setDashboardStats(stats);
      return stats;
    } catch (err) {
      console.error('Failed to load dashboard stats:', err.message);
    }
  }, []);

  const fetchHistory = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const res = await researchService.getHistory(params);
      setHistory(res.data || []);
      setLoading(false);
      return res;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  const initiateResearch = async (companyName, ticker = '', domain = '') => {
    setLoading(true);
    setError(null);
    try {
      const report = await researchService.initiate({ companyName, ticker, domain });
      setCurrentReport(report);
      setLoading(false);
      return report;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  return (
    <ResearchContext.Provider
      value={{
        currentReport,
        setCurrentReport,
        history,
        dashboardStats,
        loading,
        error,
        fetchStats,
        fetchHistory,
        initiateResearch,
      }}
    >
      {children}
    </ResearchContext.Provider>
  );
};

export const useResearch = () => {
  const context = useContext(ResearchContext);
  if (!context) {
    throw new Error('useResearch must be used within a ResearchProvider');
  }
  return context;
};

