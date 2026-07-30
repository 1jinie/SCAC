import { useCallback, useEffect, useMemo, useState } from 'react';
import { paymentApi } from '../../api/paymentApi';
import AdminSummary from '../../components/common/Summary';
import { paymentStore } from '../../store/paymentStore';
import { formatPrice } from '../../utils/formatter';
import AdminPaymentDetail from './components/AdminPaymentDetail';
import AdminPaymentList from './components/AdminPaymentList';
import AdminPaymentSearch from './components/AdminPaymentSearch';
import './css/AdminPaymentPage.css';

const ITEMS_PER_PAGE = 10;

export default function AdminPaymentPage() {
  const payments = paymentStore((state) => state.payments);
  const setPayments = paymentStore((state) => state.setPayments);

  const [selectedPayment, setSelectedPayment] = useState(null);

  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [currentPage, setCurrentPage] = useState(1);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isCanceling, setIsCanceling] = useState(false);

  // 결제 내역 조회
  const fetchPayments = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');

      const data = await paymentApi.getPayments();

      setPayments(data);

      return data;
    } catch (error) {
      console.error('결제 내역 조회 실패:', error.response?.data ?? error);

      setErrorMessage(
        error.response?.data?.message ?? '결제 내역을 불러오지 못했습니다.',
      );

      return null;
    } finally {
      setIsLoading(false);
    }
  }, [setPayments]);

  // 최초 결제 내역 조회
  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  // 검색 + 상태 필터
  const filteredPayments = useMemo(() => {
    const refacKeyword = searchKeyword.trim().replace(/\D/g, '');

    return payments.filter((payment) => {
      const phoneNumber = String(payment.phoneNumber ?? '').replace(/\D/g, '');
      const matchesKeyword =
        searchKeyword === '' ||
        String(phoneNumber).includes(refacKeyword) ||
        String(payment.paymentId).includes(refacKeyword);

      const matchesStatus =
        statusFilter === 'ALL' || payment.status === statusFilter;

      return matchesKeyword && matchesStatus;
    });
  }, [payments, searchKeyword, statusFilter]);

  // 전체 페이지 수
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredPayments.length / ITEMS_PER_PAGE));
  }, [filteredPayments]);

  // 검색 / 필터가 변경되면 첫 페이지로 이동, 선택한 결제내역 초기화
  useEffect(() => {
    setCurrentPage(1);
    setSelectedPayment(null);
  }, [searchKeyword, statusFilter]);

  // 데이터 변경으로 현재 페이지가 사라진 경우 보정
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // 현재 페이지 데이터
  const paginatedPayments = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

    return filteredPayments.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredPayments, currentPage]);

  // 다른 페이지 선택시 선택한 결제내역 초기화
  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedPayment(null);
  };

  // 요약
  const summary = useMemo(() => {
    return payments.reduce(
      (result, payment) => {
        result.total += 1;

        if (payment.status === 'PAID') {
          result.completed += 1;
          result.totalAmount += Number(payment.paymentAmount ?? 0);
        }

        if (payment.status === 'CANCELED') {
          result.canceled += 1;
        }

        return result;
      },
      {
        total: 0,
        completed: 0,
        canceled: 0,
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

  // 결제 선택
  const handlePaymentSelect = (payment) => {
    setSelectedPayment(payment);
  };

  // 결제 취소
  const handleCancelPayment = async (paymentId) => {
    if (isCanceling) return;
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
      setIsCanceling(true);
      await paymentApi.cancelPayment(paymentId, cancelReason.trim());

      const updatedPayments = await fetchPayments();

      if (!updatedPayments) {
        return;
      }

      const updatedPayment = updatedPayments.find(
        (payment) => Number(payment.paymentId) === Number(paymentId),
      );

      setSelectedPayment(updatedPayment ?? null);
    } catch (error) {
      console.error('결제 취소 실패:', error.response?.data?.message ?? error);

      window.alert(
        error.response?.data?.message ?? '결제 취소 처리에 실패했습니다.',
      );
    } finally {
      setIsCanceling(false);
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

      {errorMessage && (
        <p className="admin_payment_error" role="alert">
          {errorMessage}
        </p>
      )}

      <section className="admin_payment_workspace">
        <AdminPaymentList
          payments={paginatedPayments}
          selectedPayment={selectedPayment}
          onPaymentSelect={handlePaymentSelect}
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={handlePageChange}
          isLoading={isLoading}
        />

        <AdminPaymentDetail
          selectedPayment={selectedPayment}
          onCancelPayment={handleCancelPayment}
          isCanceling={isCanceling}
        />
      </section>
    </div>
  );
}
