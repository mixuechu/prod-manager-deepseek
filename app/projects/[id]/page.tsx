'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [project, setProject] = useState<any>(null);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{project?.title}</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => router.push(`/projects/${params.id}/budget`)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
          >
            Budget
          </button>
          <button
            onClick={() => router.push(`/projects/${params.id}/report`)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
          >
            View Report
          </button>
          <button
            onClick={() => router.push(`/projects/${params.id}/schedule`)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
          >
            View Schedule
          </button>
          <button
            onClick={() => router.push('/projects')}
            className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
          >
            Back to Projects
          </button>
        </div>
      </div>
      
      {/* Rest of the component */}
    </div>
  );
} 