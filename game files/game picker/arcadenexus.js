$(document).ready(function () {

    $('.game-card').on('click', function () {
        const gameFile = $(this).data('game');

        $('body').fadeOut(300, function () {
            window.location.href = gameFile;
        });
    });

});

$(function(){
  const cards = document.querySelectorAll('.game-card');

  function updateCards(){
    const vh = window.innerHeight;
    const centerY = vh / 2;


    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.top + rect.height / 2;

      const distance = Math.abs(cardCenter - centerY);

      const maxDistance = vh * 0.6;

      let focus = 1 - distance / maxDistance;
      focus = Math.max(0, Math.min(focus, 1));

      const scale = 0.94 + focus * 0.06;
      const translateY = (1 - focus) * 28;
      const opacity = 0.4 + focus * 0.6;

      const shadowStrength = 0.15 + focus * 0.35;
      const shadowBlur = 20 + focus * 40;

      card.style.transform =
        `scale(${scale}) translateY(${translateY}px)`;

      card.style.opacity = opacity;

      card.style.boxShadow =
        `0 ${10 + focus * 20}px ${shadowBlur}px rgba(0,0,0,${shadowStrength})`;
    
      card.style.filter = 
        focus > 0.8 ? "brightness(1.1)" : "brightness(0.95)";

    });
  }

  window.addEventListener('scroll', updateCards);
  window.addEventListener('resize', updateCards);
  updateCards();
});

$(function(){
  const title = document.querySelector('.scroll-title');
  const subtitle = document.querySelector('.scroll-subtitle');

  if(!title || !subtitle) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    const fadeDistance = 340;

    const progress = Math.min(scrollY / fadeDistance, 1);

    const opacity = 1 - progress;

    const translateY = progress * -24;

    title.style.opacity = opacity;
    title.style.transform = `translateY(${translateY}px)`;

    subtitle.style.opacity = opacity;
    subtitle.style.transform = `translateY(${translateY}px)`;
  });
});
