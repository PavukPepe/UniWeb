import MainNav from "../сomponents/MainNav.jsx"

function DevBlog() {
  return (
    <div className="d-flex min-vh-100 bg-dark">
      <MainNav />
      <main className="flex-grow-1 p-4">
        <h1 className="text-white fw-bold mb-4">Dev-Блог</h1>
        <p className="text-white">Здесь будут отображаться статьи блога</p>
      </main>
    </div>
  )
}

export default DevBlog

