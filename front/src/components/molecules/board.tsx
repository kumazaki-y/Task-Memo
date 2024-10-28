import {
  type FC,
  useState,
  useRef,
  useEffect,
  type KeyboardEvent,
} from 'react';
import {
  AddIcon,
  DeleteIcon,
  CheckIcon,
  CloseIcon,
  ViewIcon,
  ChevronDownIcon,
} from '@chakra-ui/icons';
import {
  Box,
  Text,
  VStack,
  Input,
  Flex,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from '@hello-pangea/dnd';
import useConfirmDelete from '../../features/hooks/useConfirmDelete';
import useTasks, { type Task as TaskType } from '../../features/hooks/useTasks';
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
  setBoards: React.Dispatch<React.SetStateAction<BoardItem[]>>;
}

type FilterKey = 'all' | 'completed' | 'incomplete';

const filterOptions: Record<FilterKey, { label: string; icon: JSX.Element }> = {
  all: { label: 'すべてのタスク', icon: <ViewIcon /> },
  completed: { label: '完了済み', icon: <CheckIcon /> },
  incomplete: { label: '未完了', icon: <CloseIcon /> },
};

const Board: FC<BoardProps> = ({
  boards,
  deleteBoard,
  updateBoard,
  toggleEditing,
  isEditing,
  boardName,
  setBoardName,
  selectedBoardId,
  setSelectedBoardId,
  setBoards,
}) => {
  const { tasks, addTask, deleteTask, updateTask, updateTaskStatus, setTasks } =
    useTasks();

  const [taskFilters, setTaskFilters] = useState<Record<number, FilterKey>>(
    JSON.parse(localStorage.getItem('taskFilters') ?? '{}') as Record<
      number,
      FilterKey
    >,
  );

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

  const updateTaskFilter = (boardId: number, filter: FilterKey) => {
    const updatedFilters = { ...taskFilters, [boardId]: filter };
    setTaskFilters(updatedFilters);
    localStorage.setItem('taskFilters', JSON.stringify(updatedFilters));
  };

  const filterTasks = (tasks: TaskType[], boardId: number): TaskType[] => {
    const filter = taskFilters[boardId] ?? 'all';
    switch (filter) {
      case 'completed':
        return tasks.filter((task) => task.is_completed);
      case 'incomplete':
        return tasks.filter((task) => !task.is_completed);
      default:
        return tasks;
    }
  };

  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    action: () => void,
  ) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      action();
    }
  };

  const handleBoardNameUpdate = async () => {
    await updateBoard();
    setBoards((prevBoards: BoardItem[]) =>
      prevBoards.map((board: BoardItem) =>
        board.id === selectedBoardId ? { ...board, name: boardName } : board,
      ),
    );
    setSelectedBoardId(null);
  };

  // ドラッグ終了時の処理
  const onDragEnd = async (result: DropResult, boardId: number) => {
    const { source, destination } = result;
    if (destination == null) return;

    // 並び替え対象のタスク一覧を取得し、移動されたタスクを新しい位置に配置
    const boardTasks = filterTasks(tasks, boardId);
    const [movedTask] = boardTasks.splice(source.index, 1);
    boardTasks.splice(destination.index, 0, movedTask);

    // 並び替えたタスクリストで`position`パラメータを更新し、APIリクエスト
    try {
      // タスクの並び順を更新
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.boardId === boardId
            ? (boardTasks.find((t) => t.id === task.id) ?? task)
            : task,
        ),
      );

      // APIに新しい順序を送信
      await Promise.all(
        boardTasks.map(async (task, index) => {
          await updateTask(
            task.id,
            boardId,
            task.name,
            task.description,
            task.is_completed,
            task.due_date,
            { position: index }, // 更新後の位置
          );
        }),
      );
    } catch (error) {
      console.error('Error updating task order:', error);
    }
  };

  const bgColor = useColorModeValue('teal.50', 'gray.700');
  const borderColor = useColorModeValue('teal.100', 'gray.600');
  const textColor = useColorModeValue('gray.800', 'white');
  const accentColor = useColorModeValue('teal.500', 'teal.300');
  const hoverBgColor = useColorModeValue('teal.100', 'gray.600');

  return (
    <VStack spacing={6} align="stretch" w="100%">
      {boards.length > 0 ? (
        boards.map((board: BoardItem) => {
          const tasksForBoard = filterTasks(
            tasks.filter((task) => task.boardId === board.id),
            board.id,
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
                        handleKeyDown(e, handleBoardNameUpdate);
                      }}
                      onBlur={handleBoardNameUpdate}
                      placeholder="ボード名を編集"
                      size="lg"
                      fontWeight="bold"
                      borderColor={accentColor}
                      _hover={{ borderColor: accentColor }}
                      _focus={{
                        borderColor: accentColor,
                        boxShadow: `0 0 0 1px ${accentColor}`,
                        bg: hoverBgColor,
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
                        setSelectedBoardId(board.id);
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

                <Menu>
                  <MenuButton
                    as={Button}
                    size="sm"
                    variant="outline"
                    rightIcon={<ChevronDownIcon />}
                    leftIcon={
                      filterOptions[taskFilters[board.id] ?? 'all'].icon
                    }
                    colorScheme="teal"
                  >
                    {filterOptions[taskFilters[board.id] ?? 'all'].label}
                  </MenuButton>
                  <MenuList>
                    <MenuItem
                      icon={<ViewIcon />}
                      onClick={() => {
                        updateTaskFilter(board.id, 'all');
                      }}
                    >
                      すべてのタスク
                    </MenuItem>
                    <MenuItem
                      icon={<CheckIcon />}
                      onClick={() => {
                        updateTaskFilter(board.id, 'completed');
                      }}
                    >
                      完了済み
                    </MenuItem>
                    <MenuItem
                      icon={<CloseIcon />}
                      onClick={() => {
                        updateTaskFilter(board.id, 'incomplete');
                      }}
                    >
                      未完了
                    </MenuItem>
                  </MenuList>
                </Menu>

                {tasksForBoard.length > 0 ? (
                  <DragDropContext
                    onDragEnd={async (result) => {
                      await onDragEnd(result, board.id);
                    }}
                  >
                    <Droppable droppableId={`${board.id}`}>
                      {(provided) => (
                        <VStack
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          spacing={3}
                          align="stretch" // 子要素をボード全体に合わせる
                        >
                          {tasksForBoard.map((task, index) => (
                            <Draggable
                              key={task.id}
                              draggableId={`${task.id}`}
                              index={index}
                            >
                              {(provided) => (
                                <Box
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  p={0} // 余白調整
                                  bg="transparent" // 背景色を透明に
                                  width="100%" // 全幅で表示
                                >
                                  <Task
                                    task={task}
                                    deleteTask={async () => {
                                      await deleteTask(task.id, board.id);
                                    }}
                                    updateTask={updateTask}
                                    updateTaskStatus={updateTaskStatus}
                                  />
                                </Box>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </VStack>
                      )}
                    </Droppable>
                  </DragDropContext>
                ) : (
                  <Text color="gray.500" fontSize="md">
                    タスクがありません
                  </Text>
                )}

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
                        bg: hoverBgColor,
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
                    colorScheme="green"
                    variant="outline"
                    w="100%"
                    _hover={{ bg: 'teal.100' }}
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
          onCancel={handleCancelDelete}
          message={`本当に ${boards.find((b) => b.id === targetBoardId)?.name} を削除しますか？`}
        />
      )}
    </VStack>
  );
};

export default Board;
