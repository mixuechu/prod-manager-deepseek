import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';

interface FileUploadProps {
  onUpload: (file: File) => void;
  accept?: Record<string, string[]>;
  maxSize?: number;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onUpload,
  accept = {
    'text/plain': ['.txt'],
    'application/pdf': ['.pdf'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  },
  maxSize = 10485760, // 10MB
}) => {
  const getErrorMessage = (code: string) => {
    switch (code) {
      case 'file-invalid-type':
        return '不支持的文件类型';
      case 'file-too-large':
        return '文件大小超过限制';
      case 'file-too-small':
        return '文件太小';
      case 'too-many-files':
        return '一次只能上传一个文件';
      default:
        return '上传失败';
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onUpload(acceptedFiles[0]);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false,
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'}`}
      >
        <input {...getInputProps()} />
        <CloudArrowUpIcon className="w-12 h-12 mx-auto text-gray-400" />
        <p className="mt-4 text-sm text-gray-600">
          {isDragActive ? (
            '将文件放在这里...'
          ) : (
            <>
              将文件拖放到此处，或<span className="text-primary">点击选择文件</span>
            </>
          )}
        </p>
        <p className="mt-2 text-xs text-gray-500">
          支持 PDF、DOCX 和 TXT 文件（最大 10MB）
        </p>
      </div>

      {fileRejections.length > 0 && (
        <div className="mt-4 text-sm text-red-500">
          {fileRejections.map(({ file, errors }) => (
            <div key={file.name}>
              {errors.map(error => (
                <p key={error.code}>{getErrorMessage(error.code)}</p>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload; 