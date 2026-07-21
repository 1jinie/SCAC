import { useEffect, useState } from "react";
import { formatAdminMemoDate } from "../../../utils/date";

export default function AdminMemoDetail({
  selectedMemo,
  memoData,
  setMemoData,
}) {
  const emptyMemo = {
    memo_id: "",
    user_id: 1,
    content: "",
    created_at: "",
  };

  const [memo, setMemo] = useState(emptyMemo);

  useEffect(() => {
    if (selectedMemo) {
      setMemo(selectedMemo);
    } else {
      setMemo({
        ...emptyMemo,
        created_at: new Date(),
      });
    }
  }, [selectedMemo]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setMemo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    if (!memo.content.trim()) {
      alert("내용을 입력하세요");
      return;
    }
    if (selectedMemo) {
      setMemoData((prev) =>
        prev.map((item) => (item.memo_id === memo.memo_id ? memo : item)),
      );
      alert("수정되었습니다");
    } else {
      setMemoData((prev) => [
        ...prev,
        {
          ...memo,
          memo_id:
            prev.length > 0 ? Math.max(...prev.map((m) => m.memo_id)) + 1 : 1,
          created_at: new Date(),
        },
      ]);
      alert("등록되었습니다");

      setMemo({
        ...emptyMemo,
        created_at: new Date(),
      });
    }
  };

  const handleDelete = () => {
    if (!selectedMemo) return;

    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    setMemoData((prev) =>
      prev.filter((item) => item.memo_id !== selectedMemo.memo_id),
    );

    setMemo({
      ...emptyMemo,
      created_at: new Date(),
    });

    alert("삭제되었습니다.");
  };

  return (
    <div className="admin_memo_detail">
      <h3>{selectedMemo ? "메모 수정" : "메모 등록"}</h3>

      <div className="admin_memo_form">
        <label>작성자</label>
        <input value={`관리자 #${memo.user_id}`} disabled />

        <label>작성일</label>
        <input value={formatAdminMemoDate(memo.created_at)} disabled />

        <label>메모 내용</label>
        <textarea
          name="content"
          rows={12}
          value={memo.content}
          onChange={handleChange}
          placeholder="인수인계 내용을 입력하세요."
        />

        <div className="admin_memo_button_group">
          <button className="admin_memo_save" onClick={handleSave}>
            {selectedMemo ? "수정" : "등록"}
          </button>

          {selectedMemo && (
            <button className="admin_memo_delete" onClick={handleDelete}>
              삭제
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
