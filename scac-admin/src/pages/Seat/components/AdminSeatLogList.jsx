import { useEffect, useState } from 'react';
import userSeatLog from '../../../data/admin_log.json';

export default function AdminSeatLogList({ logs, selectedSeat }) {
  const ACTION_LABEL = {
    CHECK_IN: '입실',
    CHECK_OUT: '퇴실',
    AUTO_CHECKOUT: '자동퇴실',
    FORCE_CHECKOUT: '강제퇴실',
    STATUS_CHANGE: '상태변경',
  };

  return (
    <section className="admin_panel admin_recent_log_panel">
      <div className="admin_panel_header">
        <div>
          <h3>좌석 이용 로그</h3>

          <p>
            {selectedSeat
              ? `${selectedSeat.seatNumber}번 좌석 이용 내역`
              : '전체 좌석 이용 내역'}
          </p>
        </div>
      </div>

      {logs ? (
        <div className="admin_log_table_wrap">
          <table className="admin_log_table">
            <thead>
              <tr>
                <th>시간</th>
                <th>상태</th>
                <th>설명</th>
                <th>전화번호</th>
              </tr>
            </thead>

            <tbody>
              {logs.map((log) => (
                <tr key={log.log_id}>
                  <td>{log.created_at}</td>

                  <td>
                    <span className={`admin_log_type ${log.action}`}>
                      {ACTION_LABEL[log.action]}
                    </span>
                  </td>

                  <td>{log.description}</td>

                  <td>{log.phone_number || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="admin_seat_log_empty">해당 좌석의 로그가 없습니다.</div>
      )}
    </section>
  );
}
