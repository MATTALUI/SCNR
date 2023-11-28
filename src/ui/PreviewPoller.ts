export class PreviewPoller extends HTMLElement {
  polling: boolean;
  imgEle: HTMLImageElement | null;
  interval: number | null;
  failures: number;

  constructor() {
    if (document.querySelector("#preview")) {
      throw new Error("There can only be one instance of the preview available at once.");
    }
    super();
    this.id = "preview";
    this.interval = null;
    this.imgEle = null;
    this.polling = false;
    this.failures = 0;

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
    this.interval = setInterval(this.getNextImage, 690);
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
    try {
      const req = await fetch("/api/preview");
      const imgSrc = await req.text();
      if (req.status !== 200) throw new Error("Non 200 status code: " + imgSrc);
      if (!imgSrc) throw new Error("Empty image result");

      this.imgEle.src = imgSrc;
      this.failures = 0;
    } catch (e) {
      console.error(e);
      this.failures++;
      if (this.failures >= 10) {
        this.stopInterval();
      }
    }
  }
}
customElements.define("preview-poller", PreviewPoller);

export default PreviewPoller