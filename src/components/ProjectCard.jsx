function ProjectCard({ project, editProject, deleteProject }) {
  return (
    <div className="project-card">
      <div className="project-header">
        <div>
          <h2>{project.name}</h2>
          <p>{project.location || "No location"}</p>
        </div>

        <span className="status-badge">{project.status}</span>
      </div>

      <div className="project-info">
        <p><strong>Client:</strong> {project.client || "No client"}</p>
        <p><strong>Type:</strong> {project.project_type || "Not set"}</p>
        <p><strong>Architect:</strong> {project.architect || "Not set"}</p>
        <p><strong>Deadline:</strong> {project.deadline || "Not set"}</p>
        <p><strong>Priority:</strong> {project.priority || "Medium"}</p>
      </div>

      {project.notes && <p className="notes">Notes: {project.notes}</p>}

      {project.file_url && (
        <a
          href={project.file_url}
          target="_blank"
          rel="noreferrer"
          className="file-link"
        >
          {project.file_name || "Open file"}
        </a>
      )}
<div className="progress-section">
  <div className="progress-header">
    <span>Project Progress</span>
    <span>40%</span>
  </div>

  <div className="progress-bar">
    <div className="progress-fill"></div>
  </div>
</div>
      <div className="card-actions">
        <button onClick={() => editProject(project)}>Edit</button>
        <button onClick={() => deleteProject(project.id)}>Delete</button>
      </div>
    </div>
  );
}

export default ProjectCard;