import { useCallback, useEffect, useMemo, useState } from 'react';
import { memoApi } from '../../api/memoApi';
import Pagination from '../../components/common/Pagination';
import AdminMemoDetail from './components/AdminMemoDetail';
import AdminMemoList from './components/AdminMemoList';
import './css/AdminMemoPage.css';

export default function AdminMemoPage() {
  const PAGE_SIZE = 9;

  const [memoData, setMemoData] = useState([]);
  const [selectedMemo, setSelectedMemo] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // 검색 상태 (실시간 필터링 X -> [조회] 버튼 클릭 또는 엔터 시에만 적용)
  const [searchInput, setSearchInput] = useState('');
  const [appliedKeyword, setAppliedKeyword] = useState('');

  const fetchMemos = useCallback(async () => {
    try {
      const memos = await memoApi.getMemos();
      setMemoData(memos || []);
    } catch (error) {
      console.error('메모 목록 조회 실패:', error.response?.data ?? error);
    }
  }, []);

  useEffect(() => {
    fetchMemos();
  }, [fetchMemos]);

  // [조회] 버튼 클릭 또는 엔터 입력 시 검색 확정
  const handleSearch = () => {
    setAppliedKeyword(searchInput.trim());
    setCurrentPage(1);
    setSelectedMemo(null);
  };

  // 검색어 초기화
  const handleResetSearch = () => {
    setSearchInput('');
    setAppliedKeyword('');
    setCurrentPage(1);
    setSelectedMemo(null);
  };

  // 확정된 검색어(appliedKeyword)로만 필터링 (타이핑 시 실시간 필터링 방지)
  const filteredMemos = useMemo(() => {
    if (!appliedKeyword) {
      return memoData;
    }
    const query = appliedKeyword.toLowerCase();
    return memoData.filter((memo) => {
      const contentMatch = memo.content?.toLowerCase().includes(query);
      const adminIdMatch = memo.adminId != null && String(memo.adminId).includes(query);
      return contentMatch || adminIdMatch;
    });
  }, [memoData, appliedKeyword]);

  const totalPages = Math.max(1, Math.ceil(filteredMemos.length / PAGE_SIZE));

  const currentMemos = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;

    return filteredMemos.slice(startIndex, endIndex);
  }, [filteredMemos, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedMemo(null);
  };

  const handleMemoSelect = (memo) => {
    setSelectedMemo(memo);
  };

  const handleAddMemo = () => {
    setSelectedMemo(null);
  };

  const handleCreateMemo = async (content) => {
    const createdMemo = await memoApi.createMemo(content);
    await fetchMemos();

    setCurrentPage(1);
    setSelectedMemo(createdMemo);
  };

  const handleUpdateMemo = async (memoId, content) => {
    const updatedMemo = await memoApi.updateMemo(memoId, content);
    await fetchMemos();
    setSelectedMemo(updatedMemo);
  };

  const handleDeleteMemo = async (memoId) => {
    await memoApi.deleteMemo(memoId);
    setSelectedMemo(null);
    await fetchMemos();
  };

  return (
    <div className="admin_memo_page">
      <div className="admin_page_heading">
        <div>
          <p className="admin_page_eyebrow">MEMO MANAGEMENT</p>
          <h2>인수인계 메모</h2>
          <p>관리자 간 전달사항을 기록하고 관리합니다.</p>
        </div>
      </div>

      <section className="admin_memo_workspace">
        <div className="admin_memo_list_section">
          <div className="admin_section_header">
            {/* 검색어 입력 + 조회 버튼 (실시간 필터링 X) */}
            <div className="admin_memo_search_bar">
              <input
                type="text"
                placeholder="내용 또는 작성자 ID 검색"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSearch();
                  }
                }}
              />
              <button
                type="button"
                className="admin_memo_search_btn"
                onClick={handleSearch}
              >
                조회
              </button>
              {appliedKeyword && (
                <button
                  type="button"
                  className="admin_memo_search_reset"
                  onClick={handleResetSearch}
                >
                  초기화
                </button>
              )}
            </div>

            <button className="admin_memo_add" onClick={handleAddMemo}>
              메모 등록
            </button>
          </div>

          <AdminMemoList
            memos={currentMemos}
            selectedMemo={selectedMemo}
            onMemoSelect={handleMemoSelect}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>

        <AdminMemoDetail
          selectedMemo={selectedMemo}
          onCreateMemo={handleCreateMemo}
          onUpdateMemo={handleUpdateMemo}
          onDeleteMemo={handleDeleteMemo}
        />
      </section>
    </div>
  );
}
