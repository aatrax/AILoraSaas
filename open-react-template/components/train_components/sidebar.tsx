import React, { useState, useContext, useEffect } from 'react';
import { useTasks } from './context'; 
import { FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';
import axios from 'axios';

export function Sidebar() {
    const { tasks, setTasks, addTask, deleteTask } = useTasks();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const handleCancelTask = async (taskId : number) => {
        try {
          await axios.delete(`/api/tasks/${taskId}`);
          deleteTask(taskId)
        } catch (error) {
          console.error('取消任务失败:', error);
        }
    };
    useEffect(() => {
        // 轮询间隔（单位：毫秒）
        const POLLING_INTERVAL = 5000; 
    
        const fetchTaskStatus = async () => {
          try {
            // 过滤出正在运行的任务
            const runningTasks = tasks.filter(task => task.status === 'running');
            if (runningTasks.length === 0) return; // 如果没有正在运行的任务，则跳过
    
            // 发送请求，查询任务状态
            const updatedTasks = await Promise.all(
              runningTasks.map(async (task) => {
                const response = await axios.get(`http://localhost:5000/api/task/${task.id}`);
                return { ...task, ...response.data }; // 合并新的状态
              })
            );
    
            // 更新任务状态
            setTasks(prevTasks => prevTasks.map(task =>
              updatedTasks.find(updated => updated.id === task.id) || task
            ));
          } catch (error) {
            console.error("任务状态更新失败：", error);
          }
        };
    
        // 启动轮询
        const intervalId = setInterval(fetchTaskStatus, POLLING_INTERVAL);
    
        // 组件卸载时清除轮询
        return () => clearInterval(intervalId);
      }, [tasks]);
    return (
        <div className="flex h-screen">
            {/* 主内容区域 */}
            <div className="flex-1 overflow-auto p-6 max-w-4xl mx-auto">
                {/* 原有内容保持不变 */}
            </div>

            {/* 可折叠任务面板 */}
            <div className={`relative h-screen border-l bg-white shadow-lg transition-all duration-300 ${
                isSidebarOpen ? 'w-64' : 'w-12'
            }`}>
                {/* 折叠按钮 */}
                <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="absolute -left-4 top-4 bg-white p-1.5 rounded-full shadow-md border"
                >
                {isSidebarOpen ? <FiChevronRight /> : <FiChevronLeft />}
                </button>

                {isSidebarOpen && (
                <div className="p-4">
                    <h3 className="text-lg font-semibold mb-4 flex items-center justify-between">
                    训练任务
                    <FiX 
                        className="cursor-pointer text-gray-400 hover:text-gray-600"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                    </h3>

                    <div className="space-y-4">
                    {tasks.map(task => (
                        <div key={task.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium truncate">{task.name}</span>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                            task.status === 'running' ? 'bg-blue-100 text-blue-800' :
                            task.status === 'completed' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                            }`}>
                            {task.status}
                            </span>
                        </div>
                        
                        {/* 进度条 */}
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div 
                            className="bg-blue-500 rounded-full h-2 transition-all duration-300"
                            style={{ width: `${task.progress}%` }}
                            />
                        </div>

                        <div className="flex justify-between text-xs text-gray-500">
                            <span>{task.progress}%</span>
                            <span>{task.startTime}</span>
                        </div>

                        {/* 取消按钮 */}
                        {task.status === 'running' && (
                            <button 
                            className="mt-2 w-full text-xs text-red-500 hover:text-red-700"
                            onClick={() => handleCancelTask(task.id)}
                            >
                            取消训练
                            </button>
                        )}
                        </div>
                    ))}
                    </div>
                </div>
                )}
            </div>
        </div>
    )
}