import gadaLogo from "../assets/gada logo 2.png";

function Sidebar({ user, logout }) {
  return (
    <aside className="sidebar">
      <img src={gadaLogo} className="sidebar-logo" />
      <h2>GADA Flow</h2>

      <nav>
        <span onClick={() => document.getElementById("dashboard").scrollIntoView({ behavior: "smooth" })}>📊 Dashboard</span>
        <span onClick={() => document.getElementById("new-project").scrollIntoView({ behavior: "smooth" })}>📁 Projects</span>
        <span onClick={() => document.getElementById("files").scrollIntoView({ behavior: "smooth" })}>📎 Files</span>
        <span onClick={() => document.getElementById("calendar").scrollIntoView({ behavior: "smooth" })}>📅 Calendar</span>
        <span onClick={() => document.getElementById("settings").scrollIntoView({ behavior: "smooth" })}>⚙️ Settings</span>
      </nav>

      <div className="sidebar-profile">
        <div className="profile-avatar">
          {user.email.charAt(0).toUpperCase()}
        </div>

        <div>
          <strong>{user.email.split("@")[0]}</strong>
          <p>Online ●</p>
        </div>
      </div>

      <button onClick={logout} className="logout-btn">Logout</button>
    </aside>
  );
}

export default Sidebar;