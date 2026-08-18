import AdminDevice from './AdminDevice';

export default function AdminDeviceList({
  devices,
  selectedDevice,
  onDeviceSelect,
  isDeviceLoading,
  errorMessage,
  includeInactive,
  onIncludeInactiveChange,
}) {
  return (
    <div className="admin_panel">
      <div className="admin_panel_header">
        <div>
          <h3>장치 목록</h3>
          <p>장치를 선택하면 상세 정보를 확인할 수 있습니다.</p>
        </div>

        <label className="admin_device_inactive_filter">
          <input
            type="checkbox"
            checked={includeInactive}
            onChange={(e) => onIncludeInactiveChange(e.target.checked)}
          />
          <span>비활성 장치 포함</span>
        </label>
      </div>

      <div className="admin_device_manage_list">
        {isDeviceLoading && <p>장치 목록을 불러오는 중입니다.</p>}
        {errorMessage && <p>{errorMessage}</p>}
        {!isDeviceLoading && !errorMessage && devices.length === 0 && (
          <p className="admin_device_list_empty">등록된 장치가 없습니다.</p>
        )}
        {devices.map((device) => (
          <AdminDevice
            key={device.deviceId}
            device={device}
            isSelected={selectedDevice?.deviceId === device.deviceId}
            onDeviceSelect={onDeviceSelect}
          />
        ))}
      </div>
    </div>
  );
}
