import { formatfullClock } from "../../../utils/date";
import { formatPhoneNumber } from "../../../utils/formatter";

export default function AdminSeatUserInfo({ user }) {
  return (
    <section className="admin_seat_user">
      <h3>현재 이용자</h3>

      <dl className="admin_seat_info_list">
        <div>
          <dt>전화번호</dt>
          <dd>{formatPhoneNumber(user.phoneNumber)}</dd>
        </div>

        <div>
          <dt>이용권 이름</dt>
          <dd>{user.ticketName}</dd>
        </div>

        <div>
          <dt>이용권 종류</dt>
          <dd>{user.ticketType === "TIME_PACK" ? "시간권" : "기간권"}</dd>
        </div>

        <div>
          <dt>남은 이용시간</dt>
          <dd>
            {user.ticketType == "TIME_PACK"
              ? formatfullClock(user.remainingTime)
              : `${user.remainingDays}일`}
          </dd>
        </div>
      </dl>
    </section>
  );
}
