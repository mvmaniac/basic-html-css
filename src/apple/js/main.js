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
        opacityOfMessageA: [0, 1]
      }
    },
    {
      // scroll-section-1
      type: 'normal',
      heightNum: 5, // 브라우저 높이의 5배의 scrollHeight 세팅
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
        container: document.querySelector('#scroll-section-2')
      }
    },
    {
      // scroll-section-3
      type: 'sticky',
      heightNum: 5, // 브라우저 높이의 5배의 scrollHeight 세팅
      scrollHeight: 0,
      objects: {
        container: document.querySelector('#scroll-section-3')
      }
    }
  ];

  function setLayout() {
    // 각 스크롤 세션의 높이 세팅
    for (let i = 0, {length} = sceneInfo; i < length; i += 1) {
      sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
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
    const scrollRatio = currentYOffset / sceneInfo[currentScene].scrollHeight;
    const result = scrollRatio * (values[1] - values[0] + values[0]);
    return result;
  }

  function playAnimation() {
    const {objects, values} = sceneInfo[currentScene];
    const currentYOffset = yOffset - prevScrollHeight;

    switch (currentScene) {
      case 0: {
        const opacityInOfMessageA = calculateValues(
          values.opacityOfMessageA,
          currentYOffset
        );

        objects.messageA.style.opacity = opacityInOfMessageA;
        break;
      }

      case 1: {
        break;
      }

      case 2: {
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
