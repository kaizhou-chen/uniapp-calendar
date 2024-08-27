<template>
  <!-- 自定义导航栏 -->
  <CustomNavbar class="navbar" :year="curYear" :month="curMonth" @select="onSelect"></CustomNavbar>

  <view class="wrap" ref="listComRef" @touchstart="touchStart" @touchend="touchEnd">
    <Calendar ref="calendarRef" @change="onChange" :style="{ '--height': height }"></Calendar>
  </view>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useGestures } from '@/hooks/useGestures'
import Calendar from '@/components/Calendar.vue'
import CustomNavbar from './components/CustomNavbar.vue'

const calendarRef = ref()

const curYear = ref()
const curMonth = ref()
const height = ref('0px')

onShow(async () => {
  await nextTick()
  calendarRef.value.refreshList()

  uni.$once('today', () => {
    calendarRef.value.showToday()
  })

  // 获取高度
  const query = uni.createSelectorQuery()
  query.select('.navbar').boundingClientRect()
  query.exec((res) => {
    const queryHeight = res[0].height // 获取元素的高度
    height.value = (uni.getSystemInfoSync().windowHeight - queryHeight) + 'px'
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
}

const onSelect = (year: number, month: number) => {
  calendarRef.value.gotoMonth(year, month)
}
</script>

<style>
page {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.wrap {
  flex: 1;
}
</style>
