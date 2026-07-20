import React from "react";

export default function AdminDevice({ device, selectDevice }) {
  return (
    <button
      type="button"
      className="admin_device_manage_item"
      onClick={() => selectDevice(device)}
    >
      <div>
        <strong>{device.deviceName}</strong>
        <span>{device.deviceType}</span>
      </div>

      <div>
        <span
          className={`admin_status_badge is_${device.status.toLowerCase()}`}
        >
          {device.status}
        </span>

        <small>{device.lastCheckedAt}</small>
      </div>
    </button>
  );
}
