import { formatClock, toDateString } from '../../../utils/date';

export default function AdminMemoCard({ memo, selected, onClick }) {
  const createdAt = new Date(memo.createdAt);
  const updatedAt = new Date(memo.updatedAt);

  const isUpdated =
    memo.updatedAt && createdAt.getTime() !== updatedAt.getTime();

  return (
    <div
      className={`admin_memo_card ${selected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <div className="admin_memo_header">
        <span className="admin_memo_date">{toDateString(createdAt)}</span>
        <span className="admin_memo_time">{formatClock(createdAt)}</span>
      </div>
      <div className="admin_memo_content">{memo.content}</div>
      <div className="admin_memo_footer">
        <span>
          {memo.adminId ? `작성자 #${memo.adminId}` : '작성자 정보 없음'}
        </span>

        {isUpdated && (
          <span className="admin_memo_updated">
            수정 {toDateString(updatedAt)} {formatClock(updatedAt)}
          </span>
        )}
      </div>
    </div>
  );
}
