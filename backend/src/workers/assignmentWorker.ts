import { Worker, Job } from 'bullmq';
import { connection } from '../queues/assignmentQueue';
import { generateAssignmentPaper } from '../services/aiService';
import Assignment from '../models/Assignment';
import GeneratedPaper from '../models/GeneratedPaper';
import { getIO } from '../services/socketService';

export const assignmentWorker = new Worker('assignment-generation', async (job: Job) => {
  const { assignmentId, questionTypes, numQuestions, marks, instructions } = job.data;

  try {
    const io = getIO();
    
    // Notify Frontend
    io.to(assignmentId).emit('job-progress', { status: 'generating', message: 'AI is generating questions...' });
    
    await Assignment.findByIdAndUpdate(assignmentId, { status: 'processing' });

    // Call LLM
    const generatedSections = await generateAssignmentPaper({
      questionTypes,
      numQuestions,
      marks,
      instructions
    });

    io.to(assignmentId).emit('job-progress', { status: 'saving', message: 'Saving generated paper...' });

    // Store in DB
    const newPaper = new GeneratedPaper({
      assignmentId,
      sections: generatedSections
    });
    await newPaper.save();

    await Assignment.findByIdAndUpdate(assignmentId, { status: 'completed' });

    // Notify Frontend
    io.to(assignmentId).emit('job-completed', { status: 'completed', paperId: newPaper._id });
    
    return { success: true, paperId: newPaper._id };
  } catch (error) {
    console.error(`Job failed for assignment ${assignmentId}:`, error);
    await Assignment.findByIdAndUpdate(assignmentId, { status: 'failed' });
    
    try {
      const io = getIO();
      io.to(assignmentId).emit('job-failed', { status: 'failed', message: (error as Error).message });
    } catch(e) {}
    
    throw error;
  }
}, { connection: connection as any });

assignmentWorker.on('completed', (job) => {
  console.log(`Job ${job.id} has completed!`);
});

assignmentWorker.on('failed', (job, err) => {
  console.log(`Job ${job?.id} has failed with ${err.message}`);
});
