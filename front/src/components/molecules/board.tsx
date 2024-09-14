import { type FC } from 'react';
import { Box, Stack, Text } from '@chakra-ui/react';
import useConfirmDelete from '../../features/hooks/useConfirmDelete';
import Button from '../atoms/button';
import ConfirmModal from './confirmModal';

interface BoardProps {
  boards: Array<{ id: number; name: string }>;
  boardName: string;
  setBoardName: (name: string) => void;
  updateBoard: () => void;
  deleteBoard: (id: number) => void;
  toggleEditing: (id: number, name: string) => void;
  selectedBoardId: number | null;
  setSelectedBoardId: (id: number | null) => void;
  isEditing: boolean;
}

const Board: FC<BoardProps> = ({
  boards,
  boardName,
  setBoardName,
  updateBoard,
  deleteBoard,
  toggleEditing,
  selectedBoardId,
  setSelectedBoardId,
  isEditing,
}) => {
  const {
    isModalVisible,
    targetName,
    confirmDelete,
    handleConfirmDelete,
    handleCancelDelete,
  } = useConfirmDelete();

  return (
    <Box
      p={4}
      bg="gray.50"
      borderRadius="md"
      boxShadow="md"
      maxWidth={['100%', '80%', '60%']}
      mx="auto"
      mt={8}
    >
      {/* Boardリスト */}
      {boards.length > 0 ? (
        <Stack spacing={6}>
          {boards.map((board) => (
            <Box
              key={board.id}
              p={4}
              border="1px solid"
              borderColor="gray.200"
              borderRadius="md"
              w="100%"
            >
              {isEditing && board.id === selectedBoardId ? (
                <Stack spacing={4}>
                  <input
                    type="text"
                    value={boardName}
                    onChange={(e) => {
                      setBoardName(e.target.value);
                    }}
                    style={{
                      padding: '8px',
                      borderRadius: '4px',
                      border: '1px solid gray',
                    }}
                  />
                  <Stack direction="row" spacing={4}>
                    <Button
                      label="保存"
                      colorScheme="blue"
                      onClick={() => {
                        updateBoard();
                      }}
                    />
                    <Button
                      label="キャンセル"
                      colorScheme="gray"
                      onClick={() => {
                        setSelectedBoardId(null);
                      }}
                    />
                  </Stack>
                </Stack>
              ) : (
                <Stack spacing={4} alignItems="flex-start">
                  <Text
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      toggleEditing(board.id, board.name);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        toggleEditing(board.id, board.name);
                      }
                    }}
                    fontSize="lg"
                    fontWeight="bold"
                    _hover={{ cursor: 'pointer', color: 'blue.500' }}
                  >
                    {board.name}
                  </Text>
                  <Button
                    label="削除"
                    colorScheme="red"
                    size="sm"
                    onClick={() => {
                      confirmDelete(board.id, board.name);
                    }}
                  />
                </Stack>
              )}
            </Box>
          ))}
        </Stack>
      ) : (
        <Text>No boards available.</Text>
      )}

      {/* 削除確認モーダル */}
      <ConfirmModal
        isVisible={isModalVisible}
        onConfirm={() => {
          handleConfirmDelete(deleteBoard);
        }}
        onCancel={() => {
          handleCancelDelete();
        }}
        message="本当に削除してよろしいですか？"
        targetName={targetName}
      />
    </Box>
  );
};

export default Board;
