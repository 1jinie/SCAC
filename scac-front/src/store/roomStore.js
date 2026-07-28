import { create } from 'zustand';
import { roomApi } from '../api/roomApi';
import { roomLayouts } from '../constants/SeatLayout';

export const roomStore = create((set) => ({
  rooms: [],

  fetchRooms: async () => {
    const response = await roomApi.getRoomList();

    const statusMap = {
      AVB: 'available',
      USE: 'using',
      UNA: 'unavailable',
      BRK: 'repair',
    };

    const roomImages = {
      1: '/images/studyroom_6people_00.jpg',
      2: '/images/studyroom_6people_01.jpg',
      3: '/images/studyroom_10people.jpg',
    };

    const roomIdMap = {
      1: 101,
      2: 102,
      3: 103,
    };

    const rooms = response.data.data.map((room) => {
      const layoutId = roomIdMap[room.roomId];

      const layout = roomLayouts.find(
        (item) => item.id === layoutId && item.type === 'room',
      );

      return {
        id: room.roomId,
        type: 'room',
        name: room.roomName,
        capacity: room.capacity,
        image: roomImages[room.roomId],
        status: statusMap[room.status] ?? 'available',
        ...layout,
      };
    });
    set({ rooms });
  },
}));
