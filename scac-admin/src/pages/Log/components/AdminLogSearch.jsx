import { LOG_LEVEL_LABELS, LOG_TYPE_LABELS } from '../../../constants/log';

export default function AdminLogSearch({
  keyword,
  typeFilter,
  levelFilter,
  onKeywordChange,
  onTypeChange,
  onLevelChange,
  onReset,
}) {
  return (
    <section className="admin_log_search">
      <div className="admin_log_search_group is_keyword">
        <label htmlFor="log_keyword">검색</label>

        <input
          id="log_keyword"
          type="text"
          value={keyword}
          placeholder="전화번호, 로그 내용, 대상 ID를 검색하세요."
          onChange={(event) => onKeywordChange(event.target.value)}
        />
      </div>

      <div className="admin_log_search_group">
        <label htmlFor="log_type">로그 유형</label>

        <select
          id="log_type"
          value={typeFilter}
          onChange={(event) => onTypeChange(event.target.value)}
        >
          <option value="ALL">전체</option>

          {Object.entries(LOG_TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="admin_log_search_group">
        <label htmlFor="log_level">로그 상태</label>

        <select
          id="log_level"
          value={levelFilter}
          onChange={(event) => onLevelChange(event.target.value)}
        >
          <option value="ALL">전체</option>

          {Object.entries(LOG_LEVEL_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        className="admin_log_reset_button"
        onClick={onReset}
      >
        초기화
      </button>
    </section>
  );
}
