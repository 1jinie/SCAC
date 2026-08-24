import axiosInstance from './axiosInstance';

export const openDoor = async () => {
  const response = await axiosInstance.post('/api/commands', {
    deviceId: 3,
    taskType: 'DOOR_OPEN',
    payload: '',
  });

  return response.data;
};

// 영수증 출력 명령
export const printReceipt = async ({
  orderId,
  itemName,
  amount,
  startTime,
  endTime,
}) => {
  const response = await axiosInstance.post('/api/commands', {
    deviceId: 1,
    taskType: 'PRINT_RECEIPT',
    payload: `${orderId}|${itemName}|${startTime || '-'}|${endTime || '-'}|${amount}`,
  });

  return response.data;
};

// 장치 명령 처리 결과 조회
export const getCommand = async (commandId) => {
  const response = await axiosInstance.get(`/api/commands/${commandId}`);

  return response.data;
};

export const readCard = async () => {
  const response = await axiosInstance.post('/api/commands', {
    deviceId: 2,
    taskType: 'CARD_READING',
    payload: '',
  });

  return response.data;
};

// -------------- 시연용 --------------
// 프린터 상태변경
export const updatePrinterStatus = async (status) => {
  const response = await axiosInstance.patch('/api/devices/1/status', {
    status,
  });

  return response.data;
};
