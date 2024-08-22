<template>
  <view class="wrap" ref="listComRef" @touchstart="touchStart" @touchend="touchEnd">
    <Calendar ref="calendarRef" @change="onChange"></Calendar>
  </view>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useGestures } from '@/hooks/useGestures'
import Calendar from '@/components/Calendar.vue'

const calendarRef = ref()

const curYear = ref()
const curMonth = ref()

onShow(async () => {
  await nextTick()
  calendarRef.value.refreshList()

  uni.$once('today', () => {
    calendarRef.value.showToday()
  })
})

const onScrollRight = () => {
  calendarRef.value.gotoPrevMonth()
}
const onScrollLeft = () => {
  calendarRef.value.gotoNextMonth()
}

const { touchStart, touchEnd } = useGestures({onScrollLeft, onScrollRight})

const onChange = (data: any) => {
  const { year, month } = data;
  curYear.value = year;
  curMonth.value = month;

  uni.setNavigationBarTitle({
    title: `${year}年${month}月`
  })
}
</script>

<style>
page {
  height: 100%;
}
.wrap {
  height: 100%;
}
</style>
