(async () => {
  const projectId = "testprojectid"
  const req = await fetch(`/api/images/${projectId}`);
  const carousel = document.querySelector('#carousel');
  const images = await req.json();
  // State
  let threshold = 25;
  let activeIndex = 0;
  let grabbing = false;
  let delta = 0;
  // Build Initial UI
  images.forEach((src, i) => {
    const image = document.createElement('img');
    image.src = src;
    if (i === activeIndex) image.classList.add("active");
    image.setAttribute("data-index", i.toString());
    carousel.appendChild(image);
  });
  // Add Listeners
  const handleMousemove = (event) => {
    event.preventDefault();
    delta += event.movementX;
    if (Math.abs(delta) < threshold) return;
    // Might have to adjust this depending on the rotation order of the images
    const indexChange = Math.sign(delta);
    let newIndex = activeIndex + indexChange;
    if (newIndex === images.length) newIndex = 0;
    if (newIndex < 0) newIndex = images.length - 1;
    document.querySelector(`img[data-index="${activeIndex}"]`).classList.remove("active");
    document.querySelector(`img[data-index="${newIndex}"]`).classList.add("active");
    activeIndex = newIndex;
    delta = 0;
  }
  const handleMousedown = (event) => {
    event.preventDefault();
    document.body.classList.add("grabbing");
    document.body.addEventListener("mousemove", handleMousemove);
    grabbing = true;
    delta = 0;

  };
  const handleMouseup = (event) => {
    event.preventDefault();
    document.body.classList.remove("grabbing");
    document.body.removeEventListener("mousemove", handleMousemove);
    grabbing = false;
    delta = 0;
  };

  carousel.addEventListener("mousedown", handleMousedown);
  carousel.addEventListener("mouseup", handleMouseup);
})();