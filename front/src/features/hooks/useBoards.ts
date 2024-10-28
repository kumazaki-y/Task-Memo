import { useState, useEffect, useCallback } from 'react';
import { BOARDS_API } from '../../urls';
import { apiRequest } from '../../utils/apiRequest';

interface BoardItem {
  id: number;
  name: string;
}

interface UseBoardsReturn {
  boards: BoardItem[];
  filterBoards: (searchQuery: string) => void;
  setBoards: React.Dispatch<React.SetStateAction<BoardItem[]>>;
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
  const [boards, setBoards] = useState<BoardItem[]>([]); // 取得された全てのボード
  const [filteredBoards, setFilteredBoards] = useState<BoardItem[]>([]); // フィルタリングされたボード
  const [isEditing, setIsEditing] = useState(false);
  const [boardName, setBoardName] = useState('');
  const [selectedBoardId, setSelectedBoardId] = useState<number | null>(null);

  // ボードを取得する関数
  const fetchBoards = useCallback(async (): Promise<void> => {
    try {
      const data = await apiRequest<BoardItem[]>(BOARDS_API, 'GET');
      setBoards(data);
      setFilteredBoards(data); // 取得時に全ボードをフィルタリングリストにセット
    } catch (error) {
      console.error('Error fetching boards:', error);
    }
  }, []);

  // ボードを検索クエリに基づいてフィルタリング
  const filterBoards = (searchQuery: string) => {
    const filtered = boards.filter((board) =>
      board.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    console.log('フィルタリング後のboards:', filtered); // ここでフィルタリング結果を確認
    setFilteredBoards(filtered); // フィルタされたリストを設定
  };

  // ボードを作成する関数
  const addBoard = async (): Promise<void> => {
    try {
      const newBoard = await apiRequest<BoardItem>(BOARDS_API, 'POST', {
        board: { name: boardName },
      });
      setBoards((prevBoards) => [...prevBoards, newBoard]);
      setFilteredBoards((prevBoards) => [...prevBoards, newBoard]); // 新しいボードもフィルタリングリストに追加
      setBoardName(''); // フォームをリセット
    } catch (error) {
      console.error('Error creating board:', error);
    }
  };

  // ボードを編集する関数
  const updateBoard = async (): Promise<void> => {
    if (selectedBoardId === null) return;

    try {
      const updatedBoard = await apiRequest<BoardItem>(
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

      // filteredBoardsも更新して即時反映を実現
      setFilteredBoards((prevFilteredBoards) =>
        prevFilteredBoards.map((board) =>
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
      setBoards((prevBoards) => prevBoards.filter((board) => board.id !== id));
      setFilteredBoards((prevFilteredBoards) =>
        prevFilteredBoards.filter((board) => board.id !== id),
      );
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
    void fetchBoards();
  }, [fetchBoards]);

  return {
    boards: filteredBoards,
    filterBoards,
    setBoards,
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
