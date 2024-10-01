import { useState, useEffect, useCallback } from 'react';
import { BOARDS_API } from '../../urls'; // BOARDS_APIを使う
import { apiRequest } from '../../utils/apiRequest'; // 既存のapiRequestを使う

interface Task {
  id: number;
  name: string;
  description?: string;
  due_date?: string;
  time_reduction_amount: number;
  time_reduction_period: string;
  is_completed: boolean;
  boardId: number; // ボードIDを保持する
}

interface Board {
  id: number;
  name: string;
}

const useTasks = (): {
  tasks: Task[];
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
  ) => Promise<void>;
  deleteTask: (taskId: number, boardId: number) => Promise<void>;
  updateTaskStatus: (
    taskId: number,
    boardId: number,
    isCompleted: boolean,
  ) => Promise<void>;
  resetTaskForm: () => void;
} => {
  const [tasks, setTasks] = useState<Task[]>([]); // すべてのタスクを取得して格納
  const [boards, setBoards] = useState<Board[]>([]); // すべてのボードを取得して格納
  const [taskName, setTaskName] = useState<string>('');
  const [taskDescription, setTaskDescription] = useState<string>('');
  const [taskDueDate, setTaskDueDate] = useState<string>('');
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // すべてのボードを取得
  const fetchAllBoards = async (): Promise<void> => {
    try {
      const boardsData = await apiRequest<Board[]>(BOARDS_API, 'GET');
      setBoards(boardsData); // 取得したボードを保存
    } catch (error) {
      console.error('Error fetching boards:', error);
    }
  };

  // すべてのタスクを一度に取得
  const fetchAllTasks = useCallback(async (): Promise<void> => {
    try {
      const allTasks: Task[] = []; // 全てのタスクを格納する配列

      for (const board of boards) {
        // 各ボードのタスクをループして取得
        const boardTasks = await apiRequest<Task[]>(
          `${BOARDS_API}/${board.id}/tasks`,
          'GET',
        ); // 各ボードごとのタスクを取得
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
  }, [boards]); // boardsが変更されたときだけfetchAllTasksを再生成

  useEffect(() => {
    if (boards.length > 0) {
      fetchAllTasks().catch((error) => {
        console.error('Error fetching tasks:', error);
      });
    }
  }, [boards, fetchAllTasks]);

  // boardsが空の場合にもデフォルトでfetchAllTasksを実行する
  useEffect(() => {
    fetchAllBoards().catch((error) => {
      console.error('Error fetching boards:', error);
    });
  }, []);

  // タスクを作成
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
            name: taskName, // タスク名を正しく送信
            description: taskDescription,
            due_date: taskDueDate,
            board_id: boardId, // ボードIDを追加
            time_reduction_amount: 30, // デフォルト値
            time_reduction_period: 'daily', // デフォルト値
            is_completed: isCompleted,
          },
        },
      );
      setTasks((prevTasks) => [...prevTasks, { ...newTask, boardId }]);

      resetTaskForm();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  // タスクを編集する関数
  const updateTask = async (
    taskId: number,
    boardId: number,
    newTaskName?: string, // 新しいタスク名（省略可能）
    description?: string, // 新しい説明（省略可能）
    isCompleted?: boolean, // 完了状態（省略可能）
    dueDate?: string, // 期限（省略可能）
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
          },
        },
      );
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
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

  // タスクの完了状態を更新する関数
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
          task: { is_completed: isCompleted }, // 完了状態のみを更新
        },
      );
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId
            ? { ...task, is_completed: updatedTask.is_completed }
            : task,
        ),
      );
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  // タスクを削除
  const deleteTask = async (taskId: number, boardId: number): Promise<void> => {
    try {
      await apiRequest(`${BOARDS_API}/${boardId}/tasks/${taskId}`, 'DELETE');
      setTasks(tasks.filter((task) => task.id !== taskId));
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

  useEffect(() => {
    fetchAllBoards().catch((error) => {
      console.error('Error fetching boards:', error);
    });
  }, []);

  return {
    tasks,
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
