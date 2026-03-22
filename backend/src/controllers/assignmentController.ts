import { Request, Response } from 'express';
import Assignment from '../models/Assignment';
import GeneratedPaper from '../models/GeneratedPaper';
import { generateAssignmentPaper } from '../services/aiService';
import { AuthRequest } from '../middleware/auth';

export const createAssignment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { dueDate, questionTypes, numQuestions, marks, instructions, fileUrl } = req.body;

    // Validate inputs
    if (!dueDate || !questionTypes || !numQuestions || !marks || !instructions) {
      res.status(400).json({ error: 'All fields are required.' });
      return;
    }

    if (numQuestions <= 0 || marks <= 0) {
      res.status(400).json({ error: 'Values must be positive.' });
      return;
    }

    // Save to DB
    const newAssignment = new Assignment({
      dueDate,
      questionTypes,
      numQuestions,
      marks,
      instructions,
      fileUrl,
      userId: req.user?.userId || null
    });
    const savedAssignment = await newAssignment.save();

    res.status(202).json({
      message: 'Assignment generation request received',
      assignmentId: savedAssignment._id,
    });

    // Fire and forget (Vercel might kill this though if the response is sent, so we must await it! Wait, if we await it, Vercel times out. We MUST await it here to prevent Vercel killing it, but Vercel limits functions to 10s on hobby. Let's await it.)
    try {
      savedAssignment.status = 'processing';
      await savedAssignment.save();
      
      const generatedSections = await generateAssignmentPaper({
        questionTypes,
        numQuestions,
        marks,
        instructions
      });

      const newPaper = new GeneratedPaper({
        assignmentId: savedAssignment._id,
        sections: generatedSections
      });
      await newPaper.save();

      savedAssignment.status = 'completed';
      await savedAssignment.save();
    } catch (genError) {
      console.error('Generation Error in Vercel Serverless:', genError);
      savedAssignment.status = 'failed';
      await savedAssignment.save();
    }
  } catch (error) {
    console.error('Error creating assignment:', error);
    res.status(500).json({ error: 'Failed to create assignment' });
  }
};

export const getAssignmentResult = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const assignment = await Assignment.findById(id);
    if (!assignment) {
      res.status(404).json({ error: 'Assignment not found' });
      return;
    }

    const result = await GeneratedPaper.findOne({ assignmentId: id });
    
    res.status(200).json({
      assignment,
      result: result ? result.sections : null,
    });
  } catch (error) {
    console.error('Error fetching assignment result:', error);
    res.status(500).json({ error: 'Failed to fetch result' });
  }
};

export const regenerateAssignment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const assignment = await Assignment.findById(id);
    if (!assignment) {
      res.status(404).json({ error: 'Assignment not found' });
      return;
    }

    // Delete existing generation
    await GeneratedPaper.deleteOne({ assignmentId: id });

    // Update status
    assignment.status = 'processing';
    await assignment.save();

    // Generate synchronously
    try {
      const generatedSections = await generateAssignmentPaper({
        questionTypes: assignment.questionTypes,
        numQuestions: assignment.numQuestions,
        marks: assignment.marks,
        instructions: assignment.instructions,
      });

      const newPaper = new GeneratedPaper({
        assignmentId: id,
        sections: generatedSections
      });
      await newPaper.save();
      assignment.status = 'completed';
      await assignment.save();
    } catch(generateErr) {
      assignment.status = 'failed';
      await assignment.save();
      throw generateErr;
    }

    res.status(200).json({ message: 'Regeneration completed' });
  } catch (error) {
    console.error('Error regenerating assignment:', error);
    res.status(500).json({ error: 'Failed to regenerate' });
  }
};

export const getAssignments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const assignments = await Assignment.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ assignments });
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
};
