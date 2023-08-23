(function wall3d() {
  const stageElem = document.querySelector('.stage');
  const houseElem = document.querySelector('.house');
  const barElem = document.querySelector('.progress-bar');
  const selectCharacterElem = document.querySelector('.select-character');

  const mousePos = { x: 0, y: 0 };

  let maxScrollValue = 0;

  function resizeHandler() {
    maxScrollValue = document.body.offsetHeight - window.innerHeight;
  }

  window.addEventListener('scroll', () => {
    const scrollPer = window.pageYOffset / maxScrollValue;
    const zMove = scrollPer * 980 - 490; // house 초기값이 -490 라서...
    houseElem.style.transform = `translate3d(0, 0, ${zMove}vw)`;

    // progress bar
    barElem.style.width = `${scrollPer * 100}%`;
  });

  window.addEventListener('mousemove', (event) => {
    mousePos.x = -1 + (event.clientX / window.innerWidth) * 2;
    mousePos.y = 1 - (event.clientY / window.innerHeight) * 2;

    stageElem.style.transform = `
      rotateX(${mousePos.y * 5}deg) 
      rotateY(${mousePos.x * 5}deg)
    `;
  });

  window.addEventListener('resize', resizeHandler);

  stageElem.addEventListener('click', (event) => {
    // eslint-disable-next-line no-new, no-undef
    new Character({
      xPos: (event.clientX / window.innerWidth) * 100,
      speed: Math.random() * 0.4 + 0.1, // 최소 0.1
    });
  });

  selectCharacterElem.addEventListener('click', (event) => {
    const value = event.target.getAttribute('data-char');
    document.body.setAttribute('data-char', value);
  });

  resizeHandler();
})();
