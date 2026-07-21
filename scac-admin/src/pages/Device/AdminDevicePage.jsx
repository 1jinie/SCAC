import { useEffect, useMemo } from 'react';
import AdminSummary from '../../components/common/Summary';
import admin_device from '../../data/admin_device.json';
import { deviceStore } from '../../store/deviceStore';
import AdminDeviceDetail from './components/AdminDeviceDetail';
import AdminDeviceList from './components/AdminDeviceList';
import './css/AdminDevicePage.css';

export default function AdminDevicePage() {
  const devices = deviceStore((state) => state.devices);
  const selectedDevice = deviceStore((state) => state.selectedDevice);
  const setDevices = deviceStore((state) => state.setDevices);
  const updateDeviceStatus = deviceStore((state) => state.updateDeviceStatus);

  useEffect(() => {
    const loadDevices = async () => {
      // 현재
      setDevices(admin_device);

      // API 연결 후
      // const response = await deviceApi.getDevices();
      // setDevices(response.data);
    };

    loadDevices();
  }, [setDevices]);

  const handleStatusChange = (status) => {
    if (!selectedDevice) return;

    const message =
      status === 'NORMAL'
        ? '관리자 확인 후 정상 처리되었습니다.'
        : selectedDevice.message;

    updateDeviceStatus(selectedDevice.deviceId, status, message);
  };

  const deviceSummary = useMemo(() => {
    return devices.reduce(
      (result, device) => {
        result.total += 1;

        switch (device.status) {
          case 'NORMAL':
            result.normal += 1;
            break;

          case 'WARNING':
            result.warning += 1;
            break;

          case 'ERROR':
            result.error += 1;
            break;

          default:
            break;
        }

        return result;
      },
      {
        total: 0,
        normal: 0,
        warning: 0,
        error: 0,
      },
    );
  }, [devices]);

  const summaryItems = useMemo(
    () => [
      {
        key: 'total',
        label: '전체 장치',
        value: deviceSummary.total,
        unit: '대',
        description: '등록된 장치',
        color: 'blue',
      },
      {
        key: 'normal',
        label: '정상 작동',
        value: deviceSummary.normal,
        unit: '대',
        description: '현재 정상 상태',
        color: 'mint',
      },
      {
        key: 'warning',
        label: '점검 필요',
        value: deviceSummary.warning,
        unit: '대',
        description: '점검 권장 장치',
        color: 'orange',
      },
      {
        key: 'error',
        label: '오류',
        value: deviceSummary.error,
        unit: '대',
        description: '즉시 확인 필요',
        color: 'red',
      },
    ],
    [deviceSummary],
  );

  const lastCheckedAt = useMemo(() => {
    if (devices.length === 0) return '-';

    return devices
      .map((device) => device.lastCheckedAt)
      .sort()
      .reverse()[0];
  }, [devices]);

  return (
    <div className="admin_device_page">
      <div className="admin_page_heading">
        <div>
          <p className="admin_page_eyebrow">DEVICE MANAGEMENT</p>

          <h2>장치 관리</h2>

          <p>키오스크와 연결된 장치의 현재 상태를 확인합니다.</p>
        </div>
      </div>

      <AdminSummary items={summaryItems} />
      <p className="admin_page_sub_info">마지막 장치 점검 : {lastCheckedAt}</p>

      <section className="admin_device_workspace">
        <AdminDeviceList devices={devices} />
        <AdminDeviceDetail
          onStatusChange={handleStatusChange}
          selectedDevice={selectedDevice}
        />
      </section>
    </div>
  );
}
