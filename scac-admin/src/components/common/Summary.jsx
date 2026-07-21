import React from 'react';
import './css/AdminSummary.css';

export default function AdminSummary({ items }) {
  return (
    <section className="admin_summary" aria-label="관리 현황 요약">
      {items.map((summary) => {
        const isAlert = summary.alert && summary.value > 0;

        return (
          <article
            key={summary.key}
            className={`admin_summary_card is_${summary.color} ${isAlert ? 'is_alert' : ''}`}
          >
            <div className="admin_summary_header">
              <p className="admin_summary_label">{summary.label}</p>
            </div>

            <div className="admin_summary_value_wrap">
              <strong className="admin_summary_value">{summary.value}</strong>

              {summary.unit && (
                <span className="admin_summary_unit">{summary.unit}</span>
              )}
            </div>

            {summary.description && (
              <p className="admin_summary_description">{summary.description}</p>
            )}
          </article>
        );
      })}
    </section>
  );
}
