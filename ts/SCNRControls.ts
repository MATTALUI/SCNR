import PseudoCarousel from "./PseudoCarousel";

export class SCNRControls extends HTMLElement {
  captureImagesBtn: HTMLButtonElement|null;

  constructor() {
    if (document.querySelector("#controls")) {
      throw new Error("There can only be one instance of the controls available at once.");
    }
    super();
    this.id = "controls";
    this.captureImagesBtn = null;

    this.buildElement();
  }

  buildElement() {
    // Just spacer for now
    this.appendChild(document.createElement('div'));
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
    document.querySelector("preview-poller")?.replaceWith(new PseudoCarousel());
    this.captureImagesBtn.disabled = true;
  }
}

customElements.define("scanner-controls", SCNRControls);

export default SCNRControls;