import React from 'react';
import { useNavigate } from 'react-router-dom';
import dashboardData from '../../data/dashboard_data.json';

export default function AdminMainPage() {
  const { dashboard, logList, device } = dashboardData;
  const navigate = useNavigate();

  const handleMovePage = (path) => {
    navigate(path);
  };

  return (
    <div className="admin_dashboard">
      <section className="admin_page_heading">
        <div>
          <p className="admin_page_eyebrow">Dashboard</p>
          <h2>관리자 대시보드</h2>
          <p>좌석, 예약, 결제 및 키오스크 장치 상태를 확인할 수 있습니다.</p>
        </div>
      </section>

      <section className="admin_summary_grid" aria-label="관리 현황 요약">
        {dashboard.map((summary) => (
          <article key={summary.id} className="admin_summary_card">
            <p className="admin_summary_title">{summary.title}</p>

            <div className="admin_summary_value_wrap">
              <strong className="admin_summary_value">{summary.value}</strong>
              <span className="admin_summary_unit">{summary.unit}</span>
            </div>

            <p className="admin_summary_description">{summary.description}</p>
          </article>
        ))}
      </section>

      <section className="admin_dashboard_grid">
        <article className="admin_panel">
          <div className="admin_panel_header">
            <div>
              <h3>장치 상태</h3>
              <p>키오스크와 연결된 주요 장치를 확인합니다.</p>
            </div>

            <button
              type="button"
              className="admin_text_button"
              onClick={() => handleMovePage('/admin/device')}
            >
              전체 보기
            </button>
          </div>

          <div className="admin_device_list">
            {device.map((device) => (
              <div key={device.id} className="admin_device_item">
                <div className="admin_device_name_wrap">
                  <span
                    className={`admin_status_dot is_${device.status.toLowerCase()}`}
                    aria-hidden="true"
                  />

                  <span className="admin_device_name">{device.name}</span>
                </div>

                <span
                  className={`admin_status_badge is_${device.status.toLowerCase()}`}
                >
                  {device.statusLabel}
                </span>
              </div>
            ))}
          </div>
        </article>

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
              onClick={() => handleMovePage('/admin/reservation')}
            >
              <strong>예약 승인</strong>
              <span>예약 요청 확인</span>
            </button>

            <button
              type="button"
              className="admin_quick_menu"
              onClick={() => handleMovePage('/admin/ticket')}
            >
              <strong>이용권 관리</strong>
              <span>가격 및 판매 여부 설정</span>
            </button>

            <button
              type="button"
              className="admin_quick_menu"
              onClick={() => handleMovePage('/admin/payment')}
            >
              <strong>결제 관리</strong>
              <span>결제 조회 및 취소</span>
            </button>

            <button
              type="button"
              className="admin_quick_menu"
              onClick={() => handleMovePage('/admin/log')}
            >
              <strong>로그 확인</strong>
              <span>오류 및 시스템 기록 조회</span>
            </button>
          </div>
        </article>

        <article className="admin_panel admin_recent_log_panel">
          <div className="admin_panel_header">
            <div>
              <h3>최근 로그</h3>
              <p>최근 발생한 시스템 기록입니다.</p>
            </div>

            <button
              type="button"
              className="admin_text_button"
              onClick={() => handleMovePage('/admin/log')}
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
                {logList.map((log) => (
                  <tr key={log.id}>
                    <td>{log.createdAt}</td>
                    <td>
                      <span className="admin_log_type">{log.type}</span>
                    </td>
                    <td>{log.content}</td>
                    <td>
                      <button
                        type="button"
                        className="admin_table_detail_button"
                        onClick={() => handleMovePage(`/admin/log/${log.id}`)}
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
