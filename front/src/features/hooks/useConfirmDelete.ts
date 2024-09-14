import { useState } from 'react';

interface UseConfirmDeleteReturn {
  isModalVisible: boolean;
  targetName: string | null;
  confirmDelete: (id: number, name?: string) => void;
  handleConfirmDelete: (deleteCallback: (id: number) => void) => void;
  handleCancelDelete: () => void;
}
const useConfirmDelete = (): UseConfirmDeleteReturn => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [targetId, setTargetId] = useState<number | null>(null);
  const [targetName, setTargetName] = useState<string | null>(null);

  // モーダル表示時に削除対象を設定
  const confirmDelete = (id: number, name?: string) => {
    setTargetId(id);
    setTargetName(name ?? null);
    setIsModalVisible(true);
  };

  // モーダルで「はい」が押された場合に呼ばれる
  const handleConfirmDelete = (deleteCallback: (id: number) => void) => {
    if (targetId !== null) {
      deleteCallback(targetId);
    }
    setIsModalVisible(false); // モーダルを閉じる
  };

  // モーダルで「いいえ」が押された場合にモーダルを閉じる
  const handleCancelDelete = () => {
    setIsModalVisible(false);
    setTargetId(null);
    setTargetName(null);
  };

  return {
    isModalVisible,
    targetName,
    confirmDelete,
    handleConfirmDelete,
    handleCancelDelete,
  };
};

export default useConfirmDelete;
