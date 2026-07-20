import React from "react";
import AdminDevice from "./AdminDevice";
import { deviceStore } from "../../../store/deviceStore";

export default function AdminDeviceList({ devices }) {
  const selectDevice = deviceStore((state) => state.selectDevice);

  return (
    <div className="admin_panel">
      <div className="admin_panel_header">
        <div>
          <h3>장치 목록</h3>
          <p>장치를 선택하면 상세 정보를 확인할 수 있습니다.</p>
        </div>
      </div>

      <div className="admin_device_manage_list">
        {devices.map((device) => (
          <AdminDevice
            key={device.deviceId}
            device={device}
            selectDevice={selectDevice}
          />
        ))}
      </div>
    </div>
  );
}
