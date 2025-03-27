import React, { createContext, useState, useContext, ReactNode } from 'react';

// 任务类型
export interface Task {
  id: number;
  name: string;
  progress: number;
  status: 'running' | 'completed' | 'error';
  startTime: string;
}

// Context 类型
type TaskContextType = {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;  // ✅ 添加 setTasks
  addTask: (task: Task) => void;
  deleteTask: (taskId: number) => void;
};

// Provider 的 Props 类型
interface TaskProviderProps {
  children: ReactNode;
}

// 创建 Context
export const TaskContext = createContext<TaskContextType | null>(null);

// 创建 Provider 组件
export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      name: "风格训练任务 #1",
      progress: 65,
      status: 'running',
      startTime: '2024-03-20 14:30',
    },
    {
      id: 2,
      name: "风格训练任务 #2",
      progress: 20,
      status: 'running',
      startTime: '2024-03-21 10:00',
    }
  ]);

  // 添加任务
  const addTask = (newTask: Task) => {
    setTasks(prevTasks => 
      [...prevTasks, newTask].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    );
  };

  // 删除任务
  const deleteTask = (taskId: number) => {
    console.log(`删除任务: ${taskId}`);
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  return (
    <TaskContext.Provider value={{ tasks, setTasks, addTask, deleteTask }}>
      {children}
    </TaskContext.Provider>
  );
};

// 自定义 Hook，简化使用 Context
export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
};
