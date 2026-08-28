import {
  DEVICE_STATUS_LABELS,
  DEVICE_TYPE_LABELS,
} from '../../../constants/device';

export default function AdminDevice({ device, isSelected, onClick }) {
  const formatDateTime = (dateTime) => {
    if (!dateTime) {
      return '연결 기록 없음';
    }

    return new Date(dateTime).toLocaleString('ko-KR');
  };

  const statusKey = (device.status ?? 'NORMAL').toUpperCase();
  const statusClass = statusKey.toLowerCase();
  const isAbnormal = statusKey === 'ERROR' || statusKey === 'OFFLINE' || statusKey === 'WARNING';

  return (
    <button
      type="button"
      className={`admin_device_manage_item is_${statusClass} ${isAbnormal ? 'is_abnormal' : ''} ${isSelected ? 'is_selected' : ''} ${!device.isActive ? 'is_inactive' : ''}`}
      onClick={() => onClick(device)}
    >
      <div>
        <strong>{device.deviceName}</strong>
        <span>
          {DEVICE_TYPE_LABELS[device.deviceType] ?? device.deviceType}
        </span>
        {!device.isActive && (
          <span className="admin_device_inactive_text">비활성 장치</span>
        )}
      </div>

      <div>
        <span
          className={`admin_status_badge is_${device.status.toLowerCase()}`}
        >
          {DEVICE_STATUS_LABELS[device.status]}
        </span>

        <small>{formatDateTime(device.lastConnectedAt)}</small>
      </div>
    </button>
  );
}
