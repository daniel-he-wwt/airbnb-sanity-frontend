import Link from "next/link"

const NavBar = () => {
  return (
    <div className="nav">
      <div className="logo"></div>
      <div className="nav-links">
        <Link href="/tasks">
          <a>Tasks</a>
        </Link>
      </div>
    </div>
  )
}

export default NavBar
