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
    const updateControls = () => {
      previousButton.disabled = track.scrollLeft <= 1;
      nextButton.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 1;
    };

    const move = (direction) => {
      const firstCard = track.querySelector('[role="listitem"]');
      if (!firstCard) return;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      const motion = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
      track.scrollBy({ left: direction * (firstCard.getBoundingClientRect().width + gap), behavior: motion });
    };

    previousButton.addEventListener('click', () => move(-1));
    nextButton.addEventListener('click', () => move(1));
    track.addEventListener('scroll', updateControls, { passive: true });
    window.addEventListener('resize', updateControls);
    updateControls();
  }
}
