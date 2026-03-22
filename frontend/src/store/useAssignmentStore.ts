import { create } from 'zustand';

interface AssignmentState {
  dueDate: string;
  questionTypes: string[];
  numQuestions: number;
  marks: number;
  instructions: string;
  fileUrl?: string; // Optional
  
  setField: (field: keyof Omit<AssignmentState, 'setField'>, value: any) => void;
  toggleQuestionType: (type: string) => void;
  reset: () => void;
}

const initialState = {
  dueDate: '',
  questionTypes: [],
  numQuestions: 10,
  marks: 50,
  instructions: '',
  fileUrl: '',
};

export const useAssignmentStore = create<AssignmentState>((set: any) => ({
  ...initialState,
  
  setField: (field: any, value: any) => set((state: any) => ({ ...state, [field]: value })),
  
  toggleQuestionType: (type: any) => set((state: any) => {
    const exists = state.questionTypes.includes(type);
    if (exists) {
      return { questionTypes: state.questionTypes.filter((t: any) => t !== type) };
    } else {
      return { questionTypes: [...state.questionTypes, type] };
    }
  }),
  
  reset: () => set(initialState),
}));
