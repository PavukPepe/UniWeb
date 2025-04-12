import { useState, useEffect } from "react";

function CategoriesTable() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCategoryId, setEditingCategoryId] = useState(null); // Для отслеживания редактируемой категории
  const [editFormData, setEditFormData] = useState({ categoryName: "" }); // Данные формы редактирования
  const [newCategoryName, setNewCategoryName] = useState(""); // Для создания новой категории
  const [showCreateForm, setShowCreateForm] = useState(false); // Показывать/скрывать форму создания

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:5252/api/categories", {
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error(`Ошибка при загрузке категорий: ${response.statusText}`);
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (category) => {
    setEditingCategoryId(category.categoryId);
    setEditFormData({ categoryName: category.categoryName });
  };

  const handleSaveEdit = async (categoryId) => {
    try {
      const updatedCategory = {
        categoryId,
        categoryName: editFormData.categoryName,
      };

      const response = await fetch(`http://localhost:5252/api/categories/${categoryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedCategory),
      });

      if (!response.ok) throw new Error("Не удалось обновить категорию");

      // Обновляем локальное состояние
      setCategories(categories.map((cat) =>
        cat.categoryId === categoryId ? { ...cat, categoryName: editFormData.categoryName } : cat
      ));
      setEditingCategoryId(null); // Выходим из режима редактирования
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancelEdit = () => {
    setEditingCategoryId(null);
    setEditFormData({ categoryName: "" });
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm("Вы уверены, что хотите удалить эту категорию?")) {
      try {
        const response = await fetch(`http://localhost:5252/api/categories/${categoryId}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error("Не удалось удалить категорию");

        // Обновляем локальное состояние, удаляя категорию
        setCategories(categories.filter((cat) => cat.categoryId !== categoryId));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleInputChange = (e) => {
    setEditFormData({ ...editFormData, categoryName: e.target.value });
  };

  const handleCreateInputChange = (e) => {
    setNewCategoryName(e.target.value);
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      setError("Название категории не может быть пустым");
      return;
    }

    try {
      const newCategory = {
        categoryName: newCategoryName,
      };

      const response = await fetch("http://localhost:5252/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCategory),
      });

      if (!response.ok) throw new Error("Не удалось создать категорию");

      const createdCategory = await response.json();
      setCategories([...categories, createdCategory]);
      setNewCategoryName("");
      setShowCreateForm(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancelCreate = () => {
    setNewCategoryName("");
    setShowCreateForm(false);
  };

  return (
    <div className="table-responsive">
      <div className="mb-3">
        <button
          className="btn btn-primary mb-2"
          onClick={() => setShowCreateForm(true)}
          disabled={showCreateForm}
        >
          Создать категорию
        </button>
        {showCreateForm && (
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Название новой категории"
              value={newCategoryName}
              onChange={handleCreateInputChange}
              autoFocus
            />
            <button
              className="btn btn-success"
              onClick={handleCreateCategory}
              disabled={!newCategoryName.trim()}
            >
              Добавить
            </button>
            <button
              className="btn btn-secondary"
              onClick={handleCancelCreate}
            >
              Отмена
            </button>
          </div>
        )}
      </div>

      {error ? (
        <div className="text-danger text-center py-5">{error}</div>
      ) : isLoading ? (
        <div className="text-dark text-center py-5">Загрузка...</div>
      ) : categories.length === 0 ? (
        <div className="text-dark text-center py-5">Категории не найдены</div>
      ) : (
        <table className="table table-striped table-hover">
          <thead className="thead-dark bg-dark text-white">
            <tr>
              <th>ID</th>
              <th>Название</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.categoryId}>
                <td>{category.categoryId}</td>
                <td>
                  {editingCategoryId === category.categoryId ? (
                    <input
                      type="text"
                      className="form-control"
                      value={editFormData.categoryName}
                      onChange={handleInputChange}
                      autoFocus
                    />
                  ) : (
                    category.categoryName
                  )}
                </td>
                <td>
                  {editingCategoryId === category.categoryId ? (
                    <>
                      <button
                        className="btn btn-sm btn-success me-2"
                        onClick={() => handleSaveEdit(category.categoryId)}
                        disabled={!editFormData.categoryName.trim()}
                      >
                        Сохранить
                      </button>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={handleCancelEdit}
                      >
                        Отмена
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn btn-sm btn-primary me-2"
                        onClick={() => handleEdit(category)}
                      >
                        Редактировать
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(category.categoryId)}
                      >
                        Удалить
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default CategoriesTable;