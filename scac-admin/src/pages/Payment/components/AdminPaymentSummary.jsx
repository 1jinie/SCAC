import React from "react";

export default function AdminPaymentSummary({ summary }) {
  const summaryData = [
    {
      id: "total",
      title: "전체 결제",
      value: summary.total,
    },
    {
      id: "completed",
      title: "결제 완료",
      value: summary.completed,
    },
    {
      id: "canceled",
      title: "결제 취소",
      value: summary.canceled,
    },
    {
      id: "failed",
      title: "결제 실패",
      value: summary.failed,
    },
  ];

  return (
    <section className="admin_payment_summary" aria-label="결제 현황 요약">
      {summaryData.map((item) => (
        <article
          key={item.id}
          className={`admin_summary_card payment_${item.id}`}
        >
          <p className="admin_summary_title">{item.title}</p>

          <div className="admin_summary_value_wrap">
            <strong className="admin_summary_value">{item.value}</strong>

            <span className="admin_summary_unit">건</span>
          </div>
        </article>
      ))}
    </section>
  );
}
