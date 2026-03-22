import express from 'express';
import { createAssignment, getAssignmentResult, regenerateAssignment, getAssignments, deleteAssignment, updateAssignment } from '../controllers/assignmentController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.post('/', authenticate, createAssignment);
router.get('/', authenticate, getAssignments);
router.get('/:id', authenticate, getAssignmentResult);
router.post('/:id/regenerate', authenticate, regenerateAssignment);
router.delete('/:id', authenticate, deleteAssignment);
router.patch('/:id', authenticate, updateAssignment);

export default router;
