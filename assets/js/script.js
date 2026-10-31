const button = document.querySelector('.header__burger');
const menu = document.querySelector('.header__nav');
const closeMenu = () => {
  if (!button || !menu) return;
  menu.classList.remove('active');
  button.classList.remove('burger_active');
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-label', 'Открыть меню');
};

if (button && menu) {
  button.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('active');
    button.classList.toggle('burger_active', isOpen);
    button.setAttribute('aria-expanded', String(isOpen));
    button.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
  });

  menu.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
}



let anchors = document.querySelectorAll('a[href*="#"]');
for (let anchor of anchors) {
  anchor.addEventListener("click", function (event) {
    let blockID = anchor.getAttribute("href");
    if (!blockID || !blockID.startsWith('#') || blockID === '#') return;
    const target = document.querySelector(blockID);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
}

const goTop = document.querySelector(".go_top");
if (goTop) {
  window.addEventListener("scroll", function () {
    goTop.style.opacity = window.scrollY > 0 ? 1 : 0;
  });
}

const servicesSlider = document.querySelector('.services-slider');
if (servicesSlider) {
  const track = servicesSlider.querySelector('.help__block');
  const previousButton = servicesSlider.querySelector('.services-slider__button--previous');
  const nextButton = servicesSlider.querySelector('.services-slider__button--next');

  if (track && previousButton && nextButton) {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let autoplayTimer = null;
    let restartTimer = null;

    const updateControls = () => {
      previousButton.disabled = track.scrollLeft <= 1;
      nextButton.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 1;
    };

    const getStep = () => {
      const firstCard = track.querySelector('[role="listitem"]');
      if (!firstCard) return track.clientWidth;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return firstCard.getBoundingClientRect().width + gap;
    };

    const move = (direction) => {
      track.scrollBy({ left: direction * getStep(), behavior: reducedMotion.matches ? 'auto' : 'smooth' });
    };

    const pauseAutoplay = () => {
      window.clearInterval(autoplayTimer);
      window.clearTimeout(restartTimer);
      autoplayTimer = null;
      restartTimer = null;
    };

    const startAutoplay = () => {
      pauseAutoplay();
      if (reducedMotion.matches || document.hidden || track.scrollWidth <= track.clientWidth + 1) return;
      autoplayTimer = window.setInterval(() => {
        const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
        if (atEnd) {
          track.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          move(1);
        }
      }, 5000);
    };

    const handleManualMove = (direction) => {
      pauseAutoplay();
      move(direction);
      restartTimer = window.setTimeout(startAutoplay, 9000);
    };

    previousButton.addEventListener('click', () => handleManualMove(-1));
    nextButton.addEventListener('click', () => handleManualMove(1));
    track.addEventListener('scroll', updateControls, { passive: true });
    window.addEventListener('resize', () => {
      updateControls();
      startAutoplay();
    });
    servicesSlider.addEventListener('mouseenter', pauseAutoplay);
    servicesSlider.addEventListener('mouseleave', startAutoplay);
    servicesSlider.addEventListener('focusin', pauseAutoplay);
    servicesSlider.addEventListener('focusout', (event) => {
      if (!servicesSlider.contains(event.relatedTarget)) startAutoplay();
    });
    track.addEventListener('touchstart', pauseAutoplay, { passive: true });
    track.addEventListener('touchend', () => {
      restartTimer = window.setTimeout(startAutoplay, 7000);
    }, { passive: true });
    document.addEventListener('visibilitychange', () => document.hidden ? pauseAutoplay() : startAutoplay());
    reducedMotion.addEventListener('change', startAutoplay);
    updateControls();
    startAutoplay();
  }
}
