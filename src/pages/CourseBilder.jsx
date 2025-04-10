"use client"

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import MainNav from "../сomponents/MainNav.jsx";
import Modal from "react-bootstrap/Modal"; // Импортируем Modal из react-bootstrap
import ReactMarkdown from "react-markdown"; // Импортируем ReactMarkdown для рендеринга Markdown
import TextareaAutosize from "react-textarea-autosize"; // Для автоматического изменения размера textarea
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";
import "./CourseBilder.css"

function CourseBuilder() {
  const { id } = useParams();
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [categoryName, setCourseCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [editingStep, setEditingStep] = useState(null); // Отдельное состояние для редактирования шага
  const [expandedTopics, setExpandedTopics] = useState({});
  const [loading, setLoading] = useState(false);

  // Генерация уникальных ID
  const generateId = () => `id_${Math.random().toString(36).substr(2, 9)}`;

  // Загрузка категорий с API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5252/api/categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Ошибка при загрузке категорий:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Загрузка курса, если есть id
  useEffect(() => {
    if (id) {
      const fetchCourse = async () => {
        try {
          setLoading(true);
          const response = await fetch(`http://localhost:5252/api/courses/${id}`);
          if (!response.ok) throw new Error("Ошибка загрузки курса");
          const data = await response.json();

          setCourseTitle(data.title);
          setCourseDescription(data.description);
          setCourseCategory(data.categoryId || "");
          setBlocks(
            data.blocks.map((block, blockIndex) => ({
              id: block.id || generateId(),
              title: block.title,
              topics: block.topics.map((topic, topicIndex) => ({
                id: topic.id || generateId(),
                title: topic.title,
                steps: topic.steps.map((step, stepIndex) => ({
                  id: step.id || generateId(),
                  title: step.title,
                  content: step.content || "",
                })),
              })),
            }))
          );
        } catch (error) {
          console.error("Ошибка при загрузке курса:", error);
          alert("Не удалось загрузить курс");
        } finally {
          setLoading(false);
        }
      };
      fetchCourse();
    }
  }, [id]);

  // Добавление нового блока
  const addBlock = () => {
    const newBlock = {
      id: generateId(),
      title: `Новый блок ${blocks.length + 1}`,
      topics: [],
    };
    setBlocks([...blocks, newBlock]);
  };

  // Добавление новой темы в блок
  const addTopic = (blockId) => {
    setBlocks(
      blocks.map((block) => {
        if (block.id === blockId) {
          return {
            ...block,
            topics: [
              ...block.topics,
              {
                id: generateId(),
                title: `Новая тема ${block.topics.length + 1}`,
                steps: [],
              },
            ],
          };
        }
        return block;
      })
    );
  };

  // Добавление нового шага в тему
  const addStep = (blockId, topicId) => {
    setBlocks(
      blocks.map((block) => {
        if (block.id === blockId) {
          return {
            ...block,
            topics: block.topics.map((topic) => {
              if (topic.id === topicId) {
                return {
                  ...topic,
                  steps: [
                    ...topic.steps,
                    {
                      id: generateId(),
                      title: `Новый шаг ${topic.steps.length + 1}`,
                      content: "",
                    },
                  ],
                };
              }
              return topic;
            }),
          };
        }
        return block;
      })
    );
  };

  // Удаление блока
  const deleteBlock = (blockId) => {
    setBlocks(blocks.filter((block) => block.id !== blockId));
  };

  // Удаление темы
  const deleteTopic = (blockId, topicId) => {
    setBlocks(
      blocks.map((block) => {
        if (block.id === blockId) {
          return {
            ...block,
            topics: block.topics.filter((topic) => topic.id !== topicId),
          };
        }
        return block;
      })
    );
  };

  // Удаление шага
  const deleteStep = (blockId, topicId, stepId) => {
    setBlocks(
      blocks.map((block) => {
        if (block.id === blockId) {
          return {
            ...block,
            topics: block.topics.map((topic) => {
              if (topic.id === topicId) {
                return {
                  ...topic,
                  steps: topic.steps.filter((step) => step.id !== stepId),
                };
              }
              return topic;
            }),
          };
        }
        return block;
      })
    );
  };

  // Редактирование заголовка блока
  const startEditingBlock = (block) => {
    setEditingItem({
      type: "block",
      id: block.id,
      title: block.title,
    });
  };

  // Редактирование заголовка темы
  const startEditingTopic = (blockId, topic) => {
    setEditingItem({
      type: "topic",
      id: topic.id,
      title: topic.title,
      content: blockId,
    });
  };

  // Редактирование шага (открываем большое окно)
  const startEditingStep = (blockId, topicId, step) => {
    setEditingStep({
      blockId,
      topicId,
      id: step.id,
      title: step.title,
      content: step.content || "",
    });
  };

  // Сохранение изменений в редактируемом элементе (для блоков и тем)
  const saveChanges = () => {
    if (!editingItem) return;

    if (editingItem.type === "block") {
      setBlocks(blocks.map((block) => (block.id === editingItem.id ? { ...block, title: editingItem.title } : block)));
    } else if (editingItem.type === "topic") {
      setBlocks(
        blocks.map((block) => ({
          ...block,
          topics: block.topics.map((topic) =>
            topic.id === editingItem.id ? { ...topic, title: editingItem.title } : topic
          ),
        }))
      );
    }
    setEditingItem(null);
  };

  // Сохранение изменений в шаге
  const saveStepChanges = () => {
    if (!editingStep) return;

    setBlocks(
      blocks.map((block) => {
        if (block.id === editingStep.blockId) {
          return {
            ...block,
            topics: block.topics.map((topic) => {
              if (topic.id === editingStep.topicId) {
                return {
                  ...topic,
                  steps: topic.steps.map((step) =>
                    step.id === editingStep.id
                      ? { ...step, title: editingStep.title, content: editingStep.content }
                      : step
                  ),
                };
              }
              return topic;
            }),
          };
        }
        return block;
      })
    );
    setEditingStep(null);
  };

  // Переключение состояния аккордеона
  const toggleTopic = (topicId) => {
    setExpandedTopics({
      ...expandedTopics,
      [topicId]: !expandedTopics[topicId],
    });
  };

  // Обработка перетаскивания
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination, type } = result;

    if (type === "block") {
      const reorderedBlocks = [...blocks];
      const [removed] = reorderedBlocks.splice(source.index, 1);
      reorderedBlocks.splice(destination.index, 0, removed);
      setBlocks(reorderedBlocks);
      return;
    }

    if (type === "topic") {
      const blockId = source.droppableId;
      const block = blocks.find((b) => b.id === blockId);
      if (!block) return;

      const reorderedTopics = [...block.topics];
      const [removed] = reorderedTopics.splice(source.index, 1);
      reorderedTopics.splice(destination.index, 0, removed);

      setBlocks(blocks.map((b) => (b.id === blockId ? { ...b, topics: reorderedTopics } : b)));
      return;
    }

    if (type === "step") {
      const [blockId, topicId] = source.droppableId.split("|");
      const block = blocks.find((b) => b.id === blockId);
      if (!block) return;

      const topic = block.topics.find((t) => t.id === topicId);
      if (!topic) return;

      if (source.droppableId === destination.droppableId) {
        const reorderedSteps = [...topic.steps];
        const [removed] = reorderedSteps.splice(source.index, 1);
        reorderedSteps.splice(destination.index, 0, removed);

        setBlocks(
          blocks.map((b) =>
            b.id === blockId
              ? {
                ...b,
                topics: b.topics.map((t) => (t.id === topicId ? { ...t, steps: reorderedSteps } : t)),
              }
              : b
          )
        );
      } else {
        const [destBlockId, destTopicId] = destination.droppableId.split("|");
        const destBlock = blocks.find((b) => b.id === destBlockId);
        if (!destBlock) return;

        const destTopic = destBlock.topics.find((t) => t.id === destTopicId);
        if (!destTopic) return;

        const step = topic.steps[source.index];
        const sourceTopicSteps = [...topic.steps];
        sourceTopicSteps.splice(source.index, 1);
        const destTopicSteps = [...destTopic.steps];
        destTopicSteps.splice(destination.index, 0, step);

        setBlocks(
          blocks.map((b) => {
            if (b.id === blockId) {
              return {
                ...b,
                topics: b.topics.map((t) => (t.id === topicId ? { ...t, steps: sourceTopicSteps } : t)),
              };
            }
            if (b.id === destBlockId) {
              return {
                ...b,
                topics: b.topics.map((t) => (t.id === destTopicId ? { ...t, steps: destTopicSteps } : t)),
              };
            }
            return b;
          })
        );
      }
    }
  };

  // Сохранение курса через API
  const saveCourse = async () => {
    if (!courseTitle || !courseDescription || !categoryName) {
      alert("Пожалуйста, заполните все обязательные поля: название, описание и категорию.");
      return;
    }

    const courseData = {
      title: courseTitle,
      description: courseDescription,
      userId: localStorage.getItem("userId"),
      categoryId: parseInt(categoryName, 10),
      blocks: blocks.map((block, blockIndex) => ({
        title: block.title,
        order: blockIndex + 1,
        topics: block.topics.map((topic, topicIndex) => ({
          title: topic.title,
          order: topicIndex + 1,
          steps: topic.steps.map((step, stepIndex) => ({
            title: step.title,
            content: step.content,
            order: stepIndex + 1,
            type: "text",
          })),
        })),
      })),
    };

    try {
      setLoading(true);
      const method = id ? "PUT" : "POST";
      const url = id ? `http://localhost:5252/api/courses/${id}` : "http://localhost:5252/api/courses";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(courseData),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || "Ошибка при сохранении курса");
      }

      const result = await response.json();
      alert(id ? "Курс успешно обновлён!" : "Курс успешно сохранён!");
      console.log(result);
    } catch (error) {
      console.error("Ошибка при сохранении курса:", error);
      alert(`Произошла ошибка: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex min-vh-100 bg-dark">
      <MainNav />
      <main className="flex-grow-1 p-4">
        <div className="d-flex flex-column min-vh-100 bg-dark text-light">
          <header className="p-3">
            <button className="btn btn-outline-light btn-sm d-flex align-items-center">
              Назад к курсам
            </button>
          </header>

          <div className="d-flex flex-column flex-grow-1">
            <main className="flex-grow-1 p-4">
              <div className="row g-4">
                <div className="col-md-8">
                  <textarea
                    placeholder="Введите описание курса..."
                    className="form-control bg-dark text-light border-secondary"
                    style={{ minHeight: "600px" }}
                    value={courseDescription}
                    onChange={(e) => setCourseDescription(e.target.value)}
                  ></textarea>
                </div>

                <div className="col-md-4">
                  <div className="mb-3">
                    <input
                      type="text"
                      placeholder="Введите название курса..."
                      className="form-control bg-dark text-light border-secondary"
                      value={courseTitle}
                      onChange={(e) => setCourseTitle(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <select
                      className="form-select bg-dark text-light border-secondary"
                      value={categoryName}
                      onChange={(e) => setCourseCategory(e.target.value)}
                    >
                      <option value="">Выберите категорию...</option>
                      {categories.map((category) => (
                        <option key={category.categoryId} value={category.categoryId}>
                          {category.categoryName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <input
                      type="file"
                      className="form-control bg-dark text-light border-secondary"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h2 className="fs-4 fw-semibold">Модули курса</h2>
                  <button onClick={addBlock} className="btn btn-outline-light btn-sm d-flex align-items-center">
                    <i className="bi bi-plus me-2"></i>
                    Добавить блок
                  </button>
                </div>

                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="blocks" type="block">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="d-flex flex-column gap-3">
                        {blocks.map((block, blockIndex) => (
                          <Draggable key={block.id} draggableId={block.id} index={blockIndex}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className="border border-secondary rounded overflow-hidden"
                              >
                                <div className="bg-secondary bg-opacity-25 p-3 d-flex align-items-center">
                                  <div {...provided.dragHandleProps} className="me-2">
                                    <i className="bi bi-grip-vertical text-secondary"></i>
                                  </div>
                                  <h3 className="fw-medium flex-grow-1 mb-0">{block.title}</h3>
                                  <div className="d-flex gap-2">
                                    <button className="btn btn-dark btn-sm" onClick={() => startEditingBlock(block)}>
                                      <i className="bi bi-pencil"></i>
                                    </button>
                                    <button className="btn btn-dark btn-sm" onClick={() => addTopic(block.id)}>
                                      <i className="bi bi-plus"></i>
                                    </button>
                                    <button className="btn btn-dark btn-sm" onClick={() => deleteBlock(block.id)}>
                                      <i className="bi bi-trash text-danger"></i>
                                    </button>
                                  </div>
                                </div>

                                <Droppable droppableId={block.id} type="topic">
                                  {(provided) => (
                                    <div ref={provided.innerRef} {...provided.droppableProps} className="p-3 bg-dark">
                                      <div className="accordion">
                                        {block.topics.map((topic, topicIndex) => (
                                          <Draggable key={topic.id} draggableId={topic.id} index={topicIndex}>
                                            {(provided) => (
                                              <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                className="accordion-item bg-dark text-light border border-secondary rounded mb-2"
                                              >
                                                <h2 className="accordion-header">
                                                  <button
                                                    className={`accordion-button ${!expandedTopics[topic.id] ? "collapsed" : ""
                                                      } bg-secondary bg-opacity-50 text-light`}
                                                    type="button"
                                                    onClick={() => toggleTopic(topic.id)}
                                                  >
                                                    <div className="d-flex align-items-center flex-grow-1">
                                                      <div {...provided.dragHandleProps} className="me-2">
                                                        <i className="bi bi-grip-vertical text-light"></i>
                                                      </div>
                                                      <span>{topic.title}</span>
                                                    </div>
                                                  </button>
                                                </h2>
                                                <div
                                                  className={`accordion-collapse collapse ${expandedTopics[topic.id] ? "show" : ""
                                                    }`}
                                                >
                                                  <div className="accordion-body">
                                                    <div className="d-flex justify-content-end gap-2 mb-3">
                                                      <button
                                                        className="btn btn-outline-secondary btn-sm"
                                                        onClick={() => startEditingTopic(block.id, topic)}
                                                      >
                                                        <i className="bi bi-pencil me-1"></i>
                                                        Редактировать
                                                      </button>
                                                      <button
                                                        className="btn btn-outline-secondary btn-sm"
                                                        onClick={() => addStep(block.id, topic.id)}
                                                      >
                                                        <i className="bi bi-plus me-1"></i>
                                                        Добавить шаг
                                                      </button>
                                                      <button
                                                        className="btn btn-outline-secondary btn-sm"
                                                        onClick={() => deleteTopic(block.id, topic.id)}
                                                      >
                                                        <i className="bi bi-trash me-1 text-danger"></i>
                                                        Удалить
                                                      </button>
                                                    </div>

                                                    <Droppable droppableId={`${block.id}|${topic.id}`} type="step">
                                                      {(provided) => (
                                                        <div
                                                          ref={provided.innerRef}
                                                          {...provided.droppableProps}
                                                          className="d-flex flex-column gap-2"
                                                        >
                                                          {topic.steps.map((step, stepIndex) => (
                                                            <Draggable
                                                              key={step.id}
                                                              draggableId={step.id}
                                                              index={stepIndex}
                                                            >
                                                              {(provided) => (
                                                                <div
                                                                  ref={provided.innerRef}
                                                                  {...provided.draggableProps}
                                                                  {...provided.dragHandleProps}
                                                                  className="border border-secondary rounded p-2 bg-secondary bg-opacity-25 d-flex align-items-center"
                                                                >
                                                                  <i className="bi bi-grip-vertical text-secondary me-2"></i>
                                                                  <span className="flex-grow-1">{step.title}</span>
                                                                  <div className="d-flex gap-1">
                                                                    <button
                                                                      className="btn btn-dark btn-sm"
                                                                      onClick={() =>
                                                                        startEditingStep(block.id, topic.id, step)
                                                                      }
                                                                    >
                                                                      <i className="bi bi-pencil"></i>
                                                                    </button>
                                                                    <button
                                                                      className="btn btn-dark btn-sm"
                                                                      onClick={() =>
                                                                        deleteStep(block.id, topic.id, step.id)
                                                                      }
                                                                    >
                                                                      <i className="bi bi-trash text-danger"></i>
                                                                    </button>
                                                                  </div>
                                                                </div>
                                                              )}
                                                            </Draggable>
                                                          ))}
                                                          {provided.placeholder}
                                                          {topic.steps.length === 0 && (
                                                            <div className="text-center p-3 text-secondary fst-italic">
                                                              Нет шагов. Нажмите "Добавить шаг" для создания.
                                                            </div>
                                                          )}
                                                        </div>
                                                      )}
                                                    </Droppable>
                                                  </div>
                                                </div>
                                              </div>
                                            )}
                                          </Draggable>
                                        ))}
                                      </div>
                                      {provided.placeholder}
                                      {block.topics.length === 0 && (
                                        <div className="text-center p-3 text-secondary fst-italic">
                                          Нет тем. Нажмите "+" для добавления темы.
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </Droppable>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>

                {blocks.length === 0 && (
                  <div className="text-center p-5 border border-secondary border-dashed rounded">
                    <p className="text-secondary mb-3">У вас пока нет блоков курса</p>
                    <button onClick={addBlock} className="btn btn-outline-light">
                      <i className="bi bi-plus me-2"></i>
                      Добавить первый блок
                    </button>
                  </div>
                )}
              </div>

              {/* Кнопка сохранения курса */}
              <div className="mt-4">
                <button onClick={saveCourse} className="btn btn-primary" disabled={loading}>
                  {loading ? "Сохранение..." : id ? "Обновить курс" : "Сохранить курс"}
                </button>
              </div>
            </main>
          </div>

          {/* Модальное окно для редактирования блоков и тем */}
          {editingItem && (
            <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content bg-dark text-light border-secondary">
                  <div className="modal-header border-secondary">
                    <h5 className="modal-title">
                      {editingItem.type === "block" ? "Редактирование блока" : "Редактирование темы"}
                    </h5>
                    <button
                      type="button"
                      className="btn-close btn-close-white"
                      onClick={() => setEditingItem(null)}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Название</label>
                      <input
                        type="text"
                        className="form-control bg-dark text-light border-secondary"
                        value={editingItem.title}
                        onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="modal-footer border-secondary">
                    <button type="button" className="btn btn-secondary" onClick={() => setEditingItem(null)}>
                      Отмена
                    </button>
                    <button type="button" className="btn btn-primary" onClick={saveChanges}>
                      <i className="bi bi-save me-2"></i>
                      Сохранить
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Модальное окно для редактирования шага с поддержкой Markdown */}
          {editingStep && (
            <Modal
              show={true}
              onHide={() => setEditingStep(null)}
              dialogClassName="text-light w-100 m-0 p-5 vh-100 step-mark"
            >
              <Modal.Header closeButton className="bg-dark text-light border-secondary">
                <Modal.Title>Редактирование шага</Modal.Title>
              </Modal.Header>
              <Modal.Body className="bg-dark text-light">
                <div className="mb-3">
                  <label className="form-label">Название шага</label>
                  <input
                    type="text"
                    className="form-control bg-dark text-light border-secondary"
                    value={editingStep.title}
                    onChange={(e) => setEditingStep({ ...editingStep, title: e.target.value })}
                  />
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Содержание (Markdown)</label>
                    <TextareaAutosize
                      className="form-control bg-dark text-light border-secondary"
                      minRows={10}
                      value={editingStep.content}
                      onChange={(e) => setEditingStep({ ...editingStep, content: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Предпросмотр</label>
                    <div
                      className="border border-secondary rounded p-3 bg-secondary bg-opacity-25"
                      style={{ minHeight: "200px", overflowY: "auto" }}
                    >
                      <ReactMarkdown
                        components={{
                          code({ node, inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || "");
                            return !inline && match ? (
                              <SyntaxHighlighter style={dark} language={match[1]} PreTag="div" {...props}>
                                {String(children).replace(/\n$/, "")}
                              </SyntaxHighlighter>
                            ) : (
                              <code className={className} {...props}>
                                {children}
                              </code>
                            );
                          },
                        }}
                      >
                        {editingStep.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer className="bg-dark border-secondary">
                <button className="btn btn-secondary" onClick={() => setEditingStep(null)}>
                  Отмена
                </button>
                <button className="btn btn-primary" onClick={saveStepChanges}>
                  <i className="bi bi-save me-2"></i>
                  Сохранить
                </button>
              </Modal.Footer>
            </Modal>
          )}
        </div>
      </main>
    </div>
  );
}

export default CourseBuilder;