interface ISkeletonLoaderConfig {
  width?: number;
  height?: number;
  displayLoading?: boolean;
}

export class SkeletonLoader extends HTMLElement {
  width: ISkeletonLoaderConfig["width"];
  height: ISkeletonLoaderConfig["height"];
  displayLoading: ISkeletonLoaderConfig["displayLoading"];

  constructor({
    width,
    height,
    displayLoading,
  }: ISkeletonLoaderConfig = {}) {
    super()
    this.width = width;
    this.height = height;
    this.displayLoading = displayLoading;
    this.buildElement();
  }

  buildElement() {
    this.classList.add("skeleton");
    if (this.width) {
      this.style.width = `${this.width}px`;
    }
    if (this.height) {
      this.style.height = `${this.height}px`;
      this.style.minHeight = `0px`;
    }
    if (this.displayLoading) {
      const label = document.createElement('span');
      label.innerHTML = 'loading';
      this.appendChild(label);
    }
  };
}

customElements.define("skeleton-loader", SkeletonLoader);

export default SkeletonLoader;