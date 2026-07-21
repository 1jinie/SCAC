import React from 'react';
import './css/AdminSummary.css';

export default function AdminSummary({ items }) {
  return (
    <section className="admin_summary" aria-label="관리 현황 요약">
      {items.map((item) => (
        <article
          key={item.key}
          className={`admin_summary_card is_${item.color}`}
        >
          <div className="admin_summary_header">
            <span className="admin_summary_indicator" aria-hidden="true" />

            <p className="admin_summary_label">{item.label}</p>
          </div>

          <strong className="admin_summary_value">
            {item.value.toLocaleString()}
            {item.unit && <span>{item.unit}</span>}
          </strong>

          {item.description && (
            <p className="admin_summary_description">{item.description}</p>
          )}
        </article>
      ))}
    </section>
  );
}
