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
  VStack,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react';
import Button from '../atoms/button'; // 汎用的なボタンをインポート

interface TaskDetailProps {
  task: {
    id: number;
    name: string;
    description?: string;
    is_completed: boolean;
    due_date?: string;
    boardId: number;
  };
  onClose: () => void;
  updateTaskDetail: (
    id: number,
    boardId: number,
    name: string,
    description: string,
    isCompleted: boolean,
    dueDate: string,
  ) => void;
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

  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedColor = useColorModeValue('gray.500', 'gray.400');
  const accentColor = useColorModeValue('teal.500', 'teal.300');

  return (
    <Modal isOpen={true} onClose={onClose} size="8xl">
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
      <ModalContent
        bg={bgColor}
        mx="auto"
        my="10%"
        borderRadius="lg"
        width="90%"
      >
        <ModalHeader color={textColor}>タスク詳細</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Box>
              <Text fontWeight="bold" mb={2} color={textColor}>
                タスク名
              </Text>
              <Input
                value={newName}
                onChange={(e) => {
                  setNewName(e.target.value);
                }}
                placeholder="タスク名を入力"
                borderColor={accentColor}
                _hover={{ borderColor: accentColor }}
                _focus={{
                  borderColor: accentColor,
                  boxShadow: `0 0 0 1px ${accentColor}`,
                }}
              />
            </Box>

            <Box>
              <Text fontWeight="bold" mb={2} color={textColor}>
                説明
              </Text>
              <Textarea
                value={newDescription}
                onChange={(e) => {
                  setNewDescription(e.target.value);
                }}
                placeholder="タスクの説明を入力"
                rows={10}
                borderColor={accentColor}
                _hover={{ borderColor: accentColor }}
                _focus={{
                  borderColor: accentColor,
                  boxShadow: `0 0 0 1px ${accentColor}`,
                }}
              />
            </Box>

            <HStack spacing={6} align="center">
              <Box>
                <Text fontWeight="bold" mb={2} color={textColor}>
                  完了状態
                </Text>
                <Checkbox
                  isChecked={isCompleted}
                  onChange={(e) => {
                    setIsCompleted(e.target.checked);
                  }}
                  colorScheme="teal"
                  height="40px"
                >
                  <Text color={mutedColor} width="100px">
                    {isCompleted ? '完了' : '未完了'}
                  </Text>
                </Checkbox>
              </Box>

              <Box>
                <Text fontWeight="bold" mb={2} color={textColor}>
                  期限
                </Text>
                <Input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => {
                    setNewDueDate(e.target.value);
                  }}
                  borderColor={accentColor}
                  _hover={{ borderColor: accentColor }}
                  _focus={{
                    borderColor: accentColor,
                    boxShadow: `0 0 0 1px ${accentColor}`,
                  }}
                  width="140px"
                  height="40px"
                  onClick={(e) => {
                    (e.target as HTMLInputElement).showPicker();
                  }}
                />
              </Box>
            </HStack>

            <HStack spacing={4} justifyContent="center">
              <Button
                label="キャンセル"
                onClick={onClose}
                colorScheme="gray"
                type="button"
                size="md"
                width="120px"
              />
              <Button
                label="保存"
                onClick={handleSave}
                colorScheme="teal"
                type="button"
                size="md"
                width="120px"
              />
            </HStack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default TaskDetail;
