export default function AdminPaymentSearch({
  searchKeyword,
  statusFilter,
  paymentMethodFilter,
  startDate,
  endDate,
  onSearchChange,
  onStatusChange,
  onPaymentMethodChange,
  onStartDateChange,
  onEndDateChange,
  onReset,
}) {
  const handleQuickDate = (type) => {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const toDateString = (d) =>
      `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

    const todayStr = toDateString(now);

    if (type === "today") {
      onStartDateChange(todayStr);
      onEndDateChange(todayStr);
    } else if (type === "7days") {
      const past = new Date();
      past.setDate(past.getDate() - 7);
      onStartDateChange(toDateString(past));
      onEndDateChange(todayStr);
    } else if (type === "month") {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      onStartDateChange(toDateString(firstDay));
      onEndDateChange(todayStr);
    }
  };

  return (
    <section className="admin_panel admin_payment_search">
      <div className="admin_payment_search_input_wrap">
        <label htmlFor="payment_search">결제 내역 검색</label>

        <input
          id="payment_search"
          type="text"
          value={searchKeyword}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="전화번호 또는 결제번호를 입력해 주세요."
        />
      </div>

      <div className="admin_payment_filter_wrap">
        <label htmlFor="payment_status_filter">결제 상태</label>

        <select
          id="payment_status_filter"
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option value="ALL">전체</option>
          <option value="PAID">결제 완료</option>
          <option value="PENDING">결제 진행 중</option>
          <option value="CANCELED">결제 취소</option>
          <option value="FAILED">결제 실패</option>
        </select>
      </div>

      <div className="admin_payment_filter_wrap">
        <label htmlFor="payment_method_filter">결제 수단</label>

        <select
          id="payment_method_filter"
          value={paymentMethodFilter}
          onChange={(e) => onPaymentMethodChange(e.target.value)}
        >
          <option value="ALL">전체</option>
          <option value="CARD">카드</option>
          <option value="TOSSPAY">토스페이</option>
        </select>
      </div>

      <div className="admin_payment_date_filter_wrap">
        <div className="admin_payment_date_header">
          <label>결제 기간</label>
          <div className="admin_quick_date_buttons">
            <button
              type="button"
              className="admin_quick_date_btn"
              onClick={() => handleQuickDate("today")}
            >
              오늘
            </button>
            <button
              type="button"
              className="admin_quick_date_btn"
              onClick={() => handleQuickDate("7days")}
            >
              7일
            </button>
            <button
              type="button"
              className="admin_quick_date_btn"
              onClick={() => handleQuickDate("month")}
            >
              이번달
            </button>
          </div>
        </div>

        <div className="admin_payment_date_inputs">
          <input
            type="date"
            value={startDate}
            max={endDate || undefined}
            onChange={(e) => onStartDateChange(e.target.value)}
          />

          <span>~</span>

          <input
            type="date"
            value={endDate}
            min={startDate || undefined}
            onChange={(e) => onEndDateChange(e.target.value)}
          />
        </div>
      </div>

      <button
        type="button"
        className="admin_payment_reset_button"
        onClick={onReset}
      >
        초기화
      </button>
    </section>
  );
}
