import { type FC } from 'react';
import useLogout from '../../features/auth/hooks/useLogout';
import useBoards from '../../features/hooks/useBoards';
import useToggle from '../../features/hooks/useToggle';
import Button from '../atoms/button';
import Board from '../molecules/board';

const Dashboard: FC = () => {
  const logout = useLogout();
  const [isFormVisible, toggleFormVisible] = useToggle(false); // フォームの表示/非表示
  const {
    boards,
    boardName,
    setBoardName,
    addBoard,
    updateBoard,
    deleteBoard,
    toggleEditing,
    selectedBoardId,
    setSelectedBoardId,
    isEditing,
  } = useBoards(); // ここで全ての状態を管理

  // 追加フォームを閉じるときにリセットする関数
  const closeAddForm = () => {
    toggleFormVisible();
    setBoardName(''); // 入力値をリセット
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to the dashboard.</p>
      <Button label="Logout" onClick={logout} />

      {/* Board追加フォームの表示・非表示 */}
      <Button
        label={isFormVisible ? 'キャンセル' : 'Boardを追加'}
        onClick={() => {
          if (isFormVisible) {
            closeAddForm(); // フォームを閉じてリセット
          } else {
            setBoardName('');
            toggleFormVisible(); // フォームを表示
          }
        }}
      />

      {isFormVisible && (
        <div>
          <input
            type="text"
            placeholder="Board名を入力"
            value={boardName}
            onChange={(e) => {
              setBoardName(e.target.value);
            }}
          />
          <Button
            label="作成"
            onClick={async () => {
              await addBoard(); // ボードの追加が完了してからフォームを閉じる
              closeAddForm(); // フォームを閉じてリセット
            }}
          />
        </div>
      )}

      {/* Boardリストにboardsを渡す */}
      <Board
        boards={boards}
        boardName={boardName}
        setBoardName={setBoardName}
        updateBoard={updateBoard}
        deleteBoard={deleteBoard}
        toggleEditing={toggleEditing}
        selectedBoardId={selectedBoardId}
        setSelectedBoardId={setSelectedBoardId}
        isEditing={isEditing}
        closeAddForm={closeAddForm}
      />
    </div>
  );
};

export default Dashboard;
