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

  const fetchMemos = useCallback(async () => {
    try {
      const memos = await memoApi.getMemos();
      setMemoData(memos);
    } catch (error) {
      console.error('메모 목록 조회 실패:', error.response?.data ?? error);
    }
  }, []);

  useEffect(() => {
    fetchMemos();
  }, [fetchMemos]);

  const totalPages = Math.ceil(memoData.length / PAGE_SIZE);

  const currentMemos = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;

    return memoData.slice(startIndex, endIndex);
  }, [memoData, currentPage]);

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
