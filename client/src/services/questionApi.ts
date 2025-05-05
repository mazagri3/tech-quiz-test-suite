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
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: Question[] = await response.json();
    console.log('API Response:', data);
    return data;
  } catch (error) {
    console.error('Failed to fetch questions:', error);
    throw error;
  }
};
