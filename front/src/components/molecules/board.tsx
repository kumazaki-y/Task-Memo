import { type FC } from 'react';
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
    <div>
      {/* Boardリスト */}
      {boards.length > 0 ? (
        boards.map((board) => (
          <div key={board.id}>
            {isEditing && board.id === selectedBoardId ? (
              <div>
                <input
                  type="text"
                  value={boardName}
                  onChange={(e) => {
                    setBoardName(e.target.value);
                  }}
                />
                <Button
                  label="保存"
                  onClick={() => {
                    updateBoard();
                  }}
                />
                <Button
                  label="キャンセル"
                  onClick={() => {
                    setSelectedBoardId(null);
                  }}
                />
              </div>
            ) : (
              <div
                role="button"
                tabIndex={0} // キーボード操作対応
                onClick={() => {
                  toggleEditing(board.id, board.name); // 編集モードを切り替え
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    toggleEditing(board.id, board.name);
                  }
                }}
              >
                {board.name}
              </div>
            )}
            <Button
              label="削除"
              onClick={() => {
                confirmDelete(board.id, board.name);
              }}
            />
          </div>
        ))
      ) : (
        <p>No boards available.</p>
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
    </div>
  );
};

export default Board;
