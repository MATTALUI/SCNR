import PseudoCarousel from "./PseudoCarousel";
import PreviewPoller from "./PreviewPoller";
import SCNRControls from "./SCNRControls";
(async () => {
  const mainEle = document.querySelector('main');
  if (!mainEle) return;
  
  mainEle.appendChild(new SCNRControls());
  mainEle.appendChild(new PreviewPoller());
})();