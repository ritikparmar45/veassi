import { Request, Response } from 'express';
import Assignment from '../models/Assignment';
import GeneratedPaper from '../models/GeneratedPaper';
import { generateAssignmentPaper } from '../services/aiService';
import { AuthRequest } from '../middleware/auth';

export const createAssignment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { dueDate, questionTypes, numQuestions, marks, instructions, fileUrl, subject, className } = req.body;

    // Validate inputs
    if (!dueDate || !questionTypes || !numQuestions || !marks || !instructions || !subject || !className) {
      res.status(400).json({ error: 'All fields are required (including Subject and Class).' });
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
      subject,
      className,
      fileUrl,
      userId: req.user?.userId || null
    });
    
    const savedAssignment = await newAssignment.save();

    // Generating synchronously before sending response so Vercel doesn't kill it!
    try {
      savedAssignment.status = 'processing';
      await savedAssignment.save();
      
      const generatedSections = await generateAssignmentPaper({
        questionTypes,
        numQuestions,
        marks,
        instructions: `Subject: ${subject}\nClass: ${className}\n${instructions}`
      });

      const newPaper = new GeneratedPaper({
        assignmentId: savedAssignment._id,
        sections: generatedSections
      });
      await newPaper.save();

      savedAssignment.status = 'completed';
      await savedAssignment.save();

      // ONLY send response after it is fully completed
      res.status(201).json({
        message: 'Assignment generation completed',
        assignmentId: savedAssignment._id,
      });

    } catch (genError) {
      console.error('Generation Error in Vercel Serverless:', genError);
      savedAssignment.status = 'failed';
      await savedAssignment.save();
      res.status(500).json({ error: 'AI Generation failed' });
    }
  } catch (error) {
    console.error('Error creating assignment:', error);
    res.status(500).json({ error: 'Failed to create assignment' });
  }
};

export const getAssignmentResult = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const assignment = await Assignment.findOne({ _id: id, userId });
    if (!assignment) {
      res.status(404).json({ error: 'Assignment not found or unauthorized' });
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

export const regenerateAssignment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const assignment = await Assignment.findOne({ _id: id, userId });
    if (!assignment) {
      res.status(404).json({ error: 'Assignment not found or unauthorized' });
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

export const deleteAssignment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const assignment = await Assignment.findOne({ _id: id, userId });
    if (!assignment) {
      res.status(404).json({ error: 'Assignment not found or unauthorized' });
      return;
    }

    await Assignment.deleteOne({ _id: id });
    await GeneratedPaper.deleteOne({ assignmentId: id });

    res.status(200).json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    console.error('Error deleting assignment:', error);
    res.status(500).json({ error: 'Failed to delete assignment' });
  }
};

export const updateAssignment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    const updates = req.body;

    const assignment = await Assignment.findOneAndUpdate(
      { _id: id, userId },
      { $set: updates },
      { new: true }
    );

    if (!assignment) {
      res.status(404).json({ error: 'Assignment not found or unauthorized' });
      return;
    }

    res.status(200).json({ assignment });
  } catch (error) {
    console.error('Error updating assignment:', error);
    res.status(500).json({ error: 'Failed to update assignment' });
  }
};
