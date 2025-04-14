'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FileUpload from '../../../components/FileUpload';

export default function ScriptUploadPage() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (file: File) => {
    try {
      setIsUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append('file', file);

      // 模拟上传进度
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      const response = await fetch('/api/scripts/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        throw new Error('上传失败');
      }

      setUploadProgress(100);
      const data = await response.json();
      
      // 上传成功后跳转到分析页面
      router.push(`/projects/${data.projectId}/analysis`);
    } catch (err) {
      setError(err instanceof Error ? err.message : '上传过程中发生错误');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">上传剧本</h1>
      
      <div className="max-w-2xl mx-auto">
        <FileUpload onUpload={handleUpload} />
        
        {isUploading && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">上传进度</span>
              <span className="text-sm font-medium">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">上传说明</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>支持的文件格式：PDF、DOCX、TXT</li>
            <li>最大文件大小：10MB</li>
            <li>请确保文件内容清晰可读</li>
            <li>上传后系统将自动进行智能分析</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 