import { useState } from "react";

function App() {
  const [projects, setProjects] = useState([
    { id: 1, name: "Villa A", client: "Ahmet Yılmaz", status: "Concept Design" },
    { id: 2, name: "Residence B", client: "GADA Client", status: "Municipality Approval" },
  ]);

  const [projectName, setProjectName] = useState("");
  const [clientName, setClientName] = useState("");
  const [deadline, setDeadline] = useState("");
  const [projectStatus, setProjectStatus] = useState("Concept Design");

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
  return (
    <div>
      <h1>GADA Flow</h1>
      <h2>Project Management System</h2>

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

      <hr />

      {projects.map((project) => (
        <div
          key={project.id}
          style={{
            border: "1px solid #444",
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "20px",
            backgroundColor: "#1a1a1a",
          }}
        >
          <h3>{project.name}</h3>
          <p>Client: {project.client || "No client added"}</p>
          <p>Deadline: {project.deadline || "Not set"}</p>
          <p
  style={{
    display: "inline-block",
    padding: "6px 12px",
    border: "1px solid 444",
    borderRadius: "20px",
    color: "d9d9d9",
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