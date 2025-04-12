function AdminNav({ activeSection, setActiveSection }) {
    return (
      <div className="sidebar p-4 d-flex flex-column gap-2 col-2 bg-dark text-white sticky-top" style={{ height: '100vh' }}>
        <div className="fs-4 fw-bold mb-4">Админка</div>
  
        <div
          className={`d-flex align-items-center gap-2 text-white text-decoration-none p-2 rounded ${
            activeSection === "users" ? "bg-orange" : "hover-bg-dark"
          }`}
          onClick={() => setActiveSection("users")}
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
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          <span>Пользователи</span>
        </div>
  
        <div
          className={`d-flex align-items-center gap-2 text-white text-decoration-none p-2 rounded ${
            activeSection === "courses" ? "bg-orange" : "hover-bg-dark"
          }`}
          onClick={() => setActiveSection("courses")}
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
          <span>Курсы</span>
        </div>
  
        <div
          className={`d-flex align-items-center gap-2 text-white text-decoration-none p-2 rounded ${
            activeSection === "categories" ? "bg-orange" : "hover-bg-dark"
          }`}
          onClick={() => setActiveSection("categories")}
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
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          </svg>
          <span>Категории</span>
        </div>
  
        <div
          className={`d-flex align-items-center gap-2 text-white text-decoration-none p-2 rounded ${
            activeSection === "comments" ? "bg-orange" : "hover-bg-dark"
          }`}
          onClick={() => setActiveSection("comments")}
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
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <span>Комментарии</span>
        </div>
      </div>
    );
  }
  
  export default AdminNav;