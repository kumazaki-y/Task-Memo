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
  Box,
  useColorModeValue,
} from '@chakra-ui/react';
import useConfirmDelete from '../../features/hooks/useConfirmDelete';
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
  const [newDueDate, setNewDueDate] = useState(task.due_date ?? '');
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

  // タスクの期限を更新
  const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setNewDueDate(newDate);
    // 日付が変更されたら即座に更新を行う
    updateTask(
      task.id,
      task.boardId,
      newTaskName,
      task.description ?? '',
      task.is_completed,
      newDate, // 期限も即時更新
    );
  };

  const handleTaskUpdate = () => {
    updateTask(
      task.id,
      task.boardId,
      newTaskName,
      task.description ?? '',
      task.is_completed,
      newDueDate, // 期限も更新
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

  useEffect(() => {
    // task.due_date が変更された場合に newDueDate を更新
    setNewDueDate(task.due_date ?? '');
  }, [task.due_date]);

  const bgColor = useColorModeValue(
    task.is_completed ? 'gray.200' : 'white',
    task.is_completed ? 'gray.600' : 'gray.700',
  );
  const borderColor = useColorModeValue(
    task.is_completed ? 'gray.300' : 'teal.100',
    task.is_completed ? 'gray.500' : 'gray.600',
  );
  const textColor = useColorModeValue('gray.800', 'white');
  const accentColor = useColorModeValue('teal.500', 'teal.300');
  const mutedColor = useColorModeValue('gray.500', 'gray.400');
  const hoverBgColor = useColorModeValue('teal.100', 'gray.600');

  return (
    <Box
      p={4}
      bg={bgColor}
      borderWidth={1}
      borderColor={borderColor}
      borderRadius="md"
      boxShadow="sm"
      transition="all 0.3s"
      _hover={{ boxShadow: 'md' }}
    >
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
              onBlur={handleTaskUpdate}
              placeholder="タスク名を入力"
              size="sm"
              borderColor={accentColor}
              _focus={{
                borderColor: accentColor,
                boxShadow: `0 0 0 1px ${accentColor}`,
                bg: hoverBgColor,
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

        {/* 完了状態と期限を横並びにする */}
        <HStack spacing={6} align="center">
          <Box>
            <Text fontWeight="bold" mb={2} color={textColor}>
              完了状態
            </Text>
            <Checkbox
              isChecked={task.is_completed}
              onChange={handleStatusChange}
              colorScheme="teal"
              height="40px"
            >
              <Text color={mutedColor} width="50px">
                {task.is_completed ? '完了' : '未完了'}
              </Text>
            </Checkbox>
          </Box>

          <Box>
            <Text fontWeight="bold" mb={2} color={textColor}>
              期限
            </Text>
            <Input
              type="date"
              value={newDueDate}
              onChange={handleDueDateChange} // 期限を即時更新
              borderColor={accentColor}
              _hover={{ borderColor: accentColor }}
              _focus={{
                borderColor: accentColor,
                boxShadow: `0 0 0 1px ${accentColor}`,
              }}
              width="150px"
              height="40px"
              onClick={(e) => {
                (e.target as HTMLInputElement).showPicker();
              }} // カレンダー表示
            />
          </Box>
        </HStack>

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
    </Box>
  );
};

export default Task;
