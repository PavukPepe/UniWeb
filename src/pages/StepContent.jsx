import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";

function StepContent({ blocks }) {
    const { courseId, stepId } = useParams();
    const navigate = useNavigate();

    const step = blocks
        ?.flatMap((block) => block.topics)
        .flatMap((topic) => topic.steps)
        .find((s) => s.id === parseInt(stepId));

    // Находим следующий шаг
    const allSteps = blocks
        ?.flatMap((block) => block.topics)
        .flatMap((topic) => topic.steps) || [];
    const currentStepIndex = allSteps.findIndex((s) => s.id === parseInt(stepId));
    const nextStep = currentStepIndex >= 0 && currentStepIndex < allSteps.length - 1
        ? allSteps[currentStepIndex + 1]
        : null;

        const prevStep = currentStepIndex >= 0 && currentStepIndex < allSteps.length - 1
        ? allSteps[currentStepIndex + 1]
        : null;
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
            }
        } catch (error) {
            console.error("Ошибка:", error.message);
        }
    };

    const Back = async () => {
            if (nextStep) {
                navigate(`/courses/${courseId}/step/${nextStep.id}`);
            } else {
                console.log("Это последний шаг курса");
            }
    };


    return (
        <div className="step-content p-4 dark-gray rounded">
            <h3 className="text-white">{step.title}</h3>
            <div className="text-white">
                <ReactMarkdown>{step.content}</ReactMarkdown>
            </div>
            <p className="text-muted">Тип: {step.type}</p>

            <div className="d-flex justify-content-between">
                <button className="btn btn-outline-light mb-3 col-2" onClick={() => navigate('/home')}>Назад</button>
                <button className="btn btn-outline-light mb-3 col-2" onClick={handleCompleteStep}>Вперед</button>
            </div>
        </div>
    );
}

export default StepContent;