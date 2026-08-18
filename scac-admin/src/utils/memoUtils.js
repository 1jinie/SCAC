// 관리자 ID별 은은하고 직관적인 파스텔 포스트잇 컬러
export const ADMIN_POSTIT_COLORS = [
  { bg: '#FFF8B5', border: '#E6D254', text: '#6D5B00' }, // 노랑
  { bg: '#E1F3FE', border: '#88C9FA', text: '#0C538C' }, // 하늘
  { bg: '#E4F9E8', border: '#92E099', text: '#1B6622' }, // 연두
  { bg: '#F5EBFD', border: '#CE9FF2', text: '#591C87' }, // 연보라
  { bg: '#FFEFE5', border: '#FFAF8A', text: '#8A2F08' }, // 살구
  { bg: '#FFEBF1', border: '#FCA4BE', text: '#851637' }, // 핑크
  { bg: '#E0F7F5', border: '#76D7D3', text: '#085C57' }, // 민트
  { bg: '#EFEFEF', border: '#C2C2C2', text: '#4B4B4B' }, // 뉴트럴 그레이
];

export function getAdminColor(adminId) {
  if (adminId == null || isNaN(Number(adminId))) {
    return ADMIN_POSTIT_COLORS[0];
  }
  const idx = Math.abs(Number(adminId)) % ADMIN_POSTIT_COLORS.length;
  return ADMIN_POSTIT_COLORS[idx];
}

export function isMemoCompleted(content) {
  return Boolean(content && (content.startsWith('[완료]') || content.startsWith('[DONE]')));
}

export function getCleanMemoContent(content) {
  if (!content) return '';
  return content.replace(/^\[(완료|DONE)\]\s*/i, '').trim();
}

export function toggleMemoCompleted(content) {
  if (!content) return '[완료] ';
  if (isMemoCompleted(content)) {
    return getCleanMemoContent(content);
  }
  return `[완료] ${content.trim()}`;
}
