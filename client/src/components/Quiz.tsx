import { useState, } from 'react';
import type { Question } from '../models/Question.js';
import { getQuestions } from '../services/questionApi.js';

const Quiz = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRandomQuestions = async () => {
    try {
      console.log('Getting random questions...');
      setIsLoading(true);
      setQuizStarted(true);
      console.log('Fetching questions...');
      const questions = await getQuestions();
      console.log('Received questions:', questions);

      if (!questions || questions.length === 0) {
        throw new Error('No questions received from the server');
      }

      console.log('Setting questions and resetting state...');
      setQuestions(questions);
      setQuizCompleted(false);
      setScore(0);
      setCurrentQuestionIndex(0);
    } catch (err) {
      console.error('Error fetching questions:', err);
      setError(err instanceof Error ? err.message : 'Failed to load questions');
      setQuizStarted(false);
      setQuestions([]);
    } finally {
      console.log('Setting isLoading to false');
      setIsLoading(false);
    }
  };

  const handleAnswerClick = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(score + 1);
    }

    const nextQuestionIndex = currentQuestionIndex + 1;
    if (nextQuestionIndex < questions.length) {
      setCurrentQuestionIndex(nextQuestionIndex);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleStartQuiz = async () => {
    console.log('Starting quiz...');
    setError(null);
    await getRandomQuestions();
  };

  // Show loading spinner when loading
  if (isLoading) {
    console.log('Rendering loading spinner');
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Show error message if there's an error
  if (error) {
    console.log('Rendering error state:', error);
    return (
      <div className="p-4 text-center">
        <div className="alert alert-danger">
          {error}
        </div>
        <button className="btn btn-primary d-inline-block mx-auto mt-3" onClick={handleStartQuiz}>
          Try Again
        </button>
      </div>
    );
  }

  // Show start button if quiz hasn't started
  if (!quizStarted) {
    return (
      <div className="p-4 text-center">
        <button className="btn btn-primary d-inline-block mx-auto" onClick={handleStartQuiz}>
          Start Quiz
        </button>
      </div>
    );
  }

  // Show completed state if quiz is done
  if (quizCompleted) {
    return (
      <div className="card p-4 text-center">
        <h2>Quiz Completed</h2>
        <div className="alert alert-success">
          Your score: {score}/{questions.length}
        </div>
        <button className="btn btn-primary d-inline-block mx-auto" onClick={handleStartQuiz}>
          Take New Quiz
        </button>
      </div>
    );
  }

  // Show current question
  const currentQuestion = questions[currentQuestionIndex];
  return (
    <div className='card p-4'>
      <h2>{currentQuestion.question}</h2>
      <div className="mt-3">
      {currentQuestion.answers.map((answer, index) => (
        <div key={answer._id || index} className="d-flex align-items-center mb-2">
          <button className="btn btn-primary" onClick={() => handleAnswerClick(answer.isCorrect)}>{index + 1}</button>
          <div className="alert alert-secondary mb-0 ms-2 flex-grow-1">{answer.text}</div>
        </div>
      ))}
      </div>
    </div>
  );
};

export default Quiz;
