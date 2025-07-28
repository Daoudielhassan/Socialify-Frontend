import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// @ts-ignore
import { apiService } from '../services/api';

export interface Message {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  timestamp: string;
  source: 'gmail' | 'whatsapp';
  priority: 'very_urgent' | 'important' | 'not_important';
  context: 'business' | 'personal';
  confidence: number;
  isRead: boolean;
  fullContent?: string;
}

export interface AnalyticsData {
  contextData: Array<{ name: string; value: number; color: string }>;
  priorityData: Array<{ name: string; very_urgent: number; important: number; not_important: number }>;
  feedbackData: Array<{ name: string; correct: number; incorrect: number }>;
  messageVolumeData: Array<{ name: string; messages: number }>;
  totalMessages: number;
  urgentMessages: number;
  accuracyRate: number;
}

interface DataContextType {
  messages: Message[];
  analytics: AnalyticsData | null;
  isLoadingMessages: boolean;
  isLoadingAnalytics: boolean;
  error: string | null;
  
  // Message operations
  fetchMessages: (params?: any) => Promise<void>;
  triggerMessageFetch: (source?: 'gmail' | 'whatsapp') => Promise<void>;
  submitFeedback: (messageId: string, correctedPriority: string, correctedContext: string) => Promise<void>;
  predictMessage: (messageData: any) => Promise<any>;
  
  // Analytics operations
  fetchAnalytics: (timeRange?: string) => Promise<void>;
  
  // Utility functions
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

interface DataProviderProps {
  children: ReactNode;
}

export function DataProvider({ children }: DataProviderProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch messages from the API
  const fetchMessages = async (params = {}) => {
    try {
      setIsLoadingMessages(true);
      setError(null);
      
      const response = await apiService.getMessages(params);
      
      if (response.messages && Array.isArray(response.messages)) {
        setMessages(response.messages);
      } else {
        console.warn('Invalid messages response format:', response);
        setMessages([]);
      }
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      setError(error.message || 'Failed to fetch messages');
      setMessages([]);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  // Trigger message fetch from Gmail/WhatsApp
  const triggerMessageFetch = async (source: 'gmail' | 'whatsapp' = 'gmail') => {
    try {
      setError(null);
      
      const response = await apiService.fetchMessages(source);
      
      if (response.success) {
        // Refresh messages after fetch
        await fetchMessages();
      }
      
      return response;
    } catch (error: any) {
      console.error('Error triggering message fetch:', error);
      setError(error.message || 'Failed to fetch new messages');
      throw error;
    }
  };

  // Submit feedback for message prediction
  const submitFeedback = async (messageId: string, correctedPriority: string, correctedContext: string) => {
    try {
      setError(null);
      
      const response = await apiService.submitFeedback(messageId, correctedPriority, correctedContext);
      
      // Update the local message data
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === messageId 
            ? { ...msg, priority: correctedPriority as any, context: correctedContext as any }
            : msg
        )
      );
      
      return response;
    } catch (error: any) {
      console.error('Error submitting feedback:', error);
      setError(error.message || 'Failed to submit feedback');
      throw error;
    }
  };

  // Predict message priority and context
  const predictMessage = async (messageData: any) => {
    try {
      setError(null);
      
      const response = await apiService.predictMessage(messageData);
      return response;
    } catch (error: any) {
      console.error('Error predicting message:', error);
      setError(error.message || 'Failed to predict message');
      throw error;
    }
  };

  // Fetch analytics data
  const fetchAnalytics = async (timeRange = '30d') => {
    try {
      setIsLoadingAnalytics(true);
      setError(null);
      
      const response = await apiService.getAnalytics(timeRange);
      
      if (response) {
        setAnalytics(response);
      } else {
        console.warn('Invalid analytics response format:', response);
        setAnalytics(null);
      }
    } catch (error: any) {
      console.error('Error fetching analytics:', error);
      setError(error.message || 'Failed to fetch analytics');
      setAnalytics(null);
    } finally {
      setIsLoadingAnalytics(false);
    }
  };

  // Refresh all data
  const refreshData = async () => {
    await Promise.all([
      fetchMessages(),
      fetchAnalytics()
    ]);
  };

  // Initial data load
  useEffect(() => {
    refreshData();
  }, []);

  const value = {
    messages,
    analytics,
    isLoadingMessages,
    isLoadingAnalytics,
    error,
    fetchMessages,
    triggerMessageFetch,
    submitFeedback,
    predictMessage,
    fetchAnalytics,
    refreshData,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export default DataContext;
