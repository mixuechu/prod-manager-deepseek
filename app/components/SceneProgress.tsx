import { ChartBarIcon } from '@heroicons/react/24/outline';

interface SceneStatus {
  status: string;
  progress: number;
  start_time?: string;
  end_time?: string;
  notes?: string;
}

interface SceneProgressProps {
  status: SceneStatus;
  isEditing: boolean;
  onStatusChange: (status: SceneStatus) => void;
}

const STATUS_OPTIONS = [
  { value: 'pending', label: '未开始', color: 'bg-gray-100 text-gray-800' },
  { value: 'in_progress', label: '进行中', color: 'bg-blue-100 text-blue-800' },
  { value: 'completed', label: '已完成', color: 'bg-green-100 text-green-800' },
];

export default function SceneProgress({
  status = {
    status: 'pending',
    progress: 0,
  },
  isEditing,
  onStatusChange,
}: SceneProgressProps) {
  const handleChange = (field: keyof SceneStatus, value: any) => {
    onStatusChange({
      ...status,
      [field]: value,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <ChartBarIcon className="w-5 h-5 mr-2 text-primary" />
        拍摄进度
      </h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {isEditing ? (
              <select
                value={status.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="p-2 border rounded"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <span className={`px-3 py-1 rounded-full text-sm ${
                STATUS_OPTIONS.find(opt => opt.value === status.status)?.color
              }`}>
                {STATUS_OPTIONS.find(opt => opt.value === status.status)?.label}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">进度：</span>
            {isEditing ? (
              <input
                type="number"
                value={status.progress}
                onChange={(e) => handleChange('progress', parseFloat(e.target.value))}
                className="w-20 p-2 border rounded"
                min="0"
                max="100"
                step="5"
              />
            ) : (
              <span className="font-semibold">{status.progress}%</span>
            )}
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-primary h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${status.progress}%` }}
          ></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">开始时间</label>
            {isEditing ? (
              <input
                type="datetime-local"
                value={status.start_time?.slice(0, 16) || ''}
                onChange={(e) => handleChange('start_time', e.target.value)}
                className="w-full p-2 border rounded"
              />
            ) : (
              <p className="text-gray-800">
                {status.start_time
                  ? new Date(status.start_time).toLocaleString()
                  : '尚未开始'}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">结束时间</label>
            {isEditing ? (
              <input
                type="datetime-local"
                value={status.end_time?.slice(0, 16) || ''}
                onChange={(e) => handleChange('end_time', e.target.value)}
                className="w-full p-2 border rounded"
              />
            ) : (
              <p className="text-gray-800">
                {status.end_time
                  ? new Date(status.end_time).toLocaleString()
                  : '尚未完成'}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">进度备注</label>
          {isEditing ? (
            <textarea
              value={status.notes || ''}
              onChange={(e) => handleChange('notes', e.target.value)}
              className="w-full p-2 border rounded"
              rows={3}
              placeholder="添加进度相关备注..."
            />
          ) : (
            <p className="text-gray-800 whitespace-pre-line">
              {status.notes || '暂无备注'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
} 