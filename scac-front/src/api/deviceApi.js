import axiosInstance from './axiosInstance';

export const openDoor = async () => {
  const response = await axiosInstance.post('/api/commands', {
    taskType: 'DOOR_OPEN',
    payload: '',
  });

  return response.data;
};
// 영수증 출력 명령 (임시로 얹어둔거라 지우시고 하시면돼요)
export const printReceipt = async ({ orderId, itemName, amount }) => {
  const response = await axiosInstance.post('/api/commands', {
    taskType: 'PRINT_RECEIPT',
    payload: `${orderId}|${itemName}|${amount}`,
  });

  return response.data;
};

// 장치 명령 처리 결과 조회 (임시로 얹어둔거라 지우시고 하시면돼요22)
export const getCommand = async (commandId) => {
  const response = await axiosInstance.get(`/api/commands/${commandId}`);

  return response.data;
};
