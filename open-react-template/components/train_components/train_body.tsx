'use client';

import { useState, useCallback, ChangeEvent, DragEvent } from 'react';
import { useAuth } from '@/utils/AuthContext';
import { FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';
import axios from 'axios';

type TrainingStatus = 'idle' | 'uploading' | 'training' | 'completed' | 'error';

type TrainingState = {
  status: TrainingStatus;
  progress: number;
  message: string;
};

type FileOptions = {
  compress: boolean;
  quality: number;
  format: 'webp' | 'jpeg' | 'png';
};

export function TrainBody() {
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [options, setOptions] = useState<FileOptions>({
    compress: true,
    quality: 80,
    format: 'webp',
  });
  const [trainingState, setTrainingState] = useState<TrainingState>({
    status: 'idle',
    progress: 0,
    message: '',
  });

  const { token } = useAuth();

  const startTraining = async () => {
    if (!token) {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    try {
      setTrainingState({ status: 'uploading', progress: 0, message: '开始上传...' });

      const formData = new FormData();
      files.forEach((file) => formData.append('images', file));

      const uploadRes = await axios.post<{ task_id: string }>('http://localhost:5000/api/upload', formData, {
        headers: { Authorization: `Bearer ${token}` },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setTrainingState((prev) => ({ ...prev, progress, message: `上传中 ${progress}%` }));
          }
        },
      });

      const taskId = uploadRes.data.task_id;
      const pollStatus = async () => {
        try {
          const { data } = await axios.get<TrainingState>(`http://localhost:5000/api/training-status/${taskId}`);
          setTrainingState(data);

          if (data.status !== 'completed' && data.status !== 'error') {
            setTimeout(pollStatus, 2000);
          }
        } catch {
          setTrainingState({ status: 'error', progress: 0, message: '状态查询失败' });
        }
      };

      pollStatus();
    } catch (error) {
      setTrainingState({
        status: 'error',
        progress: 0,
        message: axios.isAxiosError(error) ? error.response?.data?.error || '请求失败' : '未知错误',
      });
    }
  };

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      processFiles(Array.from(event.target.files));
    }
  };

  const handleDrag = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(e.type === 'dragover');
  }, []);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  const processFiles = (fileList: File[]) => {
    const imageFiles = fileList.filter((file) => file.type.startsWith('image/'));
    setFiles(imageFiles);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div 
        className={`border-4 border-dashed rounded-lg p-8 text-center mb-6 transition-colors ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
        }`}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <input type="file" id="fileInput" className="hidden" onChange={handleFileSelect} multiple />
        <label htmlFor="fileInput" className="cursor-pointer">
          <p className="text-gray-600">拖拽文件到这里 或 <span className="text-blue-600">选择文件</span></p>
        </label>
      </div>

      {files.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">已选择文件 ({files.length})</h3>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center p-3 border rounded-lg bg-white">
                <span className="mr-3 text-blue-500">📷</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB · {file.type.split('/')[1].toUpperCase()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={startTraining}
        disabled={files.length === 0}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        开始训练
      </button>
    </div>
  );
}
