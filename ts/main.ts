import { parseQueryparams } from "./utils";
import PseudoCarousel from "./PseudoCarousel";
import PreviewPoller from "./PreviewPoller";
import SCNRControls from "./SCNRControls";
(async () => {
  const scannerEle = document.querySelector('#scanner');
  if (!scannerEle) return;
  const queryParams = parseQueryparams();

  scannerEle.appendChild(new SCNRControls());
  if (queryParams.get('projectId')) {
    scannerEle.appendChild(new PseudoCarousel());
  } else {
    scannerEle.appendChild(new PreviewPoller());
  }
})();