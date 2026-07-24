import Pagination from '../../../components/common/Pagination';
import {
  PAYMENT_METHOD_LABELS,
  PAYMENT_STATUS_LABELS,
} from '../../../constants/payment';
import { formatPrice } from '../../../utils/formatter';

export default function AdminPaymentList({
  payments,
  selectedPayment,
  onPaymentSelect,
  totalPages,
  setCurrentPage,
  currentPage,
}) {
  return (
    <section className="admin_panel admin_payment_list_panel">
      <div className="admin_panel_header">
        <div>
          <h3>결제 내역</h3>
          <p>결제 내역을 선택하면 상세 정보를 확인할 수 있습니다.</p>
        </div>
      </div>

      <div className="admin_payment_table_wrap">
        <table className="admin_payment_table">
          <thead>
            <tr>
              <th>결제 번호</th>
              <th>사용자</th>
              <th>결제 상품</th>
              <th>결제 금액</th>
              <th>결제 수단</th>
              <th>상태</th>
            </tr>
          </thead>

          <tbody>
            {payments.length === 0 ? (
              <tr>
                <td colSpan="6" className="admin_payment_empty">
                  조회된 결제 내역이 없습니다.
                </td>
              </tr>
            ) : (
              payments.map((payment) => {
                const isSelected =
                  selectedPayment?.paymentId === payment.paymentId;

                return (
                  <tr
                    key={payment.paymentId}
                    className={isSelected ? 'is_selected' : ''}
                    onClick={() => onPaymentSelect(payment)}
                  >
                    <td>{payment.paymentId}</td>

                    <td>{payment.phoneNumber}</td>

                    <td>{payment.productName}</td>

                    <td>{formatPrice(payment.amount)}</td>

                    <td>
                      {PAYMENT_METHOD_LABELS[payment.paymentMethod] ??
                        payment.paymentMethod}
                    </td>

                    <td>
                      <span
                        className={`admin_payment_status status_${payment.status.toLowerCase()}`}
                      >
                        {PAYMENT_STATUS_LABELS[payment.status] ??
                          payment.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </section>
  );
}
