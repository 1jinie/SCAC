export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  pageGroupSize = 5,
}) {
  if (totalPages <= 1) {
    return null;
  }

  const currentGroup = Math.floor((currentPage - 1) / pageGroupSize);
  const startPage = currentGroup * pageGroupSize + 1;
  const endPage = Math.min(startPage + pageGroupSize - 1, totalPages);

  const pageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, index) => startPage + index,
  );

  const handlePreviousGroup = () => {
    if (startPage > 1) {
      onPageChange(startPage - 1);
    }
  };

  const handleNextGroup = () => {
    if (endPage < totalPages) {
      onPageChange(endPage + 1);
    }
  };

  return (
    <nav className="admin_pagination" aria-label="페이지 이동">
      <button
        type="button"
        className="admin_pagination_button admin_pagination_arrow"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="이전 페이지"
      >
        ‹
      </button>

      {startPage > 1 && (
        <button
          type="button"
          className="admin_pagination_button"
          onClick={handlePreviousGroup}
          aria-label="이전 페이지 그룹"
        >
          ...
        </button>
      )}

      {pageNumbers.map((pageNumber) => (
        <button
          key={pageNumber}
          type="button"
          className={`admin_pagination_button ${
            currentPage === pageNumber ? 'is_active' : ''
          }`}
          onClick={() => onPageChange(pageNumber)}
          aria-current={currentPage === pageNumber ? 'page' : undefined}
        >
          {pageNumber}
        </button>
      ))}

      {endPage < totalPages && (
        <button
          type="button"
          className="admin_pagination_button"
          onClick={handleNextGroup}
          aria-label="다음 페이지 그룹"
        >
          ...
        </button>
      )}

      <button
        type="button"
        className="admin_pagination_button admin_pagination_arrow"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="다음 페이지"
      >
        ›
      </button>
    </nav>
  );
}
