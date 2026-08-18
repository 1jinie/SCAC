import { formatClock, toDateString } from '../../../utils/date';
import {
  getAdminColor,
  getCleanMemoContent,
  isMemoCompleted,
} from '../../../utils/memoUtils';

export default function AdminMemoCard({ memo, selected, onClick }) {
  const createdAt = new Date(memo.createdAt);
  const updatedAt = new Date(memo.updatedAt);

  const isUpdated =
    memo.updatedAt && createdAt.getTime() !== updatedAt.getTime();

  const completed = isMemoCompleted(memo.content);
  const cleanContent = getCleanMemoContent(memo.content);
  const color = getAdminColor(memo.adminId);

  return (
    <div
      className={`admin_memo_card ${selected ? 'selected' : ''} ${
        completed ? 'completed' : ''
      }`}
      style={
        !completed
          ? {
              backgroundColor: color.bg,
              borderColor: color.border,
            }
          : undefined
      }
      onClick={onClick}
    >
      <div className="admin_memo_header">
        <span className="admin_memo_date">{toDateString(createdAt)}</span>
        <span className="admin_memo_time">{formatClock(createdAt)}</span>
      </div>

      <div className="admin_memo_content">{cleanContent}</div>

      <div className="admin_memo_footer">
        <span
          className="admin_memo_author_tag"
          style={!completed ? { color: color.text } : undefined}
        >
          {memo.adminId ? `작성자 #${memo.adminId}` : '작성자 정보 없음'}
        </span>

        {completed ? (
          <span className="admin_memo_done_tag">✓ 완료됨</span>
        ) : isUpdated ? (
          <span className="admin_memo_updated">
            수정 {toDateString(updatedAt)} {formatClock(updatedAt)}
          </span>
        ) : null}
      </div>
    </div>
  );
}
