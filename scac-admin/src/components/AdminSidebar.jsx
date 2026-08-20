import { NavLink } from 'react-router-dom';
//사이드바 메뉴 데이터 여기있습니다
import adminMenuData from '../data/admin_sidebar.json';
import { useAuthStore } from '../store/authStore';

export default function AdminSidebar() {
  const user = useAuthStore((state) => state.user);

  const visibleMenuData = adminMenuData.filter((menu) => {
    if (menu.superAdminOnly) {
      return user?.role === 'SUPER_ADMIN';
    }

    return true;
  });
  return (
    <aside className="admin_sidebar">
      <div className="admin_sidebar_logo">
        <span className="admin_sidebar_logo_mark">
          <img src="/logo/logo.png" alt="SCAC" className="sidebar_logo_img" />
        </span>
        <span className="admin_sidebar_logo_text">
          Study Cafe
          <br />
          Access Control
        </span>
      </div>

      <nav className="admin_navigation">
        {visibleMenuData.map((menu) => (
          <NavLink
            key={menu.path}
            to={menu.path}
            end={menu.end}
            className={({ isActive }) =>
              `admin_navigation_item${isActive ? ' is_active' : ''}`
            }
          >
            <span>{menu.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="admin_sidebar_footer">
        <p>SCAC Admin</p>
        <span>Frontend v1.0</span>
      </div>
    </aside>
  );
}
