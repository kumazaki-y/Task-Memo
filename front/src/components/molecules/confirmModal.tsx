import { type FC } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

interface ConfirmModalProps {
  isVisible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message: string;
}

const ConfirmModal: FC<ConfirmModalProps> = ({
  isVisible,
  onConfirm,
  onCancel,
  message,
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('purple.100', 'gray.600');

  return (
    <Modal isOpen={isVisible} onClose={onCancel}>
      <ModalOverlay />
      <ModalContent bg={bgColor} borderColor={borderColor} borderWidth={1}>
        <ModalHeader color={textColor}>確認</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text color={textColor}>{message}</Text>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="gray" mr={3} onClick={onCancel}>
            キャンセル
          </Button>
          <Button colorScheme="red" onClick={onConfirm}>
            削除
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmModal;
