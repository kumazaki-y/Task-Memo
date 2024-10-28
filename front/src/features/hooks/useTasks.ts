import { useState, useEffect, useCallback } from 'react';
import { BOARDS_API } from '../../urls';
import { apiRequest } from '../../utils/apiRequest';

export interface Task {
  id: number;
  name: string;
  description?: string;
  due_date?: string;
  time_reduction_amount: number;
  time_reduction_period: string;
  is_completed: boolean;
  boardId: number;
}

interface Board {
  id: number;
  name: string;
}

const useTasks = (): {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  taskName: string;
  setTaskName: React.Dispatch<React.SetStateAction<string>>;
  taskDescription: string;
  setTaskDescription: React.Dispatch<React.SetStateAction<string>>;
  taskDueDate: string;
  setTaskDueDate: React.Dispatch<React.SetStateAction<string>>;
  isCompleted: boolean;
  setIsCompleted: React.Dispatch<React.SetStateAction<boolean>>;
  addTask: (boardId: number, taskName: string) => Promise<void>;
  updateTask: (
    taskId: number,
    boardId: number,
    newTaskName?: string,
    description?: string,
    isCompleted?: boolean,
    dueDate?: string,
    additionalParams?: { position?: number },
  ) => Promise<void>;
  deleteTask: (taskId: number, boardId: number) => Promise<void>;
  updateTaskStatus: (
    taskId: number,
    boardId: number,
    isCompleted: boolean,
  ) => Promise<void>;
  resetTaskForm: () => void;
} => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [boards, setBoards] = useState<Board[]>([]);
  const [taskName, setTaskName] = useState<string>('');
  const [taskDescription, setTaskDescription] = useState<string>('');
  const [taskDueDate, setTaskDueDate] = useState<string>('');
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const fetchAllBoards = async (): Promise<void> => {
    try {
      const boardsData = await apiRequest<Board[]>(BOARDS_API, 'GET');
      setBoards(boardsData);
    } catch (error) {
      console.error('Error fetching boards:', error);
    }
  };

  const fetchAllTasks = useCallback(async (): Promise<void> => {
    try {
      const allTasks: Task[] = [];
      for (const board of boards) {
        const boardTasks = await apiRequest<Task[]>(
          `${BOARDS_API}/${board.id}/tasks`,
          'GET',
        );
        const mappedTasks = boardTasks.map((task) => ({
          ...task,
          boardId: board.id,
        }));
        allTasks.push(...mappedTasks);
      }
      setTasks(allTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  }, [boards]);

  useEffect(() => {
    if (boards.length > 0) {
      fetchAllTasks().catch((error) => {
        console.error('Error fetching tasks:', error);
      });
    }
  }, [boards, fetchAllTasks]);

  useEffect(() => {
    fetchAllBoards().catch((error) => {
      console.error('Error fetching boards:', error);
    });
  }, []);

  const addTask = async (boardId: number, taskName: string): Promise<void> => {
    if (taskName === '') {
      console.error('Task name is required');

      return;
    }

    try {
      const newTask: Task = await apiRequest<Task>(
        `${BOARDS_API}/${boardId}/tasks`,
        'POST',
        {
          task: {
            name: taskName,
            description: taskDescription,
            due_date: taskDueDate,
            board_id: boardId,
            time_reduction_amount: 30,
            time_reduction_period: 'daily',
            is_completed: isCompleted,
          },
        },
      );
      setTasks((prevTasks: Task[]) => [...prevTasks, { ...newTask, boardId }]);
      resetTaskForm();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const updateTask = async (
    taskId: number,
    boardId: number,
    newTaskName?: string,
    description?: string,
    isCompleted?: boolean,
    dueDate?: string,
    additionalParams: { position?: number } = {},
  ): Promise<void> => {
    try {
      const updatedTask: Task = await apiRequest<Task>(
        `${BOARDS_API}/${boardId}/tasks/${taskId}`,
        'PATCH',
        {
          task: {
            ...(newTaskName !== undefined && { name: newTaskName }),
            ...(description !== undefined && { description }),
            ...(isCompleted !== undefined && { is_completed: isCompleted }),
            ...(dueDate !== undefined && { due_date: dueDate }),
            ...additionalParams,
          },
        },
      );

      setTasks((prevTasks: Task[]) =>
        prevTasks.map((task: Task) =>
          task.id === taskId
            ? {
                ...task,
                name: updatedTask.name,
                description: updatedTask.description,
                is_completed: updatedTask.is_completed,
                due_date: updatedTask.due_date,
              }
            : task,
        ),
      );
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const updateTaskStatus = async (
    taskId: number,
    boardId: number,
    isCompleted: boolean,
  ): Promise<void> => {
    try {
      const updatedTask: Task = await apiRequest<Task>(
        `${BOARDS_API}/${boardId}/tasks/${taskId}`,
        'PATCH',
        {
          task: { is_completed: isCompleted },
        },
      );
      setTasks((prevTasks: Task[]) =>
        prevTasks.map((task: Task) =>
          task.id === taskId
            ? { ...task, is_completed: updatedTask.is_completed }
            : task,
        ),
      );
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const deleteTask = async (taskId: number, boardId: number): Promise<void> => {
    try {
      await apiRequest(`${BOARDS_API}/${boardId}/tasks/${taskId}`, 'DELETE');
      setTasks((prevTasks: Task[]) =>
        prevTasks.filter((task) => task.id !== taskId),
      );
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const resetTaskForm = () => {
    setTaskName('');
    setTaskDescription('');
    setTaskDueDate('');
    setIsCompleted(false);
  };

  return {
    tasks,
    setTasks, // 追加
    taskName,
    setTaskName,
    taskDescription,
    setTaskDescription,
    taskDueDate,
    setTaskDueDate,
    isCompleted,
    setIsCompleted,
    addTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    resetTaskForm,
  };
};

export default useTasks;
