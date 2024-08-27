import { ref } from 'vue'

export type GesturesProps = {
  onScrollLeft(): void
  onScrollRight?(): void
}

export const useGestures = (props: GesturesProps) => {
  const touchStartTime = ref()
  const touchStartX = ref(0) // 记录滑动开始的位置
  const touchStartY = ref(0)
  const touchEndX = ref(0) // 记录滑动结束的位置
  const touchEndY = ref(0)

  function touchStart(e: any) {
    touchStartX.value = e.changedTouches[0].pageX;
    touchStartY.value = e.changedTouches[0].pageY;
    touchStartTime.value = Date.now()
  }
  
  function touchEnd(e: any) {
    touchEndX.value = e.changedTouches[0].pageX;
    touchEndY.value = e.changedTouches[0].pageY;
  
    const endTime = Date.now()
    if (endTime - touchStartTime.value > 2000) {
      return;
    }
    // 判断滑动的方向
    if (
      Math.abs(touchStartY.value - touchEndY.value) > 50 || // 上下滑动距离大于50
      Math.abs(touchStartX.value - touchEndX.value) < 10   // 左右滑动距离小于10
    ) {
      return;
    }
  
    if (touchEndX.value - touchStartX.value > 0) {
      props.onScrollRight ? props.onScrollRight() : null
    } else {
      props.onScrollLeft ? props.onScrollLeft() : null
    }
  }

  return {
    touchStart,
    touchEnd
  }
}