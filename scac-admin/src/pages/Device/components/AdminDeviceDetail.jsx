import { DEVICE_STATUS_LABELS } from '../../../constants/device';

export default function AdminDeviceDetail({ onStatusChange, selectedDevice }) {
  return (
    <aside className="admin_panel admin_device_detail">
      {!selectedDevice ? (
        <div className="admin_device_detail_empty">
          확인할 장치를 선택해 주세요.
        </div>
      ) : (
        <>
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
              <dt>장치 종류</dt>
              <dd>{selectedDevice.deviceType}</dd>
            </div>

            <div>
              <dt>현재 상태</dt>
              <dd>{DEVICE_STATUS_LABELS[selectedDevice.status]}</dd>
            </div>

            <div>
              <dt>마지막 확인</dt>
              <dd>{selectedDevice.lastCheckedAt}</dd>
            </div>

            <div>
              <dt>상태 메시지</dt>
              <dd>{selectedDevice.message}</dd>
            </div>
          </dl>

          {selectedDevice.status !== 'NORMAL' && (
            <button
              type="button"
              className="admin_device_normal_button"
              onClick={() => onStatusChange('NORMAL')}
            >
              정상 처리
            </button>
          )}
        </>
      )}
    </aside>
  );
}
