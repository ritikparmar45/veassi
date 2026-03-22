import express from 'express';
import { createAssignment, getAssignmentResult, regenerateAssignment, getAssignments } from '../controllers/assignmentController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.post('/', authenticate, createAssignment);
router.get('/', authenticate, getAssignments);
router.get('/:id', authenticate, getAssignmentResult);
router.post('/:id/regenerate', authenticate, regenerateAssignment);

export default router;
