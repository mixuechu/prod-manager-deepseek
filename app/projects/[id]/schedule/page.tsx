'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

interface Scene {
  number: string;
  location: string;
  startTime: string;
  endTime: string;
  estimated_duration: number;
  characters: Array<{
    name: string;
    role: string;
  }>;
  status: {
    status: string;
    progress: number;
  };
}

interface ScheduleDay {
  date: string;
  scenes: Scene[];
}

export default function SchedulePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [schedule, setSchedule] = useState<ScheduleDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await fetch(`/api/projects/${params.id}/schedule`);
        if (!response.ok) {
          throw new Error('获取拍摄日程失败');
        }
        const data = await response.json();
        setSchedule(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载日程时出错');
        setLoading(false);
      }
    };

    fetchSchedule();
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
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">拍摄日程</h1>

      <div className="space-y-6">
        {schedule.map((day) => (
          <div key={day.date} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b">
              <h2 className="text-lg font-semibold">
                {new Date(day.date).toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  weekday: 'long',
                })}
              </h2>
            </div>
            <div className="p-4 space-y-4">
              {day.scenes.map((scene) => (
                <div
                  key={scene.number}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => router.push(`/projects/${params.id}/scenes/${scene.number}`)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-medium">场景 {scene.number}</h3>
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      scene.status.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : scene.status.status === 'in_progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {scene.status.status === 'completed'
                        ? '已完成'
                        : scene.status.status === 'in_progress'
                        ? '进行中'
                        : '未开始'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600">
                        <ClockIcon className="w-5 h-5 mr-2" />
                        <span>
                          {scene.startTime} - {scene.endTime}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPinIcon className="w-5 h-5 mr-2" />
                        <span>{scene.location}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600">
                        <CalendarIcon className="w-5 h-5 mr-2" />
                        <span>时长：{scene.estimated_duration} 小时</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <UserGroupIcon className="w-5 h-5 mr-2" />
                        <span>
                          演员：{scene.characters.map((char) => char.name).join('、')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-primary h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${scene.status.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 