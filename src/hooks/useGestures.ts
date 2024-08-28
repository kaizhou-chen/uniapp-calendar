import { ref } from 'vue'

export type GesturesProps = {
  onScrollLeft?(): void
  onScrollRight?(): void
}

export const useGestures = (props: GesturesProps) => {
  const touchStartTime = ref()
  const touchStartX = ref(0) // 记录滑动开始的位置
  const touchStartY = ref(0)

  function touchStart(e: any) {
    touchStartTime.value = Date.now()
    touchStartX.value = e.changedTouches[0].pageX;
    touchStartY.value = e.changedTouches[0].pageY;
  }
  
  function touchEnd(e: any) {
    const moveX = touchStartX.value - e.changedTouches[0].pageX;
    const moveY = touchStartY.value - e.changedTouches[0].pageY;
  
    const endTime = Date.now()
    if (endTime - touchStartTime.value > 2000) {
      return;
    }

    if (Math.abs(moveY) > Math.abs(moveX)) { // 竖向滑动
      upDown(moveY)
    } else { // 横向滑动
      leftRight(moveX)
    }
  }

  function leftRight(moveX: number) {
    if (Math.abs(moveX) < 10 ) {
      return;
    }
  
    if (moveX > 0) {
      props.onScrollRight ? props.onScrollRight() : null
    } else {
      props.onScrollLeft ? props.onScrollLeft() : null
    }
  }

  function upDown(moveY: number) {

  }

  return {
    touchStart,
    touchEnd
  }
}