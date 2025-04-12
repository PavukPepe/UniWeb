import { useState, useEffect } from "react";

function UsersTable() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5252/api/users', {
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error(`Ошибка при загрузке пользователей: ${response.statusText}`);
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleBlock = async (user) => {
    const updatedUser = { ...user, isBlocked: !user.isBlocked };
    try {
      const response = await fetch(`http://localhost:5252/api/users/${user.userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) throw new Error(`Не удалось ${updatedUser.IsBlocked ? 'забанить' : 'разбанить'} пользователя`);
      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="table-responsive">
      {error ? (
        <div className="text-danger text-center py-5">{error}</div>
      ) : isLoading ? (
        <div className="text-dark text-center py-5">Загрузка...</div>
      ) : users.length === 0 ? (
        <div className="text-dark text-center py-5">Пользователи не найдены</div>
      ) : (
        <table className="table table-striped table-hover">
          <thead className="thead-dark bg-dark text-white">
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Полное имя</th>
              <th>Дата регистрации</th>
              <th>Заблокирован</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.userId} className="">
                <td>{user.userId}</td>
                <td>{user.email}</td>
                <td>{user.fullName}</td>
                <td>{new Date(user.registrationDate).toLocaleDateString()}</td>
                <td>{user.isBlocked ? 'Да' : 'Нет'}</td>
                <td>
                  <button 
                    className={`btn btn-sm ${user.isBlocked ? 'btn-success' : 'btn-danger'}`} 
                    onClick={() => handleToggleBlock(user)}
                  >
                    {user.isBlocked ? 'Разбанить' : 'Забанить'}
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

export default UsersTable;