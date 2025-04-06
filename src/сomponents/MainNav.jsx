import { Link, useLocation } from "react-router-dom"
function MainNav() {
  const location = useLocation()

  return (
    <div className="sidebar p-4 d-flex flex-column gap-2 col-2 navigation sticky-top">
      <div className="text-white fs-4 fw-bold mb-4">UNI</div>

      <Link
        to="/home"
        className={`d-flex align-items-center gap-2 text-white text-decoration-none p-2 rounded ${
          location.pathname === "/home" ? "bg-orange" : "hover-bg-dark"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
        </svg>
        <span>Каталог курсов</span>
      </Link>

      <Link
        to="/my-courses"
        className={`d-flex align-items-center gap-2 text-white text-decoration-none p-2 rounded ${
          location.pathname === "/my-courses" ? "bg-orange" : "hover-bg-dark"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
        </svg>
        <span>Мои курсы</span>
      </Link>

      <Link
        to="/blog"
        className={`d-flex align-items-center gap-2 text-white text-decoration-none p-2 rounded ${
          location.pathname === "/blog" ? "bg-orange" : "hover-bg-dark"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
        </svg>
        <span>Dev-Блог</span>
      </Link>

      <Link
        to="/profile"
        className={`d-flex align-items-center gap-2 text-white text-decoration-none p-2 rounded ${
          location.pathname === "/profile" ? "bg-orange" : "hover-bg-dark"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
        </svg>
        <span>Профиль</span>
      </Link>
    </div>
  )
}

export default MainNav
