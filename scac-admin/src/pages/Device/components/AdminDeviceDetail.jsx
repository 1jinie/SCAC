import { useEffect, useState } from 'react';
import {
  DEVICE_STATUS_LABELS,
  DEVICE_TYPE_LABELS,
} from '../../../constants/device';
import { formatfullDateTime } from '../../../utils/date';

const INITIAL_FORM = {
  deviceName: '',
  deviceType: 'PRINTER',
  location: '',
  ipAddress: '',
  serialNumber: '',
};

export default function AdminDeviceDetail({
  selectedDevice,
  deviceLogs,
  onStatusChange,
  isUpdatingStatus,
  onActiveChange,
  isUpdatingActive,

  formMode,
  onEdit,
  onCancelForm,
  onSubmitForm,
  isSavingDevice,
  onDelete,
  isDeletingDevice,
}) {
  const [form, setForm] = useState(INITIAL_FORM);

  const isCreateMode = formMode === 'create';
  const isEditMode = formMode === 'edit';
  const isFormMode = isCreateMode || isEditMode;

  useEffect(() => {
    if (isEditMode && selectedDevice) {
      setForm({
        deviceName: selectedDevice.deviceName ?? '',
        deviceType: selectedDevice.deviceType ?? 'PRINTER',
        location: selectedDevice.location ?? '',
        ipAddress: selectedDevice.ipAddress ?? '',
        serialNumber: selectedDevice.serialNumber ?? '',
      });

      return;
    }

    if (isCreateMode) {
      setForm(INITIAL_FORM);
    }
  }, [isCreateMode, isEditMode, selectedDevice]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.deviceName.trim()) {
      window.alert('장치명을 입력해 주세요.');
      return;
    }

    if (!form.deviceType) {
      window.alert('장치 종류를 선택해 주세요.');
      return;
    }

    onSubmitForm({
      ...form,
      deviceName: form.deviceName.trim(),
      location: form.location.trim(),
      ipAddress: form.ipAddress.trim(),
      serialNumber: form.serialNumber.trim(),
    });
  };

  // 조회 모드인데 선택된 장치가 없는 경우
  if (!selectedDevice && !isCreateMode) {
    return (
      <aside className="admin_panel admin_device_detail">
        <div className="admin_device_detail_empty">
          확인할 장치를 선택해 주세요.
        </div>
      </aside>
    );
  }

  const latestLog = deviceLogs?.[0];

  return (
    <aside className="admin_panel admin_device_detail">
      <div className="admin_panel_header">
        <div>
          <p className="admin_section_eyebrow">DEVICE INFORMATION</p>

          <h3>{isCreateMode ? '새 장치 등록' : selectedDevice.deviceName}</h3>
          <p className="admin_device_detail_description">
            {isCreateMode
              ? '새로운 장치 정보를 입력해 주세요.'
              : isEditMode
                ? '수정할 정보를 입력해 주세요.'
                : '선택한 장치의 상세 정보입니다.'}
          </p>
        </div>

        {!isCreateMode && (
          <span
            className={`admin_status_badge is_${selectedDevice.status.toLowerCase()}`}
          >
            {DEVICE_STATUS_LABELS[selectedDevice.status]}
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <dl className="admin_device_info_list">
          {/* 장치 ID - 조회/수정 */}
          {!isCreateMode && (
            <div>
              <dt>장치 ID</dt>
              <dd>{selectedDevice.deviceId}</dd>
            </div>
          )}

          {/* 장치명 */}
          <div>
            <dt>장치명</dt>
            <dd>
              {isFormMode ? (
                <input
                  type="text"
                  name="deviceName"
                  value={form.deviceName}
                  onChange={handleChange}
                  placeholder="장치명을 입력해 주세요."
                  maxLength={50}
                />
              ) : (
                selectedDevice.deviceName
              )}
            </dd>
          </div>

          {/* 운영 여부 - 조회/수정 */}
          {!isCreateMode && (
            <div>
              <dt>운영 여부</dt>
              <dd>{selectedDevice.isActive ? '사용 중' : '비활성'}</dd>
            </div>
          )}

          {/* 장치 종류 */}
          <div>
            <dt>장치 종류</dt>
            <dd>
              {isFormMode ? (
                <select
                  name="deviceType"
                  value={form.deviceType}
                  onChange={handleChange}
                >
                  {Object.entries(DEVICE_TYPE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              ) : (
                (DEVICE_TYPE_LABELS[selectedDevice.deviceType] ??
                selectedDevice.deviceType)
              )}
            </dd>
          </div>

          {/* 현재 상태 - 조회/수정 */}
          {!isCreateMode && (
            <div>
              <dt>현재 상태</dt>
              <dd>{DEVICE_STATUS_LABELS[selectedDevice.status]}</dd>
            </div>
          )}

          {/* 설치 위치 */}
          <div>
            <dt>설치 위치</dt>
            <dd>
              {isFormMode ? (
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="설치 위치를 입력해 주세요."
                  maxLength={100}
                />
              ) : (
                (selectedDevice.location ?? '-')
              )}
            </dd>
          </div>

          {/* IP 주소 */}
          <div>
            <dt>IP 주소</dt>
            <dd>
              {isFormMode ? (
                <input
                  type="text"
                  name="ipAddress"
                  value={form.ipAddress}
                  onChange={handleChange}
                  placeholder="예: 192.168.0.10"
                  maxLength={45}
                />
              ) : (
                (selectedDevice.ipAddress ?? '-')
              )}
            </dd>
          </div>

          {/* 시리얼 번호 */}
          <div>
            <dt>시리얼 번호</dt>
            <dd>
              {isFormMode ? (
                <input
                  type="text"
                  name="serialNumber"
                  value={form.serialNumber}
                  onChange={handleChange}
                  placeholder="시리얼 번호를 입력해 주세요."
                  maxLength={100}
                />
              ) : (
                (selectedDevice.serialNumber ?? '-')
              )}
            </dd>
          </div>

          {!isCreateMode && (
            <>
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
            </>
          )}
        </dl>

        {isFormMode ? (
          <div className="admin_device_form_actions">
            <button
              type="button"
              className="admin_device_form_cancel_button"
              onClick={onCancelForm}
              disabled={isSavingDevice}
            >
              취소
            </button>

            <button
              type="submit"
              className="admin_device_form_submit_button"
              disabled={isSavingDevice}
            >
              {isSavingDevice
                ? '처리 중...'
                : isCreateMode
                  ? '장치 등록'
                  : '수정 완료'}
            </button>
          </div>
        ) : (
          <>
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
              className="admin_device_edit_button"
              onClick={onEdit}
            >
              정보 수정
            </button>

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
            <span
              title={
                deviceLogs.length > 0
                  ? '장치 로그가 존재하는 장치는 삭제할 수 없습니다.'
                  : ''
              }
            >
              <button
                type="button"
                className="admin_device_delete_button"
                onClick={onDelete}
                disabled={isDeletingDevice || deviceLogs.length > 0}
              >
                {isDeletingDevice ? '삭제 중...' : '장치 삭제'}
              </button>
            </span>
          </>
        )}
      </form>
    </aside>
  );
}
