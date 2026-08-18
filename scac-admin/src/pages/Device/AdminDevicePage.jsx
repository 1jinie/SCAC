import { useCallback, useEffect, useMemo, useState } from 'react';
import { deviceApi } from '../../api/deviceApi';
import AdminSummary from '../../components/common/Summary';
import AdminDeviceDetail from './components/AdminDeviceDetail';
import AdminDeviceList from './components/AdminDeviceList';
import AdminDeviceLogList from './components/AdminDeviceLogList';
import './css/AdminDevicePage.css';

export default function AdminDevicePage() {
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [deviceLogs, setDeviceLogs] = useState([]);
  const [isDeviceLoading, setIsDeviceLoading] = useState(false);
  const [isLogLoading, setIsLogLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [includeInactive, setIncludeInactive] = useState(false);
  const [isUpdatingActive, setIsUpdatingActive] = useState(false);
  const [deviceFormMode, setDeviceFormMode] = useState(null); // 장치 추가/수정모드 null, create, edit
  const [isSavingDevice, setIsSavingDevice] = useState(false);
  const [isDeletingDevice, setIsDeletingDevice] = useState(false);

  // 전체 장치 조회
  const fetchDevices = useCallback(async () => {
    try {
      setIsDeviceLoading(true);
      setErrorMessage('');
      const data = await deviceApi.getDevices(includeInactive);
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
  }, [includeInactive]);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  // 장치 선택 + 해당 장치 로그 조회
  const handleDeviceSelect = async (device) => {
    setSelectedDevice(device);
    setDeviceLogs([]);
    setDeviceFormMode(null);

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
      // 상세 화면 갱신
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

  const handleActiveChange = async () => {
    if (!selectedDevice || isUpdatingActive) {
      return;
    }
    const deviceActive = !selectedDevice.isActive;

    const message = deviceActive
      ? '이 장치를 다시 활성화하시겠습니까?'
      : '이 장치를 비활성화하시겠습니까?\n비활성화된 장치는 기본 목록에서 숨겨집니다.';
    if (!window.confirm(message)) {
      return;
    }

    try {
      setIsUpdatingActive(true);
      const updatedDevice = await deviceApi.updateDeviceActive(
        selectedDevice.deviceId,
        deviceActive,
      );
      setSelectedDevice(updatedDevice);
      await fetchDevices();

      // 장치 비활성화 선택시 상세 선택 해제
      if (!deviceActive && !includeInactive) {
        setSelectedDevice(null);
        setDeviceLogs([]);
      }
    } catch (error) {
      console.error(
        '장치 활성 상태 변경 실패:',
        error.response?.data?.message ?? error,
      );

      window.alert(
        error.response?.data?.message ??
          '장치 상태 변경 중 오류가 발생했습니다.',
      );
    } finally {
      setIsUpdatingActive(false);
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

  // 장치추가
  const handleCreateDevice = () => {
    setDeviceFormMode('create');
    setSelectedDevice(null);
  };

  // 장치수정
  const handleEditDevice = () => {
    if (!selectedDevice) {
      return;
    }
    setDeviceFormMode('edit');
  };

  // 장치 form 닫기
  const handleCloseDeviceForm = () => {
    if (isSavingDevice) {
      return;
    }
    setDeviceFormMode(null);
  };

  // 장치 추가/수정 등록버튼
  const handleDeviceFormSubmit = async (form) => {
    if (isSavingDevice) {
      return;
    }

    try {
      setIsSavingDevice(true);

      if (deviceFormMode === 'create') {
        const createdDevice = await deviceApi.createDevice(form);

        await fetchDevices();

        setSelectedDevice(createdDevice);
        setDeviceLogs([]);

        window.alert('장치 등록이 완료되었습니다.');
      }

      if (deviceFormMode === 'edit') {
        const updatedDevice = await deviceApi.updateDevice(
          selectedDevice.deviceId,
          form,
        );

        setSelectedDevice(updatedDevice);

        await fetchDevices();

        window.alert('장치 정보 수정이 완료되었습니다.');
      }

      setDeviceFormMode(null);
    } catch (error) {
      console.error('장치 저장 실패:', error.response?.data?.message ?? error);

      window.alert(
        error.response?.data?.message ?? '장치 저장 중 오류가 발생했습니다.',
      );
    } finally {
      setIsSavingDevice(false);
    }
  };

  // 장치 삭제
  const handleDeleteDevice = async () => {
    if (!selectedDevice || isDeletingDevice) {
      return;
    }

    const confirmed = window.confirm(
      `"${selectedDevice.deviceName}" 장치를 삭제하시겠습니까?\n\n장치 로그가 존재하는 장치는 삭제할 수 없습니다.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setIsDeletingDevice(true);

      await deviceApi.deleteDevice(selectedDevice.deviceId);

      setSelectedDevice(null);
      setDeviceLogs([]);

      await fetchDevices();

      window.alert('장치 삭제가 완료되었습니다.');
    } catch (error) {
      console.error('장치 삭제 실패:', error.response?.data?.message ?? error);

      window.alert(
        error.response?.data?.message ?? '장치 삭제 중 오류가 발생했습니다.',
      );
    } finally {
      setIsDeletingDevice(false);
    }
  };

  const summaryItems = useMemo(
    () => [
      {
        key: 'total',
        label: includeInactive ? '전체 장치' : '운영 장치',
        value: deviceSummary.total,
        unit: '대',
        description: includeInactive
          ? '등록된 모든 장치'
          : '현재 활성화된 장치',
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
        alert: true,
      },
      {
        key: 'error',
        label: '오류',
        value: deviceSummary.error,
        unit: '대',
        description: '즉시 확인 필요',
        color: 'red',
        alert: true,
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
        <div className="admin_device_left_column">
          <AdminDeviceList
            devices={devices}
            selectedDevice={selectedDevice}
            onDeviceSelect={handleDeviceSelect}
            isDeviceLoading={isDeviceLoading}
            errorMessage={errorMessage}
            includeInactive={includeInactive}
            onIncludeInactiveChange={setIncludeInactive}
            onCreateDevice={handleCreateDevice}
            isCreateMode={deviceFormMode === 'create'}
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
        </div>
        <AdminDeviceDetail
          // 장치 상세정보
          selectedDevice={selectedDevice}
          deviceLogs={deviceLogs}
          onStatusChange={handleStatusChange}
          isUpdatingStatus={isUpdatingStatus}
          onActiveChange={handleActiveChange}
          isUpdatingActive={isUpdatingActive}
          // 장치 추가, 수정 삭제
          formMode={deviceFormMode}
          onCreate={handleCreateDevice}
          onEdit={handleEditDevice}
          onCancelForm={handleCloseDeviceForm}
          onSubmitForm={handleDeviceFormSubmit}
          isSavingDevice={isSavingDevice}
          onDelete={handleDeleteDevice}
          isDeletingDevice={isDeletingDevice}
        />
      </section>
    </div>
  );
}
