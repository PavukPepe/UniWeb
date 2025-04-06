"use client"

import { useState } from "react"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import "bootstrap/dist/css/bootstrap.min.css"
import MainNav from "../сomponents/MainNav.jsx"
import "bootstrap-icons/font/bootstrap-icons.css"

function CourseBuilder() {
  const [courseDescription, setCourseDescription] = useState("")
  const [courseCategory, setCourseCategory] = useState("")
  const [blocks, setBlocks] = useState([])
  const [editingItem, setEditingItem] = useState(null)
  const [expandedTopics, setExpandedTopics] = useState({})

  // Генерация уникальных ID
  const generateId = () => `id_${Math.random().toString(36).substr(2, 9)}`

  // Добавление нового блока
  const addBlock = () => {
    const newBlock = {
      id: generateId(),
      title: `Новый блок ${blocks.length + 1}`,
      topics: [],
    }
    setBlocks([...blocks, newBlock])
  }

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
          }
        }
        return block
      }),
    )
  }

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
                }
              }
              return topic
            }),
          }
        }
        return block
      }),
    )
  }

  // Удаление блока
  const deleteBlock = (blockId) => {
    setBlocks(blocks.filter((block) => block.id !== blockId))
  }

  // Удаление темы
  const deleteTopic = (blockId, topicId) => {
    setBlocks(
      blocks.map((block) => {
        if (block.id === blockId) {
          return {
            ...block,
            topics: block.topics.filter((topic) => topic.id !== topicId),
          }
        }
        return block
      }),
    )
  }

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
                }
              }
              return topic
            }),
          }
        }
        return block
      }),
    )
  }

  // Редактирование заголовка блока
  const startEditingBlock = (block) => {
    setEditingItem({
      type: "block",
      id: block.id,
      title: block.title,
    })
  }

  // Редактирование заголовка темы
  const startEditingTopic = (blockId, topic) => {
    setEditingItem({
      type: "topic",
      id: topic.id,
      title: topic.title,
      content: blockId,
    })
  }

  // Редактирование шага
  const startEditingStep = (blockId, topicId, step) => {
    setEditingItem({
      type: "step",
      id: step.id,
      title: step.title,
      content: `${blockId}|${topicId}|${step.content}`,
    })
  }

  // Сохранение изменений
  const saveChanges = () => {
    if (!editingItem) return

    if (editingItem.type === "block") {
      setBlocks(blocks.map((block) => (block.id === editingItem.id ? { ...block, title: editingItem.title } : block)))
    } else if (editingItem.type === "topic") {
      setBlocks(
        blocks.map((block) => ({
          ...block,
          topics: block.topics.map((topic) =>
            topic.id === editingItem.id ? { ...topic, title: editingItem.title } : topic,
          ),
        })),
      )
    } else if (editingItem.type === "step") {
      const [blockId, topicId, oldContent] = (editingItem.content || "").split("|")

      setBlocks(
        blocks.map((block) => {
          if (block.id === blockId) {
            return {
              ...block,
              topics: block.topics.map((topic) => {
                if (topic.id === topicId) {
                  return {
                    ...topic,
                    steps: topic.steps.map((step) =>
                      step.id === editingItem.id
                        ? { ...step, title: editingItem.title, content: editingItem.content?.split("|")[2] || "" }
                        : step,
                    ),
                  }
                }
                return topic
              }),
            }
          }
          return block
        }),
      )
    }

    setEditingItem(null)
  }

  // Переключение состояния аккордеона
  const toggleTopic = (topicId) => {
    setExpandedTopics({
      ...expandedTopics,
      [topicId]: !expandedTopics[topicId],
    })
  }

  // Обработка перетаскивания
  const handleDragEnd = (result) => {
    if (!result.destination) return

    const { source, destination, type } = result

    // Перетаскивание блоков
    if (type === "block") {
      const reorderedBlocks = [...blocks]
      const [removed] = reorderedBlocks.splice(source.index, 1)
      reorderedBlocks.splice(destination.index, 0, removed)
      setBlocks(reorderedBlocks)
      return
    }

    // Перетаскивание тем
    if (type === "topic") {
      const blockId = source.droppableId
      const block = blocks.find((b) => b.id === blockId)
      if (!block) return

      const reorderedTopics = [...block.topics]
      const [removed] = reorderedTopics.splice(source.index, 1)
      reorderedTopics.splice(destination.index, 0, removed)

      setBlocks(blocks.map((b) => (b.id === blockId ? { ...b, topics: reorderedTopics } : b)))
      return
    }

    // Перетаскивание шагов
    if (type === "step") {
      const [blockId, topicId] = source.droppableId.split("|")
      const block = blocks.find((b) => b.id === blockId)
      if (!block) return

      const topic = block.topics.find((t) => t.id === topicId)
      if (!topic) return

      // Если перетаскивание в пределах одной темы
      if (source.droppableId === destination.droppableId) {
        const reorderedSteps = [...topic.steps]
        const [removed] = reorderedSteps.splice(source.index, 1)
        reorderedSteps.splice(destination.index, 0, removed)

        setBlocks(
          blocks.map((b) =>
            b.id === blockId
              ? {
                  ...b,
                  topics: b.topics.map((t) => (t.id === topicId ? { ...t, steps: reorderedSteps } : t)),
                }
              : b,
          ),
        )
      } else {
        // Перетаскивание между разными темами
        const [destBlockId, destTopicId] = destination.droppableId.split("|")
        const destBlock = blocks.find((b) => b.id === destBlockId)
        if (!destBlock) return

        const destTopic = destBlock.topics.find((t) => t.id === destTopicId)
        if (!destTopic) return

        const step = topic.steps[source.index]

        // Удаляем из исходной темы
        const sourceTopicSteps = [...topic.steps]
        sourceTopicSteps.splice(source.index, 1)

        // Добавляем в целевую тему
        const destTopicSteps = [...destTopic.steps]
        destTopicSteps.splice(destination.index, 0, step)

        setBlocks(
          blocks.map((b) => {
            if (b.id === blockId) {
              return {
                ...b,
                topics: b.topics.map((t) => (t.id === topicId ? { ...t, steps: sourceTopicSteps } : t)),
              }
            }
            if (b.id === destBlockId) {
              return {
                ...b,
                topics: b.topics.map((t) => (t.id === destTopicId ? { ...t, steps: destTopicSteps } : t)),
              }
            }
            return b
          }),
        )
      }
    }
  }

  return (
    <div className="d-flex min-vh-100 bg-dark">
    <MainNav />
    <main className="flex-grow-1 p-4">
    <div className="d-flex flex-column min-vh-100 bg-dark text-light">
      {/* Верхняя панель */}
      <header className="p-3">
        <button className="btn btn-outline-light btn-sm d-flex align-items-center">
          Назад к курсам
        </button>
      </header>

      <div className="d-flex flex-column flex-grow-1">
        {/* Основное содержимое */}
        <main className="flex-grow-1 p-4">
          <div className="row g-4">
            {/* Левая колонка - описание курса */}
            <div className="col-md-8">
              <textarea
                placeholder="Введите описание курса..."
                className="form-control bg-dark text-light border-secondary"
                style={{ minHeight: "600px" }}
                value={courseDescription}
                onChange={(e) => setCourseDescription(e.target.value)}
              ></textarea>
            </div>

            {/* Правая колонка - категория курса */}
            <div className="col-md-4">
            <div className="mb-3">
                <input
                  type="file"
                  placeholder="Введите название курса..."
                  className="form-control bg-dark text-light border-secondary"
                  value={courseCategory}
                  onChange={(e) => setCourseCategory(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  placeholder="Введите название курса..."
                  className="form-control bg-dark text-light border-secondary"
                  value={courseCategory}
                  onChange={(e) => setCourseCategory(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  placeholder="Введите категорию курса..."
                  className="form-control bg-dark text-light border-secondary"
                  value={courseCategory}
                  onChange={(e) => setCourseCategory(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Модули курса */}
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
                                                className={`accordion-button ${!expandedTopics[topic.id] ? "collapsed" : ""} bg-secondary bg-opacity-50 text-light`}
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
                                              className={`accordion-collapse collapse ${expandedTopics[topic.id] ? "show" : ""}`}
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
        </main>
      </div>

      {/* Модальное окно редактирования */}
      {editingItem && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark text-light border-secondary">
              <div className="modal-header border-secondary">
                <h5 className="modal-title">
                  {editingItem.type === "block"
                    ? "Редактирование блока"
                    : editingItem.type === "topic"
                      ? "Редактирование темы"
                      : "Редактирование шага"}
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

                {editingItem.type === "step" && (
                  <div className="mb-3">
                    <label className="form-label">Содержание</label>
                    <textarea
                      className="form-control bg-dark text-light border-secondary"
                      rows="5"
                      value={editingItem.content?.split("|")[2] || ""}
                      onChange={(e) => {
                        const parts = editingItem.content?.split("|") || []
                        parts[2] = e.target.value
                        setEditingItem({ ...editingItem, content: parts.join("|") })
                      }}
                    ></textarea>
                  </div>
                )}
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
    </div>
    </main>
  </div>

  )
}

export default CourseBuilder

