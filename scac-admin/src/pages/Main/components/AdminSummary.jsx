import React from "react";

export default function AdminSummary({ dashboard }) {
  return (
    <section className="admin_summary_grid" aria-label="관리 현황 요약">
      {dashboard.map((summary) => {
        const isAlert =
          (summary.id === "pending-reservation" ||
            summary.id === "device-error") &&
          summary.value > 0;
        const categoryClass =
          summary.id === "pending-reservation"
            ? "reservation"
            : summary.id === "device-error"
              ? "device"
              : "";

        return (
          <article
            key={summary.id}
            className={`admin_summary_card ${isAlert ? "is_alert" : ""} ${categoryClass}`}
          >
            <div className="admin_summary_title_wrap">
              <p className="admin_summary_title">{summary.title}</p>

              {isAlert && (
                <span className={`admin_summary_alert ${categoryClass}`}>
                  확인 필요
                </span>
              )}
            </div>

            <div className="admin_summary_value_wrap">
              <strong className="admin_summary_value">{summary.value}</strong>
              <span className="admin_summary_unit">{summary.unit}</span>
            </div>

            <p className="admin_summary_description">{summary.description}</p>
          </article>
        );
      })}
    </section>
  );
}
