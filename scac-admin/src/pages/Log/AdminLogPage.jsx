import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import AdminSummary from "../../components/common/Summary";
import AdminLogList from "./components/AdminLogList";
import AdminLogSearch from "./components/AdminLogSearch";
import Pagination from "../../components/common/Pagination";
import "./css/AdminLogPage.css";

export default function AdminLogPage() {
  const navigate = useNavigate();
  const ITEMS_PER_PAGE = 10;

  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const [keyword, setKeyword] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [levelFilter, setLevelFilter] = useState("ALL");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get("/api/admin/logs");
        setLogs(response.data?.data ?? []);
      } catch (error) {
        console.error("로그 목록 조회 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, []);

  // 검색 및 필터링 로직
  const filteredLogs = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return logs.filter((log) => {
      const matchesKeyword =
        normalizedKeyword === "" ||
        (log.content ?? "").toLowerCase().includes(normalizedKeyword) ||
        (log.detail ?? "").toLowerCase().includes(normalizedKeyword) ||
        String(log.userId ?? "").includes(normalizedKeyword) ||
        String(log.adminId ?? "").includes(normalizedKeyword);

      const matchesType = typeFilter === "ALL" || log.logType === typeFilter;
      const matchesLevel =
        levelFilter === "ALL" || log.logLevel === levelFilter;

      return matchesKeyword && matchesType && matchesLevel;
    });
  }, [logs, keyword, typeFilter, levelFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredLogs.length / ITEMS_PER_PAGE),
  );

  const paginatedLogs = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredLogs.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredLogs, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [keyword, typeFilter, levelFilter]);

  // 상단 요약 카운트
  const logSummary = useMemo(() => {
    return logs.reduce(
      (result, log) => {
        result.total += 1;
        if (log.logLevel === "INFO") result.info += 1;
        else if (log.logLevel === "WARN" || log.logLevel === "WARNING")
          result.warning += 1;
        else if (log.logLevel === "ERROR") result.error += 1;
        return result;
      },
      { total: 0, info: 0, warning: 0, error: 0 },
    );
  }, [logs]);

  const summaryItems = useMemo(
    () => [
      {
        key: "total",
        label: "전체 로그",
        value: logSummary.total,
        unit: "건",
        description: "전체 시스템 기록",
        color: "blue",
      },
      {
        key: "info",
        label: "안내",
        value: logSummary.info,
        unit: "건",
        description: "정상 처리 기록",
        color: "mint",
      },
      {
        key: "warning",
        label: "주의",
        value: logSummary.warning,
        unit: "건",
        description: "확인이 필요한 기록",
        color: "orange",
        alert: true,
      },
      {
        key: "error",
        label: "오류",
        value: logSummary.error,
        unit: "건",
        description: "즉시 확인 필요",
        color: "red",
        alert: true,
      },
    ],
    [logSummary],
  );

  const handleReset = () => {
    setKeyword("");
    setTypeFilter("ALL");
    setLevelFilter("ALL");
  };

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
