// components/StepContent.jsx
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";

function StepContent({ blocks }) {
  const { stepId } = useParams();

  const step = blocks
    ?.flatMap((block) => block.topics)
    .flatMap((topic) => topic.steps)
    .find((s) => s.id === parseInt(stepId));

  if (!step) {
    return <div className="text-white">Шаг не найден</div>;
  }

  return (
    <div className="step-content p-4 dark-gray rounded mb-3">
      <h3 className="text-white">{step.title}</h3>
      <div className="text-white">
        <ReactMarkdown>{step.content}</ReactMarkdown>
      </div>
      <p className="text-muted">Тип: {step.type}</p>
    </div>
  );
}

export default StepContent;