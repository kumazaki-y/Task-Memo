import { type FC, useCallback, useEffect, useRef, useState } from 'react';
import { AddIcon, SearchIcon, CloseIcon } from '@chakra-ui/icons'; // CloseIconを追加
import {
  Box,
  Text,
  VStack,
  Input,
  Flex,
  IconButton,
  Button,
  useColorModeValue,
  Container,
} from '@chakra-ui/react';
import useBoards from '../../features/hooks/useBoards';
import useToggle from '../../features/hooks/useToggle';
import Board from '../molecules/board';
import DashboardLayout from '../templates/dashboardLayout';

const Dashboard: FC = () => {
  const formRef = useRef<HTMLDivElement>(null); // 外部クリック検出用
  const inputRef = useRef<HTMLInputElement>(null); // ボード追加用のInput
  const searchInputRef = useRef<HTMLInputElement>(null); // 検索フォームのInput
  const [isFormVisible, toggleFormVisible] = useToggle(false); // ボード追加フォーム
  const [isSearchVisible, toggleSearchVisible] = useToggle(false); // 検索フォーム
  const [searchQuery, setSearchQuery] = useState(''); // 検索クエリ用

  // useBoardsから必要な関数とステートを取得
  const {
    boards, // フィルタされたボードリスト
    setBoards, // ボードリストを更新
    filterBoards, // フィルタリング関数
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
    setBoardName(''); // ボード名をリセット
  }, [toggleFormVisible, setBoardName]);

  // 検索フォームをクリアして閉じる
  const closeSearchForm = useCallback(() => {
    setSearchQuery(''); // 検索クエリをリセット
    filterBoards(''); // 全てのボードを再表示
    toggleSearchVisible(); // 検索フォームを閉じる
  }, [filterBoards, toggleSearchVisible]);

  // ボード追加フォームと検索フォームの共通外部クリック処理
  useEffect(() => {
    if (isFormVisible && inputRef.current !== null) {
      inputRef.current?.focus();
    }
    if (isSearchVisible && searchInputRef.current !== null) {
      searchInputRef.current?.focus();
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        (isFormVisible || isSearchVisible) &&
        formRef.current !== null &&
        !formRef.current.contains(event.target as Node)
      ) {
        if (isFormVisible) closeAddForm();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFormVisible, isSearchVisible, closeAddForm]);

  const buttonBg = useColorModeValue('teal.50', 'teal.900');
  const buttonHoverBg = useColorModeValue('teal.100', 'teal.800');
  const buttonColor = useColorModeValue('teal.600', 'teal.200');

  // 検索実行時のEnterキー監視
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      e.preventDefault(); // フォームのデフォルト動作を防止
      filterBoards(searchQuery); // 検索クエリでボードをフィルタリング
    }
  };

  return (
    <DashboardLayout>
      <Container maxW="1600px" p={0}>
        <Box bg="white" borderRadius="lg" p={4} boxShadow="xl">
          <VStack spacing={4} align="stretch">
            <Flex justifyContent="space-between" alignItems="center" px={2}>
              <Flex alignItems="center">
                <Text fontSize="lg" fontWeight="bold" mr={2}>
                  ボード一覧
                </Text>
                <IconButton
                  aria-label={isSearchVisible ? '検索を閉じる' : '検索'}
                  icon={isSearchVisible ? <CloseIcon /> : <SearchIcon />} // 検索フォームが開いているときは「✗」を表示
                  onClick={toggleSearchVisible}
                  bg={buttonBg}
                  color={buttonColor}
                  _hover={{ bg: buttonHoverBg }}
                  size="sm"
                />
                {/* 検索クリアボタンを追加 */}
                {searchQuery !== '' && (
                  <Button
                    onClick={closeSearchForm}
                    colorScheme="teal"
                    variant="solid"
                    ml={2}
                    size="sm"
                  >
                    検索をクリア
                  </Button>
                )}
              </Flex>
              <IconButton
                aria-label={isFormVisible ? 'キャンセル' : 'ボードを追加'}
                icon={<AddIcon />}
                onClick={() => {
                  if (isFormVisible) {
                    closeAddForm();
                  } else {
                    setBoardName('');
                    toggleFormVisible();
                  }
                }}
                bg={buttonBg}
                color={buttonColor}
                _hover={{ bg: buttonHoverBg }}
                size="sm"
              />
            </Flex>

            {/* 検索フォームをトグル表示 */}
            {isSearchVisible && (
              <Flex ref={formRef} px={2} alignItems="center">
                <Input
                  ref={searchInputRef}
                  placeholder="ボード名で検索"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                  }}
                  onKeyDown={handleSearchKeyDown} // Enterキーで検索実行
                  size="md"
                  bg={buttonBg}
                  _focus={{ bg: buttonHoverBg }}
                  mb={4}
                />
              </Flex>
            )}

            {/* ボード追加フォーム */}
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

            {/* フィルタされたボードを表示 */}
            <Board
              key={boards.length} // フィルタされたボードの長さをキーに使用
              boards={boards} // フィルタリングされたボードを渡す
              setBoards={setBoards}
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
