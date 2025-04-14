'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ClockIcon,
  MapPinIcon,
  CalendarIcon,
  UserGroupIcon,
  CubeIcon,
  CameraIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import SceneProgress from '@/app/components/SceneProgress';
import { toast } from 'react-hot-toast';

interface SceneDetail {
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
  status?: {
    status: string;
    progress: number;
    start_time?: string;
    end_time?: string;
    notes?: string;
  };
}

export default function SceneDetailPage({
  params,
}: {
  params: { id: string; number: string };
}) {
  const router = useRouter();
  const [scene, setScene] = useState<SceneDetail | null>(null);
  const [editedScene, setEditedScene] = useState<SceneDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchScene = async () => {
      try {
        const response = await fetch(`/api/scenes/${params.number}`);
        if (!response.ok) {
          throw new Error('Failed to fetch scene details');
        }
        const data = await response.json();
        setScene(data);
        setEditedScene(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading scene details');
      } finally {
        setLoading(false);
      }
    };

    fetchScene();
  }, [params.number]);

  const handleSave = async () => {
    if (!editedScene) return;
    
    try {
      setIsSaving(true);
      const response = await fetch(`/api/scenes/${params.number}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedScene),
      });

      if (!response.ok) {
        throw new Error('保存场景失败');
      }

      const updatedScene = await response.json();
      setScene(updatedScene);
      setEditedScene(updatedScene);
      setIsEditing(false);
      toast.success('Scene updated successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error saving scene');
      toast.error('Failed to update scene');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedScene(scene);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof SceneDetail, value: any) => {
    if (!editedScene) return;
    setEditedScene({ ...editedScene, [field]: value });
  };

  const handleCharacterChange = (index: number, field: string, value: string) => {
    if (!editedScene) return;
    const newCharacters = [...editedScene.characters];
    newCharacters[index] = { ...newCharacters[index], [field]: value };
    setEditedScene({ ...editedScene, characters: newCharacters });
  };

  const handlePropChange = (index: number, field: string, value: string) => {
    if (!editedScene) return;
    const newProps = [...editedScene.props];
    newProps[index] = { ...newProps[index], [field]: value };
    setEditedScene({ ...editedScene, props: newProps });
  };

  const handleStatusChange = async (newStatus: any) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/scenes/${params.number}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newStatus),
      });

      if (!response.ok) {
        throw new Error('Failed to update scene status');
      }

      const updatedScene = await response.json();
      setScene(updatedScene);
      toast.success('Scene progress updated');
    } catch (error) {
      console.error('Error updating scene status:', error);
      toast.error('Failed to update scene progress');
    } finally {
      setIsLoading(false);
    }
  };

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

  if (!scene || !editedScene) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Scene {scene.number}</h1>
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
              >
                Edit
              </button>
              <button
                onClick={() => router.back()}
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
              >
                Back
              </button>
            </>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-600">{error}</div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <DocumentTextIcon className="w-5 h-5 mr-2 text-primary" />
                  基本信息
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center text-gray-600">
                    <MapPinIcon className="w-5 h-5 mr-2" />
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedScene.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder="场景地点"
                      />
                    ) : (
                      <span>场景地点：{scene.location}</span>
                    )}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <CalendarIcon className="w-5 h-5 mr-2" />
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedScene.time}
                        onChange={(e) => handleInputChange('time', e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder="拍摄时间"
                      />
                    ) : (
                      <span>拍摄时间：{scene.time}</span>
                    )}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <ClockIcon className="w-5 h-5 mr-2" />
                    {isEditing ? (
                      <input
                        type="number"
                        value={editedScene.estimated_duration}
                        onChange={(e) => handleInputChange('estimated_duration', parseFloat(e.target.value))}
                        className="w-full p-2 border rounded"
                        placeholder="预计时长（小时）"
                        step="0.5"
                      />
                    ) : (
                      <span>预计时长：{scene.estimated_duration} 小时</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <UserGroupIcon className="w-5 h-5 mr-2 text-primary" />
                  演员信息
                </h2>
                <div className="space-y-4">
                  {(isEditing ? editedScene : scene).characters.map((char, index) => (
                    <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                      {isEditing ? (
                        <>
                          <input
                            type="text"
                            value={char.name}
                            onChange={(e) => handleCharacterChange(index, 'name', e.target.value)}
                            className="w-full p-2 border rounded mb-2"
                            placeholder="角色名称"
                          />
                          <textarea
                            value={char.actions}
                            onChange={(e) => handleCharacterChange(index, 'actions', e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="角色动作"
                            rows={2}
                          />
                        </>
                      ) : (
                        <>
                          <h3 className="font-medium mb-2">{char.name}</h3>
                          <p className="text-gray-600">{char.actions}</p>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <CubeIcon className="w-5 h-5 mr-2 text-primary" />
                  道具清单
                </h2>
                <div className="grid grid-cols-1 gap-3">
                  {(isEditing ? editedScene : scene).props.map((prop, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                    >
                      {isEditing ? (
                        <>
                          <input
                            type="text"
                            value={prop.name}
                            onChange={(e) => handlePropChange(index, 'name', e.target.value)}
                            className="flex-1 p-2 border rounded mr-2"
                            placeholder="道具名称"
                          />
                          <select
                            value={prop.importance}
                            onChange={(e) => handlePropChange(index, 'importance', e.target.value)}
                            className="p-2 border rounded"
                          >
                            <option value="high">重要</option>
                            <option value="medium">普通</option>
                            <option value="low">次要</option>
                          </select>
                        </>
                      ) : (
                        <>
                          <span>{prop.name}</span>
                          <span className={`px-2 py-1 rounded-full text-sm ${
                            prop.importance === 'high'
                              ? 'bg-red-100 text-red-800'
                              : prop.importance === 'medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {prop.importance === 'high' ? '重要' : prop.importance === 'medium' ? '普通' : '次要'}
                          </span>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <CameraIcon className="w-5 h-5 mr-2 text-primary" />
                  技术要求
                </h2>
                {isEditing ? (
                  <textarea
                    value={editedScene.technical_requirements || ''}
                    onChange={(e) => handleInputChange('technical_requirements', e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="技术要求"
                    rows={4}
                  />
                ) : (
                  <p className="text-gray-600 whitespace-pre-line">
                    {scene.technical_requirements || '暂无特殊技术要求'}
                  </p>
                )}
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">特殊说明</h2>
                {isEditing ? (
                  <textarea
                    value={editedScene.special_notes || ''}
                    onChange={(e) => handleInputChange('special_notes', e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="特殊说明"
                    rows={4}
                  />
                ) : (
                  <p className="text-gray-600 whitespace-pre-line">
                    {scene.special_notes || '暂无特殊说明'}
                  </p>
                )}
              </div>
            </div>
          </div>

          <SceneProgress
            status={scene.status}
            isEditing={isEditing}
            onStatusChange={handleStatusChange}
          />
        </div>
      )}
    </div>
  );
} 