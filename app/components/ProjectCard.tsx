import { CalendarIcon, UserGroupIcon, TagIcon } from '@heroicons/react/24/outline';

interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  startDate: string;
  teamMembers: number;
  tags: string[];
  progress: number;
}

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
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

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
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
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">{project.title}</h3>
          {project.status && (
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                project.status
              )}`}
            >
              {getStatusText(project.status)}
            </span>
          )}
        </div>
        <p className="mt-2 text-sm text-gray-500">{project.description}</p>

        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div>团队成员: {project.teamMembers}</div>
            <div>开始日期: {new Date(project.startDate).toLocaleDateString()}</div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">进度</span>
              <span className="text-sm font-medium text-gray-700">{project.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>
          {project.tags && project.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {project.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 