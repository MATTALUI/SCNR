import ProjectTile from "./ProjectTile";
import { Project } from "./types";

export class ProjectsSection extends HTMLElement {
  projects: Project[];

  constructor() {
    if (document.querySelector("#project-section")) {
      throw new Error("There can only be one instance of the project-section available at once.");
    }
    super()
    this.id = "project-section";
    this.projects = [];
    this.buildElement();
    this.populateProjects();
  }

  buildElement() {
  };

  populateProjects = async () => {
    const req = await fetch("/api/projects");
    this.projects = await req.json();
    this.projects.forEach((project) => {
      this.appendChild(new ProjectTile({ project }));
    });

  }
}

customElements.define("projects-section", ProjectsSection);

export default ProjectsSection;