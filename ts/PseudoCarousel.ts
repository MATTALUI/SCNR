import SkeletonLoader from "./SkeletonLoader";
import { parseQueryparams } from "./utils";
export class PseudoCarousel extends HTMLElement {
  projectId: string;
  images: string[];
  activeIndex: number;
  grabbing: boolean;
  delta: number;
  // Static?
  threshold: number;

  constructor() {
    if (document.querySelector("#carousel")) {
      throw new Error("There can only be one instance of the carousel available at once.");
    }
    const projectId = parseQueryparams().get("projectId");
    if (!projectId) {
      throw new Error("Could not parse project ID from search param");
    }
    super();
    this.id = "carousel";
    this.projectId = projectId;
    this.images = [];
    this.threshold = 25;
    this.activeIndex = 0;
    this.grabbing = false;
    this.delta = 0;
    this.buildElement();
    this.populateProjectImages();
    this.registerHandlers();
  }

  connectedCallback() {
    console.log("Custom element added to page.");
  }

  disconnectedCallback() {
    console.log("Custom element removed from page.");
  }

  adoptedCallback() {
    console.log("Custom element moved to new page.");
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(`Attribute ${name} has changed. ${oldValue} -> ${newValue}`);
  }

  buildElement() {
    this.appendChild(new SkeletonLoader({ width: 700, height: 525, displayLoading: true }));
  }

  async populateProjectImages() {
    await new Promise(res => setTimeout(res, 5000)); // Simulate slow responses
    const req = await fetch(`/api/projects/${this.projectId}/images`);
    this.images = await req.json();
    this.innerHTML = "";
    this.images.forEach((src, i) => {
      const image = document.createElement('img');
      image.src = src;
      if (i === this.activeIndex) image.classList.add("active");
      image.setAttribute("data-index", i.toString());
      this.appendChild(image);
    });
  }

  registerHandlers() {
    this.addEventListener("mousedown", this.handleMousedown);
    this.addEventListener("mouseup", this.handleMouseup);
  }

  handleMousemove = (event) => {
    event.preventDefault();
    this.delta += event.movementX;
    if (Math.abs(this.delta) < this.threshold) return;
    // Might have to adjust this depending on the rotation order of the images
    const indexChange = Math.sign(this.delta);
    let newIndex = this.activeIndex + indexChange;
    if (newIndex === this.images.length) newIndex = 0;
    if (newIndex < 0) newIndex = this.images.length - 1;
    document.querySelector(`img[data-index="${this.activeIndex}"]`)?.classList.remove("active");
    document.querySelector(`img[data-index="${newIndex}"]`)?.classList.add("active");
    this.activeIndex = newIndex;
    this.delta = 0;
  }

  handleMousedown(event) {
    event.preventDefault();
    document.body.classList.add("grabbing");
    document.body.addEventListener("mousemove", this.handleMousemove);
    this.grabbing = true;
    this.delta = 0;
  };

  handleMouseup(event) {
    event.preventDefault();
    document.body.classList.remove("grabbing");
    document.body.removeEventListener("mousemove", this.handleMousemove);
    this.grabbing = false;
    this.delta = 0;
  };

}

customElements.define("pseudo-carousel", PseudoCarousel);

export default PseudoCarousel;