import React from 'react';
import { useNavigate } from 'react-router-dom';

const DASHBOARD_SUMMARY = [
  {
    id: 'total-seat',
    title: '전체 좌석',
    value: 32,
    unit: '석',
    description: '스터디룸 포함',
  },
  {
    id: 'using-seat',
    title: '사용 중 좌석',
    value: 18,
    unit: '석',
    description: '현재 이용 중',
  },
  {
    id: 'pending-reservation',
    title: '예약 승인 대기',
    value: 4,
    unit: '건',
    description: '승인 확인 필요',
  },
  {
    id: 'device-error',
    title: '장치 이상',
    value: 1,
    unit: '건',
    description: '장치 상태 확인 필요',
  },
];

const DEVICE_LIST = [
  {
    id: 1,
    name: '카드 리더기',
    status: 'NORMAL',
    statusLabel: '정상',
  },
  {
    id: 2,
    name: '영수증 프린터',
    status: 'NORMAL',
    statusLabel: '정상',
  },
  {
    id: 3,
    name: '출입문 장치',
    status: 'WARNING',
    statusLabel: '확인 필요',
  },
  {
    id: 4,
    name: '네트워크',
    status: 'NORMAL',
    statusLabel: '정상',
  },
];

const RECENT_LOG_LIST = [
  {
    id: 1,
    createdAt: '2026.07.15 14:30',
    type: 'DEVICE',
    content: '출입문 장치 연결 상태가 불안정합니다.',
  },
  {
    id: 2,
    createdAt: '2026.07.15 14:12',
    type: 'PAYMENT',
    content: '결제 취소 요청이 등록되었습니다.',
  },
  {
    id: 3,
    createdAt: '2026.07.15 13:45',
    type: 'RESERVATION',
    content: '스터디룸 예약 승인 요청이 등록되었습니다.',
  },
];

export default function AdminMainPage() {
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
        {DASHBOARD_SUMMARY.map((summary) => (
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
            {DEVICE_LIST.map((device) => (
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
                {RECENT_LOG_LIST.map((log) => (
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
