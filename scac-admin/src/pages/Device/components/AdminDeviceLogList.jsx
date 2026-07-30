import { useEffect, useMemo, useState } from 'react';
import Pagination from '../../../components/common/Pagination';
import { DEVICE_STATUS_LABELS } from '../../../constants/device';

const PAGE_SIZE = 5;

export default function AdminDeviceLogList({ logs }) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(logs.length / PAGE_SIZE);

  const currentLogs = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;

    return logs.slice(startIndex, endIndex);
  }, [logs, currentPage]);

  // 장치를 새로 선택하거나 로그가 갱신되면 첫 페이지로 이동
  useEffect(() => {
    setCurrentPage(1);
  }, [logs]);

  const formatDateTime = (dateTime) => {
    if (!dateTime) {
      return '-';
    }

    return new Date(dateTime).toLocaleString('ko-KR');
  };

  return (
    <div className="admin_device_log_section">
      <div className="admin_device_log_header">
        <h4>장치 로그</h4>

        <span>{logs.length}건</span>
      </div>

      {logs.length === 0 ? (
        <p className="admin_device_log_empty">기록된 장치 로그가 없습니다.</p>
      ) : (
        <>
          <ul className="admin_device_log_list">
            {currentLogs.map((log) => (
              <li key={log.logId} className="admin_device_log_item">
                <div className="admin_device_log_info">
                  <strong>{log.eventType}</strong>

                  <span
                    className={`admin_status_badge is_${log.status.toLowerCase()}`}
                  >
                    {DEVICE_STATUS_LABELS[log.status]}
                  </span>
                </div>

                <p>{log.message ?? '-'}</p>

                <small>{formatDateTime(log.createdAt)}</small>
              </li>
            ))}
          </ul>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            pageGroupSize={3}
          />
        </>
      )}
    </div>
  );
}
