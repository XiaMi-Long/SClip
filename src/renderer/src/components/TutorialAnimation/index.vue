<script setup lang="ts">
// 动画总区域公共组件
// 这个组件封装了SClip Logo的开场动画效果

const leftShapeMotion = {
  initial: {
    opacity: 0,
    x: '100%'
  },
  enter: {
    opacity: 1,
    x: ['100%', '0%', '-110%'],
    times: [0, 0.5, 1],
    transition: {
      x: {
        duration: 2000,
        ease: 'anticipate'
      }
    }
  }
}

const rightShapeMotion = {
  initial: {
    opacity: 0,
    x: '-100%'
  },
  enter: {
    opacity: 1,
    x: ['-100%', '0%', '110%'],
    times: [0, 0.5, 1],
    transition: {
      x: {
        duration: 2000,
        ease: 'anticipate'
      }
    }
  }
}

const animationContainerMotion = {
  initial: {
    opacity: 1,
    scale: 1
  },
  enter: {
    opacity: 1,
    scale: [1, 0.8, 0.75, 0.65, 1],
    transition: {
      scale: {
        duration: 1500,
        times: [0, 0.25, 0.5, 0.75, 1],
        ease: 'easeOut',
        delay: 1500
      }
    }
  }
}

const logoSTextMotion = {
  initial: {
    opacity: 0,
    y: '-100%',
    x: '500%'
  },
  enter: {
    y: '0%',
    x: ['500%', '0%', '0%', '0%'],
    opacity: 1,
    transition: {
      x: {
        duration: 1200,
        times: [0, 0.7, 0.9, 1],
        ease: 'easeOut',
        delay: 1500
      },
      y: {
        duration: 400,
        times: [0, 1],
        ease: 'anticipate',
        delay: 1500
      },
      opacity: {
        duration: 400,
        times: [0, 1],
        ease: 'anticipate',
        delay: 1500
      }
    }
  }
}

const logoCTextMotion = {
  initial: {
    opacity: 0,
    y: '-100%',
    x: '500%'
  },
  enter: {
    x: ['500%', '0%', '0%', '0%'],
    opacity: 1,
    y: '0%',
    transition: {
      x: {
        duration: 1000,
        times: [0, 0.7, 0.9, 1],
        ease: 'easeOut',
        delay: 1700
      },
      y: {
        duration: 400,
        times: [0, 1],
        ease: 'anticipate',
        delay: 1700
      },
      opacity: {
        duration: 400,
        times: [0, 1],
        ease: 'anticipate',
        delay: 1700
      }
    }
  }
}

const logoLTextMotion = {
  initial: {
    opacity: 0,
    y: '-100%',
    x: '500%'
  },
  enter: {
    x: ['500%', '0%', '0%', '0%'],
    opacity: 1,
    y: '0%',
    transition: {
      x: {
        duration: 800,
        times: [0, 0.7, 0.9, 1],
        ease: 'easeOut',
        delay: 1900
      },
      y: {
        duration: 400,
        times: [0, 1],
        ease: 'anticipate',
        delay: 1900
      },
      opacity: {
        duration: 400,
        times: [0, 1],
        ease: 'anticipate',
        delay: 1900
      }
    }
  }
}

const logoITextMotion = {
  initial: {
    opacity: 0,
    y: '-100%',
    x: '500%'
  },
  enter: {
    x: ['500%', '0%', '0%', '0%'],
    opacity: 1,
    y: '0%',
    transition: {
      x: {
        duration: 600,
        times: [0, 0.7, 0.9, 1],
        ease: 'easeOut',
        delay: 2100
      },
      y: {
        duration: 400,
        times: [0, 1],
        ease: 'anticipate',
        delay: 2100
      },
      opacity: {
        duration: 400,
        times: [0, 1],
        ease: 'anticipate',
        delay: 2100
      }
    }
  }
}

const logoPTextMotion = {
  initial: {
    opacity: 0,
    y: '-100%',
    x: '500%'
  },
  enter: {
    x: ['500%', '0%', '0%', '0%'],
    opacity: 1,
    y: '0%',
    transition: {
      x: {
        duration: 400,
        times: [0, 0.7, 0.9, 1],
        ease: 'easeOut',
        delay: 2300
      },
      y: {
        duration: 400,
        times: [0, 1],
        ease: 'anticipate',
        delay: 2300
      },
      opacity: {
        duration: 400,
        times: [0, 1],
        ease: 'anticipate',
        delay: 2300
      }
    }
  }
}
</script>

<template>
  <!-- 动画总区域 -->
  <div v-motion="animationContainerMotion" class="animation-container">
    <!-- 左右滑块区域-第一个出现 -->
    <div class="shape-container">
      <div class="left-shape">
        <div v-motion="leftShapeMotion" class="shape-line"></div>
      </div>
      <div class="right-shape">
        <div v-motion="rightShapeMotion" class="shape-line"></div>
      </div>
    </div>

    <div class="logo-section">
      <h1 class="gradient-logo">
        <div v-motion="logoSTextMotion" class="slipt-text-1">S</div>
        <div v-motion="logoCTextMotion" class="slipt-text-2">C</div>
        <div v-motion="logoLTextMotion" class="slipt-text-3">L</div>
        <div v-motion="logoITextMotion" class="slipt-text-4">I</div>
        <div v-motion="logoPTextMotion" class="slipt-text-5">P</div>
      </h1>
    </div>
  </div>
</template>

<style scoped lang="scss">
.animation-container {
  height: 20%;
  width: 100%;
  position: relative;
}

.shape-container {
  height: 100%;
  width: 100%;
  display: flex;

  .left-shape {
    width: 50%;
    height: 100%;
    overflow: hidden;

    .shape-line {
      width: 100%;
      height: 100%;
      background-color: white;
    }
  }

  .right-shape {
    width: 50%;
    height: 100%;
    overflow: hidden;

    .shape-line {
      width: 100%;
      height: 100%;
      background-color: white;
    }
  }
}

.logo-section {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: 0;
  z-index: 2;

  .gradient-logo {
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 2.5em;
    font-weight: bold;
    letter-spacing: 5px;
  }
}

// Logo渐变动画
@keyframes gradientShift {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}
</style>
