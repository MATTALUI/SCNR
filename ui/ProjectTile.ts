import { Project } from "./types";
import { pushQueryParams } from "./utils";
import PseudoCarousel from "./PseudoCarousel";

interface IProjectTileConfig {
  project: Project;
}

export class ProjectTile extends HTMLElement {
  project: IProjectTileConfig["project"];

  constructor({
    project,
  }: IProjectTileConfig) {
    super();
    this.project = project;

    this.buildElement();
    this.registerEventListeners();
  }

  buildElement() {
    this.classList.add("project-tile");
    const preview = document.createElement('img');
    preview.src = this.project.imagePreview;

    this.appendChild(preview);
  }

  registerEventListeners() {
    this.addEventListener('click', this.goToProject);
  }

  goToProject() {
    pushQueryParams({ projectId: this.project.id });
    const elementToReplace = document.querySelector("pseudo-carousel, preview-poller");
    if (elementToReplace) {
      elementToReplace.remove();
      document.querySelector("#scanner")?.appendChild(new PseudoCarousel());
    }
  }
}
customElements.define("project-tile", ProjectTile);

export default ProjectTile;