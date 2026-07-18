export type Priority = 'High' | 'Medium' | 'Low';

export type Survey = {
  id: string;
  siteName: string;
  clientName: string;
  description: string;
  priority: Priority;
  date: string;
  photo?: string;
  photoTime?: string;
  latitude?: number;
  longitude?: number;
  accuracy?: number;
  contactName?: string;
  contactNumber?: string;
  notes?: string;
  status: 'draft' | 'submitted';
  createdAt: string;
};

export type SurveyFormData = {
  siteName: string;
  clientName: string;
  description: string;
  priority: Priority;
  date: string;
};

export type SurveyContextType = {
  surveys: Survey[];
  addSurvey: (survey: Omit<Survey, 'id' | 'createdAt' | 'status'>) => Survey;
  updateSurvey: (id: string, data: Partial<Survey>) => void;
  deleteSurvey: (id: string) => void;
  getSurveyById: (id: string) => Survey | undefined;
  todayCount: number;
};
