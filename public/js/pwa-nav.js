const anchorTags = document.querySelectorAll('a');

// Adds event to keep web app in full-screen mode
anchorTags.forEach((anchor) => {
  // Ensures that buttons without links do not get this event
  if (anchor.dataset.href) {
    anchor.addEventListener('click', () => {
      location.href = anchor.dataset.href;
    })
  }
})
