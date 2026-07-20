import { useEffect, useMemo, useState } from "react";
import AdminPaymentSummary from "./components/AdminPaymentSummary";
import AdminPaymentSearch from "./components/AdminPaymentSearch";
import AdminPaymentList from "./components/AdminPaymentList";
import AdminPaymentDetail from "./components/AdminPaymentDetail";
import payment_dummy from "../../data/payment_dummy.json";
import { paymentStore } from "../../store/paymentStore";
import "./css/AdminPaymentPage.css";

export default function AdminPaymentPage() {
  const payments = paymentStore((state) => state.payments);
  const setPayments = paymentStore((state) => state.setPayments);
  const selectedPayment = paymentStore((state) => state.selectedPayment);
  const selectPayment = paymentStore((state) => state.selectPayment);
  const updatePaymentStatus = paymentStore(
    (state) => state.updatePaymentStatus,
  );

  const [searchKeyword, setSearchKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // 추후 API 연결
    // const fetchPayments = async () => {
    //   const response = await paymentApi.getPayments();
    //   setPayments(response.data);
    // };

    setPayments(payment_dummy);
  }, [setPayments]);

  // 상단 요약
  const summary = useMemo(() => {
    return {
      total: payments.length,

      completed: payments.filter((payment) => payment.status === "COMPLETED")
        .length,

      canceled: payments.filter((payment) => payment.status === "CANCELED")
        .length,

      failed: payments.filter((payment) => payment.status === "FAILED").length,
    };
  }, [payments]);

  // 검색 + 상태 필터
  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const matchesKeyword =
        searchKeyword === "" ||
        payment.phoneNumber.includes(searchKeyword) ||
        String(payment.paymentId).includes(searchKeyword);

      const matchesStatus =
        statusFilter === "ALL" || payment.status === statusFilter;

      return matchesKeyword && matchesStatus;
    });
  }, [payments, searchKeyword, statusFilter]);

  // 결제 선택
  const handlePaymentSelect = (payment) => {
    selectPayment(payment);
  };

  // 결제 취소
  const handleCancelPayment = (paymentId) => {
    const confirmed = window.confirm(
      "선택한 결제를 취소 처리하시겠습니까?\n취소 후에는 되돌릴 수 없습니다.",
    );

    if (!confirmed) {
      return;
    }

    // 추후 API 연결
    // await paymentApi.cancelPayment(paymentId);

    updatePaymentStatus(paymentId, "CANCELED");
  };

  return (
    <div className="admin_payment_page">
      <div className="admin_page_heading">
        <div>
          <p className="admin_page_eyebrow">PAYMENT MANAGEMENT</p>

          <h2>결제 내역 관리</h2>

          <p>결제 내역을 조회하고 필요한 경우 결제 취소를 처리합니다.</p>
        </div>
      </div>

      <AdminPaymentSummary summary={summary} />

      <AdminPaymentSearch
        searchKeyword={searchKeyword}
        statusFilter={statusFilter}
        onSearchChange={setSearchKeyword}
        onStatusChange={setStatusFilter}
      />

      <section className="admin_payment_workspace">
        <AdminPaymentList
          payments={filteredPayments}
          selectedPayment={selectedPayment}
          onPaymentSelect={handlePaymentSelect}
        />

        <AdminPaymentDetail
          selectedPayment={selectedPayment}
          onCancelPayment={handleCancelPayment}
        />
      </section>
    </div>
  );
}
