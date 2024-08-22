import { ref } from 'vue'

export type GesturesProps = {
  onScrollLeft(): void
  onScrollRight(): void
}

export const useGestures = (props: GesturesProps) => {
  const touchStartTime = ref()
  const touchStartX = ref(0) // 记录滑动开始的位置
  const touchEndX = ref(0) // 记录滑动结束的位置

  function touchStart(e: any) {
    const x = e.changedTouches[0].pageX;
    touchStartX.value = x;
    touchStartTime.value = Date.now()
  }
  
  function touchEnd(e: any) {
    const x = e.changedTouches[0].pageX;
    touchEndX.value = x;
  
    const endTime = Date.now()
    if (endTime - touchStartTime.value > 2000) {
      return;
    }
    if (Math.abs(touchStartX.value - touchEndX.value) < 10) {
      return;
    }
  
    if (touchEndX.value - touchStartX.value > 0) {
      props.onScrollRight()
    } else {
      props.onScrollLeft()
    }
  }

  return {
    touchStart,
    touchEnd
  }
}