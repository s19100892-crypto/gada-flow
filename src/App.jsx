import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import gadaLogo from "./assets/gada logo 2.png";
import "./App.css";
import DashboardCards from "./components/DashboardCards";
import ProjectForm from "./components/ProjectsForm";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function App() {
  const [user, setUser] = useState(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [clientName, setClientName] = useState("");
  const [deadline, setDeadline] = useState("");
  const [projectStatus, setProjectStatus] = useState("Concept Design");
  const [projectType, setProjectType] = useState("Office");
  const [location, setLocation] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [architect, setArchitect] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    checkUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user || null)
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) getProjects();
  }, [user]);

  const login = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });

    if (error) alert("Giriş başarısız: " + error.message);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setProjects([]);
  };

  const getProjects = async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setProjects(data || []);
  };

  const clearForm = () => {
    setProjectName("");
    setClientName("");
    setDeadline("");
    setProjectStatus("Concept Design");
    setProjectType("Office");
    setLocation("");
    setPriority("Medium");
    setArchitect("");
    setNotes("");
    setSelectedFile(null);
    setSelectedImage(null);
    setEditingId(null);
  };

  const saveProject = async () => {
    if (projectName.trim() === "") return;

    let fileUrl = null;
    let fileName = null;

    if (selectedFile) {
      const filePath = `${Date.now()}-${selectedFile.name}`;

      const { error: uploadError } = await supabase.storage
        .from("project-files")
        .upload(filePath, selectedFile);

      if (uploadError) {
        alert("Dosya yüklenemedi: " + uploadError.message);
        return;
      }

      const { data } = supabase.storage
        .from("project-files")
        .getPublicUrl(filePath);

      fileUrl = data.publicUrl;
      fileName = selectedFile.name;
    }
let imageUrl = null;
let imageName = null;

if (selectedImage) {
 const cleanImageName = selectedImage.name
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/[^a-zA-Z0-9.]/g, "-")
  .toLowerCase();

const imagePath = `project-images/${Date.now()}-${cleanImageName}`;

  const { error: imageUploadError } = await supabase.storage
    .from("project-files")
    .upload(imagePath, selectedImage);

  if (imageUploadError) {
    alert("Fotoğraf yüklenemedi: " + imageUploadError.message);
    return;
  }

  const { data: imageData } = supabase.storage
    .from("project-files")
    .getPublicUrl(imagePath);

  imageUrl = imageData.publicUrl;
  imageName = selectedImage.name;
}
    const projectData = {
      name: projectName,
      client: clientName,
      status: projectStatus,
      deadline: deadline || null,
      project_type: projectType,
      location,
      priority,
      architect,
      notes,
    };

    if (imageUrl) {
      projectData.image_url = imageUrl;
      projectData.image_name = imageName;
    }

    if (fileUrl) {
      projectData.file_url = fileUrl;
      projectData.file_name = fileName;
    }

    if (editingId) {
      await supabase.from("projects").update(projectData).eq("id", editingId);
    } else {
      await supabase.from("projects").insert([projectData]);
    }

    clearForm();
    getProjects();
  };

  const editProject = (project) => {
    setEditingId(project.id);
    setProjectName(project.name || "");
    setClientName(project.client || "");
    setDeadline(project.deadline || "");
    setProjectStatus(project.status || "Concept Design");
    setProjectType(project.project_type || "Office");
    setLocation(project.location || "");
    setPriority(project.priority || "Medium");
    setArchitect(project.architect || "");
    setNotes(project.notes || "");
  };

  const deleteProject = async (id) => {
    await supabase.from("projects").delete().eq("id", id);
    getProjects();
  };

  const updateProjectStatus = async (id, status) => {
    const { error } = await supabase
      .from("projects")
      .update({ status })
      .eq("id", id);

    if (!error) {
      getProjects();
    }
  };

  const totalProjects = projects.length;

  const filteredProjects = projects.filter((project) =>
    (project.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getProgress = (status) => {
    if (status === "Concept Design") return 20;
    if (status === "Municipality Approval") return 40;
    if (status === "Construction Documents") return 60;
    if (status === "Construction Site") return 80;
    if (status === "Completed") return 100;
    return 0;
  };
 const exportProjectPDF = (project) => {
  const doc = new jsPDF();

  // ===== Header =====
  doc.setFillColor(18, 18, 18);
  doc.rect(0, 0, 210, 35, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text("GADA Flow", 20, 20);

  doc.setFontSize(12);
  doc.text("Professional Project Report", 20, 28);

  doc.setFontSize(10);
  doc.text(new Date().toLocaleDateString("tr-TR"), 170, 20);

  // ===== Title =====
  doc.setTextColor(40);
  doc.setFontSize(20);
  doc.text(project.name || "Project", 20, 50);

  doc.setFontSize(11);
  doc.setTextColor(120);
  doc.text(
    "Automatically generated by GADA Flow",
    20,
    58
  );

  // ===== Table =====
  autoTable(doc, {
    startY: 66,

    theme: "grid",

    head: [["Field", "Information"]],

    body: [
      ["Client", project.client || "-"],
      ["Architect", project.architect || "-"],
      ["Project Type", project.project_type || "-"],
      ["Location", project.location || "-"],
      ["Status", project.status || "-"],
      ["Priority", project.priority || "-"],
      ["Deadline", project.deadline || "-"],
      ["Progress", `${getProgress(project.status)} %`],
      ["Notes", project.notes || "-"],
    ],

    headStyles: {
      fillColor: [25, 25, 25],
      textColor: [255, 255, 255],
      fontSize: 11,
    },

    styles: {
      fontSize: 10,
      cellPadding: 5,
    },

    alternateRowStyles: {
      fillColor: [247, 247, 247],
    },
  });

  // ===== Progress =====
  const y = doc.lastAutoTable.finalY + 18;

  doc.setFontSize(13);
  doc.setTextColor(40);
  doc.text("Project Progress", 20, y);

  doc.setFillColor(235, 235, 235);
  doc.roundedRect(20, y + 6, 120, 8, 4, 4, "F");

  doc.setFillColor(70, 70, 70);
  doc.roundedRect(
    20,
    y + 6,
    (120 * getProgress(project.status)) / 100,
    8,
    4,
    4,
    "F"
  );

  doc.setFontSize(11);
  doc.text(`${getProgress(project.status)}%`, 148, y + 12);

  // ===== Footer =====
  doc.setDrawColor(220);
  doc.line(20, 280, 190, 280);

  doc.setFontSize(9);
  doc.setTextColor(120);

  doc.text(
    "Generated by GADA Flow",
    20,
    287
  );

  doc.text(
    "Designed & Developed by Sılanur Biner",
    125,
    287
  );

  doc.save(
    `${project.name.replace(/\s+/g, "_")}_Report.pdf`
  );
};

  const getStatusClass = (status) => {
    if (status === "Concept Design") return "status-concept";
    if (status === "Municipality Approval") return "status-municipality";
    if (status === "Construction Documents") return "status-documents";
    if (status === "Construction Site") return "status-site";
    if (status === "Completed") return "status-completed";
    return "status-default";
  };

  const getPriorityClass = (priority) => {
    if ((priority || "").toLowerCase() === "high") return "priority-high";
    if ((priority || "").toLowerCase() === "low") return "priority-low";
    return "priority-medium";
  };

  const getNotifications = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return projects
      .flatMap((project) => {
        const items = [];

        if (project.deadline) {
          const deadline = new Date(project.deadline);
          deadline.setHours(0, 0, 0, 0);

          const daysLeft = Math.ceil(
            (deadline - today) / (1000 * 60 * 60 * 24)
          );

          if (daysLeft >= 0 && daysLeft <= 7) {
            items.push({
              icon: "📅",
              title: project.name,
              text:
                daysLeft === 0
                  ? "Deadline today"
                  : `${daysLeft} days left`,
            });
          }
        }

        if ((project.priority || "").toLowerCase() === "high") {
          items.push({
            icon: "⚠️",
            title: project.name,
            text: "High priority project",
          });
        }

        if (project.status === "Completed") {
          items.push({
            icon: "✅",
            title: project.name,
            text: "Project completed",
          });
        }

        return items;
      })
      .slice(0, 5);
  };

  const notifications = getNotifications();

  if (!user) {
    return (
      <div className="login-page">
        <div className="login-card">
          <img src={gadaLogo} className="login-logo" alt="GADA Logo" />
          <h1>GADA Flow</h1>
          <p>Project Management System</p>

          <div className="designer-signature">
            Designed & Developed by <strong>Sılanur Biner</strong>
          </div>

          <p className="version-signature">
            Version 1.0 · © 2026 Sılanur Biner
          </p>

          <input
            type="email"
            placeholder="Email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
          />

          <button onClick={login} className="primary-btn">Login</button>
        </div>
      </div>
    );
  }
const hour = new Date().getHours();
let welcomeMessage = "";

if (hour >= 5 && hour < 12) {
  welcomeMessage = "Ready to design something extraordinary today?";
} else if (hour >= 12 && hour < 18) {
  welcomeMessage = "Let's keep creativity flowing this afternoon.";
} else if (hour >= 18 && hour < 22) {
  welcomeMessage = "Another great project is waiting for you.";
} else {
  welcomeMessage = "Time to wrap up today's great work.";
}

let greeting = "Good Evening 🌙";

if (hour >= 5 && hour < 12) {
  greeting = "Good Morning ☀️";
} else if (hour >= 12 && hour < 18) {
  greeting = "Good Afternoon 🌤️";
} else if (hour >= 18 && hour < 22) {
  greeting = "Good Evening 🌇";
} else {
  greeting = "Good Night 🌙";
}
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <img src={gadaLogo} className="sidebar-logo" alt="GADA Logo" />
        <h2>GADA Flow</h2>

        <nav>
          <span onClick={() => document.getElementById("dashboard")?.scrollIntoView({ behavior: "smooth" })}>📊 Dashboard</span>
          <span onClick={() => document.getElementById("new-project")?.scrollIntoView({ behavior: "smooth" })}>📁 Projects</span>
          <span onClick={() => document.getElementById("files")?.scrollIntoView({ behavior: "smooth" })}>📎 Files</span>
          <span onClick={() => document.getElementById("calendar")?.scrollIntoView({ behavior: "smooth" })}>📅 Calendar</span>
          <span onClick={() => document.getElementById("settings")?.scrollIntoView({ behavior: "smooth" })}>⚙️ Settings</span>
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

      <main className="main-content">
        <div className="topbar">
          <div>
            <h1>Project Dashboard</h1>
            <p>GADA Mimarlık project management workspace</p>
          </div>

          <div className="topbar-actions">
            <input
              className="search"
              placeholder="Search project..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="notification-wrapper">
              <button className="notification-btn">
                🔔
                {notifications.length > 0 && (
                  <span>{notifications.length}</span>
                )}
              </button>

              <div className="notification-panel">
                <h3>Notifications</h3>

                {notifications.length === 0 ? (
                  <p className="empty-notification">No notifications.</p>
                ) : (
                  notifications.map((item, index) => (
                    <div className="notification-item" key={index}>
                      <strong>{item.icon} {item.title}</strong>
                      <p>{item.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <section className="welcome-panel">
          <div>
            <span className="eyebrow">GADA FLOW WORKSPACE</span>

            <h2>{greeting}</h2>

            <p className="welcome-message">
              {welcomeMessage}
            </p>

            <p className="welcome-stats">
              You have <strong>{totalProjects}</strong> active projects and{" "}
              <strong>{projects.filter((project) => project.deadline).length}</strong>{" "}
              upcoming deadlines.
            </p>
          </div>

          <div className="today-card">
            <span>Today</span>
            <strong>{new Date().toLocaleDateString("tr-TR")}</strong>
          </div>
        </section>

        <DashboardCards projects={projects} />

        <ProjectForm
          editingId={editingId}
          projectName={projectName}
          setProjectName={setProjectName}
          clientName={clientName}
          setClientName={setClientName}
          projectType={projectType}
          setProjectType={setProjectType}
          location={location}
          setLocation={setLocation}
          deadline={deadline}
          setDeadline={setDeadline}
          projectStatus={projectStatus}
          setProjectStatus={setProjectStatus}
          priority={priority}
          setPriority={setPriority}
          architect={architect}
          setArchitect={setArchitect}
          notes={notes}
          setNotes={setNotes}
          setSelectedFile={setSelectedFile}
          setSelectedImage={setSelectedImage}
          saveProject={saveProject}
          clearForm={clearForm}
        />

        <section id="calendar" className="calendar-panel">
          <h2>Upcoming Deadlines</h2>

          {projects.filter((project) => project.deadline).length === 0 && (
            <p className="empty-state">No deadlines added yet.</p>
          )}

          {projects
            .filter((project) => project.deadline)
            .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
            .map((project) => (
              <div className="deadline-item" key={project.id}>
                <span>{new Date(project.deadline).toLocaleDateString("tr-TR")}</span>
                <strong>{project.name}</strong>
                <em>{project.status}</em>
              </div>
            ))}
        </section>

        <section id="projects" className="projects-list apple-projects-list">
          {filteredProjects.map((project) => (
            <div key={project.id} className="project-card apple-project-card">
              <div className="project-visual">
               <div className="project-image-upload">
  {project.image_url ? (
    <img
  src={project.image_url}
  alt={project.name}
  onClick={() => setPreviewImage(project.image_url)}
/>
  ) : (
    <div className="image-empty">
      <span>🖼️</span>
      <p>Proje fotoğrafı ekleyin</p>
      <small>JPG, PNG</small>
    </div>
  )}
</div>
              </div>

              <div className="project-main-area">
                <div className="project-top-row">
                  <div>
                    <h2>{project.name}</h2>
                    <p className="project-location">📍 {project.location || "No location"}</p>
                  </div>

<select
  className={`status-select ${getStatusClass(project.status)}`}
  value={project.status}
  onChange={(e) => updateProjectStatus(project.id, e.target.value)}
>
  <option>Concept Design</option>
  <option>Municipality Approval</option>
  <option>Construction Documents</option>
  <option>Construction Site</option>
  <option>Completed</option>
</select>                </div>

                <div className="apple-info-row">
                  <div className="apple-info-item">
                    <span>👤 Client</span>
                    <strong>{project.client || "No client"}</strong>
                  </div>

                  <div className="apple-info-item">
                    <span>🏛 Type</span>
                    <strong>{project.project_type || "Not set"}</strong>
                  </div>

                  <div className="apple-info-item">
                    <span>👷 Architect</span>
                    <strong>{project.architect || "Not set"}</strong>
                  </div>

                  <div className="apple-info-item">
                    <span>📅 Deadline</span>
                    <strong>{project.deadline || "Not set"}</strong>
                  </div>

                  <div className={`apple-info-item ${getPriorityClass(project.priority)}`}>
                    <span>⭐ Priority</span>
                    <strong>{project.priority || "Medium"}</strong>
                  </div>
                </div>

                {project.notes && <p className="notes apple-notes">📝 {project.notes}</p>}

                {project.file_url && (
                  <a href={project.file_url} target="_blank" rel="noreferrer" className="file-link apple-file-link">
                    📎 {project.file_name || "Open file"}
                  </a>
                )}

                <div className="progress-section apple-progress-section">
                  <div className="progress-header">
                    <span>Project Progress</span>
                    <span>{getProgress(project.status)}%</span>
                  </div>

                  <div className="progress-bar">
                    <div
                      className={`progress-fill ${getStatusClass(project.status)}`}
                      style={{ width: `${getProgress(project.status)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="card-actions apple-card-actions">
                  <button onClick={() => exportProjectPDF(project)}>Export PDF</button>
                  <button onClick={() => editProject(project)}>Edit</button>
                  <button onClick={() => deleteProject(project.id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </section>

        <section id="files" className="calendar-panel">
          <h2>Files</h2>

          {projects.filter((project) => project.file_url).length === 0 && (
            <p>No files uploaded yet.</p>
          )}

          {projects
            .filter((project) => project.file_url)
            .map((project) => (
              <div className="deadline-item" key={project.id}>
                <span>{project.project_type || "Project"}</span>
                <strong>{project.file_name || "Open file"}</strong>
                <a href={project.file_url} target="_blank" rel="noreferrer">
                  Open
                </a>
              </div>
            ))}
        </section>

        <section id="settings" className="calendar-panel">
          <h2>Settings</h2>

          <div className="deadline-item">
            <span>User</span>
            <strong>{user.email}</strong>
            <em>Active</em>
          </div>

          <div className="deadline-item">
            <span>Database</span>
            <strong>Supabase</strong>
            <em>Connected</em>
          </div>

          <div className="deadline-item">
            <span>Application</span>
            <strong>GADA Flow</strong>
            <em>Version 1.0</em>
          </div>
        </section>
        {previewImage && (
  <div className="image-modal" onClick={() => setPreviewImage(null)}>
    <button className="image-modal-close">×</button>
    <img src={previewImage} alt="Project preview" />
  </div>
)}
      </main>
    </div>
  );
}

export default App;
