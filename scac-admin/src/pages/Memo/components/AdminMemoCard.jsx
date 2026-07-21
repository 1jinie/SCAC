export default function AdminMemoCard({ memo, selected, onClick }) {
  const createdAt = new Date(memo.created_at);
  const date =
    `${createdAt.getFullYear()}.` +
    `${String(createdAt.getMonth() + 1).padStart(2, '0')}.` +
    `${String(createdAt.getDate()).padStart(2, '0')}`;
  const time =
    `${String(createdAt.getHours()).padStart(2, '0')}:` +
    `${String(createdAt.getMinutes()).padStart(2, '0')}`;

  return (
    <div
      className={`admin_memo_card ${selected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <div className="admin_memo_header">
        <span className="admin_memo_date">{date}</span>
        <span className="admin_memo_time">{time}</span>
      </div>
      <div className="admin_memo_content">{memo.content}</div>
      <div className="admin_memo_footer">
        <span>작성자 #{memo.user_id}</span>
      </div>
    </div>
  );
}
