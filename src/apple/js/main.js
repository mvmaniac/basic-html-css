(() => {
  let yOffset = 0; // window.pageYOffset 대신 사용할 변수
  let prevScrollHeight = 0; // 현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
  let currentScene = 0; // 현재 활성화된(눈 앞에 보고있는) 씬(scroll-section)
  let isNewScene = false; // 새로운 scene이 시작된 순간 true

  const sceneInfo = [
    {
      // scroll-section-0
      type: 'sticky',
      heightNum: 5, // 브라우저 높이의 5배의 scrollHeight 세팅
      scrollHeight: 0,
      objects: {
        container: document.querySelector('#scroll-section-0'),
        messageA: document.querySelector('#scroll-section-0 .main-message.a'),
        messageB: document.querySelector('#scroll-section-0 .main-message.b'),
        messageC: document.querySelector('#scroll-section-0 .main-message.c'),
        messageD: document.querySelector('#scroll-section-0 .main-message.d')
      },
      values: {
        // 10% ~ 20% 구간에서 opacity 값이 0에서 1로 변경
        opacityInOfMessageA: {min: 0, max: 1, play: {start: 0.1, end: 0.2}},
        opacityInOfMessageB: {min: 0, max: 1, play: {start: 0.3, end: 0.4}},
        opacityInOfMessageC: {min: 0, max: 1, play: {start: 0.5, end: 0.6}},
        opacityInOfMessageD: {min: 0, max: 1, play: {start: 0.7, end: 0.8}},

        // 10% ~ 20% 구간에서 translateY 값이 20에서 0으로 변경 (20으로 내렸다가 0으로 올림)
        translateYInOfMessageA: {min: 20, max: 0, play: {start: 0.1, end: 0.2}},
        translateYInOfMessageB: {min: 20, max: 0, play: {start: 0.3, end: 0.4}},
        translateYInOfMessageC: {min: 20, max: 0, play: {start: 0.5, end: 0.6}},
        translateYInOfMessageD: {min: 20, max: 0, play: {start: 0.7, end: 0.8}},

        // 25% ~ 30% 구간에서 opacity 값이 0에서 1로 변경
        opacityOutOfMessageA: {min: 1, max: 0, play: {start: 0.25, end: 0.3}},
        opacityOutOfMessageB: {min: 1, max: 0, play: {start: 0.45, end: 0.5}},
        opacityOutOfMessageC: {min: 1, max: 0, play: {start: 0.65, end: 0.7}},
        opacityOutOfMessageD: {min: 1, max: 0, play: {start: 0.85, end: 0.9}},

        // 25% ~ 30% 구간에서 translateY 값이 0에서 -20으로 변경 (현재 기준으로 음수값으로 하여 위로 올림)
        // prettier-ignore
        translateYOutOfMessageA: {min: 0, max: -20, play: {start: 0.25, end: 0.3}},
        // prettier-ignore
        translateYOutOfMessageB: {min: 0, max: -20, play: {start: 0.45, end: 0.5}},
        // prettier-ignore
        translateYOutOfMessageC: {min: 0, max: -20, play: {start: 0.65, end: 0.7}},
        // prettier-ignore
        translateYOutOfMessageD: {min: 0, max: -20, play: {start: 0.85, end: 0.9}}
      }
    },
    {
      // scroll-section-1
      type: 'normal',
      // heightNum: 5, // type normal 에서는 필요 없음
      scrollHeight: 0,
      objects: {
        container: document.querySelector('#scroll-section-1')
      }
    },
    {
      // scroll-section-2
      type: 'sticky',
      heightNum: 5, // 브라우저 높이의 5배의 scrollHeight 세팅
      scrollHeight: 0,
      objects: {
        container: document.querySelector('#scroll-section-2'),
        messageA: document.querySelector('#scroll-section-2 .a'),
        messageB: document.querySelector('#scroll-section-2 .b'),
        messageC: document.querySelector('#scroll-section-2 .c'),
        pinB: document.querySelector('#scroll-section-2 .b .pin'),
        pinC: document.querySelector('#scroll-section-2 .c .pin')
      },
      values: {
        opacityInOfMessageA: {min: 0, max: 1, play: {start: 0.25, end: 0.3}},
        opacityInOfMessageB: {min: 0, max: 1, play: {start: 0.6, end: 0.65}},
        opacityInOfMessageC: {min: 0, max: 1, play: {start: 0.87, end: 0.92}},

        // prettier-ignore
        translateYInOfMessageA: {min: 20, max: 0, play: {start: 0.15, end: 0.2}},
        // prettier-ignore
        translateYInOfMessageB: {min: 30, max: 0, play: {start: 0.6, end: 0.65}},
        // prettier-ignore
        translateYInOfMessageC: {min: 30, max: 0, play: {start: 0.87, end: 0.92}},

        opacityOutOfMessageA: {min: 1, max: 0, play: {start: 0.4, end: 0.45}},
        opacityOutOfMessageB: {min: 1, max: 0, play: {start: 0.68, end: 0.73}},
        opacityOutOfMessageC: {min: 1, max: 0, play: {start: 0.95, end: 1}},

        // prettier-ignore
        translateYOutOfMessageA: {min: 0, max: -20, play: {start: 0.4, end: 0.45}},
        // prettier-ignore
        translateYOutOfMessageB: {min: 0, max: -20, play: {start: 0.68, end: 0.73}},
        // prettier-ignore
        translateYOutOfMessageC: {min: 0, max: -20, play: {start: 0.95, end: 1}},

        scaleYOfPinB: {min: 0.5, max: 1, play: {start: 0.6, end: 0.65}},
        scaleYOfPinC: {min: 0.5, max: 1, play: {start: 0.87, end: 0.92}}
      }
    },
    {
      // scroll-section-3
      type: 'sticky',
      heightNum: 5, // 브라우저 높이의 5배의 scrollHeight 세팅
      scrollHeight: 0,
      objects: {
        container: document.querySelector('#scroll-section-3'),
        canvasContainer: document.querySelector('.canvas-caption')
      },
      values: {}
    }
  ];

  function setLayout() {
    // 각 스크롤 세션의 높이 세팅
    for (let i = 0, {length} = sceneInfo; i < length; i += 1) {
      if (sceneInfo[i].type === 'sticky') {
        sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
      } else {
        sceneInfo[i].scrollHeight = sceneInfo[i].objects.container.offsetHeight; // 컨테이너 원래 높이로 적용
      }

      // prettier-ignore
      sceneInfo[i].objects.container.style.height = `${sceneInfo[i].scrollHeight}px`;
    }

    yOffset = window.pageYOffset;

    let totalScrollHeight = 0;
    for (let i = 0, {length} = sceneInfo; i < length; i += 1) {
      totalScrollHeight += sceneInfo[i].heightNum * window.innerHeight;

      if (totalScrollHeight >= yOffset) {
        currentScene = i;
        break;
      }
    }

    document.body.setAttribute('id', `show-scene-${currentScene}`);
  }

  function calculateValues(values, currentYOffset) {
    // 현재 씬(스크롤 섹션)에서 스크롤 된 범위를 비율로 구하기
    const {scrollHeight} = sceneInfo[currentScene];
    const scrollRatio = currentYOffset / scrollHeight;

    const {min, max, play} = values;

    // 애니메이션 실행 범위 값이 있다면
    if (play) {
      // start ~ end 사이에 애니메이션 실행
      const partScrollStart = play.start * scrollHeight;
      const partScrollEnd = play.end * scrollHeight;
      const partScrollHeight = partScrollEnd - partScrollStart;

      if (
        currentYOffset >= partScrollStart &&
        currentYOffset <= partScrollEnd
      ) {
        // prettier-ignore
        return (currentYOffset - partScrollStart) / partScrollHeight * (max - min) + min;
      }

      // currentYOffset < partScrollStart 인 경우 min
      // currentYOffset > partScrollStart 인 경우 max
      return currentYOffset < partScrollStart ? min : max;
    }

    // 현재 씬 높이를 기준으로 최소값 ~ 최대값 사이에서의 비율 구하기
    return scrollRatio * (max - min) + min;
  }

  function playAnimation() {
    const {objects, values, scrollHeight} = sceneInfo[currentScene];
    const currentYOffset = yOffset - prevScrollHeight;
    const scrollRatio = currentYOffset / scrollHeight; // 현재 씬에서의 스크롤된 높이

    switch (currentScene) {
      case 0: {
        let opacity;
        let translateY;

        // messageA
        if (scrollRatio <= 0.22) {
          // in
          opacity = calculateValues(values.opacityInOfMessageA, currentYOffset);
          translateY = calculateValues(
            values.translateYInOfMessageA,
            currentYOffset
          );
        } else {
          // out
          opacity = calculateValues(
            values.opacityOutOfMessageA,
            currentYOffset
          );
          translateY = calculateValues(
            values.translateYOutOfMessageA,
            currentYOffset
          );
        }

        objects.messageA.style.opacity = opacity;
        objects.messageA.style.transform = `translate3d(0, ${translateY}%, 0)`;

        // messageB
        if (scrollRatio <= 0.42) {
          // in
          opacity = calculateValues(values.opacityInOfMessageB, currentYOffset);
          translateY = calculateValues(
            values.translateYInOfMessageB,
            currentYOffset
          );
        } else {
          // out
          opacity = calculateValues(
            values.opacityOutOfMessageB,
            currentYOffset
          );
          translateY = calculateValues(
            values.translateYOutOfMessageB,
            currentYOffset
          );
        }

        objects.messageB.style.opacity = opacity;
        objects.messageB.style.transform = `translate3d(0, ${translateY}%, 0)`;

        // messageC
        if (scrollRatio <= 0.62) {
          // in
          opacity = calculateValues(values.opacityInOfMessageC, currentYOffset);
          translateY = calculateValues(
            values.translateYInOfMessageC,
            currentYOffset
          );
        } else {
          // out
          opacity = calculateValues(
            values.opacityOutOfMessageC,
            currentYOffset
          );
          translateY = calculateValues(
            values.translateYOutOfMessageC,
            currentYOffset
          );
        }

        objects.messageC.style.opacity = opacity;
        objects.messageC.style.transform = `translate3d(0, ${translateY}%, 0)`;

        // messageD
        if (scrollRatio <= 0.82) {
          // in
          opacity = calculateValues(values.opacityInOfMessageD, currentYOffset);
          translateY = calculateValues(
            values.translateYInOfMessageD,
            currentYOffset
          );
        } else {
          // out
          opacity = calculateValues(
            values.opacityOutOfMessageD,
            currentYOffset
          );
          translateY = calculateValues(
            values.translateYOutOfMessageD,
            currentYOffset
          );
        }

        objects.messageD.style.opacity = opacity;
        objects.messageD.style.transform = `translate3d(0, ${translateY}%, 0)`;

        break;
      }

      case 2: {
        let opacity;
        let translateY;
        let scaleY;

        // messageA
        if (scrollRatio <= 0.32) {
          // in
          opacity = calculateValues(values.opacityInOfMessageA, currentYOffset);
          translateY = calculateValues(
            values.translateYInOfMessageA,
            currentYOffset
          );
        } else {
          // out
          opacity = calculateValues(
            values.opacityOutOfMessageA,
            currentYOffset
          );
          translateY = calculateValues(
            values.translateYOutOfMessageA,
            currentYOffset
          );
        }

        objects.messageA.style.opacity = opacity;
        objects.messageA.style.transform = `translate3d(0, ${translateY}%, 0)`;

        // messageB
        if (scrollRatio <= 0.67) {
          // in
          opacity = calculateValues(values.opacityInOfMessageB, currentYOffset);
          translateY = calculateValues(
            values.translateYInOfMessageB,
            currentYOffset
          );
          scaleY = calculateValues(values.scaleYOfPinB, currentYOffset);
        } else {
          // out
          opacity = calculateValues(
            values.opacityOutOfMessageB,
            currentYOffset
          );
          translateY = calculateValues(
            values.translateYOutOfMessageB,
            currentYOffset
          );
          scaleY = calculateValues(values.scaleYOfPinB, currentYOffset);
        }

        objects.messageB.style.opacity = opacity;
        objects.messageB.style.transform = `translate3d(0, ${translateY}%, 0)`;
        objects.pinB.style.transform = `scaleY(${scaleY})`;

        // messageC
        if (scrollRatio <= 0.93) {
          // in
          opacity = calculateValues(values.opacityInOfMessageC, currentYOffset);
          translateY = calculateValues(
            values.translateYInOfMessageC,
            currentYOffset
          );
          scaleY = calculateValues(values.scaleYOfPinC, currentYOffset);
        } else {
          // out
          opacity = calculateValues(
            values.opacityOutOfMessageC,
            currentYOffset
          );
          translateY = calculateValues(
            values.translateYOutOfMessageC,
            currentYOffset
          );
          scaleY = calculateValues(values.scaleYOfPinC, currentYOffset);
        }

        objects.messageC.style.opacity = opacity;
        objects.messageC.style.transform = `translate3d(0, ${translateY}%, 0)`;
        objects.pinC.style.transform = `scaleY(${scaleY})`;

        break;
      }

      case 3: {
        break;
      }

      default: {
        // nothing
      }
    }
  }

  function scrollLoop() {
    isNewScene = false;
    prevScrollHeight = 0;

    for (let i = 0; i < currentScene; i += 1) {
      prevScrollHeight += sceneInfo[i].scrollHeight;
    }

    if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
      isNewScene = true;

      currentScene += 1;
      document.body.setAttribute('id', `show-scene-${currentScene}`);
    }

    if (yOffset < prevScrollHeight) {
      isNewScene = true;

      if (currentScene === 0) return; // 브라우저 바운스 효과로 인해 마이너스가 되는 것을 방지(모바일)
      currentScene -= 1;
      document.body.setAttribute('id', `show-scene-${currentScene}`);
    }

    // console.log(`currentScene: ${currentScene}`);

    if (isNewScene) return;
    playAnimation();
  }

  window.addEventListener('scroll', () => {
    yOffset = window.pageYOffset;
    scrollLoop();
  });
  window.addEventListener('resize', setLayout);
  window.addEventListener('load', setLayout);
})();
