import './css/LoadingOverlay.css';

/**
 * LoadingOverlay
 *
 * 데이터 조회 중 기존 화면 위에 로딩 UI를 표시하는 공통 컴포넌트입니다.
 * 기존 콘텐츠를 제거하지 않고 Overlay 형태로 표시하기 때문에
 * 로딩 중 레이아웃이 변경되는 현상을 줄일 수 있습니다.
 *
 * [사용 방법]
 *
 * 1. LoadingOverlay를 감싸는 부모 요소에 position: relative를 반드시 설정합니다.
 *
 * .parent {
 *   position: relative;
 * }
 *
 * 2. 로딩 중 부모 영역의 높이가 줄어드는 것을 방지하려면
 *    필요에 따라 min-height를 설정합니다.
 *
 * .parent {
 *   position: relative;
 *   min-height: 400px;
 * }
 *
 * 3. 사용 예시
 *
 * <div className="parent">
 *   <LoadingOverlay
 *     isLoading={isLoading}
 *     message="장치를 불러오는 중입니다."
 *   />
 *
 *   {contents}
 * </div>
 *
 * [Props]
 * - isLoading : true일 때 LoadingOverlay 표시
 * - message   : 화면에 표시할 로딩 안내 문구
 *               기본값은 "데이터를 불러오는 중입니다."
 */
export default function LoadingOverlay({
  isLoading,
  message = '데이터를 불러오는 중입니다.',
}) {
  if (!isLoading) {
    return null;
  }

  return (
    <div className="loading_overlay" role="status" aria-live="polite">
      <div className="loading_overlay_content">
        <div className="loading_spinner" />
        <span>{message}</span>
      </div>
    </div>
  );
}
