import {
  LOG_LEVEL_LABELS,
  LOG_TARGET_TYPE_LABELS,
  LOG_TYPE_LABELS,
} from '../../../constants/log';

export default function AdminLogList({ logs, onLogSelect }) {
  if (logs.length === 0) {
    return <div className="admin_log_empty">조회된 로그가 없습니다.</div>;
  }

  return (
    <div className="admin_log_table_wrap">
      <table className="admin_log_table">
        <thead>
          <tr>
            <th>발생 시간</th>
            <th>유형</th>
            <th>상태</th>
            <th>행위자 (관리자/사용자)</th>
            <th>대상</th>
            <th>내용</th>
            <th aria-label="상세 보기" />
          </tr>
        </thead>

        <tbody>
          {logs.map((log) => {
            const hasAdmin = log.adminId != null;
            const hasUser = log.userId != null;

            return (
              <tr key={log.logId ?? log.id}>
                <td>
                  {log.createdAt
                    ? String(log.createdAt).replace('T', ' ').slice(0, 19)
                    : '-'}
                </td>

                <td>
                  <span className="admin_log_type">
                    {LOG_TYPE_LABELS[log.logType] ?? log.logType}
                  </span>
                </td>

                <td>
                  <span
                    className={`admin_log_level is_${(log.logLevel || '').toLowerCase()}`}
                  >
                    {LOG_LEVEL_LABELS[log.logLevel] ?? log.logLevel}
                  </span>
                </td>

                {/* 관리자ID / 사용자ID 중 하나만 우선하여 명확히 표시 */}
                <td>
                  <div className="admin_log_actor_cell">
                    {hasAdmin ? (
                      <span className="admin_log_actor is_admin">
                        관리자 #{log.adminId}
                      </span>
                    ) : hasUser ? (
                      <span className="admin_log_actor is_user">
                        사용자 #{log.userId}
                      </span>
                    ) : (
                      <span className="admin_log_actor is_system">
                        시스템 (자동)
                      </span>
                    )}
                  </div>
                </td>

                <td>
                  {log.targetType ? (
                    <div className="admin_log_target">
                      <span>
                        {LOG_TARGET_TYPE_LABELS[log.targetType] ?? log.targetType}
                      </span>
                      {log.targetId && <small>#{log.targetId}</small>}
                    </div>
                  ) : (
                    '-'
                  )}
                </td>

                <td className="admin_log_content" title={log.content}>
                  {log.content}
                </td>

                <td>
                  <button
                    type="button"
                    className="admin_table_detail_button"
                    onClick={() => onLogSelect(log.logId ?? log.id)}
                  >
                    상세
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
