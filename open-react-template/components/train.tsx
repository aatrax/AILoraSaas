'use client';
import {TrainBody} from '@/components/train_components/train_body';
import {Sidebar} from '@/components/train_components/sidebar';
import {TaskProvider} from '@/components/train_components/context'; 

export default function Train() {
  return (
    <TaskProvider>
      <div className="flex">
        <TrainBody />
        <Sidebar />
      </div>
    </TaskProvider>
  )
}
