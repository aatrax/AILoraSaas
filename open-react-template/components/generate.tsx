"use client"
import { useState } from 'react';
import { FaMagic, FaSpinner } from 'react-icons/fa';

type Model = {
  id: string;
  name: string;
  provider: string;
  description: string;
};

export const Generate: React.FC = () => {
  // 状态管理
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [inputPrompt, setInputPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 模拟模型数据
  const models: Model[] = [
    {
      id: 'sd-xl',
      name: 'Stable Diffusion XL',
      provider: 'Stability AI',
      description: '最新一代文生图模型，支持高分辨率输出'
    },
    {
      id: 'dall-e-3',
      name: 'DALL·E 3',
      provider: 'OpenAI',
      description: '理解能力更强的创意生成模型'
    },
    {
      id: 'midjourney-v6',
      name: 'Midjourney V6',
      provider: 'Midjourney',
      description: '艺术风格生成专家'
    }
  ];

  // 生成处理函数
  const handleGenerate = async () => {
    if (!selectedModel || !inputPrompt.trim()) return;
    
    setIsLoading(true);
    try {
      // 这里模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 2000));
      // 模拟返回图片URL
      setGeneratedImage('https://via.placeholder.com/512x512.png?text=Generated+Image');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 左侧模型选择侧边栏 */}
      <div className="w-64 bg-white border-r border-gray-200 p-4">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">选择模型</h2>
        <div className="space-y-2">
          {models.map((model) => (
            <div
              key={model.id}
              onClick={() => setSelectedModel(model)}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                selectedModel?.id === model.id
                  ? 'bg-blue-50 border-2 border-blue-200'
                  : 'hover:bg-gray-100 border-2 border-transparent'
              }`}
            >
              <h3 className="font-medium text-gray-800">{model.name}</h3>
              <p className="text-xs text-gray-500 mt-1">{model.provider}</p>
              <p className="text-xs text-gray-400 mt-1">{model.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="flex-1 flex flex-col p-6">
        {/* 生成结果展示区域 */}
        <div className="flex-1 bg-white rounded-xl border-2 border-dashed border-gray-200 mb-6 flex items-center justify-center">
          {isLoading ? (
            <FaSpinner className="animate-spin text-4xl text-blue-500" />
          ) : generatedImage ? (
            <img 
              src={generatedImage} 
              alt="Generated content" 
              className="w-full h-full object-contain rounded-lg"
            />
          ) : (
            <div className="text-center text-gray-400">
              <FaMagic className="text-6xl mx-auto mb-4" />
              <p className="text-lg">输入提示词开始创作</p>
            </div>
          )}
        </div>

        {/* 提示词输入区域 */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex gap-3">
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="输入你的创意描述..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
            />
            <button
              onClick={handleGenerate}
              disabled={!selectedModel || !inputPrompt.trim() || isLoading}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 
                disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  生成中...
                </>
              ) : (
                <>
                  <FaMagic />
                  立即生成
                </>
              )}
            </button>
          </div>
          
          {/* 模型状态提示 */}
          {selectedModel && (
            <div className="mt-3 text-sm text-gray-500">
              当前模型: <span className="font-medium">{selectedModel.name}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};