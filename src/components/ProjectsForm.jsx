function ProjectForm({
  editingId,
  projectName,
  setProjectName,
  clientName,
  setClientName,
  projectType,
  setProjectType,
  location,
  setLocation,
  deadline,
  setDeadline,
  projectStatus,
  setProjectStatus,
  priority,
  setPriority,
  architect,
  setArchitect,
  notes,
  setNotes,
  setSelectedFile,
setSelectedImage,
  saveProject,
  clearForm,
}) {
  return (
    <section id="new-project" className="form-panel">
      <h2>{editingId ? "Edit Project" : "New Project"}</h2>

      <div className="form-grid">
        <input placeholder="Project Name" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
        <input placeholder="Client Name" value={clientName} onChange={(e) => setClientName(e.target.value)} />

        <select value={projectType} onChange={(e) => setProjectType(e.target.value)}>
          <option>Office</option>
          <option>Housing</option>
          <option>Villa</option>
          <option>Hotel</option>
          <option>Mosque</option>
          <option>Industrial</option>
          <option>Commercial</option>
          <option>Other</option>
        </select>

        <input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
        <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />

        <select value={projectStatus} onChange={(e) => setProjectStatus(e.target.value)}>
          <option>Concept Design</option>
          <option>Municipality Approval</option>
          <option>Construction Documents</option>
          <option>Construction Site</option>
          <option>Completed</option>
        </select>

        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <input placeholder="Responsible Architect" value={architect} onChange={(e) => setArchitect(e.target.value)} />
      </div>

      <textarea placeholder="Project Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
      <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} /><label className="image-upload-label">
  Project Image
  <input
    type="file"
    accept="image/*"
    onChange={(e) => setSelectedImage(e.target.files[0])}
  />
</label>

      <div className="button-row">
        <button onClick={saveProject} className="primary-btn">
          {editingId ? "Update Project" : "+ New Project"}
        </button>

        {editingId && <button onClick={clearForm} className="secondary-btn">Cancel</button>}
      </div>
    </section>
  );
}

export default ProjectForm;