import { useEffect, useState } from "react";
import memoJson from "../../data/admin_memo.json";
import AdminMemoList from "./components/AdminMemoList";
import AdminMemoDetail from "./components/AdminMemoDetail";
import "./css/AdminMemoPage.css";

export default function AdminMemoPage() {
  const [memoData, setMemoData] = useState([]);
  const [selectedMemo, setSelectedMemo] = useState(null);

  useEffect(() => {
    setMemoData(memoJson);
  }, []);

  const handleMemoSelect = (memo) => {
    setSelectedMemo(memo);
  };

  const handleAddMemo = () => {
    setSelectedMemo(null);
  };

  return (
    <div className="admin_memo_page">
      <section className="admin_memo_workspace">
        {/* 왼쪽 */}
        <div className="admin_memo_list_section">
          <div className="admin_section_header">
            <div>
              <h2>인수인계 메모</h2>
              <p>관리자 간 전달사항을 기록하고 관리합니다.</p>
            </div>

            <button className="admin_memo_add" onClick={handleAddMemo}>
              메모 등록
            </button>
          </div>

          <AdminMemoList
            memos={memoData}
            selectedMemo={selectedMemo}
            onMemoSelect={handleMemoSelect}
          />
        </div>

        {/* 오른쪽 */}
        <AdminMemoDetail
          selectedMemo={selectedMemo}
          memoData={memoData}
          setMemoData={setMemoData}
        />
      </section>
    </div>
  );
}
