document.addEventListener('DOMContentLoaded', function () {
  const buttonContainer = document.getElementById('toggleButtonContainer');
  const originalOffsetTop = buttonContainer.offsetTop;

  window.addEventListener('scroll', function () {
    if (window.scrollY > originalOffsetTop) {
      buttonContainer.style.position = 'fixed';
      buttonContainer.style.bottom = '10px';
      buttonContainer.style.left = '10px';
      buttonContainer.style.zIndex = '1000';
      buttonContainer.style.transition = 'all 0.3s ease';
    } else {
      buttonContainer.style.position = 'static';
      buttonContainer.style.transition = 'none';
    }
  });
});
