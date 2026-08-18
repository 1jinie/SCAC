import {
  DEVICE_STATUS_LABELS,
  DEVICE_TYPE_LABELS,
} from '../../../constants/device';
import { formatfullDateTime } from '../../../utils/date';

export default function AdminDeviceDetail({
  selectedDevice,
  deviceLogs,
  onStatusChange,
  isUpdatingStatus,
  onActiveChange,
  isUpdatingActive,
}) {
  if (!selectedDevice) {
    return (
      <aside className="admin_panel admin_device_detail">
        <div className="admin_device_detail_empty">
          확인할 장치를 선택해 주세요.
        </div>
      </aside>
    );
  }

  const latestLog = deviceLogs[0];

  return (
    <aside className="admin_panel admin_device_detail">
      <div className="admin_panel_header">
        <div>
          <p className="admin_section_eyebrow">DEVICE INFORMATION</p>

          <h3>{selectedDevice.deviceName}</h3>
        </div>

        <span
          className={`admin_status_badge is_${selectedDevice.status.toLowerCase()}`}
        >
          {DEVICE_STATUS_LABELS[selectedDevice.status]}
        </span>
      </div>

      <dl className="admin_device_info_list">
        <div>
          <dt>장치 ID</dt>
          <dd>{selectedDevice.deviceId}</dd>
        </div>

        <div>
          <dt>운영 여부</dt>

          <dd>{selectedDevice.isActive ? '사용 중' : '비활성'}</dd>
        </div>

        <div>
          <dt>장치 종류</dt>
          <dd>
            {DEVICE_TYPE_LABELS[selectedDevice.deviceType] ??
              selectedDevice.deviceType}
          </dd>
        </div>

        <div>
          <dt>현재 상태</dt>
          <dd>{DEVICE_STATUS_LABELS[selectedDevice.status]}</dd>
        </div>

        <div>
          <dt>설치 위치</dt>
          <dd>{selectedDevice.location ?? '-'}</dd>
        </div>

        <div>
          <dt>IP 주소</dt>
          <dd>{selectedDevice.ipAddress ?? '-'}</dd>
        </div>

        <div>
          <dt>시리얼 번호</dt>
          <dd>{selectedDevice.serialNumber ?? '-'}</dd>
        </div>

        <div>
          <dt>마지막 연결</dt>
          <dd>{formatfullDateTime(selectedDevice.lastConnectedAt)}</dd>
        </div>

        <div>
          <dt>최근 이벤트</dt>
          <dd>{latestLog?.eventType ?? '-'}</dd>
        </div>

        <div>
          <dt>최근 메시지</dt>
          <dd>{latestLog?.message ?? '-'}</dd>
        </div>
      </dl>

      {selectedDevice.status !== 'NORMAL' && (
        <button
          type="button"
          className="admin_device_normal_button"
          onClick={() => onStatusChange('NORMAL')}
          disabled={isUpdatingStatus}
        >
          {isUpdatingStatus ? '처리 중...' : '정상 처리'}
        </button>
      )}
      <button
        type="button"
        className={
          selectedDevice.isActive
            ? 'admin_device_inactive_button'
            : 'admin_device_active_button'
        }
        onClick={onActiveChange}
        disabled={isUpdatingActive}
      >
        {isUpdatingActive
          ? '처리 중...'
          : selectedDevice.isActive
            ? '장치 비활성화'
            : '장치 다시 활성화'}
      </button>
    </aside>
  );
}
