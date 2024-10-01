import { type FC, useState } from 'react';
import { Box, HStack, Stack, Text, Input, Checkbox } from '@chakra-ui/react';
import useConfirmDelete from '../../features/hooks/useConfirmDelete';
import Button from '../atoms/button';
import ConfirmModal from './confirmModal';
import TaskDetail from './taskDetail';

interface TaskProps {
  task: {
    id: number;
    name: string;
    description?: string;
    is_completed: boolean;
    due_date?: string;
    boardId: number;
  };
  deleteTask: () => void;
  updateTask: (
    taskId: number,
    boardId: number,
    newTaskName: string,
    description: string,
    isCompleted: boolean,
    dueDate: string,
  ) => void;
  updateTaskStatus: (
    taskId: number,
    boardId: number,
    isCompleted: boolean,
  ) => void;
}

const Task: FC<TaskProps> = ({
  task,
  deleteTask,
  updateTask,
  updateTaskStatus,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTaskName, setNewTaskName] = useState(task.name);
  const [showDetail, setShowDetail] = useState(false);

  const {
    isModalVisible,
    confirmDelete,
    handleConfirmDelete,
    handleCancelDelete,
  } = useConfirmDelete();

  // タスクの部分更新（タスク名や完了状態のみ）
  const handleTaskUpdate = () => {
    updateTask(
      task.id,
      task.boardId,
      newTaskName,
      task.description ?? '', // 詳細画面で更新されないので、既存のdescriptionを使う
      task.is_completed,
      task.due_date ?? '',
    );
    setIsEditing(false);
  };

  // 完了状態の更新
  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateTaskStatus(task.id, task.boardId, e.target.checked);
  };

  return (
    <Box
      p={4}
      border="1px solid"
      borderColor="gray.200"
      borderRadius="md"
      mb={4}
    >
      <HStack justifyContent="space-between" w="100%">
        {isEditing ? (
          <Input
            value={newTaskName}
            onChange={(e) => {
              setNewTaskName(e.target.value);
            }}
            placeholder="タスク名を入力"
          />
        ) : (
          <Text
            fontSize="lg"
            fontWeight="bold"
            onClick={() => {
              setIsEditing(true);
            }}
            _hover={{ cursor: 'pointer', color: 'blue.500' }}
          >
            {task.name}
          </Text>
        )}
        {isEditing ? (
          <HStack>
            <Button
              label="保存"
              colorScheme="blue"
              size="sm"
              onClick={handleTaskUpdate}
            />
            <Button
              label="キャンセル"
              colorScheme="gray"
              size="sm"
              onClick={() => {
                setIsEditing(false);
              }}
            />
          </HStack>
        ) : (
          <HStack>
            <Button
              label="詳細"
              size="sm"
              onClick={() => {
                setShowDetail(true);
              }}
            />
            <Button
              label="削除"
              colorScheme="red"
              size="sm"
              onClick={() => {
                confirmDelete(task.id, task.name);
              }}
            />
          </HStack>
        )}
      </HStack>

      <Stack spacing={2} mt={2}>
        <Text>{task.description}</Text>

        <Checkbox isChecked={task.is_completed} onChange={handleStatusChange}>
          {task.is_completed ? '完了' : '未完了'}
        </Checkbox>

        {isModalVisible && (
          <ConfirmModal
            isVisible={isModalVisible}
            onConfirm={() => {
              handleConfirmDelete(deleteTask);
            }}
            onCancel={handleCancelDelete}
            message={`本当に${task.name}を削除しますか？`}
          />
        )}

        {/* 詳細画面 */}
        {showDetail && (
          <TaskDetail
            task={task}
            onClose={() => {
              setShowDetail(false);
            }}
            updateTaskDetail={updateTask} // 直接updateTaskを渡す
          />
        )}
      </Stack>
    </Box>
  );
};

export default Task;
