import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import AdminSummary from '../../components/common/Summary';
import Pagination from '../../components/common/Pagination';
import {
  LOG_ACTION_LABELS,
  LOG_LEVEL_LABELS,
  LOG_TARGET_TYPE_LABELS,
  LOG_TYPE_LABELS,
} from '../../constants/log';
import AdminLogList from './components/AdminLogList';
import AdminLogSearch from './components/AdminLogSearch';
import './css/AdminLogPage.css';

export default function AdminLogPage() {
  const navigate = useNavigate();
  const ITEMS_PER_PAGE = 10;

  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // 실제 적용되는 검색 필터 상태 (조회 버튼 클릭 시에만 갱신)
  const [appliedFilters, setAppliedFilters] = useState({
    keyword: '',
    typeFilter: 'ALL',
    levelFilter: 'ALL',
  });

  const fetchLogs = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get('/api/admin/logs');
      const data = response.data?.data ?? [];
      
      // 최신순 정렬 보장 (createdAt 내림차순)
      const sortedData = [...data].sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA;
      });

      setLogs(sortedData);
    } catch (error) {
      console.error('로그 목록 조회 실패:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // 조회 버튼 클릭 시 호출
  const handleSearch = (filters) => {
    setAppliedFilters(filters);
    setCurrentPage(1);
  };

  // 검색 초기화
  const handleReset = () => {
    setAppliedFilters({
      keyword: '',
      typeFilter: 'ALL',
      levelFilter: 'ALL',
    });
    setCurrentPage(1);
  };

  // 확정된 appliedFilters 기준으로만 필터링 수행 (실시간 자동 필터링 X)
  const filteredLogs = useMemo(() => {
    const { keyword, typeFilter, levelFilter } = appliedFilters;
    const normalizedKeyword = keyword.trim().toLowerCase();

    return logs.filter((log) => {
      const matchesKeyword =
        normalizedKeyword === '' ||
        (log.content ?? '').toLowerCase().includes(normalizedKeyword) ||
        (log.detail ?? '').toLowerCase().includes(normalizedKeyword) ||
        String(log.userId ?? '').includes(normalizedKeyword) ||
        String(log.adminId ?? '').includes(normalizedKeyword) ||
        String(log.action ?? '').toLowerCase().includes(normalizedKeyword);

      const matchesType = typeFilter === 'ALL' || log.logType === typeFilter;
      const matchesLevel =
        levelFilter === 'ALL' || log.logLevel === levelFilter;

      return matchesKeyword && matchesType && matchesLevel;
    });
  }, [logs, appliedFilters]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredLogs.length / ITEMS_PER_PAGE),
  );

  const paginatedLogs = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredLogs.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredLogs, currentPage]);

  // 엑셀 (CSV UTF-8 with BOM) 다운로드 기능
  const handleExportExcel = () => {
    if (filteredLogs.length === 0) {
      window.alert('다운로드할 로그 데이터가 없습니다.');
      return;
    }

    // CSV 헤더 정의
    const headers = [
      '로그 ID',
      '발생 시간',
      '로그 유형',
      '로그 상태(레벨)',
      '처리 액션',
      '행위 주체(구분)',
      '사용자 ID',
      '관리자 ID',
      '대상 유형',
      '대상 ID',
      '로그 내용',
      '상세/오류 내용',
    ];

    // CSV 행 데이터 생성 (콤마, 따옴표, 줄바꿈 이스케이프 처리)
    const escapeCsv = (str) => {
      if (str == null) return '""';
      const text = String(str).replace(/"/g, '""');
      return `"${text}"`;
    };

    const rows = filteredLogs.map((log) => {
      const typeLabel = LOG_TYPE_LABELS[log.logType] ?? log.logType ?? '-';
      const levelLabel = LOG_LEVEL_LABELS[log.logLevel] ?? log.logLevel ?? '-';
      const actionLabel = LOG_ACTION_LABELS[log.action] ?? log.action ?? '-';
      const targetLabel = LOG_TARGET_TYPE_LABELS[log.targetType] ?? log.targetType ?? '-';
      
      const actorLabel = log.adminId != null
        ? `관리자 #${log.adminId}`
        : (log.userId != null ? `사용자 #${log.userId}` : '시스템');

      return [
        log.id ?? log.logId ?? '',
        log.createdAt ? String(log.createdAt).replace('T', ' ') : '',
        typeLabel,
        levelLabel,
        actionLabel,
        actorLabel,
        log.userId ?? '',
        log.adminId ?? '',
        targetLabel,
        log.targetId ?? '',
        log.content ?? '',
        log.detail ?? '',
      ].map(escapeCsv).join(',');
    });

    const csvContent = [headers.map(escapeCsv).join(','), ...rows].join('\r\n');

    // 한글 깨짐 방지를 위한 UTF-8 BOM 추가
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });

    // 파일명 생성: 시스템로그_YYYYMMDD_HHmmss.csv
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const dateStr = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
    const filename = `시스템로그_${dateStr}.csv`;

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 상단 요약 카운트
  const logSummary = useMemo(() => {
    return logs.reduce(
      (result, log) => {
        result.total += 1;
        if (log.logLevel === 'INFO') result.info += 1;
        else if (log.logLevel === 'WARN' || log.logLevel === 'WARNING')
          result.warning += 1;
        else if (log.logLevel === 'ERROR') result.error += 1;
        return result;
      },
      { total: 0, info: 0, warning: 0, error: 0 },
    );
  }, [logs]);

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

  const handleLogSelect = (logId) => {
    navigate(`/log/${logId}`);
  };

  if (isLoading) {
    return (
      <div className="admin_log_page">
        <p className="admin_loading_message">
          시스템 로그를 불러오는 중입니다...
        </p>
      </div>
    );
  }

  const isFiltered =
    appliedFilters.keyword ||
    appliedFilters.typeFilter !== 'ALL' ||
    appliedFilters.levelFilter !== 'ALL';

  return (
    <div className="admin_log_page">
      <section className="admin_page_heading">
        <div>
          <p className="admin_page_eyebrow">SYSTEM LOG</p>
          <h2>로그 확인</h2>
          <p>
            시스템에서 발생한 사용자 활동, 관리자 처리 및 오류 기록을 최신순으로
            확인합니다.
          </p>
        </div>
      </section>

      <AdminSummary items={summaryItems} />

      <AdminLogSearch
        initialValues={appliedFilters}
        onSearch={handleSearch}
        onReset={handleReset}
        onExportExcel={handleExportExcel}
        totalCount={filteredLogs.length}
      />

      {/* 검색 결과 현황 바 */}
      {isFiltered && (
        <div className="admin_log_search_notice">
          <span>
            조건 조회 결과: 총 <strong>{filteredLogs.length}</strong>건의 로그가
            검색되었습니다.
          </span>
          <button
            type="button"
            className="admin_log_search_notice_reset"
            onClick={handleReset}
          >
            전체 목록 보기
          </button>
        </div>
      )}

      <AdminLogList logs={paginatedLogs} onLogSelect={handleLogSelect} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
