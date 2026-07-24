import { useEffect, useMemo, useState } from 'react';
import { paymentApi } from '../../api/paymentApi';
import AdminSummary from '../../components/common/Summary';
import { paymentStore } from '../../store/paymentStore';
import AdminPaymentDetail from './components/AdminPaymentDetail';
import AdminPaymentList from './components/AdminPaymentList';
import AdminPaymentSearch from './components/AdminPaymentSearch';
import './css/AdminPaymentPage.css';
import { formatPrice } from '../../utils/formatter';

export default function AdminPaymentPage() {
  const payments = paymentStore((state) => state.payments);
  const setPayments = paymentStore((state) => state.setPayments);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const [totalPages, setTotalPages] = useState(
    Math.ceil(payments.length / ITEMS_PER_PAGE),
  );
  // const totalPages = Math.ceil(payments.length / ITEMS_PER_PAGE);

  // 검색 + 상태 필터
  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const matchesKeyword =
        searchKeyword === '' ||
        String(payment.phoneNumber ?? payment.userId ?? '').includes(
          searchKeyword,
        ) ||
        String(payment.paymentId).includes(searchKeyword);

      const matchesStatus =
        statusFilter === 'ALL' || payment.status === statusFilter;

      return matchesKeyword && matchesStatus;
    });
  }, [payments, searchKeyword, statusFilter]);

  const summary = useMemo(() => {
    return payments.reduce(
      (result, payment) => {
        result.total += 1;

        if (payment.status === 'PAID') {
          result.completed += 1;
          result.totalAmount += Number(payment.amount ?? 0);
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
        value: formatPrice(summary.totalAmount),
        unit: '원',
        description: '완료 결제 기준',
        color: 'dark',
      },
    ],
    [summary],
  );

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const payments = await paymentApi.getPayments();
        setPayments(payments);
      } catch (error) {
        console.error('결제 내역 조회 실패:', error.response?.data ?? error);
        setPayments([]);
      }
    };

    fetchPayments();
  }, [setPayments]);

  const paginatedPayments = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    setTotalPages(Math.ceil(filteredPayments.length / ITEMS_PER_PAGE));

    return filteredPayments.slice(startIndex, endIndex);
  }, [filteredPayments, currentPage]);

  // 결제 선택
  const handlePaymentSelect = (payment) => {
    setSelectedPayment(payment);
  };

  // 결제 취소
  const handleCancelPayment = async (paymentId) => {
    const confirmed = window.confirm(
      '선택한 결제를 취소 처리하시겠습니까?\n취소 후에는 되돌릴 수 없습니다.',
    );

    if (!confirmed) {
      return;
    }

    const cancelReason = window.prompt('결제 취소 사유를 입력해 주세요.');

    if (!cancelReason?.trim()) {
      return;
    }

    try {
      await paymentApi.cancelPayment(paymentId, cancelReason.trim());
      const updatedPayments = await paymentApi.getPayments();
      setPayments(updatedPayments);
      const updatedPayment = updatedPayments.find(
        (payment) => Number(payment.paymentId) === Number(paymentId),
      );
      setSelectedPayment(updatedPayment);
    } catch (error) {
      console.error('결제 취소 실패:', error.response?.data ?? error);
      window.alert(
        error.response?.data?.message ?? '결제 취소 처리에 실패했습니다.',
      );
    }
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
          payments={paginatedPayments}
          selectedPayment={selectedPayment}
          onPaymentSelect={handlePaymentSelect}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
        />

        <AdminPaymentDetail
          selectedPayment={selectedPayment}
          onCancelPayment={handleCancelPayment}
        />
      </section>
    </div>
  );
}
