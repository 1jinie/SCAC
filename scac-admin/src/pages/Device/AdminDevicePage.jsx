import { useEffect, useMemo, useState } from "react";
import admin_device from "../../data/admin_device.json";
import "./css/AdminDevicePage.css";
import AdminDeviceList from "./components/AdminDeviceList";
import { deviceStore } from "../../store/deviceStore";
import AdminDeviceSummary from "./components/AdminDeviceSummary";
import AdminDeviceDetail from "./components/AdminDeviceDetail";

export default function AdminDevicePage() {
  const devices = deviceStore((state) => state.devices);
  const setDevices = deviceStore((state) => state.setDevices);
  const selectedDevice = deviceStore((state) => state.selectedDevice);
  const updateDeviceStatus = deviceStore((state) => state.updateDeviceStatus);
  useEffect(() => {
    setDevices(admin_device);
  }, [setDevices]);

  //api연결용
  // useEffect(() => {
  // const fetchDevices = async () => {
  //   const response = await deviceApi.getDevices();

  //   setDevices(response.data);
  // };
  //
  //   fetchDevices();
  // }, [setDevices]);

  const summary = useMemo(() => {
    return {
      total: devices.length,
      normal: devices.filter((device) => device.status === "NORMAL").length,
      warning: devices.filter((device) => device.status === "WARNING").length,
      error: devices.filter((device) => device.status === "ERROR").length,
    };
  }, [devices]);

  const handleStatusChange = (status) => {
    if (!selectedDevice) return;

    const message =
      status === "NORMAL"
        ? "관리자 확인 후 정상 처리되었습니다."
        : selectedDevice.message;

    updateDeviceStatus(selectedDevice.deviceId, status, message);
  };

  return (
    <div className="admin_device_page">
      <div className="admin_page_heading">
        <div>
          <p className="admin_page_eyebrow">DEVICE MANAGEMENT</p>

          <h2>장치 관리</h2>

          <p>키오스크와 연결된 장치의 현재 상태를 확인합니다.</p>
        </div>
      </div>

      <AdminDeviceSummary summary={summary} />

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
