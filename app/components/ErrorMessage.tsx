import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="flex items-center justify-center p-4 bg-red-50 rounded-lg">
      <ExclamationCircleIcon className="h-6 w-6 text-red-500 mr-2" />
      <span className="text-red-700">{message}</span>
    </div>
  );
} 