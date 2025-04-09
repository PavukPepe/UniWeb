import { Link } from "react-router-dom"
import './CourseCard.css';


export function CourseCard({ course, onClick }) {
  return (
    <div className="card card-background text-white h-100" style={{ overflow: "hidden" }} onClick={onClick}>
      <div className="position-relative" style={{ height: "180px" }}>
        {/* <img src={course.image || "/placeholder.jpg"} alt={course.title} className="w-100 h-100 object-fit-cover" /> */}
        <img src='course.png' alt={course.title} className="w-100 h-100 object-fit-cover" />
      </div>

      <div className="card-body">
        <p className="card-title">{course.courseTitle}</p>

        <div className="d-flex align-items-center mb-2">
          {Array(5)
            .fill(null)
            .map((_, i) => (
              <svg
                key={i}
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill={i < course.rating ? "#FF3800" : "#495057"}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ marginRight: "2px" }}
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            ))}
          <span className="text-secondary ms-1 small">/{course.reviewCount} отзывов</span>
        </div>

        <div className="text-secondary mb-3">{course.instructor}</div>

        <div className="d-flex align-items-center gap-2">
          <Link to={`/enroll/${course.id}`} className="btn btn-orange">
            Записаться
          </Link>

          <Link to={`/course/${course.id}`} className="text-white text-decoration-none">
            Программа курса
          </Link>
        </div>
      </div>
    </div>
  )
}

