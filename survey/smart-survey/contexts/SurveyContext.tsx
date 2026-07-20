import React, { createContext, useContext, useState, useCallback } from 'react';
import { Survey, SurveyContextType } from '@/types/survey';

const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

const initialSurveys: Survey[] = [
  {
    id: 'SRV-001',
    siteName: 'Downtown Office Complex',
    clientName: 'ABC Corporation',
    description: 'Full structural inspection of the 12-story office building including foundation, load-bearing walls, and rooftop.',
    priority: 'High',
    date: 'Jul 18, 2026',
    status: 'submitted',
    createdAt: '2026-07-18T09:00:00Z',
  },
  {
    id: 'SRV-002',
    siteName: 'Riverside Mall',
    clientName: 'Metro Properties',
    description: 'Routine inspection of fire exits, electrical systems, and plumbing across 3 floors.',
    priority: 'Medium',
    date: 'Jul 17, 2026',
    status: 'submitted',
    createdAt: '2026-07-17T14:30:00Z',
  },
  {
    id: 'SRV-003',
    siteName: 'Green Valley Residential',
    clientName: 'HomeBuild Inc.',
    description: 'Pre-handover inspection of newly constructed residential block B.',
    priority: 'Low',
    date: 'Jul 16, 2026',
    status: 'draft',
    createdAt: '2026-07-16T10:15:00Z',
  },
];

export function SurveyProvider({ children }: { children: React.ReactNode }) {
  const [surveys, setSurveys] = useState<Survey[]>(initialSurveys);

  const generateId = () => {
    const num = String(surveys.length + 1).padStart(3, '0');
    return `SRV-${num}`;
  };

  const addSurvey = useCallback(
    (surveyData: Omit<Survey, 'id' | 'createdAt' | 'status'>) => {
      const newSurvey: Survey = {
        ...surveyData,
        id: generateId(),
        status: 'draft',
        createdAt: new Date().toISOString(),
      };
      setSurveys((prev) => [newSurvey, ...prev]);
      return newSurvey;
    },
    [surveys.length]
  );

  const updateSurvey = useCallback((id: string, data: Partial<Survey>) => {
    setSurveys((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...data } : s))
    );
  }, []);

  const deleteSurvey = useCallback((id: string) => {
    setSurveys((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const getSurveyById = useCallback(
    (id: string) => surveys.find((s) => s.id === id),
    [surveys]
  );

  const todayCount = surveys.filter(
    (s) => s.date === new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  ).length;

  return (
    <SurveyContext.Provider
      value={{ surveys, addSurvey, updateSurvey, deleteSurvey, getSurveyById, todayCount }}
    >
      {children}
    </SurveyContext.Provider>
  );
}

export function useSurvey() {
  const context = useContext(SurveyContext);
  if (!context) {
    throw new Error('useSurvey must be used within a SurveyProvider');
  }
  return context;
}
