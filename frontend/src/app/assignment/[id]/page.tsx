import PaperOutput from '@/components/PaperOutput';

export default async function AssignmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <PaperOutput assignmentId={id} />
    </div>
  );
}
