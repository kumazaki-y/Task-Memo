import { type FC, useState } from 'react';
import {
  Box,
  Text,
  Input,
  Textarea,
  Checkbox,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import Button from '../atoms/button';

interface TaskDetailProps {
  task: {
    id: number;
    name: string;
    description?: string;
    is_completed: boolean;
    due_date?: string;
    boardId: number;
  };
  onClose: () => void; // 閉じるための関数
  updateTaskDetail: (
    id: number,
    boardId: number,
    name: string,
    description: string,
    isCompleted: boolean,
    dueDate: string,
  ) => void; // タスク詳細の更新
}

const TaskDetail: FC<TaskDetailProps> = ({
  task,
  onClose,
  updateTaskDetail,
}) => {
  const [newName, setNewName] = useState(task.name);
  const [newDescription, setNewDescription] = useState(task.description ?? '');
  const [newDueDate, setNewDueDate] = useState(task.due_date ?? '');
  const [isCompleted, setIsCompleted] = useState(task.is_completed);

  const handleSave = () => {
    updateTaskDetail(
      task.id,
      task.boardId,
      newName,
      newDescription,
      isCompleted,
      newDueDate,
    );
    onClose();
  };

  return (
    <Modal isOpen={true} onClose={onClose}>
      <ModalOverlay bg="rgba(0, 0, 0, 0.8)" />

      <ModalContent maxWidth="600px" mx="auto" my="10%" borderRadius="lg" p={6}>
        <ModalHeader>タスク詳細</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box p={4}>
            <Text fontSize="lg" fontWeight="bold">
              タスク編集
            </Text>

            <Text>名前</Text>
            <Textarea
              value={newName}
              onChange={(e) => {
                setNewName(e.target.value);
              }}
              placeholder="タスク名を入力"
              mb={4}
            />

            <Text>説明</Text>
            <Textarea
              value={newDescription}
              onChange={(e) => {
                setNewDescription(e.target.value);
              }}
              placeholder="タスクの説明を入力"
              mb={4}
              rows={10}
              overflow="auto"
            />

            <Text>完了状態</Text>
            <Checkbox
              isChecked={isCompleted}
              onChange={(e) => {
                setIsCompleted(e.target.checked);
              }}
              mb={4}
            >
              {isCompleted ? '完了' : '未完了'}
            </Checkbox>

            <Text>期限</Text>
            <Input
              type="date"
              value={newDueDate}
              onChange={(e) => {
                setNewDueDate(e.target.value);
              }}
              mb={4}
            />

            <Button
              label="保存"
              onClick={handleSave}
              colorScheme="blue"
              size="md"
            />
            <Button
              label="キャンセル"
              onClick={onClose}
              colorScheme="gray"
              size="md"
              className="ml-2"
            />
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default TaskDetail;
