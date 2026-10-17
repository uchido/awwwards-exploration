document.addEventListener("DOMContentLoaded", function () {
  if (typeof CircleType === "undefined") return;

  document.querySelectorAll(".circle-cta").forEach(function (wrapper) {
    const circle = wrapper.querySelector(".circle");
    const text = wrapper.querySelector(".circle-text");

    if (!circle || !text) return;

    const circleType = new CircleType(text);

    function updateCircle() {
      const circleSize = circle.getBoundingClientRect().width;

      // Distance of the text from the centre of the circle
      const radius = circleSize * 0.9;

      circleType.radius(radius);
    }

    updateCircle();
    window.addEventListener("resize", updateCircle);
  });
});
