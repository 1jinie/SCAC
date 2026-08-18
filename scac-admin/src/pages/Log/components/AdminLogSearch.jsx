import { useState } from 'react';
import { LOG_LEVEL_LABELS, LOG_TYPE_LABELS } from '../../../constants/log';

export default function AdminLogSearch({
  initialValues,
  onSearch,
  onReset,
  onExportExcel,
  totalCount,
}) {
  const [keyword, setKeyword] = useState(initialValues.keyword || '');
  const [typeFilter, setTypeFilter] = useState(initialValues.typeFilter || 'ALL');
  const [levelFilter, setLevelFilter] = useState(initialValues.levelFilter || 'ALL');

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    onSearch({
      keyword: keyword.trim(),
      typeFilter,
      levelFilter,
    });
  };

  const handleResetClick = () => {
    setKeyword('');
    setTypeFilter('ALL');
    setLevelFilter('ALL');
    onReset();
  };

  return (
    <section className="admin_log_search">
      <form className="admin_log_search_form" onSubmit={handleSearchSubmit}>
        <div className="admin_log_search_group is_keyword">
          <label htmlFor="log_keyword">검색어</label>
          <input
            id="log_keyword"
            type="text"
            value={keyword}
            placeholder="내용, 상세 오류, 사용자 ID, 관리자 ID 검색"
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>

        <div className="admin_log_search_group">
          <label htmlFor="log_type">로그 유형</label>
          <select
            id="log_type"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="ALL">전체 유형</option>
            {Object.entries(LOG_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="admin_log_search_group">
          <label htmlFor="log_level">로그 상태 (레벨)</label>
          <select
            id="log_level"
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
          >
            <option value="ALL">전체 상태</option>
            {Object.entries(LOG_LEVEL_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="admin_log_search_actions">
          <button type="submit" className="admin_log_search_submit_btn">
            조회
          </button>
          <button
            type="button"
            className="admin_log_reset_button"
            onClick={handleResetClick}
          >
            초기화
          </button>
        </div>
      </form>

      <div className="admin_log_search_extra">
        <button
          type="button"
          className="admin_log_excel_button"
          onClick={onExportExcel}
          title="조회된 로그 목록을 엑셀(CSV) 파일로 다운로드합니다."
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          엑셀 다운로드 ({totalCount}건)
        </button>
      </div>
    </section>
  );
}
