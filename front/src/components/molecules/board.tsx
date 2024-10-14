import {
  type FC,
  useState,
  useRef,
  useEffect,
  type KeyboardEvent,
} from 'react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import {
  Box,
  Text,
  VStack,
  Input,
  Flex,
  IconButton,
  useColorModeValue,
} from '@chakra-ui/react';
import useBoards from '../../features/hooks/useBoards';
import useConfirmDelete from '../../features/hooks/useConfirmDelete';
import useTasks from '../../features/hooks/useTasks';
import ConfirmModal from './confirmModal';
import Task from './task';

interface BoardItem {
  id: number;
  name: string;
}

interface BoardProps {
  boards: BoardItem[];
  boardName: string;
  setBoardName: (name: string) => void;
  updateBoard: () => Promise<void>;
  deleteBoard: (id: number) => Promise<void>;
  toggleEditing: (id: number, name: string) => void;
  selectedBoardId: number | null;
  setSelectedBoardId: (id: number | null) => void;
  isEditing: boolean;
  closeAddForm: () => void;
}

const Board: FC<BoardProps> = () => {
  const {
    boards,
    deleteBoard,
    updateBoard,
    toggleEditing,
    isEditing,
    boardName,
    setBoardName,
    selectedBoardId,
  } = useBoards();
  const { tasks, addTask, deleteTask, updateTask, updateTaskStatus } =
    useTasks();

  const [formVisibility, setFormVisibility] = useState<Record<number, boolean>>(
    {},
  );
  const [taskNames, setTaskNames] = useState<Record<number, string>>({});
  const [targetBoardId, setTargetBoardId] = useState<number | null>(null);

  const boardInputRef = useRef<HTMLInputElement>(null);
  const taskInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const {
    isModalVisible,
    confirmDelete,
    handleConfirmDelete,
    handleCancelDelete,
  } = useConfirmDelete();

  useEffect(() => {
    if (isEditing && boardInputRef.current !== null) {
      boardInputRef.current.focus();
    }
  }, [isEditing]);

  // 外部クリックを検出してタスクフォームを閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectedBoardId !== null &&
        formVisibility[selectedBoardId] &&
        formRef.current !== null &&
        !formRef.current.contains(event.target as Node)
      ) {
        closeTaskForm(selectedBoardId);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [formVisibility, selectedBoardId]);

  const toggleTaskFormVisibility = (boardId: number) => {
    setFormVisibility((prevState) => ({
      ...prevState,
      [boardId]: !prevState[boardId],
    }));
    setTimeout(() => {
      taskInputRef.current?.focus();
    }, 0);
  };

  const handleTaskNameChange = (boardId: number, name: string) => {
    setTaskNames((prev) => ({
      ...prev,
      [boardId]: name,
    }));
  };

  const closeTaskForm = (boardId: number) => {
    setFormVisibility((prev) => ({
      ...prev,
      [boardId]: false,
    }));
    setTaskNames((prev) => ({
      ...prev,
      [boardId]: '',
    }));
  };

  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    action: () => void,
  ) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      action();
    }
  };

  const bgColor = useColorModeValue('purple.50', 'gray.700');
  const borderColor = useColorModeValue('purple.100', 'gray.600');
  const textColor = useColorModeValue('gray.800', 'white');
  const accentColor = useColorModeValue('purple.500', 'purple.300');
  const hoverFocusBgColor = useColorModeValue('purple.100', 'gray.600');

  return (
    <VStack spacing={6} align="stretch" w="100%">
      {boards.length > 0 ? (
        boards.map((board) => {
          const tasksForBoard = tasks.filter(
            (task) => task.boardId === board.id,
          );

          return (
            <Box
              key={board.id}
              p={6}
              bg={bgColor}
              borderRadius="xl"
              boxShadow="sm"
              borderWidth={1}
              borderColor={borderColor}
              transition="all 0.3s"
              _hover={{ boxShadow: 'md' }}
            >
              <VStack spacing={4} align="stretch">
                <Flex justifyContent="space-between" alignItems="center">
                  {isEditing && selectedBoardId === board.id ? (
                    <Input
                      ref={boardInputRef}
                      value={boardName}
                      onChange={(e) => {
                        setBoardName(e.target.value);
                      }}
                      onKeyDown={(e) => {
                        handleKeyDown(e, updateBoard);
                      }}
                      onBlur={async () => {
                        await updateBoard();
                      }}
                      placeholder="ボード名を編集"
                      size="lg"
                      fontWeight="bold"
                      borderColor={accentColor}
                      _hover={{ borderColor: accentColor }}
                      _focus={{
                        borderColor: accentColor,
                        boxShadow: `0 0 0 1px ${accentColor}`,
                      }}
                    />
                  ) : (
                    <Text
                      fontSize="xl"
                      fontWeight="bold"
                      color={textColor}
                      cursor="pointer"
                      onClick={() => {
                        toggleEditing(board.id, board.name);
                      }}
                      _hover={{ color: accentColor }}
                    >
                      {board.name}
                    </Text>
                  )}
                  {!isEditing && (
                    <IconButton
                      aria-label="削除"
                      icon={<DeleteIcon />}
                      onClick={() => {
                        setTargetBoardId(board.id);
                        confirmDelete(board.id, board.name);
                      }}
                      size="sm"
                      variant="ghost"
                      colorScheme="gray"
                      _hover={{ bg: 'red.100', color: 'red.500' }}
                    />
                  )}
                </Flex>

                <VStack spacing={3} align="stretch">
                  {tasksForBoard.map((task) => (
                    <Task
                      key={task.id}
                      task={task}
                      deleteTask={async () => {
                        await deleteTask(task.id, board.id);
                      }}
                      updateTask={updateTask}
                      updateTaskStatus={updateTaskStatus}
                    />
                  ))}
                </VStack>

                {formVisibility[board.id] ? (
                  <Box ref={formRef}>
                    <Input
                      ref={taskInputRef}
                      placeholder="新しいタスク名"
                      value={taskNames[board.id] ?? ''}
                      onChange={(e) => {
                        handleTaskNameChange(board.id, e.target.value);
                      }}
                      onKeyDown={(e) => {
                        handleKeyDown(e, async () => {
                          await addTask(board.id, taskNames[board.id] ?? '');
                          closeTaskForm(board.id);
                        });
                      }}
                      onBlur={() => {
                        closeTaskForm(board.id);
                      }}
                      borderColor={accentColor}
                      _hover={{ borderColor: accentColor }}
                      _focus={{
                        borderColor: accentColor,
                        boxShadow: `0 0 0 1px ${accentColor}`,
                        bg: hoverFocusBgColor,
                      }}
                    />
                  </Box>
                ) : (
                  <IconButton
                    aria-label="タスクを追加"
                    icon={<AddIcon />}
                    onClick={() => {
                      toggleTaskFormVisibility(board.id);
                    }}
                    colorScheme="purple"
                    variant="outline"
                    w="100%"
                    _hover={{ bg: 'purple.100' }}
                  />
                )}
              </VStack>
            </Box>
          );
        })
      ) : (
        <Text color="gray.500">
          ボードがありません。新しいボードを追加してください。
        </Text>
      )}
      {isModalVisible && targetBoardId !== null && (
        <ConfirmModal
          isVisible={isModalVisible}
          onConfirm={() => {
            handleConfirmDelete(async () => {
              await deleteBoard(targetBoardId);
            });
          }}
          onCancel={() => {
            handleCancelDelete();
            setTargetBoardId(null);
          }}
          message={`本当に ${boards.find((b) => b.id === targetBoardId)?.name} を削除しますか？`}
        />
      )}
    </VStack>
  );
};

export default Board;
