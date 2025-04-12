import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";

function StepContent({ blocks }) {
  const { courseId, stepId } = useParams();
  const navigate = useNavigate();

  const step = blocks
    ?.flatMap((block) => block.topics)
    .flatMap((topic) => topic.steps)
    .find((s) => s.id === parseInt(stepId));

  // Находим предыдущий и следующий шаг
  const allSteps = blocks
    ?.flatMap((block) => block.topics)
    .flatMap((topic) => topic.steps) || [];
  const currentStepIndex = allSteps.findIndex((s) => s.id === parseInt(stepId));
  const nextStep =
    currentStepIndex >= 0 && currentStepIndex < allSteps.length - 1
      ? allSteps[currentStepIndex + 1]
      : null;
  const prevStep =
    currentStepIndex > 0 ? allSteps[currentStepIndex - 1] : null;

  if (!step) {
    return <div className="text-white">Шаг не найден</div>;
  }

  const handleCompleteStep = async () => {
    const userId = localStorage.getItem("userId"); // Получаем userId из LocalStorage
    if (!userId) {
      console.error("User ID not found in LocalStorage");
      return;
    }

    try {
      const response = await fetch("http://localhost:5252/api/Userprogresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: parseInt(userId),
          stepId: step.id,
          isCompleted: true,
          completionDate: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Ошибка сохранения прогресса");
      }

      // Переход к следующему шагу, если он есть
      if (nextStep) {
        navigate(`/courses/${courseId}/step/${nextStep.id}`);
      } else {
        console.log("Это последний шаг курса");
        navigate(`/courses/${courseId}`); // Возвращаемся к курсу, если шаг последний
      }
    } catch (error) {
      console.error("Ошибка:", error.message);
    }
  };

  const handleGoBack = () => {
    if (prevStep) {
      navigate(`/courses/${courseId}/step/${prevStep.id}`);
    } else {
      navigate(`/courses/${courseId}`); // Возвращаемся к курсу, если нет предыдущего шага
    }
  };

  return (
    <div className="step-content p-4 dark-gray rounded">
      <h3 className="text-white">{step.title}</h3>
      <div className="text-white">
        {step.type === "text" ? (
          <ReactMarkdown>{step.content}</ReactMarkdown>
        ) : step.type === "video" ? (
<div className="d-flex justify-content-center mb-3">
              <video
                controls
                width="100%"
                style={{ maxWidth: "800px" }}
                className="rounded"
              >
                <source src={step.content}/>
                Ваш браузер не поддерживает воспроизведение видео.
              </video>
</div>
        ) : (
          <p className="text-muted">Неизвестный тип шага</p>
        )}
      </div>

      <div className="d-flex justify-content-between m-0">
        <button
          className="btn btn-outline-light  col-2"
          onClick={handleGoBack}
        >
          Назад
        </button>
        <button
          className="btn btn-outline-light col-2 m-0"
          onClick={handleCompleteStep}
        >
          Вперед
        </button>
      </div>
    </div>
  );
}

export default StepContent;