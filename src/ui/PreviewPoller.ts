export class PreviewPoller extends HTMLElement {
  polling: boolean;
  imgEle: HTMLImageElement | null;
  interval: number | null;

  constructor() {
    if (document.querySelector("#preview")) {
      throw new Error("There can only be one instance of the preview available at once.");
    }
    super();
    this.id = "preview";
    this.interval = null;
    this.imgEle = null;
    this.polling = false;

    this.buildElement();
    this.startInterval();
  }

  disconnectedCallback() {
    this.stopInterval();
  }

  buildElement() {
    this.imgEle = document.createElement('img');

    this.appendChild(this.imgEle);
  }

  startInterval() {
    if (this.polling) return;
    this.interval = setInterval(this.getNextImage, 200);
    this.polling = true;
  }

  stopInterval() {
    if (!this.polling || this.interval === null) return;
    clearInterval(this.interval);
    this.interval = null;
    this.polling = false;
  }

  getNextImage = async () => {
    if (!this.imgEle) return;
    const req = await fetch("/api/preview");
    const imgSrc = await req.text();

    this.imgEle.src = imgSrc;
  }
}
customElements.define("preview-poller", PreviewPoller);

export default PreviewPoller