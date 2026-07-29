import axiosInstance from './axiosInstance';

export const memoApi = {
  // 관리자 메모 전체 조회
  getMemos: async () => {
    const response = await axiosInstance.get('/api/admin/memos');
    return response.data.data;
  },

  // 관리자 메모 등록
  createMemo: async (content) => {
    const response = await axiosInstance.post('/api/admin/memos', {
      content,
    });

    return response.data.data;
  },

  // 관리자 메모 수정
  updateMemo: async (memoId, content) => {
    const response = await axiosInstance.put(`/api/admin/memos/${memoId}`, {
      content,
    });

    return response.data.data;
  },

  // 관리자 메모 삭제
  deleteMemo: async (memoId) => {
    const response = await axiosInstance.delete(`/api/admin/memos/${memoId}`);

    return response.data;
  },
};
