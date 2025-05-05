import express from 'express';
const router = express.Router();
import {
  getRandomQuestions
} from '../../controllers/questionController.js';

router.route('/').get(getRandomQuestions);

export default router;
