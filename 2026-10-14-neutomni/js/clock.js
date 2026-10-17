document.addEventListener("DOMContentLoaded", function () {
  function updateDateTime() {
    const now = new Date();

    const dateEl = document.querySelector(".date");
    const timeEl = document.querySelector(".time");

    if (!dateEl || !timeEl) return;

    const date = now.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric"
    });

    const time = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    });

    dateEl.textContent = date;
    timeEl.textContent = time;
  }

  updateDateTime();
  setInterval(updateDateTime, 60);
});
