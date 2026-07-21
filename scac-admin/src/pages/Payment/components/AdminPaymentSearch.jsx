export default function AdminPaymentSearch({
  searchKeyword,
  statusFilter,
  onSearchChange,
  onStatusChange,
}) {
  const handleSearchChange = (event) => {
    onSearchChange(event.target.value);
  };

  const handleStatusChange = (event) => {
    onStatusChange(event.target.value);
  };

  return (
    <section className="admin_panel admin_payment_search">
      <div className="admin_payment_search_input_wrap">
        <label htmlFor="payment_search">결제 내역 검색</label>

        <input
          id="payment_search"
          type="text"
          value={searchKeyword}
          onChange={handleSearchChange}
          placeholder="전화번호 또는 결제번호를 입력해 주세요."
        />
      </div>

      <div className="admin_payment_filter_wrap">
        <label htmlFor="payment_status_filter">결제 상태</label>

        <select
          id="payment_status_filter"
          value={statusFilter}
          onChange={handleStatusChange}
        >
          <option value="ALL">전체</option>
          <option value="COMPLETED">결제 완료</option>
          <option value="CANCELED">결제 취소</option>
          <option value="FAILED">결제 실패</option>
        </select>
      </div>
    </section>
  );
}
