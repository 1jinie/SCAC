import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  LOG_ACTION_LABELS,
  LOG_LEVEL_LABELS,
  LOG_REFERENCE_TYPE_LABELS,
  LOG_TARGET_TYPE_LABELS,
  LOG_TYPE_LABELS,
} from "../../constants/log";
import "./css/AdminLogPage.css";
import axiosInstance from "../../api/axiosInstance";

export default function AdminLogDetailPage() {
  const { logId } = useParams();
  const navigate = useNavigate();

  const [selectedLog, setSelectedLog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 💡 단일 로그 조회 (전체 목록에서 해당 ID 검색)
  useEffect(() => {
    const fetchLogDetail = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get("/api/admin/logs");
        const logs = response.data?.data ?? [];
        const foundLog = logs.find(
          (log) => Number(log.id ?? log.logId) === Number(logId),
        );
        setSelectedLog(foundLog ?? null);
      } catch (error) {
        console.error("로그 상세 조회 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogDetail();
  }, [logId]);

  if (isLoading) {
    return (
      <div className="admin_log_detail_empty">
        <p>로그 상세 정보를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (!selectedLog) {
    return (
      <div className="admin_log_detail_empty">
        <p>로그 정보를 찾을 수 없습니다.</p>
        <button
          type="button"
          className="admin_log_back_button"
          onClick={() => navigate("/log")}
        >
          목록으로
        </button>
      </div>
    );
  }

  return (
    <div className="admin_log_detail_page">
      <section className="admin_page_heading">
        <div>
          <p className="admin_page_eyebrow">LOG DETAIL</p>
          <h2>로그 상세</h2>
          <p>선택한 시스템 로그의 상세 내용을 확인합니다.</p>
        </div>
      </section>

      <article className="admin_log_detail_card">
        <section className="admin_log_detail_section">
          <h3>로그 정보</h3>

          <div className="admin_log_detail_grid">
            <div>
              <span>로그 번호</span>
              <strong>#{selectedLog.id ?? selectedLog.logId}</strong>
            </div>

            <div>
              <span>발생 시간</span>
              <strong>
                {selectedLog.createdAt
                  ? String(selectedLog.createdAt).replace("T", " ")
                  : "-"}
              </strong>
            </div>

            <div>
              <span>로그 유형</span>
              <strong>
                {LOG_TYPE_LABELS[selectedLog.logType] ?? selectedLog.logType}
              </strong>
            </div>

            <div>
              <span>상태</span>
              <strong
                className={`admin_log_level is_${(selectedLog.logLevel ?? "INFO").toLowerCase()}`}
              >
                {LOG_LEVEL_LABELS[selectedLog.logLevel] ?? selectedLog.logLevel}
              </strong>
            </div>

            <div>
              <span>처리 유형</span>
              <strong>
                {LOG_ACTION_LABELS[selectedLog.action] ??
                  selectedLog.action ??
                  "-"}
              </strong>
            </div>
          </div>
        </section>

        <section className="admin_log_detail_section">
          <h3>행위자 정보</h3>

          <div className="admin_log_detail_grid">
            <div>
              <span>행위 주체</span>
              <strong>
                {selectedLog.adminId != null ? (
                  <span className="admin_log_actor is_admin">
                    관리자 #{selectedLog.adminId}
                  </span>
                ) : selectedLog.userId != null ? (
                  <span className="admin_log_actor is_user">
                    사용자 #{selectedLog.userId}
                  </span>
                ) : (
                  <span className="admin_log_actor is_system">시스템 (자동)</span>
                )}
              </strong>
            </div>

            <div>
              <span>접속 IP</span>
              <strong>{selectedLog.ipAddress ?? "-"}</strong>
            </div>

            {selectedLog.adminId != null ? (
              <>
                <div>
                  <span>관리자 ID</span>
                  <strong>#{selectedLog.adminId}</strong>
                </div>

                <div>
                  <span>관리자 계정</span>
                  <strong>{selectedLog.adminLoginId ?? "-"}</strong>
                </div>
              </>
            ) : selectedLog.userId != null ? (
              <>
                <div>
                  <span>사용자 ID</span>
                  <strong>#{selectedLog.userId}</strong>
                </div>

                <div>
                  <span>전화번호</span>
                  <strong>{selectedLog.phoneNumber ?? "-"}</strong>
                </div>
              </>
            ) : null}
          </div>
        </section>

        <section className="admin_log_detail_section">
          <h3>대상 정보</h3>

          <div className="admin_log_detail_grid">
            <div>
              <span>대상 유형</span>
              <strong>
                {selectedLog.targetType
                  ? (LOG_TARGET_TYPE_LABELS[selectedLog.targetType] ??
                    selectedLog.targetType)
                  : "-"}
              </strong>
            </div>

            <div>
              <span>대상 ID</span>
              <strong>
                {selectedLog.targetId ? `#${selectedLog.targetId}` : "-"}
              </strong>
            </div>

            <div>
              <span>연관 데이터</span>
              <strong>
                {selectedLog.referenceType
                  ? (LOG_REFERENCE_TYPE_LABELS[selectedLog.referenceType] ??
                    selectedLog.referenceType)
                  : "-"}
              </strong>
            </div>

            <div>
              <span>연관 ID</span>
              <strong>
                {selectedLog.referenceId ? `#${selectedLog.referenceId}` : "-"}
              </strong>
            </div>
          </div>
        </section>

        <section className="admin_log_detail_section">
          <h3>로그 내용</h3>

          <div className="admin_log_detail_message">
            <span>내용</span>
            <strong>{selectedLog.content}</strong>
          </div>

          <div className="admin_log_detail_message">
            <span>상세 내용</span>
            <p>{selectedLog.detail ?? "-"}</p>
          </div>
        </section>

        <div className="admin_log_detail_actions">
          <button
            type="button"
            className="admin_log_back_button"
            onClick={() => navigate("/log")}
          >
            목록으로
          </button>
        </div>
      </article>
    </div>
  );
}
