import { useState, useEffect } from "react";

function CommentsTable() {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://193.37.71.67:8000/api/Reviews', { // Или /api/users/comments, если в UsersController
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error(`Ошибка при загрузке комментариев: ${response.statusText}`);
      const data = await response.json();
      setComments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (window.confirm("Вы уверены, что хотите удалить этот комментарий?")) {
      try {
        const response = await fetch(`http://193.37.71.67:8000/api/Reviews/${reviewId}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) throw new Error('Не удалось удалить комментарий');
        fetchComments();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="table-responsive">
      {error ? (
        <div className="text-danger text-center py-5">{error}</div>
      ) : isLoading ? (
        <div className="text-dark text-center py-5">Загрузка...</div>
      ) : comments.length === 0 ? (
        <div className="text-dark text-center py-5">Комментарии не найдены</div>
      ) : (
        <table className="table table-striped table-hover">
          <thead className="thead-dark bg-dark text-white">
            <tr>
              <th>ID</th>
              <th>Текст</th>
              <th>Рейтинг</th>
              <th>Пользователь</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {comments.map((comment) => (
              <tr key={comment.reviewId}>
                <td>{comment.reviewId}</td>
                <td>{comment.reviewText || "Без текста"}</td>
                <td>{comment.userRating || "Без рейтинга"}</td>
                <td>{new Date(comment.submissionDate).toLocaleDateString()}</td>
                <td>
                  <button 
                    className="btn btn-sm btn-danger" 
                    onClick={() => handleDelete(comment.reviewId)}
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default CommentsTable;