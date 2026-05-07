const slider = document.getElementById("comparisonSlider");
const beforeWrapper = document.getElementById("beforeWrapper");
const afterWrapper = document.getElementById("afterWrapper");
const sliderButton = document.getElementById("sliderButton");
const sliderLine = document.getElementById("sliderLine");

let isDragging = false;

// UPDATE
function updateSlider(x) {
  const rect = slider.getBoundingClientRect();
  let position = x - rect.left;
  if (position < 0) position = 0;
  if (position > rect.width) position = rect.width;
  const percent = (position / rect.width) * 100;

  // LEFT IMAGE
  beforeWrapper.style.width = percent + "%";
  // RIGHT IMAGE
  afterWrapper.style.width = (100 - percent) + "%";
  // HANDLE
  sliderLine.style.left = percent + "%";
  sliderButton.style.left = percent + "%";
}

// DESKTOP
slider.addEventListener("mousedown", () => {
  isDragging = true;
});

window.addEventListener("mouseup", () => {
  isDragging = false;
});

window.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  updateSlider(e.clientX);
});

// MOBILE
slider.addEventListener("touchstart", () => {
  isDragging = true;
});

window.addEventListener("touchend", () => {
  isDragging = false;
});

window.addEventListener("touchmove", (e) => {
  if (!isDragging) return;
  updateSlider(e.touches[0].clientX);
});

// CLICK
slider.addEventListener("click", (e) => {
  updateSlider(e.clientX);
});