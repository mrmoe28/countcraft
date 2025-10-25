import { PerformanceForm } from '@/components/PerformanceForm';

export default function NewPerformancePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Create New Performance</h1>
      <PerformanceForm />
    </div>
  );
}
