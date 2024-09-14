import { useState, useEffect } from 'react';
import { BOARDS_API } from '../../urls';
import { apiRequest } from '../../utils/apiRequest';

interface Board {
  id: number;
  name: string;
}

interface UseBoardsReturn {
  boards: Board[];
  boardName: string;
  setBoardName: (name: string) => void;
  isEditing: boolean;
  addBoard: () => Promise<void>;
  updateBoard: () => Promise<void>;
  deleteBoard: (id: number) => Promise<void>;
  toggleEditing: (id: number, name: string) => void;
  selectedBoardId: number | null;
  setSelectedBoardId: (id: number | null) => void;
}

const useBoards = (): UseBoardsReturn => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [boardName, setBoardName] = useState('');
  const [selectedBoardId, setSelectedBoardId] = useState<number | null>(null);

  // ボードを取得する関数
  const fetchBoards = async (): Promise<void> => {
    try {
      const data = await apiRequest<Board[]>(BOARDS_API, 'GET');
      setBoards(data);
    } catch (error) {
      console.error('Error fetching boards:', error);
    }
  };

  // ボードを作成する関数
  const addBoard = async (): Promise<void> => {
    try {
      const newBoard = await apiRequest<Board>(BOARDS_API, 'POST', {
        board: { name: boardName },
      });
      setBoards([...boards, newBoard]);
      setBoardName(''); // フォームをリセット
    } catch (error) {
      console.error('Error creating board:', error);
    }
  };

  // ボードを編集する関数
  const updateBoard = async (): Promise<void> => {
    if (selectedBoardId === null) return; // 明示的なnullチェック

    try {
      const updatedBoard = await apiRequest<Board>(
        `${BOARDS_API}/${selectedBoardId}`,
        'PATCH',
        {
          board: { name: boardName },
        },
      );
      setBoards((prevBoards) =>
        prevBoards.map((board) =>
          board.id === selectedBoardId
            ? { ...board, name: updatedBoard.name }
            : board,
        ),
      );
      setIsEditing(false);
      setSelectedBoardId(null); // 編集モード解除
    } catch (error) {
      console.error('Error updating board:', error);
    }
  };

  // ボードを削除する関数
  const deleteBoard = async (id: number): Promise<void> => {
    try {
      await apiRequest(`${BOARDS_API}/${id}`, 'DELETE');
      setBoards(boards.filter((board) => board.id !== id));
    } catch (error) {
      console.error('Error deleting board:', error);
    }
  };

  // 編集モードを切り替える関数
  const toggleEditing = (id: number, name: string): void => {
    setIsEditing(!isEditing);
    setSelectedBoardId(id);
    setBoardName(name);
  };

  useEffect(() => {
    void fetchBoards(); // fetchBoards() の実行をマークしてPromise処理の指摘に対応
  }, []);

  return {
    boards,
    boardName,
    setBoardName,
    isEditing,
    addBoard,
    updateBoard,
    deleteBoard,
    toggleEditing,
    selectedBoardId,
    setSelectedBoardId,
  };
};

export default useBoards;
