import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { ChevronDown, ChevronUp } from "react-bootstrap-icons";

function CourseStructure({ blocks, courseId }) {
  const [structuredBlocks, setStructuredBlocks] = useState([]);

  useEffect(() => {
    setStructuredBlocks((prevBlocks) => {
      if (!blocks || blocks.length === 0) return prevBlocks;
      return blocks.map((newBlock) => {
        const existingBlock = prevBlocks.find((b) => b.id === newBlock.id);
        return {
          ...newBlock,
          expanded: existingBlock ? existingBlock.expanded : true,
          topics: newBlock.topics.map((newTopic) => {
            const existingTopic = existingBlock?.topics.find((t) => t.id === newTopic.id);
            return {
              ...newTopic,
              expanded: existingTopic ? existingTopic.expanded : true,
            };
          }),
        };
      });
    });
  }, [blocks]);

  const toggleBlock = (blockId) => {
    setStructuredBlocks((prev) =>
      prev.map((block) =>
        block.id === blockId ? { ...block, expanded: !block.expanded } : block
      )
    );
  };

  const toggleTopic = (blockId, topicId) => {
    setStructuredBlocks((prev) =>
      prev.map((block) => {
        if (block.id === blockId) {
          return {
            ...block,
            topics: block.topics.map((topic) =>
              topic.id === topicId ? { ...topic, expanded: !topic.expanded } : topic
            ),
          };
        }
        return block;
      })
    );
  };

  const handleStepClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="sidebar p-4 d-flex flex-column gap-2 col-2 navigation">
      <h5 className="text-white fs-4 fw-bold mb-4">Содержание курса</h5>
      <ul className="list-unstyled">
        {structuredBlocks?.map((block) => (
          <li key={block.id} className="mb-2">
            <div
              className="d-flex justify-content-between align-items-center text-white mb-3"
              onClick={() => toggleBlock(block.id)}
              style={{ cursor: "pointer" }}
            >
              <strong>{block.title}</strong>
              {block.expanded ? <ChevronUp /> : <ChevronDown />}
            </div>
            {block.expanded && (
              <ul className="list-unstyled ms-3">
                {block.topics?.map((topic) => (
                  <li key={topic.id} className="mb-2">
                    <div
                      className="d-flex justify-content-between align-items-center text-white mb-3"
                      onClick={() => toggleTopic(block.id, topic.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <span>{topic.title}</span>
                      {topic.expanded ? <ChevronUp /> : <ChevronDown />}
                    </div>
                    {topic.expanded && (
                      <ul className="list-unstyled ms-3">
                        {topic.steps?.map((step) => (
                          <li key={step.id}>
                            <NavLink
                              to={`/courses/${courseId}/step/${step.id}`}
                              className={({ isActive }) =>
                                `d-flex align-items-center gap-2 text-white text-decoration-none p-2 rounded ${
                                  step.completed ? "bg-success" : isActive ? "bg-orange" : "hover-bg-dark"
                                }`
                              }
                              onClick={handleStepClick}
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
                              <span>{step.title}</span>
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CourseStructure;