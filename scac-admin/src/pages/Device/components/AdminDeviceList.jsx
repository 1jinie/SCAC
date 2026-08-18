import LoadingOverlay from '../../../components/common/LoadingOverlay';
import AdminDevice from './AdminDevice';

export default function AdminDeviceList({
  devices,
  selectedDevice,
  onDeviceSelect,
  isDeviceLoading,
  errorMessage,
  includeInactive,
  onIncludeInactiveChange,
  onCreateDevice,
  isCreateMode,
}) {
  return (
    <div className="admin_panel">
      <div className="admin_panel_header">
        <div>
          <h3>장치 목록</h3>
          <p>장치를 선택하면 상세 정보를 확인할 수 있습니다.</p>
        </div>
        <div className="admin_device_list_actions">
          <label className="admin_device_inactive_filter">
            <input
              type="checkbox"
              checked={includeInactive}
              onChange={(e) => onIncludeInactiveChange(e.target.checked)}
            />
            <span>비활성 장치 포함</span>
          </label>
          <button
            type="button"
            className={`admin_device_create_button ${
              isCreateMode ? 'is_active' : ''
            }`}
            onClick={onCreateDevice}
          >
            장치 추가
          </button>
        </div>
      </div>

      <div className="admin_device_manage_list">
        <LoadingOverlay
          isLoading={isDeviceLoading}
          message="장치를 불러오는 중입니다."
        />

        {errorMessage && !isDeviceLoading && (
          <div className="admin_device_error">{errorMessage}</div>
        )}

        {!errorMessage && devices.length === 0 && !isDeviceLoading && (
          <div className="admin_device_empty">등록된 장치가 없습니다.</div>
        )}

        {devices.map((device) => (
          <AdminDevice
            key={device.deviceId}
            device={device}
            isSelected={selectedDevice?.deviceId === device.deviceId}
            onClick={() => onDeviceSelect(device)}
          />
        ))}
      </div>
    </div>
  );
}
