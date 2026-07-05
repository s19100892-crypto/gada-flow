import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import gadaLogo from "./assets/gada logo 2.png";
function App() {
 const [projects, setProjects] = useState(() => {
  const savedProjects = localStorage.getItem("gadaProjects");

  if (savedProjects) {
    return JSON.parse(savedProjects);
  }

  return [
    {
      id: 1,
      name: "Villa A",
      client: "Ahmet Yılmaz",
      status: "Concept Design",
      deadline: "",
    },
    {
      id: 2,
      name: "Residence B",
      client: "GADA Client",
      status: "Municipality Approval",
      deadline: "",
    },
  ];
});

  const [projectName, setProjectName] = useState("");
  const [clientName, setClientName] = useState("");
  const [deadline, setDeadline] = useState("");
  const [projectStatus, setProjectStatus] = useState("Concept Design");
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
  localStorage.setItem(
    "gadaProjects",
    JSON.stringify(projects)
  );
}, [projects]);

  const addProject = () => {
    if (projectName.trim() === "") return;

    const newProject = {
      id: Date.now(),
      name: projectName,
      client: clientName,
      status: projectStatus,
      deadline: deadline,
    };
    setProjects([...projects, newProject]);
    setProjectName("");
    setClientName("");
    setDeadline("");
  };

  const deleteProject = (id) => {
    setProjects(projects.filter((project) => project.id !== id));
  };
  const totalProjects = projects.length;
const conceptProjects = projects.filter(
  (project) => project.status === "Concept Design"
).length;
const municipalityProjects = projects.filter(
  (project) => project.status === "Municipality Approval"
).length;
const completedProjects = projects.filter(
  (project) => project.status === "Completed"
).length;
return (
  <div>
    <div
  style={{
    marginBottom: "24px",
    display: "flex",
    justifyContent: "center",
  }}
>
  <img
    src={gadaLogo}
    alt="GADA Mimarlık Logo"
    style={{
      width: "70px",
      opacity: "0.95",
      borderRadius: "4px",
    }}
  />
</div>
     <h1
  style={{
    fontSize: "52px",
    fontWeight: "300",
    letterSpacing: "-2px",
    marginBottom: "8px",
  }}
>
  GADA Flow
</h1>
<h2
  style={{
    fontSize: "52px",
    fontWeight: "300",
    letterSpacing: "-2px",
    marginBottom: "10px",
  }}
></h2>

<h2
  style={{
    fontSize: "18px",
    fontWeight: "400",
    color: "#9a9a9a",
    marginBottom: "40px",
  }}
>
  Project Management System
</h2>
<div
  style={{
    display: "flex",
    justifyContent: "center",
    gap: "16px",
    marginBottom: "30px",
    flexWrap: "wrap",
  }}
>
  <div
    style={{
      backgroundColor: "#151515",
      border: "1px solid #2f2f2f",
      borderRadius: "12px",
      padding: "14px 28px",
      minWidth: "120px",
    }}
  >
    <h3 style={{ fontSize: "28px", margin: "0 0 8px 0" }}>{totalProjects}</h3>
    <p>Total Projects</p>
  </div>

  <div
    style={{
      backgroundColor: "#151515",
      border: "1px solid #2f2f2f",
      borderRadius: "12px",
      padding: "14px 28px",
      minWidth: "120px",
    }}
  >
   <h3 style={{ fontSize: "28px", margin: "0 0 8px 0" }}>{totalProjects}</h3>
    <p>Concept Design</p>
  </div>

  <div
    style={{
      backgroundColor: "#151515",
      border: "1px solid #2f2f2f",
      borderRadius: "12px",
      padding: "14px 28px",
      minWidth: "120px",
    }}
  >
   
   <h3 style={{ fontSize: "28px", margin: "0 0 8px 0" }}>
  {municipalityProjects}
</h3>
<p>Municipality</p>
</div>

  <div
    style={{
      backgroundColor: "#151515",
      border: "1px solid #2f2f2f",
      borderRadius: "12px",
      padding: "14px 28px",
      minWidth: "120px",
    }}
  >
    <h3 style={{ fontSize: "28px", margin: "0 0 8px 0" }}>{totalProjects}</h3>
    <p>Completed</p>
  </div>
</div>

      <input
        type="text"
        placeholder="Project Name"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
      />

      <input
        type="text"
        placeholder="Client Name"
        value={clientName}
        onChange={(e) => setClientName(e.target.value)}
      />

      <input
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
      />

      <select
        value={projectStatus}
        onChange={(e) => setProjectStatus(e.target.value)}
      >
        <option>Concept Design</option>
        <option>Municipality Approval</option>
        <option>Construction Documents</option>
        <option>Construction Site</option>
        <option>Completed</option>
      </select>

      <button onClick={addProject}>+ New Project</button>
      <br />
<br />

<input
  type="text"
  placeholder="Search Project..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>

      <hr />

      {projects
  .filter((project) =>
    project.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  )
  .map((project) => (
        <div
          key={project.id}
         style={{
  border: "1px solid #2f2f2f",
  borderRadius: "18px",
  padding: "44px 32px",
  marginBottom: "24px",
  backgroundColor: "#151515",
  boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
}}
        >
          <h3 style={{ fontSize: "28px", margin: "0 0 8px 0" }}>
  {project.name}
</h3>
          <p>Client: {project.client || "No client added"}</p>
          <p>Deadline: {project.deadline || "Not set"}</p>

          <p
            style={{
              display: "inline-block",
              padding: "6px 12px",
              border: "1px solid #444",
              borderRadius: "20px",
              color: "#d9d9d9",
              fontSize: "12px",
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}
          >
            {project.status}
          </p>

          <button onClick={() => deleteProject(project.id)}>
            Delete Project
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;