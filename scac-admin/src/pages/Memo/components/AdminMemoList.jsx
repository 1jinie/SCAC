import Pagination from '../../../components/common/Pagination';
import AdminMemoCard from './AdminMemoCard';

export default function AdminMemoList({ memos, selectedMemo, onMemoSelect }) {
  if (memos.length === 0) {
    return <div className="admin_memo_empty">등록된 메모가 없습니다</div>;
  }

  return (
    <div className="admin_memo_grid">
      {memos.map((memo) => (
        <AdminMemoCard
          key={memo.memoId}
          memo={memo}
          selected={selectedMemo?.memoId === memo.memoId}
          onClick={() => onMemoSelect(memo)}
        />
      ))}
    </div>
  );
}
