"use client"
import { useState } from "react"
import { ChevronDown, ChevronUp } from "react-bootstrap-icons"

export default function CoursePage({ id, title, description, topics: initialTopics }) {
  const [expanded, setExpanded] = useState(false)
  const [topics, setTopics] = useState(initialTopics)

  const toggleModule = () => {
    setExpanded(!expanded)
  }

  const toggleTopic = (topicId) => {
    setTopics(topics.map((topic) => (topic.id === topicId ? { ...topic, expanded: !topic.expanded } : topic)))
  }

  return (
    <div className="card bg-dark border-secondary mb-3">
      <div
        className="card-header d-flex justify-content-between align-items-center cursor-pointer"
        onClick={toggleModule}
        style={{ cursor: "pointer" }}
      >
        <h5 className="mb-0">
          Модуль {id}: {title}
        </h5>
        {expanded ? <ChevronUp /> : <ChevronDown />}
      </div>

      {expanded && (
        <div className="card-body">
          <p className="card-text text-light-emphasis">{description}</p>

          <div className="list-group list-group-flush bg-dark">
            {topics.map((topic) => (
              <div key={topic.id} className="list-group-item bg-dark border-secondary">
                <div
                  className="d-flex justify-content-between align-items-center"
                  onClick={() => toggleTopic(topic.id)}
                  style={{ cursor: "pointer" }}
                >
                  <h6 className="mb-0">
                    Тема {topic.id}: {topic.title}
                  </h6>
                  {topic.expanded ? <ChevronUp /> : <ChevronDown />}
                </div>

                {topic.expanded && (
                  <ul className="list-group list-group-flush mt-2 bg-dark">
                    {topic.steps.map((step) => (
                      <li key={step.id} className="list-group-item bg-dark border-secondary d-flex align-items-center">
                        <div
                          className={`me-2 rounded-circle border ${step.completed ? "bg-success" : ""}`}
                          style={{ width: "12px", height: "12px" }}
                        ></div>
                        <span>
                          Шаг {step.id}: {step.title}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}