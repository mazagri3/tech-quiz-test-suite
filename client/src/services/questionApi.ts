import type { Question } from '../models/Question.js';

const API_BASE = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3003';

export const getQuestions = async (): Promise<Question[]> => {
  try {
    console.log('Making request to:', `${API_BASE}/api/questions`);
    const response = await fetch(`${API_BASE}/api/questions`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error('Failed to load questions');
    }

    const data: Question[] = await response.json();
    console.log('API Response:', data);
    return data;
  } catch (error) {
    console.error('Failed to fetch questions:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to load questions');
  }
};
