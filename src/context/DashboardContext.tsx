import React, { createContext, useContext, useState, useEffect } from 'react';
import { DashboardState, UserMetrics, DailyActivity } from '../types';

interface DashboardContextType {
  state: DashboardState;
  updateMetrics: (metrics: Partial<UserMetrics>) => void;
  updateDaily: (date: string, activity: Partial<DailyActivity>) => void;
  updateGoals: (goals: Partial<DashboardState['goals']>) => void;
  updateOnboarding: (status: boolean) => void;
}

const defaultState: DashboardState = {
  metrics: {
    weight: 70,
    height: 170,
    age: 25,
    gender: 'male',
    activity: 'moderate',
    waist: 80,
  },
  daily: {},
  goals: {
    targetWeight: 65,
    startWeight: 75,
    dailyCalorieTarget: 2000,
    dailyWaterGoal: 8,
    dailySleepGoal: 8,
  },
  onboarded: false,
};

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<DashboardState>(() => {
    try {
      const saved = localStorage.getItem('nerroplay_dashboard_v1');
      if (!saved) return defaultState;
      
      const parsed = JSON.parse(saved);
      // Basic validation: ensure metrics exists
      if (!parsed.metrics || typeof parsed.metrics !== 'object') {
        return defaultState;
      }
      return parsed;
    } catch (err) {
      console.warn('Dashboard state data corrupted, reverting to defaults.', err);
      return defaultState;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('nerroplay_dashboard_v1', JSON.stringify(state));
    } catch (err) {
      console.error('Failed to persist dashboard state:', err);
    }
  }, [state]);

  const updateMetrics = (metrics: Partial<UserMetrics>) => {
    setState(prev => ({
      ...prev,
      metrics: { ...prev.metrics, ...metrics }
    }));
  };

  const updateDaily = (date: string, activity: Partial<DailyActivity>) => {
    setState(prev => {
      const existing = prev.daily[date] || {
        date,
        water: 0,
        calories: 0,
        sleep: 0,
        workout: false,
      };
      return {
        ...prev,
        daily: {
          ...prev.daily,
          [date]: { ...existing, ...activity }
        }
      };
    });
  };

  const updateGoals = (goals: Partial<DashboardState['goals']>) => {
    setState(prev => ({
      ...prev,
      goals: { ...prev.goals, ...goals }
    }));
  };

  const updateOnboarding = (status: boolean) => {
    setState(prev => ({
      ...prev,
      onboarded: status
    }));
  };

  return (
    <DashboardContext.Provider value={{ state, updateMetrics, updateDaily, updateGoals, updateOnboarding }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) throw new Error('useDashboard must be used within DashboardProvider');
  return context;
};
