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
        messageD: document.querySelector('#scroll-section-0 .main-message.d'),
        canvas: document.querySelector('#video-canvas-0'),
        context: document.querySelector('#video-canvas-0').getContext('2d'),
        images: []
      },
      values: {
        imageCount: 300,
        imageSequence: {min: 0, max: 299},
        opacityOfCanvas: {min: 1, max: 0, play: {start: 0.9, end: 1}},

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
        pinC: document.querySelector('#scroll-section-2 .c .pin'),
        canvas: document.querySelector('#video-canvas-1'),
        context: document.querySelector('#video-canvas-1').getContext('2d'),
        images: []
      },
      values: {
        imageCount: 960,
        imageSequence: {min: 0, max: 959},
        opacityInOfCanvas: {min: 0, max: 1, play: {start: 0, end: 0.1}},
        opacityOutOfCanvas: {min: 1, max: 0, play: {start: 0.95, end: 1}},

        opacityInOfMessageA: {min: 0, max: 1, play: {start: 0.25, end: 0.3}},
        opacityInOfMessageB: {min: 0, max: 1, play: {start: 0.6, end: 0.65}},
        opacityInOfMessageC: {min: 0, max: 1, play: {start: 0.87, end: 0.92}},

        translateYInOfMessageA: {min: 20, max: 0, play: {start: 0.15, end: 0.2}},
        translateYInOfMessageB: {min: 30, max: 0, play: {start: 0.6, end: 0.65}},
        translateYInOfMessageC: {min: 30, max: 0, play: {start: 0.87, end: 0.92}},

        opacityOutOfMessageA: {min: 1, max: 0, play: {start: 0.4, end: 0.45}},
        opacityOutOfMessageB: {min: 1, max: 0, play: {start: 0.68, end: 0.73}},
        opacityOutOfMessageC: {min: 1, max: 0, play: {start: 0.95, end: 1}},

        translateYOutOfMessageA: {min: 0, max: -20, play: {start: 0.4, end: 0.45}},
        translateYOutOfMessageB: {min: 0, max: -20, play: {start: 0.68, end: 0.73}},
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
        canvasCaption: document.querySelector('.canvas-caption'),
        canvas: document.querySelector('.image-blend-canvas'),
        context: document.querySelector('.image-blend-canvas').getContext('2d'),
        tempContext: document.createElement('canvas').getContext('2d'),
        images: []
      },
      values: {
        imageCount: 2,
        rect1X: {min: 0, max: 0, play: {start: 0, end: 0}},
        rect2X: {min: 0, max: 0, play: {start: 0, end: 0}},
        blendHeight: {min: 0, max: 0, play: {start: 0, end: 0}},
        scaleOfCanvas: {min: 0, max: 0, play: {start: 0, end: 0}},
        opacityOfCanvasCaption: {min: 0, max: 1, play: {start: 0, end: 0}},
        translateYOfCanvasCaption: {min: 20, max: 0, play: {start: 0, end: 0}},
        rectStartY: 0
      }
    }
  ];

  function checkMenu() {
    // global-nav 높이 값이 44임
    if (yOffset > 44) {
      document.body.classList.add('local-nav-sticky');
    } else {
      document.body.classList.remove('local-nav-sticky');
    }
  }

  function setCanvasImages(sceneInfoObject, imagePath, imagePrefix, startImageNumber) {
    const {values, objects} = sceneInfoObject;

    let imgElem;

    for (let i = 0, length = values.imageCount; i < length; i += 1) {
      imgElem = new Image();
      imgElem.src = `${imagePath}/${imagePrefix}${startImageNumber + i}.jpg`;

      objects.images.push(imgElem);
    }
  }

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

    // 높이에 맞춤, 동영상의 기본 높이가 1080
    const heightRatio = window.innerHeight / 1080;
    sceneInfo[0].objects.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
    sceneInfo[2].objects.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
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

      if (currentYOffset >= partScrollStart && currentYOffset <= partScrollEnd) {
        return ((currentYOffset - partScrollStart) / partScrollHeight) * (max - min) + min;
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

        const sequence = Math.round(calculateValues(values.imageSequence, currentYOffset));
        objects.context.drawImage(objects.images[sequence], 0, 0);
        objects.canvas.style.opacity = calculateValues(values.opacityOfCanvas, currentYOffset);

        // messageA
        if (scrollRatio <= 0.22) {
          // in
          opacity = calculateValues(values.opacityInOfMessageA, currentYOffset);
          translateY = calculateValues(values.translateYInOfMessageA, currentYOffset);
        } else {
          // out
          opacity = calculateValues(values.opacityOutOfMessageA, currentYOffset);
          translateY = calculateValues(values.translateYOutOfMessageA, currentYOffset);
        }

        objects.messageA.style.opacity = opacity;
        objects.messageA.style.transform = `translate3d(0, ${translateY}%, 0)`;

        // messageB
        if (scrollRatio <= 0.42) {
          // in
          opacity = calculateValues(values.opacityInOfMessageB, currentYOffset);
          translateY = calculateValues(values.translateYInOfMessageB, currentYOffset);
        } else {
          // out
          opacity = calculateValues(values.opacityOutOfMessageB, currentYOffset);
          translateY = calculateValues(values.translateYOutOfMessageB, currentYOffset);
        }

        objects.messageB.style.opacity = opacity;
        objects.messageB.style.transform = `translate3d(0, ${translateY}%, 0)`;

        // messageC
        if (scrollRatio <= 0.62) {
          // in
          opacity = calculateValues(values.opacityInOfMessageC, currentYOffset);
          translateY = calculateValues(values.translateYInOfMessageC, currentYOffset);
        } else {
          // out
          opacity = calculateValues(values.opacityOutOfMessageC, currentYOffset);
          translateY = calculateValues(values.translateYOutOfMessageC, currentYOffset);
        }

        objects.messageC.style.opacity = opacity;
        objects.messageC.style.transform = `translate3d(0, ${translateY}%, 0)`;

        // messageD
        if (scrollRatio <= 0.82) {
          // in
          opacity = calculateValues(values.opacityInOfMessageD, currentYOffset);
          translateY = calculateValues(values.translateYInOfMessageD, currentYOffset);
        } else {
          // out
          opacity = calculateValues(values.opacityOutOfMessageD, currentYOffset);
          translateY = calculateValues(values.translateYOutOfMessageD, currentYOffset);
        }

        objects.messageD.style.opacity = opacity;
        objects.messageD.style.transform = `translate3d(0, ${translateY}%, 0)`;

        break;
      }

      case 2: {
        let opacity;
        let translateY;
        let scaleY;

        const sequence = Math.round(calculateValues(values.imageSequence, currentYOffset));
        objects.context.drawImage(objects.images[sequence], 0, 0);

        if (scrollRatio <= 0.5) {
          // in
          objects.canvas.style.opacity = calculateValues(values.opacityInOfCanvas, currentYOffset);
        } else {
          // out
          objects.canvas.style.opacity = calculateValues(values.opacityOutOfCanvas, currentYOffset);
        }

        // messageA
        if (scrollRatio <= 0.32) {
          // in
          opacity = calculateValues(values.opacityInOfMessageA, currentYOffset);
          translateY = calculateValues(values.translateYInOfMessageA, currentYOffset);
        } else {
          // out
          opacity = calculateValues(values.opacityOutOfMessageA, currentYOffset);
          translateY = calculateValues(values.translateYOutOfMessageA, currentYOffset);
        }

        objects.messageA.style.opacity = opacity;
        objects.messageA.style.transform = `translate3d(0, ${translateY}%, 0)`;

        // messageB
        if (scrollRatio <= 0.67) {
          // in
          opacity = calculateValues(values.opacityInOfMessageB, currentYOffset);
          translateY = calculateValues(values.translateYInOfMessageB, currentYOffset);
          scaleY = calculateValues(values.scaleYOfPinB, currentYOffset);
        } else {
          // out
          opacity = calculateValues(values.opacityOutOfMessageB, currentYOffset);
          translateY = calculateValues(values.translateYOutOfMessageB, currentYOffset);
          scaleY = calculateValues(values.scaleYOfPinB, currentYOffset);
        }

        objects.messageB.style.opacity = opacity;
        objects.messageB.style.transform = `translate3d(0, ${translateY}%, 0)`;
        objects.pinB.style.transform = `scaleY(${scaleY})`;

        // messageC
        if (scrollRatio <= 0.93) {
          // in
          opacity = calculateValues(values.opacityInOfMessageC, currentYOffset);
          translateY = calculateValues(values.translateYInOfMessageC, currentYOffset);
          scaleY = calculateValues(values.scaleYOfPinC, currentYOffset);
        } else {
          // out
          opacity = calculateValues(values.opacityOutOfMessageC, currentYOffset);
          translateY = calculateValues(values.translateYOutOfMessageC, currentYOffset);
          scaleY = calculateValues(values.scaleYOfPinC, currentYOffset);
        }

        objects.messageC.style.opacity = opacity;
        objects.messageC.style.transform = `translate3d(0, ${translateY}%, 0)`;
        objects.pinC.style.transform = `scaleY(${scaleY})`;

        // currentScene 3에서 쓰는 캔버스를 미리 그려주기 시작
        if (scrollRatio > 0.9) {
          // eslint-disable-next-line no-shadow
          const {objects, values} = sceneInfo[3];
          const widthRatio = window.innerWidth / objects.canvas.width;
          const heightRatio = window.innerHeight / objects.canvas.height;

          let canvasScaleRatio;

          if (widthRatio <= heightRatio) {
            // 캔버스 보다 브라우저 창이 홀쭉한 경우
            canvasScaleRatio = heightRatio;
          } else {
            // 캔버스 보다 브라우저 창이 납작한 경우
            canvasScaleRatio = widthRatio;
          }

          objects.canvas.style.transform = `scale(${canvasScaleRatio})`;

          objects.context.fillStyle = 'white';
          objects.context.drawImage(
            objects.images[0],
            0,
            0,
            objects.canvas.width,
            objects.canvas.height
          );

          // 캔버스 사이즈에 맞춰 가정한 innerWidth와 innerHeight
          // document.body.offsetWidth 은 스크롤 넓이를 제외한 값
          const recalculatedInnerWidth = document.body.offsetWidth / canvasScaleRatio;
          const recalculatedInnerHeight = window.innerHeight / canvasScaleRatio;

          const whiteRectWidth = recalculatedInnerWidth * 0.15;

          values.rect1X.min = (objects.canvas.width - recalculatedInnerWidth) / 2;
          values.rect1X.max = values.rect1X.min - whiteRectWidth;
          values.rect2X.min = values.rect1X.min + recalculatedInnerWidth - whiteRectWidth;
          values.rect2X.max = values.rect2X.min + whiteRectWidth;

          objects.context.fillRect(
            values.rect1X.min,
            0,
            parseInt(whiteRectWidth, 10),
            objects.canvas.height
          );

          objects.context.fillRect(
            values.rect2X.min,
            0,
            parseInt(whiteRectWidth, 10),
            objects.canvas.height
          );
        }

        break;
      }

      case 3: {
        // 가로/세로 모두 꽉 차게 하기 위해 여기서 세팅(계산 필요)
        const widthRatio = window.innerWidth / objects.canvas.width;
        const heightRatio = window.innerHeight / objects.canvas.height;

        let canvasScaleRatio;

        if (widthRatio <= heightRatio) {
          // 캔버스 보다 브라우저 창이 홀쭉한 경우
          canvasScaleRatio = heightRatio;
        } else {
          // 캔버스 보다 브라우저 창이 납작한 경우
          canvasScaleRatio = widthRatio;
        }

        objects.canvas.style.transform = `scale(${canvasScaleRatio})`;
        objects.context.fillStyle = 'white';
        objects.context.drawImage(
          objects.images[0],
          0,
          0,
          objects.canvas.width,
          objects.canvas.height
        );

        // 캔버스 사이즈에 맞춰 가정한 innerWidth와 innerHeight
        // document.body.offsetWidth 은 스크롤 넓이를 제외한 값
        const recalculatedInnerWidth = document.body.offsetWidth / canvasScaleRatio;
        const recalculatedInnerHeight = window.innerHeight / canvasScaleRatio;

        if (!values.rectStartY) {
          // values.rectStartY = objects.canvas.getBoundingClientRect().top;

          // prettier-ignore
          // 현재 캔버스 높이(objects.canvas.height) 에서 scale 값이 적용 된 캔버스 높이(objects.canvas.height * canvasScaleRatio)를 빼면
          // scale 적용된 캔버스와의 높이 차이 값을 구할 수 있고 거기서 나누기 2를 해서 위/아래 중 위쪽 영역의 높이 만 가져옴
          // 나온 높이 값을 현재 문서에서 캔버스가 떨어진 위치값(objects.canvas.offsetTop)에 더해서 현재 캔버스의 정확한 top 값을 가져옴
          values.rectStartY = objects.canvas.offsetTop + ((objects.canvas.height - objects.canvas.height * canvasScaleRatio) / 2);

          values.rect1X.play.start = window.innerHeight / 2 / scrollHeight;
          values.rect1X.play.end = values.rectStartY / scrollHeight;

          values.rect2X.play.start = window.innerHeight / 2 / scrollHeight;
          values.rect2X.play.end = values.rectStartY / scrollHeight;
        }

        const whiteRectWidth = recalculatedInnerWidth * 0.15;

        values.rect1X.min = (objects.canvas.width - recalculatedInnerWidth) / 2;
        values.rect1X.max = values.rect1X.min - whiteRectWidth;
        values.rect2X.min = values.rect1X.min + recalculatedInnerWidth - whiteRectWidth;
        values.rect2X.max = values.rect2X.min + whiteRectWidth;

        // 좌우 흰색 박스 그리기 fillRect(x, y, width, height)
        objects.context.fillRect(
          parseInt(calculateValues(values.rect1X, currentYOffset), 10),
          0,
          parseInt(whiteRectWidth, 10),
          objects.canvas.height
        );

        objects.context.fillRect(
          parseInt(calculateValues(values.rect2X, currentYOffset), 10),
          0,
          parseInt(whiteRectWidth, 10),
          objects.canvas.height
        );

        if (scrollRatio < values.rect1X.play.end) {
          // 캔버스가 브라우저 상단에 닿기 전
          objects.canvas.classList.remove('sticky');
        } else {
          // 캔버스가 브라우저 상단에 닿은 후
          objects.canvas.classList.add('sticky');

          // prettier-ignore
          objects.canvas.style.top = `${-(objects.canvas.height - objects.canvas.height * canvasScaleRatio) / 2}px`

          // 이미지 블렌드 처리
          values.blendHeight.min = 0;
          values.blendHeight.max = objects.canvas.height;
          values.blendHeight.play.start = values.rect1X.play.end;
          values.blendHeight.play.end = values.blendHeight.play.start + 0.2; // start 시점으로 부터 0.2(20%)까지 실행

          const blendHeight = calculateValues(values.blendHeight, currentYOffset);

          // TODO: 최초 1번만 그리기?
          objects.tempContext.canvas.width = objects.canvas.width;
          objects.tempContext.canvas.height = objects.canvas.height;
          objects.tempContext.drawImage(
            objects.images[1],
            0,
            0,
            objects.canvas.width,
            objects.canvas.height
          );

          objects.context.drawImage(
            objects.tempContext.canvas,
            0,
            objects.canvas.height - blendHeight,
            objects.canvas.width,
            blendHeight,
            0,
            objects.canvas.height - blendHeight,
            objects.canvas.width,
            blendHeight
          );

          if (scrollRatio > values.blendHeight.play.end) {
            // 블렌드된 이미지 축소
            values.scaleOfCanvas.min = canvasScaleRatio;
            values.scaleOfCanvas.max = document.body.offsetWidth / (1.5 * objects.canvas.width); // 분수니깐 분모의 값을 증가시켜서 결과값을 작게 만듬

            values.scaleOfCanvas.play.start = values.blendHeight.play.end;
            values.scaleOfCanvas.play.end = values.scaleOfCanvas.play.start + 0.2; // start 시점으로 부터 0.2(20%)까지 실행

            const scaleOfCanvas = calculateValues(values.scaleOfCanvas, currentYOffset);
            objects.canvas.style.transform = `scale(${scaleOfCanvas})`;
            objects.canvas.style.marginTop = '0';
          }

          if (scrollRatio > values.scaleOfCanvas.play.end && values.scaleOfCanvas.play.end > 0) {
            objects.canvas.classList.remove('sticky');
            objects.canvas.style.marginTop = `${scrollHeight * 0.4}px`; // 0.2로 더해준 부분이 2군데 라서 0.4?

            values.opacityOfCanvasCaption.play.start = values.scaleOfCanvas.play.end;
            values.opacityOfCanvasCaption.play.end = values.opacityOfCanvasCaption.play.start + 0.1;

            objects.canvasCaption.style.opacity = calculateValues(
              values.opacityOfCanvasCaption,
              currentYOffset
            );

            values.translateYOfCanvasCaption.play.start = values.opacityOfCanvasCaption.play.start;
            values.translateYOfCanvasCaption.play.end = values.opacityOfCanvasCaption.play.end;

            const translateYOfCanvasCaption = calculateValues(
              values.translateYOfCanvasCaption,
              currentYOffset
            );
            objects.canvasCaption.style.transform = `translate3d(0, ${translateYOfCanvasCaption}%, 0)`;
          }
        }

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
    checkMenu();
  });
  window.addEventListener('resize', setLayout);
  window.addEventListener('load', () => {
    setLayout();

    const {objects} = sceneInfo[0];
    objects.context.drawImage(objects.images[0], 0, 0);
  });

  // 캔버스에 사용될 이미지 로드
  setCanvasImages(sceneInfo[0], '/apple/video/001', 'IMG_', 6726);
  setCanvasImages(sceneInfo[2], '/apple/video/002', 'IMG_', 7027);
  setCanvasImages(sceneInfo[3], '/apple/images', 'blend-image-', 1);

  // scene3 의 캔버스는 현재 모니터의 해상도에 맞춰서 보여줌
  document.querySelector('.image-blend-canvas').setAttribute('width', window.screen.width);
  document.querySelector('.image-blend-canvas').setAttribute('height', window.screen.height);
})();
