import { useCallback, useEffect, useMemo, useState } from 'react';
import { deviceApi } from '../../api/deviceApi';
import AdminSummary from '../../components/common/Summary';
import AdminDeviceDetail from './components/AdminDeviceDetail';
import AdminDeviceList from './components/AdminDeviceList';
import './css/AdminDevicePage.css';
import AdminDeviceLogList from './components/AdminDeviceLogList';

export default function AdminDevicePage() {
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [deviceLogs, setDeviceLogs] = useState([]);
  const [isDeviceLoading, setIsDeviceLoading] = useState(false);
  const [isLogLoading, setIsLogLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // 테스트할땐 백엔드 global/config/SecurityConfig.java에
  // .requestMatchers("/api/devices/**").permitAll() 를 추가하세요

  // 전체 장치 조회
  const fetchDevices = useCallback(async () => {
    try {
      setIsDeviceLoading(true);
      setErrorMessage('');
      const data = await deviceApi.getDevices();
      setDevices(data);
    } catch (error) {
      console.error(
        '장치 목록 조회 실패:',
        error.response?.data?.message ?? error,
      );

      setErrorMessage(
        `장치 목록 조회 실패:
        ${error.response?.data?.message ?? error}`,
      );
    } finally {
      setIsDeviceLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  // 장치 선택 + 해당 장치 로그 조회
  const handleDeviceSelect = async (device) => {
    setSelectedDevice(device);
    setDeviceLogs([]);

    setIsLogLoading(true);
    try {
      const logs = await deviceApi.getDeviceLogs(device.deviceId);

      setDeviceLogs(logs);
    } catch (error) {
      console.error(
        '장치 로그 조회 실패:',
        error.response?.data?.message ?? error,
      );
      setDeviceLogs([]);
    } finally {
      setIsLogLoading(false);
    }
  };

  // 관리자 장치 상태 변경
  const handleStatusChange = async (status) => {
    if (!selectedDevice || isUpdatingStatus) {
      return;
    }

    setIsUpdatingStatus(true);
    const message =
      status === 'NORMAL'
        ? '관리자 확인 후 정상 처리되었습니다.'
        : '관리자에 의해 장치 상태가 변경되었습니다.';

    try {
      const updatedDevice = await deviceApi.updateDeviceStatus(
        selectedDevice.deviceId,
        status,
        message,
      );

      // 상세 화면 즉시 갱신
      setSelectedDevice(updatedDevice);

      // 장치 목록 갱신
      await fetchDevices();

      // 로그 다시 조회
      const logs = await deviceApi.getDeviceLogs(selectedDevice.deviceId);
      setDeviceLogs(logs);
    } catch (error) {
      console.error(
        '장치 상태 업데이트 실패:',
        error.response?.data?.message ?? error,
      );
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const deviceSummary = useMemo(() => {
    return devices.reduce(
      (result, device) => {
        result.total += 1;

        switch (device.status) {
          case 'NORMAL':
            result.normal += 1;
            break;

          case 'OFFLINE':
            result.offline += 1;
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
        offline: 0,
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
        key: 'offline',
        label: '오프라인',
        value: deviceSummary.offline,
        unit: '대',
        description: '현재 연결되지 않은 장치',
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

      <section className="admin_device_workspace">
        <AdminDeviceList
          devices={devices}
          selectedDevice={selectedDevice}
          onDeviceSelect={handleDeviceSelect}
          isDeviceLoading={isDeviceLoading}
          errorMessage={errorMessage}
        />

        <AdminDeviceDetail
          selectedDevice={selectedDevice}
          deviceLogs={deviceLogs}
          onStatusChange={handleStatusChange}
          isUpdatingStatus={isUpdatingStatus}
        />

        {selectedDevice &&
          (isLogLoading ? (
            <div className="admin_device_log_section">
              <p className="admin_device_log_empty">
                로그를 불러오는 중입니다.
              </p>
            </div>
          ) : (
            <AdminDeviceLogList logs={deviceLogs} />
          ))}
      </section>
    </div>
  );
}
