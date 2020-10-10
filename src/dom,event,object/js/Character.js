function Character(info) {
  this.mainElem = document.createElement('div');

  this.mainElem.classList.add('character');
  this.mainElem.style.left = `${info.xPos}%`;

  this.mainElem.innerHTML = `
    <div class="character">
      <div class="character-face-con character-head">
        <div class="character-face character-head-face face-front"></div>
        <div class="character-face character-head-face face-back"></div>
      </div>
      <div class="character-face-con character-torso">
        <div class="character-face character-torso-face face-front"></div>
        <div class="character-face character-torso-face face-back"></div>
      </div>
      <div class="character-face-con character-arm character-arm-right">
        <div class="character-face character-arm-face face-front"></div>
        <div class="character-face character-arm-face face-back"></div>
      </div>
      <div class="character-face-con character-arm character-arm-left">
        <div class="character-face character-arm-face face-front"></div>
        <div class="character-face character-arm-face face-back"></div>
      </div>
      <div class="character-face-con character-leg character-leg-right">
        <div class="character-face character-leg-face face-front"></div>
        <div class="character-face character-leg-face face-back"></div>
      </div>
      <div class="character-face-con character-leg character-leg-left">
        <div class="character-face character-leg-face face-front"></div>
        <div class="character-face character-leg-face face-back"></div>
      </div>
    </div>
  `;

  document.querySelector('.stage').appendChild(this.mainElem);

  this.scrollState = false; // 스크롤 중인지 아닌지
  this.lastScrollTop = 0; // 바로 이전 스크롤 위치

  this.xPos = info.xPos; // X 위치
  this.direction = ''; // 방향
  this.speed = info.speed; // 이동 속도
  this.runningState = false; // 좌,우 이동중인지 아닌지

  this.rafId = '';

  this.init();
}

Character.prototype = {
  constructor: Character,
  init() {
    const self = this;
    window.addEventListener('scroll', function scrollHandler() {
      clearTimeout(self.scrollState);

      if (!self.scrollState) {
        self.mainElem.classList.add('running');
      }

      self.scrollState = setTimeout(function timeoutHandler() {
        self.scrollState = false;
        self.mainElem.classList.remove('running');
      }, 500);

      // 이전 스크롤 위치와 현재 스크롤 위치를 비교
      if (self.lastScrollTop > this.pageYOffset) {
        // 이전 스크롤 위치가 크다면 - 스크롤 올림
        self.mainElem.setAttribute('data-direction', 'backward');
      } else {
        // 현재 스크롤 위치가 크다면 - 스크롤 내림
        self.mainElem.setAttribute('data-direction', 'forward');
      }

      self.lastScrollTop = window.pageYOffset;
    });

    window.addEventListener('keydown', function keydownHandler(event) {
      if (event.keyCode === 38 || event.keyCode === 40) {
        event.preventDefault();
      }

      if (self.runningState) {
        return;
      }

      // 왼쪽
      if (event.keyCode === 37) {
        self.direction = 'left';
        self.mainElem.setAttribute('data-direction', 'left');
        self.mainElem.classList.add('running');

        self.runningState = true;
        self.run();
        return;
      }

      // 오른쪽
      if (event.keyCode === 39) {
        self.direction = 'right';
        self.mainElem.setAttribute('data-direction', 'right');
        self.mainElem.classList.add('running');

        self.runningState = true;
        self.run();
      }
    });

    window.addEventListener('keyup', function keyupHandler() {
      self.mainElem.classList.remove('running');
      cancelAnimationFrame(self.rafId);
      self.runningState = false;
    });
  },
  run() {
    const self = this;

    if (self.direction === 'left') {
      self.xPos -= self.speed;
    }

    if (self.direction === 'right') {
      self.xPos += self.speed;
    }

    if (self.xPos < 2) {
      self.xPos = 2;
    }

    if (self.xPos > 88) {
      self.xPos = 88;
    }

    self.mainElem.style.left = `${self.xPos}%`;

    self.rafId = requestAnimationFrame(self.run.bind(self));
  }
};
