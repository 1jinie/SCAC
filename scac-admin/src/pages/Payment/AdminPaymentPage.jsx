import { useEffect, useMemo, useState } from 'react';
import AdminSummary from '../../components/common/Summary';
import payment_dummy from '../../data/payment_dummy.json';
import { paymentStore } from '../../store/paymentStore';
import AdminPaymentDetail from './components/AdminPaymentDetail';
import AdminPaymentList from './components/AdminPaymentList';
import AdminPaymentSearch from './components/AdminPaymentSearch';
import './css/AdminPaymentPage.css';

export default function AdminPaymentPage() {
  const payments = paymentStore((state) => state.payments);
  const setPayments = paymentStore((state) => state.setPayments);
  const selectedPayment = paymentStore((state) => state.selectedPayment);
  const selectPayment = paymentStore((state) => state.selectPayment);
  const updatePaymentStatus = paymentStore(
    (state) => state.updatePaymentStatus,
  );

  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  // const [currentPage, setCurrentPage] = useState(1);

  const summary = useMemo(() => {
    return payments.reduce(
      (result, payment) => {
        result.total += 1;

        if (payment.status === 'COMPLETED') {
          result.completed += 1;
          result.totalAmount += Number(payment.paymentAmount ?? 0);
        }

        if (payment.status === 'CANCELED') {
          result.canceled += 1;
        }

        if (payment.status === 'FAILED') {
          result.failed += 1;
        }

        return result;
      },
      {
        total: 0,
        completed: 0,
        canceled: 0,
        failed: 0,
        totalAmount: 0,
      },
    );
  }, [payments]);

  const summaryItems = useMemo(
    () => [
      {
        key: 'total',
        label: '전체 결제',
        value: summary.total,
        unit: '건',
        description: '전체 결제 내역',
        color: 'blue',
      },
      {
        key: 'completed',
        label: '결제 완료',
        value: summary.completed,
        unit: '건',
        description: '정상 승인된 결제',
        color: 'mint',
      },
      {
        key: 'canceled',
        label: '결제 취소',
        value: summary.canceled,
        unit: '건',
        description: '취소 처리된 결제',
        color: 'orange',
      },
      {
        key: 'sales',
        label: '총 결제 금액',
        value: summary.totalAmount,
        unit: '원',
        description: '완료 결제 기준',
        color: 'dark',
      },
    ],
    [summary],
  );

  useEffect(() => {
    // 추후 API 연결
    // const fetchPayments = async () => {
    //   const response = await paymentApi.getPayments();
    //   setPayments(response.data);
    // };

    setPayments(payment_dummy);
  }, [setPayments]);

  // 검색 + 상태 필터
  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const matchesKeyword =
        searchKeyword === '' ||
        payment.phoneNumber.includes(searchKeyword) ||
        String(payment.paymentId).includes(searchKeyword);

      const matchesStatus =
        statusFilter === 'ALL' || payment.status === statusFilter;

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
      '선택한 결제를 취소 처리하시겠습니까?\n취소 후에는 되돌릴 수 없습니다.',
    );

    if (!confirmed) {
      return;
    }

    // 추후 API 연결
    // await paymentApi.cancelPayment(paymentId);

    updatePaymentStatus(paymentId, 'CANCELED');
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

      <AdminSummary items={summaryItems} />

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
