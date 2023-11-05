import { parseQueryparams } from "./utils";
import PseudoCarousel from "./PseudoCarousel";
import PreviewPoller from "./PreviewPoller";
import SCNRControls from "./SCNRControls";
import ProjectsSection from "./ProjectsSection";
(async () => {
  const mainEle = document.querySelector('main');
  const scannerEle = document.querySelector('#scanner');
  if (!scannerEle || !mainEle) return;
  const queryParams = parseQueryparams();

  scannerEle.appendChild(new SCNRControls());
  if (queryParams.get('projectId')) {
    scannerEle.appendChild(new PseudoCarousel());
  } else {
    scannerEle.appendChild(new PreviewPoller());
  }

  mainEle.appendChild(new ProjectsSection());
})();