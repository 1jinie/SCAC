import {
  PAYMENT_METHOD_LABELS,
  PAYMENT_PRODUCT_TYPE_LABELS,
  PAYMENT_STATUS_LABELS,
} from '../../../constants/payment';
import { formatfullDateTime } from '../../../utils/date';
import { formatPhoneNumber, formatPrice } from '../../../utils/formatter';
import {
  canCancelPayment,
  getPaymentProductStatusLabel,
  getPaymentCancelUnavailableReason,
} from '../utils/paymentUtils';

export default function AdminPaymentDetail({
  selectedPayment,
  onCancelPayment,
  isCanceling,
}) {
  const statusLabel = getPaymentProductStatusLabel(selectedPayment);
  const canCancel = canCancelPayment(selectedPayment);
  const cancelUnavailableReason =
    getPaymentCancelUnavailableReason(selectedPayment);
  if (!selectedPayment) {
    return (
      <aside className="admin_panel admin_payment_detail is_empty">
        <p>
          결제 내역을 선택하면
          <br />
          상세 정보가 표시됩니다.
        </p>
      </aside>
    );
  }
  console.log(selectedPayment);
  return (
    <aside className="admin_panel admin_payment_detail">
      <div className="admin_panel_header">
        <div>
          <p className="admin_section_eyebrow">PAYMENT INFORMATION</p>

          <h3>결제 상세</h3>
        </div>

        <span
          className={`admin_payment_status status_${selectedPayment.status.toLowerCase() ?? '-'}`}
        >
          {PAYMENT_STATUS_LABELS[selectedPayment.status]}
        </span>
      </div>

      <dl className="admin_payment_info_list">
        <div>
          <dt>결제 번호</dt>
          <dd>{selectedPayment.paymentId}</dd>
        </div>

        <div>
          <dt>사용자</dt>
          <dd>{formatPhoneNumber(selectedPayment.phoneNumber)}</dd>
        </div>

        <div>
          <dt>상품 유형</dt>
          <dd>
            {PAYMENT_PRODUCT_TYPE_LABELS[selectedPayment.ticketType] ??
              selectedPayment.ticketType ??
              '-'}
          </dd>
        </div>

        {selectedPayment.reservationId != null && (
          <div>
            <dt>스터디룸 예약 번호</dt>
            <dd>{selectedPayment.reservationId}</dd>
          </div>
        )}
        <div>
          <dt>결제 상품</dt>
          <dd>{selectedPayment.ticketName}</dd>
        </div>

        <div>
          <dt>결제 금액</dt>
          <dd>{formatPrice(selectedPayment.paymentAmount)}</dd>
        </div>

        <div>
          <dt>결제 수단</dt>
          <dd>
            {PAYMENT_METHOD_LABELS[selectedPayment.paymentMethod] ??
              selectedPayment.paymentMethod ??
              '-'}
          </dd>
        </div>
        <div>
          <dt>결제 상태</dt>
          <dd>{PAYMENT_STATUS_LABELS[selectedPayment.status] ?? '-'}</dd>
        </div>
        <div>
          <dt>상품 이용 상태</dt>
          <dd>{statusLabel}</dd>
        </div>

        <div>
          <dt>결제 일시</dt>
          <dd>{formatfullDateTime(selectedPayment.paidAt)}</dd>
        </div>
        {selectedPayment.status === 'CANCELED' && (
          <>
            <div>
              <dt>취소 일시</dt>
              <dd>{formatfullDateTime(selectedPayment.cancelledAt)}</dd>
            </div>

            <div className="admin_payment_cancel_reason">
              <dt>취소 사유</dt>
              <dd>{selectedPayment.cancelReason ?? '-'}</dd>
            </div>
          </>
        )}
      </dl>

      {selectedPayment.status === 'PAID' && (
        <div className="admin_payment_actions">
          <p className="admin_payment_cancel_notice">
            결제 취소 후에는 되돌릴 수 없습니다. 결제 정보를 확인한 후 처리해
            주세요.
          </p>
          <span
            title={!canCancel ? cancelUnavailableReason : ''}
            className="admin_payment_cancel_button_wrapper"
          >
            <button
              type="button"
              className="admin_payment_cancel_button"
              onClick={() => onCancelPayment(selectedPayment.paymentId)}
              disabled={!canCancel || isCanceling}
            >
              {isCanceling ? '취소 처리 중...' : '결제 취소'}
            </button>
          </span>
        </div>
      )}

      {selectedPayment.status === 'CANCELED' && (
        <p className="admin_payment_result_message">취소 처리된 결제입니다.</p>
      )}

      {selectedPayment.status === 'FAILED' && (
        <p className="admin_payment_result_message is_error">
          결제에 실패한 내역입니다.
        </p>
      )}
    </aside>
  );
}
