import MainNav from "../сomponents/MainNav"

function MyCourses() {
  return (
    <div className="d-flex min-vh-100 bg-dark">
      <MainNav />
      <main className="flex-grow-1 p-4">
        <h1 className="text-white fw-bold mb-4">Мои курсы</h1>
        <p className="text-white">Здесь будут отображаться ваши курсы</p>
      </main>
    </div>
  )
}

export default MyCourses

