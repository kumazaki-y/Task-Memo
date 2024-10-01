import { type FC, useState } from 'react';
import { Box, Text, Stack, HStack, Input } from '@chakra-ui/react';
import useBoards from '../../features/hooks/useBoards'; // ボード管理フック
import useConfirmDelete from '../../features/hooks/useConfirmDelete';
import useTasks from '../../features/hooks/useTasks'; // useTasksフックをインポート
import Button from '../atoms/button';
import ConfirmModal from './confirmModal';
import Task from './task'; // Taskコンポーネントをインポート

const Board: FC = () => {
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

  // 削除対象のボードIDを追跡する状態を追加
  const [targetBoardId, setTargetBoardId] = useState<number | null>(null);

  const {
    isModalVisible,
    confirmDelete,
    handleConfirmDelete,
    handleCancelDelete,
  } = useConfirmDelete();

  // フォームの表示/非表示を切り替える関数
  const toggleTaskFormVisibility = (boardId: number) => {
    setFormVisibility((prevState) => ({
      ...prevState,
      [boardId]: !prevState[boardId],
    }));
  };

  const handleTaskNameChange = (boardId: number, name: string) => {
    setTaskNames((prev) => ({
      ...prev,
      [boardId]: name, // 各ボードのタスク名を保存
    }));
  };

  const closeTaskForm = (boardId: number) => {
    setFormVisibility((prev) => ({
      ...prev,
      [boardId]: false, // フォームを非表示にする
    }));
    setTaskNames((prev) => ({
      ...prev,
      [boardId]: '', // 該当するタスク名をリセット
    }));
  };

  return (
    <Box
      p={4}
      bg="gray.50"
      borderRadius="md"
      boxShadow="md"
      maxWidth="80%"
      mx="auto"
      mt={8}
    >
      {boards.length > 0 ? (
        <Stack spacing={6}>
          {boards.map((board) => {
            // 各ボードに関連するタスクをフィルタリング
            const tasksForBoard = tasks.filter(
              (task) => task.boardId === board.id,
            );

            return (
              <Box
                key={board.id}
                p={4}
                border="1px solid"
                borderColor="gray.200"
                borderRadius="md"
                w="100%"
              >
                <HStack justifyContent="space-between" w="100%">
                  {isEditing && selectedBoardId === board.id ? (
                    <Input
                      value={boardName}
                      onChange={(e) => {
                        setBoardName(e.target.value);
                      }}
                      placeholder="ボード名を編集"
                    />
                  ) : (
                    <Text
                      fontSize="lg"
                      fontWeight="bold"
                      onClick={() => {
                        toggleEditing(board.id, board.name);
                      }}
                      _hover={{ cursor: 'pointer', color: 'blue.500' }}
                    >
                      {board.name}
                    </Text>
                  )}

                  {/* ボード更新または削除ボタン */}
                  {isEditing && selectedBoardId === board.id ? (
                    <HStack>
                      <Button
                        label="保存"
                        colorScheme="blue"
                        size="sm"
                        onClick={async () => {
                          await updateBoard();
                        }}
                      />
                      <Button
                        label="キャンセル"
                        colorScheme="gray"
                        size="sm"
                        onClick={() => {
                          toggleEditing(board.id, board.name);
                        }}
                      />
                    </HStack>
                  ) : (
                    <Button
                      label="ボードを削除"
                      colorScheme="red"
                      size="sm"
                      onClick={() => {
                        setTargetBoardId(board.id); // 削除対象のボードIDを設定
                        confirmDelete(board.id, board.name); // 削除確認モーダルを表示
                      }}
                    />
                  )}
                </HStack>

                {/* 削除確認モーダル */}
                {isModalVisible && targetBoardId === board.id && (
                  <ConfirmModal
                    isVisible={isModalVisible}
                    onConfirm={() => {
                      handleConfirmDelete(async () => {
                        await deleteBoard(board.id);
                      });
                    }}
                    onCancel={() => {
                      handleCancelDelete();
                      setTargetBoardId(null); // モーダルを閉じたらターゲットIDをリセット
                    }}
                    message={`本当に ${board.name} を削除しますか？`}
                  />
                )}

                {/* タスクリストの表示 */}
                <Stack spacing={4}>
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
                </Stack>

                {/* タスク追加フォームの表示切替ボタン */}
                <Button
                  label={
                    formVisibility[board.id] ? 'キャンセル' : 'タスクを追加'
                  }
                  onClick={() => {
                    toggleTaskFormVisibility(board.id);
                  }}
                />

                {/* タスク追加フォーム */}
                {formVisibility[board.id] && (
                  <Stack spacing={4}>
                    <input
                      type="text"
                      placeholder="タスク名を入力"
                      value={taskNames[board.id] ?? ''}
                      onChange={(e) => {
                        handleTaskNameChange(board.id, e.target.value);
                      }}
                    />
                    <Button
                      label="タスクを追加"
                      onClick={async () => {
                        await addTask(board.id, taskNames[board.id] ?? '');
                        closeTaskForm(board.id); // タスク追加後にフォームをリセット
                      }}
                    />
                  </Stack>
                )}
              </Box>
            );
          })}
        </Stack>
      ) : (
        <Text>No boards available.</Text>
      )}
    </Box>
  );
};

export default Board;
