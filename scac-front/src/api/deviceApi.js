import axiosInstance from './axiosInstance';

export const openDoor = async () => {
  const response = await axiosInstance.post('/api/commands', {
    taskType: 'DOOR_OPEN',
    payload: '',
  });

  return response.data;
};

export const readCard = async () => {
  const response = await axiosInstance.post('/api/commands', {
    taskType: 'CARD_READING',
    payload: ''
  });

  return response.data;
}