import React from "react";

export default function AdminDeviceSummary({ summary }) {
  return (
    <section className="admin_device_summary">
      <article className="admin_summary_card">
        <p className="admin_summary_title">전체 장치</p>
        <strong className="admin_summary_value">{summary.total}</strong>
      </article>

      <article className="admin_summary_card">
        <p className="admin_summary_title">정상</p>
        <strong className="admin_summary_value">{summary.normal}</strong>
      </article>

      <article className="admin_summary_card">
        <p className="admin_summary_title">점검 필요</p>
        <strong className="admin_summary_value">{summary.warning}</strong>
      </article>

      <article className="admin_summary_card">
        <p className="admin_summary_title">오류</p>
        <strong className="admin_summary_value">{summary.error}</strong>
      </article>
    </section>
  );
}
