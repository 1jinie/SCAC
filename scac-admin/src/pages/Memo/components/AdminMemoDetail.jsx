import { useEffect, useState } from 'react';
import { formatAdminMemoDate } from '../../../utils/date';

const EMPTY_MEMO = {
  memoId: null,
  adminId: null,
  content: '',
  createdAt: null,
  updatedAt: null,
};

export default function AdminMemoDetail({
  selectedMemo,
  onCreateMemo,
  onUpdateMemo,
  onDeleteMemo,
}) {
  const [memo, setMemo] = useState(EMPTY_MEMO);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (selectedMemo) {
      setMemo(selectedMemo);
    } else {
      setMemo(EMPTY_MEMO);
    }
  }, [selectedMemo]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setMemo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!memo.content.trim()) {
      window.alert('내용을 입력하세요.');
      return;
    }

    try {
      setIsSaving(true);

      if (selectedMemo) {
        await onUpdateMemo(memo.memoId, memo.content.trim());

        window.alert('수정되었습니다.');
      } else {
        await onCreateMemo(memo.content.trim());

        window.alert('등록되었습니다.');
      }
    } catch (error) {
      console.error('메모 저장 실패:', error.response?.data ?? error);

      window.alert(
        error.response?.data?.message ?? '메모 저장에 실패했습니다.',
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedMemo) {
      return;
    }

    const confirmed = window.confirm('정말 삭제하시겠습니까?');

    if (!confirmed) {
      return;
    }

    try {
      await onDeleteMemo(selectedMemo.memoId);

      window.alert('삭제되었습니다.');
    } catch (error) {
      console.error('메모 삭제 실패:', error.response?.data ?? error);

      window.alert(
        error.response?.data?.message ?? '메모 삭제에 실패했습니다.',
      );
    }
  };

  return (
    <div className="admin_memo_detail">
      <h3>{selectedMemo ? '메모 수정' : '메모 등록'}</h3>

      <div className="admin_memo_form">
        <label>작성자</label>
        <input
          value={
            memo.adminId ? `관리자 #${memo.adminId}` : '관리자 정보 연동 전'
          }
          disabled
        />

        <label>작성일</label>
        <input
          value={
            memo.createdAt
              ? formatAdminMemoDate(memo.createdAt)
              : '등록 시 자동 생성'
          }
          disabled
        />
        <label>수정일</label>
        <span>
          {memo.updatedAt &&
          memo.createdAt &&
          new Date(memo.createdAt).getTime() !==
            new Date(memo.updatedAt).getTime()
            ? formatAdminMemoDate(memo.updatedAt)
            : '-'}
        </span>

        <label>메모 내용</label>
        <textarea
          name="content"
          rows={12}
          value={memo.content}
          onChange={handleChange}
          placeholder="인수인계 내용을 입력하세요."
        />

        <div className="admin_memo_button_group">
          <button
            className="admin_memo_save"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? '처리 중...' : selectedMemo ? '수정' : '등록'}
          </button>

          {selectedMemo && (
            <button
              className="admin_memo_delete"
              onClick={handleDelete}
              disabled={isSaving}
            >
              삭제
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
