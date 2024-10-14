import { type FC, useCallback, useEffect, useRef } from 'react';
import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  Input,
  Flex,
  IconButton,
  useColorModeValue,
  Container,
} from '@chakra-ui/react';
import useLogout from '../../features/auth/hooks/useLogout';
import useBoards from '../../features/hooks/useBoards';
import useToggle from '../../features/hooks/useToggle';
import Board from '../molecules/board';
import DashboardLayout from '../templates/dashboardLayout';

const Dashboard: FC = () => {
  const formRef = useRef<HTMLDivElement>(null); // 外部クリック検出用
  const inputRef = useRef<HTMLInputElement>(null); // フォームのInput用
  const logout = useLogout();
  const [isFormVisible, toggleFormVisible] = useToggle(false);
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
  } = useBoards();

  const closeAddForm = useCallback(() => {
    toggleFormVisible();
    setBoardName('');
  }, [toggleFormVisible, setBoardName]);

  useEffect(() => {
    if (isFormVisible && inputRef.current !== null) {
      inputRef.current?.focus();
    }
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isFormVisible &&
        formRef.current !== null &&
        !formRef.current.contains(event.target as Node)
      ) {
        closeAddForm();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFormVisible, closeAddForm]);

  const buttonBg = useColorModeValue('purple.50', 'purple.900');
  const buttonHoverBg = useColorModeValue('purple.100', 'purple.800');
  const buttonColor = useColorModeValue('purple.600', 'purple.200');

  return (
    <DashboardLayout>
      <Container maxW="800px" p={4}>
        <Flex justifyContent="space-between" alignItems="center" mb={4}>
          <Heading as="h1" size="2xl" color="white" ml={2}>
            ダッシュボード
          </Heading>
          <Button
            onClick={logout}
            bg="transparent"
            color="white"
            borderColor="white"
            borderWidth={1}
            _hover={{ bg: 'whiteAlpha.200' }}
          >
            ログアウト
          </Button>
        </Flex>

        <Box bg="white" borderRadius="lg" p={6} boxShadow="xl">
          <VStack spacing={4} align="stretch">
            <Flex justifyContent="space-between" alignItems="center" px={2}>
              <Text fontSize="lg" fontWeight="bold">
                ボード一覧
              </Text>
              <IconButton
                aria-label={isFormVisible ? 'キャンセル' : 'ボードを追加'}
                icon={isFormVisible ? <CloseIcon /> : <AddIcon />}
                onClick={() => {
                  isFormVisible ? closeAddForm() : toggleFormVisible();
                }}
                bg={buttonBg}
                color={buttonColor}
                _hover={{ bg: buttonHoverBg }}
                size="sm"
              />
            </Flex>

            {isFormVisible && (
              <Flex ref={formRef} px={2}>
                <Input
                  ref={inputRef}
                  placeholder="ボード名を入力"
                  value={boardName}
                  onChange={(e) => {
                    setBoardName(e.target.value);
                  }}
                  onKeyDown={async (e) => {
                    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                      try {
                        await addBoard();
                        closeAddForm();
                      } catch (error) {
                        console.error('Board creation failed:', error);
                      }
                    }
                  }}
                  mr={2}
                  bg={buttonBg}
                  _focus={{ bg: buttonHoverBg }}
                />
              </Flex>
            )}

            <Board
              key={boards.length}
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
          </VStack>
        </Box>
      </Container>
    </DashboardLayout>
  );
};

export default Dashboard;
