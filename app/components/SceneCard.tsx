import { ClockIcon, UserIcon, CubeIcon } from '@heroicons/react/24/outline';

interface SceneCardProps {
  scene: {
    number: number;
    location: string;
    time: string;
    characters: Array<{
      name: string;
      role: string;
    }>;
    props: Array<{
      name: string;
      importance: string;
    }>;
    estimated_duration: number;
    status?: {
      status: string;
      progress: number;
    };
  };
  onClick?: () => void;
}

export default function SceneCard({ scene, onClick }: SceneCardProps) {
  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'planned':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return '已完成';
      case 'in_progress':
        return '进行中';
      case 'planned':
        return '计划中';
      default:
        return '未开始';
    }
  };

  return (
    <div
      className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            场景 {scene.number}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {scene.location} - {scene.time}
          </p>
        </div>
        {scene.status && (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
              scene.status.status
            )}`}
          >
            {getStatusText(scene.status.status)}
          </span>
        )}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="flex items-center text-sm text-gray-500">
          <UserIcon className="flex-shrink-0 mr-1.5 h-5 w-5" />
          <span>{scene.characters.length} 名角色</span>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <CubeIcon className="flex-shrink-0 mr-1.5 h-5 w-5" />
          <span>{scene.props.length} 个道具</span>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <ClockIcon className="flex-shrink-0 mr-1.5 h-5 w-5" />
          <span>{scene.estimated_duration} 分钟</span>
        </div>
      </div>

      {scene.status && (
        <div className="mt-4">
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block text-gray-600">
                  进度
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-gray-600">
                  {scene.status.progress}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
              <div
                style={{ width: `${scene.status.progress}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 