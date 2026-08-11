import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../../api/adminApi';
import { deviceApi } from '../../api/deviceApi';
import axiosInstance from '../../api/axiosInstance';
import AdminSummary from '../../components/common/Summary';

export default function AdminMainPage() {
  const navigate = useNavigate();

  // 1. 백엔드에서 불러올 상태 값들
  const [dashboard, setDashboard] = useState(null);
  const [devices, setDevices] = useState([]);
  const [recentLogs, setRecentLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 2. 통합 데이터 조회 Effect
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);

        // ① 대시보드 요약 통계 조회
        const dashboardData = await adminApi.getDashboardSummary();
        setDashboard(dashboardData);

        // ② 장치 상태 목록 조회
        const deviceList = await deviceApi.getDevices();
        setDevices(deviceList ?? []);

        // ③ 최근 시스템 로그 조회 (최신 5건만 표출)
        const logResponse = await axiosInstance.get('/api/admin/logs');
        const logs = logResponse.data?.data ?? [];
        setRecentLogs(logs.slice(0, 5));
      } catch (error) {
        console.error('대시보드 데이터 조회 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // 3. 백엔드 DashboardRes 객체를 AdminSummary 카드 규격으로 매핑
  const summaryItems = useMemo(() => {
    if (!dashboard) return [];

    return [
      {
        key: 'occupiedSeats',
        label: '이용 중 좌석',
        value: dashboard.occupiedSeats,
        unit: '석',
        description: `전체 ${dashboard.totalSeats}석 중 이용 중`,
        color: 'blue',
      },
      {
        key: 'todayRevenue',
        label: '당일 매출액',
        value: (dashboard.todayRevenue ?? 0).toLocaleString(),
        unit: '원',
        description: '오늘 누적 결제금액',
        color: 'mint',
      },
      {
        key: 'errorDevices',
        label: '장비 장애',
        value: dashboard.errorDevices,
        unit: '대',
        description: `전체 ${dashboard.totalDevices}대 중 이상 발생`,
        color: 'orange',
        alert: true,
      },
      {
        key: 'todayErrorLogs',
        label: '오늘의 에러 로그',
        value: dashboard.todayErrorLogs,
        unit: '건',
        description: '시스템 오류 발생 건수',
        color: 'red',
        alert: true,
      },
    ];
  }, [dashboard]);

  const handleMovePage = (path) => {
    navigate(path);
  };

  if (isLoading) {
    return (
      <div className="admin_dashboard">
        <p className="admin_loading_message">
          대시보드 데이터를 불러오는 중입니다...
        </p>
      </div>
    );
  }

  return (
    <div className="admin_dashboard">
      <section className="admin_page_heading">
        <div>
          <p className="admin_page_eyebrow">DASHBOARD</p>
          <h2>관리자 대시보드</h2>
          <p>좌석, 예약, 결제 및 키오스크 장치 상태를 확인할 수 있습니다.</p>
        </div>
      </section>

      {/* 실시간 요약 통계 카드 */}
      <AdminSummary items={summaryItems} />

      <section className="admin_dashboard_grid">
        {/* ① 실시간 장치 상태 패널 */}
        <article className="admin_panel">
          <div className="admin_panel_header">
            <div>
              <h3>장치 상태</h3>
              <p>키오스크와 연결된 주요 장치를 확인합니다.</p>
            </div>

            <button
              type="button"
              className="admin_text_button"
              onClick={() => handleMovePage('/device')}
            >
              전체 보기
            </button>
          </div>

          <div className="admin_device_list">
            {devices.map((item) => (
              <div key={item.deviceId} className="admin_device_item">
                <div className="admin_device_name_wrap">
                  <span
                    className={`admin_status_dot is_${(item.status ?? 'NORMAL').toLowerCase()}`}
                    aria-hidden="true"
                  />
                  <span className="admin_device_name">{item.deviceName}</span>
                </div>

                <span
                  className={`admin_status_badge is_${(item.status ?? 'NORMAL').toLowerCase()}`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </article>

        {/* ② 빠른 관리 패널 */}
        <article className="admin_panel">
          <div className="admin_panel_header">
            <div>
              <h3>빠른 관리</h3>
              <p>자주 사용하는 관리자 기능입니다.</p>
            </div>
          </div>

          <div className="admin_quick_menu_grid">
            <button
              type="button"
              className="admin_quick_menu"
              onClick={() => handleMovePage('/reservation')}
            >
              <strong>스터디룸 현황</strong>
              <span>스터디룸의 현재 상태 및 예약 일정 관리</span>
            </button>

            <button
              type="button"
              className="admin_quick_menu"
              onClick={() => handleMovePage('/ticket')}
            >
              <strong>이용권 관리</strong>
              <span>가격 및 판매 여부 설정</span>
            </button>

            <button
              type="button"
              className="admin_quick_menu"
              onClick={() => handleMovePage('/payment')}
            >
              <strong>결제 관리</strong>
              <span>결제 조회 및 취소</span>
            </button>

            <button
              type="button"
              className="admin_quick_menu"
              onClick={() => handleMovePage('/log')}
            >
              <strong>로그 확인</strong>
              <span>오류 및 시스템 기록 조회</span>
            </button>
          </div>
        </article>

        {/* ③ 최근 시스템 로그 패널 */}
        <article className="admin_panel admin_recent_log_panel">
          <div className="admin_panel_header">
            <div>
              <h3>최근 로그</h3>
              <p>최근 발생한 시스템 기록입니다.</p>
            </div>

            <button
              type="button"
              className="admin_text_button"
              onClick={() => handleMovePage('/log')}
            >
              전체 보기
            </button>
          </div>

          <div className="admin_log_table_wrap">
            <table className="admin_log_table">
              <thead>
                <tr>
                  <th>발생 시간</th>
                  <th>구분</th>
                  <th>내용</th>
                  <th aria-label="상세 보기" />
                </tr>
              </thead>

              <tbody>
                {recentLogs.map((log) => (
                  <tr key={log.logId}>
                    <td>
                      {log.createdAt
                        ? String(log.createdAt).replace('T', ' ')
                        : '-'}
                    </td>
                    <td>
                      <span className="admin_log_type">{log.logType}</span>
                    </td>
                    <td>{log.content}</td>
                    <td>
                      <button
                        type="button"
                        className="admin_table_detail_button"
                        onClick={() => handleMovePage(`/log/${log.logId}`)}
                      >
                        상세
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </div>
  );
}
