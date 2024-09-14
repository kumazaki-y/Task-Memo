import { type FC } from 'react';

interface ConfirmModalProps {
  isVisible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message: string;
  targetName?: string;
}

const ConfirmModal: FC<ConfirmModalProps> = ({
  isVisible,
  onConfirm,
  onCancel,
  message,
  targetName,
}) => {
  if (!isVisible) return null;

  const hasTargetName =
    targetName !== undefined && targetName !== null && targetName.trim() !== '';

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>
          {message} {hasTargetName && <strong>{targetName}</strong>}?
        </p>
        <button onClick={onConfirm}>はい</button>
        <button onClick={onCancel}>いいえ</button>
      </div>
    </div>
  );
};

export default ConfirmModal;
