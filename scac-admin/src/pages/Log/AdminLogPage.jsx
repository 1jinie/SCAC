import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSummary from '../../components/common/Summary';
import admin_log from '../../data/admin_log.json';
import AdminLogList from './components/AdminLogList';
import AdminLogSearch from './components/AdminLogSearch';
import './css/AdminLogPage.css';
import Pagination from '../../components/common/Pagination';

export default function AdminLogPage() {
  const navigate = useNavigate();
  const ITEMS_PER_PAGE = 10;

  const [currentPage, setCurrentPage] = useState(1);

  const [keyword, setKeyword] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [levelFilter, setLevelFilter] = useState('ALL');

  //   const logs = logStore((state) => state.logs);
  // const fetchLogs = logStore((state) => state.fetchLogs);

  // useEffect(() => {
  //   fetchLogs();
  // }, [fetchLogs]);

  const filteredLogs = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return admin_log.filter((log) => {
      const matchesKeyword =
        normalizedKeyword === '' ||
        log.content.toLowerCase().includes(normalizedKeyword) ||
        (log.detail ?? '').toLowerCase().includes(normalizedKeyword) ||
        (log.phoneNumber ?? '').includes(normalizedKeyword) ||
        (log.adminLoginId ?? '').toLowerCase().includes(normalizedKeyword) ||
        String(log.targetId ?? '').includes(normalizedKeyword) ||
        String(log.referenceId ?? '').includes(normalizedKeyword);

      const matchesType = typeFilter === 'ALL' || log.logType === typeFilter;

      const matchesLevel =
        levelFilter === 'ALL' || log.logLevel === levelFilter;

      return matchesKeyword && matchesType && matchesLevel;
    });
  }, [keyword, typeFilter, levelFilter]);

  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE);

  const paginatedLogs = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    return filteredLogs.slice(startIndex, endIndex);
  }, [filteredLogs, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [keyword, typeFilter, levelFilter]);

  const logSummary = useMemo(() => {
    return admin_log.reduce(
      (result, log) => {
        result.total += 1;

        switch (log.logLevel) {
          case 'INFO':
            result.info += 1;
            break;

          case 'WARNING':
            result.warning += 1;
            break;

          case 'ERROR':
            result.error += 1;
            break;

          default:
            break;
        }

        return result;
      },
      {
        total: 0,
        info: 0,
        warning: 0,
        error: 0,
      },
    );
  }, []);

  const summaryItems = useMemo(
    () => [
      {
        key: 'total',
        label: '전체 로그',
        value: logSummary.total,
        unit: '건',
        description: '전체 시스템 기록',
        color: 'blue',
      },
      {
        key: 'info',
        label: '안내',
        value: logSummary.info,
        unit: '건',
        description: '정상 처리 기록',
        color: 'mint',
      },
      {
        key: 'warning',
        label: '주의',
        value: logSummary.warning,
        unit: '건',
        description: '확인이 필요한 기록',
        color: 'orange',
        alert: true,
      },
      {
        key: 'error',
        label: '오류',
        value: logSummary.error,
        unit: '건',
        description: '즉시 확인 필요',
        color: 'red',
        alert: true,
      },
    ],
    [logSummary],
  );

  const handleReset = () => {
    setKeyword('');
    setTypeFilter('ALL');
    setLevelFilter('ALL');
  };

  const handleLogSelect = (logId) => {
    navigate(`/log/${logId}`);
  };

  return (
    <div className="admin_log_page">
      <section className="admin_page_heading">
        <div>
          <p className="admin_page_eyebrow">SYSTEM LOG</p>

          <h2>로그 확인</h2>

          <p>
            시스템에서 발생한 사용자 활동, 관리자 처리 및 오류 기록을
            확인합니다.
          </p>
        </div>
      </section>

      <AdminSummary items={summaryItems} />

      <AdminLogSearch
        keyword={keyword}
        typeFilter={typeFilter}
        levelFilter={levelFilter}
        onKeywordChange={setKeyword}
        onTypeChange={setTypeFilter}
        onLevelChange={setLevelFilter}
        onReset={handleReset}
      />

      <AdminLogList logs={paginatedLogs} onLogSelect={handleLogSelect} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
