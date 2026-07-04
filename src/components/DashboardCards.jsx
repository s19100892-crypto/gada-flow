function DashboardCards({ projects }) {
  const totalProjects = projects.length || 1;

  const getProgress = (status) => {
    if (status === "Concept Design") return 20;
    if (status === "Municipality Approval") return 40;
    if (status === "Construction Documents") return 60;
    if (status === "Construction Site") return 80;
    if (status === "Completed") return 100;
    return 0;
  };

  const data = [
    { label: "Concept Design", count: projects.filter((p) => p.status === "Concept Design").length },
    { label: "Municipality", count: projects.filter((p) => p.status === "Municipality Approval").length },
    { label: "Construction", count: projects.filter((p) => p.status === "Construction Documents" || p.status === "Construction Site").length },
    { label: "Completed", count: projects.filter((p) => p.status === "Completed").length },
  ];

  const activeProjects = projects.filter((p) => p.status !== "Completed");

  const focusProject =
    activeProjects
      .filter((p) => p.deadline)
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))[0] ||
    activeProjects[0];

  return (
    <section id="dashboard" className="dashboard-overview dashboard-with-widget">
      <div className="analytics-card">
        <div className="overview-header">
          <span className="eyebrow">PROJECT OVERVIEW</span>
          <h2>Dashboard Analytics</h2>
        </div>

        <div className="overview-bars">
          {data.map((item) => (
            <div className="overview-row" key={item.label}>
              <div className="overview-row-top">
                <span>{item.label}</span>
                <strong>{item.count}</strong>
              </div>

              <div className="overview-track">
                <div
                  className="overview-fill"
                  style={{ width: `${(item.count / totalProjects) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="focus-widget">
        <span className="eyebrow">TODAY'S FOCUS</span>

        {focusProject ? (
          <>
            <h2>{focusProject.name}</h2>
            <p>{focusProject.status}</p>

            <div className="focus-progress">
              <div>
                <span>Progress</span>
                <strong>{getProgress(focusProject.status)}%</strong>
              </div>

              <div className="overview-track">
                <div
                  className="overview-fill"
                  style={{ width: `${getProgress(focusProject.status)}%` }}
                ></div>
              </div>
            </div>

            <small>
              {focusProject.deadline
                ? `Deadline: ${new Date(focusProject.deadline).toLocaleDateString("tr-TR")}`
                : "No deadline set"}
            </small>
          </>
        ) : (
          <>
            <h2>No Focus Project</h2>
            <p>Add a project to start tracking.</p>
          </>
        )}
      </div>
    </section>
  );
}

export default DashboardCards;