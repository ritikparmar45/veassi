import AssignmentForm from '../../components/AssignmentForm';

export default function CreateAssignmentPage() {
  return (
    <div className="max-w-4xl mx-auto w-full pt-4 pb-12">
      <div className="mb-6 px-1">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Create Assignment</h2>
        </div>
        <p className="text-gray-400 text-sm mt-1">Set up a new assignment for your students</p>
      </div>

      {/* Progress Bar Mock */}
      <div className="flex space-x-2 mb-8 items-center justify-start max-w-sm px-1">
         <div className="h-1.5 w-1/2 bg-gray-600 rounded-full"></div>
         <div className="h-1.5 w-1/2 bg-gray-200 rounded-full"></div>
      </div>

      <AssignmentForm />
    </div>
  );
}
