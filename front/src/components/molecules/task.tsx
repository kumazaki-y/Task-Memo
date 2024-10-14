import {
  type FC,
  useState,
  useRef,
  useEffect,
  type KeyboardEvent,
} from 'react';
import { DeleteIcon, InfoIcon } from '@chakra-ui/icons';
import {
  HStack,
  VStack,
  Text,
  Input,
  Checkbox,
  IconButton,
  useColorModeValue,
} from '@chakra-ui/react';
import useConfirmDelete from '../../features/hooks/useConfirmDelete';
import CardContainer from '../templates/cardContainer';
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
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    isModalVisible,
    confirmDelete,
    handleConfirmDelete,
    handleCancelDelete,
  } = useConfirmDelete();

  useEffect(() => {
    if (isEditing && inputRef.current !== null) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleTaskUpdate = () => {
    updateTask(
      task.id,
      task.boardId,
      newTaskName,
      task.description ?? '', // Nullable check
      task.is_completed,
      task.due_date ?? '', // Nullable check
    );
    setIsEditing(false);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateTaskStatus(task.id, task.boardId, e.target.checked);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      handleTaskUpdate();
    }
  };

  const textColor = useColorModeValue('gray.800', 'white');
  const accentColor = useColorModeValue('purple.500', 'purple.300');

  return (
    <CardContainer isCompleted={task.is_completed}>
      <VStack align="stretch" spacing={3}>
        <HStack justifyContent="space-between">
          {isEditing ? (
            <Input
              ref={inputRef}
              value={newTaskName}
              onChange={(e) => {
                setNewTaskName(e.target.value);
              }}
              onKeyDown={handleKeyDown}
              onBlur={() => {
                handleTaskUpdate();
              }}
              placeholder="タスク名を入力"
              size="sm"
              borderColor={accentColor}
              _focus={{
                borderColor: accentColor,
                boxShadow: `0 0 0 1px ${accentColor}`,
              }}
            />
          ) : (
            <Text
              fontSize="md"
              fontWeight="semibold"
              color={textColor}
              isTruncated
              cursor="pointer"
              onClick={() => {
                setIsEditing(true);
              }}
              _hover={{ color: accentColor }}
            >
              {task.name}
            </Text>
          )}
          <HStack spacing={2}>
            <IconButton
              aria-label="詳細"
              icon={<InfoIcon />}
              size="sm"
              variant="ghost"
              colorScheme="blue"
              onClick={() => {
                setShowDetail(true);
              }}
            />
            <IconButton
              aria-label="削除"
              icon={<DeleteIcon />}
              size="sm"
              variant="ghost"
              colorScheme="black"
              _hover={{ bg: 'red.100', color: 'red.500' }}
              onClick={() => {
                confirmDelete(task.id, task.name);
              }}
            />
          </HStack>
        </HStack>

        <Checkbox
          isChecked={task.is_completed}
          onChange={handleStatusChange}
          colorScheme="purple"
        >
          {task.is_completed ? '完了' : '未完了'}
        </Checkbox>

        {isModalVisible && (
          <ConfirmModal
            isVisible={isModalVisible}
            onConfirm={() => {
              handleConfirmDelete(deleteTask);
            }}
            onCancel={() => {
              handleCancelDelete();
            }}
            message={`本当に${task.name}を削除しますか？`}
          />
        )}

        {showDetail && (
          <TaskDetail
            task={task}
            onClose={() => {
              setShowDetail(false);
            }}
            updateTaskDetail={updateTask}
          />
        )}
      </VStack>
    </CardContainer>
  );
};

export default Task;
