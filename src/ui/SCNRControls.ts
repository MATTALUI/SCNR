import ProjectTile from "./ProjectTile";
import PseudoCarousel from "./PseudoCarousel";
import { Project } from "./types";
import { pushQueryParams } from "./utils";

export class SCNRControls extends HTMLElement {
  captureImagesBtn: HTMLButtonElement|null;
  lightLevelInput: HTMLInputElement|null;

  constructor() {
    if (document.querySelector("#controls")) {
      throw new Error("There can only be one instance of the controls available at once.");
    }
    super();
    this.id = "controls";
    this.captureImagesBtn = null;
    this.lightLevelInput = null;

    this.buildElement();
  }

  buildElement() {
    // Light Level Block
    const lightLevelBlock = document.createElement('div');
    const lightLevelLabel = document.createElement('label')
    lightLevelLabel.innerHTML = "Light Level";
    lightLevelLabel.htmlFor = "light_level";
    this.lightLevelInput = document.createElement('input');
    this.lightLevelInput.type = "range";
    this.lightLevelInput.min = "0";
    this.lightLevelInput.max = "100"
    this.lightLevelInput.value = "50";
    this.lightLevelInput.step = "10";
    this.lightLevelInput.name = "light_level";
    this.lightLevelInput.addEventListener('change', this.setLightLevel);
    lightLevelBlock.appendChild(lightLevelLabel);
    lightLevelBlock.appendChild(this.lightLevelInput);
    this.appendChild(lightLevelBlock);
    // Capture Images Block
    const captureBlock = document.createElement('div');
    this.captureImagesBtn = document.createElement('button');
    this.captureImagesBtn.id = "capture-images";
    this.captureImagesBtn.innerHTML = "Capture Images";
    this.captureImagesBtn.addEventListener('click', this.captureImages);
    captureBlock.appendChild(this.captureImagesBtn);
    this.appendChild(captureBlock);
  }

  captureImages = async () => {
    if (!this.captureImagesBtn) return;

    const req = await fetch('/api/projects/', {
      method: "POST"
    });
    const project: Project = await req.json();
    console.table(project);

    pushQueryParams({ projectId: project.id });
    document.querySelector("preview-poller")?.replaceWith(new PseudoCarousel());
    document.querySelector("#project-section")?.appendChild(new ProjectTile({ project }));
    this.captureImagesBtn.disabled = true;
  }

  setLightLevel = async (e) => {
    console.log(e.target.value);
  }
}

customElements.define("scanner-controls", SCNRControls);

export default SCNRControls;