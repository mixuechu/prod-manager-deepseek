'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Tab } from '@headlessui/react';
import {
  ClockIcon,
  UserGroupIcon,
  CubeIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

interface AnalysisData {
  scenes: Array<{
    number: string;
    location: string;
    time: string;
    description: string;
    characters: Array<{
      name: string;
      actions: string;
    }>;
    props: Array<{
      name: string;
      importance: string;
    }>;
    technical_requirements?: string;
    estimated_duration: number;
    special_notes?: string;
  }>;
  characters: Array<{
    name: string;
    type?: string;
    description?: string;
  }>;
  props: Array<{
    name: string;
    importance: string;
    description?: string;
  }>;
  statistics: {
    total_scenes: number;
    total_characters: number;
    total_props: number;
  };
}

export default function AnalysisPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const response = await fetch(`/api/scripts/analysis/${params.id}`);
        if (!response.ok) {
          throw new Error('获取分析结果失败');
        }
        const data = await response.json();
        setAnalysis(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载分析结果时出错');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">剧本分析结果</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            icon={<DocumentTextIcon className="w-6 h-6" />}
            title="总场景数"
            value={analysis.statistics.total_scenes}
          />
          <StatCard
            icon={<UserGroupIcon className="w-6 h-6" />}
            title="总角色数"
            value={analysis.statistics.total_characters}
          />
          <StatCard
            icon={<CubeIcon className="w-6 h-6" />}
            title="总道具数"
            value={analysis.statistics.total_props}
          />
          <StatCard
            icon={<ClockIcon className="w-6 h-6" />}
            title="预计总时长"
            value={`${analysis.scenes.reduce((acc, scene) => acc + scene.estimated_duration, 0).toFixed(1)}小时`}
          />
        </div>
      </div>

      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 p-1">
          <Tab className={({ selected }) =>
            `w-full rounded-lg py-2.5 text-sm font-medium leading-5
             ${selected
              ? 'bg-white shadow text-primary'
              : 'text-gray-600 hover:bg-white/[0.12] hover:text-primary'
            }`
          }>
            场景列表
          </Tab>
          <Tab className={({ selected }) =>
            `w-full rounded-lg py-2.5 text-sm font-medium leading-5
             ${selected
              ? 'bg-white shadow text-primary'
              : 'text-gray-600 hover:bg-white/[0.12] hover:text-primary'
            }`
          }>
            角色信息
          </Tab>
          <Tab className={({ selected }) =>
            `w-full rounded-lg py-2.5 text-sm font-medium leading-5
             ${selected
              ? 'bg-white shadow text-primary'
              : 'text-gray-600 hover:bg-white/[0.12] hover:text-primary'
            }`
          }>
            道具清单
          </Tab>
        </Tab.List>

        <Tab.Panels className="mt-4">
          <Tab.Panel>
            <div className="space-y-4">
              {analysis.scenes.map((scene) => (
                <div
                  key={scene.number}
                  className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => router.push(`/projects/${params.id}/scenes/${scene.number}`)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">场景 {scene.number}</h3>
                    <span className="text-sm text-gray-500">{scene.estimated_duration}小时</span>
                  </div>
                  <div className="text-gray-600 mb-2">
                    <span className="mr-4">{scene.location}</span>
                    <span>{scene.time}</span>
                  </div>
                  <p className="text-gray-700 mb-3">{scene.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {scene.characters.map((char) => (
                      <span key={char.name} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {char.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Tab.Panel>

          <Tab.Panel>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analysis.characters.map((character) => (
                <div key={character.name} className="bg-white rounded-lg shadow p-4">
                  <h3 className="text-lg font-semibold mb-2">{character.name}</h3>
                  {character.type && (
                    <p className="text-sm text-gray-500 mb-2">{character.type}</p>
                  )}
                  {character.description && (
                    <p className="text-gray-600">{character.description}</p>
                  )}
                </div>
              ))}
            </div>
          </Tab.Panel>

          <Tab.Panel>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analysis.props.map((prop) => (
                <div key={prop.name} className="bg-white rounded-lg shadow p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">{prop.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      prop.importance === 'high'
                        ? 'bg-red-100 text-red-800'
                        : prop.importance === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {prop.importance === 'high' ? '重要' : prop.importance === 'medium' ? '普通' : '次要'}
                    </span>
                  </div>
                  {prop.description && (
                    <p className="text-gray-600">{prop.description}</p>
                  )}
                </div>
              ))}
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}

function StatCard({ icon, title, value }: { icon: React.ReactNode; title: string; value: number | string }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center mb-2">
        <div className="text-primary mr-2">{icon}</div>
        <h3 className="text-gray-600">{title}</h3>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
} 