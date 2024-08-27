<template>
  <view class="container" @touchmove.stop>
    <view class="weeks">
      <view v-for="item in week" :key="item" class="week">{{ item }}</view>
    </view>
    
    <scroll-view class="days-scroll" scroll-y :scroll-into-view="scrollName">
      <view class="days">
        <view 
          v-for="(item, index) in list" 
          :key="index + 'pre'" 
          :class="{
            'today': item.date === today,
            'active': item.date === activeItem?.date
          }"
          class="day" 
          @tap="onClickDay($event, item)"
        >
          <view :id="'date_' + item.date"></view>
          <view class="text" :class="{'extra': item.extra}">{{ item.day }}</view>
          <!-- 日程列表 -->
          <view class="schedule-wrap">
            <view v-for="x in item.list" :key="x.id" class="schedule">
              <view :class="[x.type || 'default']" class="text">{{ x.title }}</view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <Schedule ref="scheduleRef" :activeItem="activeItem"></Schedule>
  </view>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue'
import { useCalendarStore } from '@/stores/index'

import dayjs from 'dayjs'
import Schedule from './Schedule.vue'

const props = defineProps<{
  year?: number,
  month?: number,
  isToday?: boolean
}>()

const emit = defineEmits<{
  change: [any]
}>()

const { setActiveDate } = useCalendarStore()

const week = ref(['周一', '周二', '周三', '周四', '周五', '周六', '周日']);
const curYear = ref() // 当前年
const curMonth = ref() // 当前月
const list = ref();
const today = ref()
const activeItem = ref()

const scheduleRef = ref()
const scrollName = ref()

onMounted(() => {
  showToday()
})

function showToday() {
  curYear.value = dayjs().year() // 当前年
  curMonth.value = dayjs().month() + 1 // 当前月
  list.value = getDayList()

  let day = dayjs().date()
  today.value = dayjs().format('YYYY-MM-DD')
  activeItem.value = list.value.find((x: any) => {
    return x.date === format(curYear.value, curMonth.value, day)
  })

  setActiveDate(activeItem.value.date)
}

function getDayList() {
  const dayList = [];

  // 当月的所有日期
  let month = curMonth.value;
  let year = curYear.value;
  const m = dayjs(`${year}-${month}`)
  const days = m.daysInMonth() // 获取当月一共有多少天
  for (let day = 1; day <= days; day++) {
    dayList.push({ year, month, day, date: format(year, month, day) })
  }

  // 上个月、下个月，在月历上的日期
  const preList = getPreMonthDays(m)
  const nextList = getNextMonthDays(m)
  dayList.unshift(...preList)
  dayList.push(...nextList)

  // 获取日程列表
  getScheduleList(dayList)

  emit('change', {
    year: curYear.value,
    month: curMonth.value
  })

  return dayList
}

// 获取日程列表
function getScheduleList(dayList: any) {
  dayList.forEach((x: any) => {
    const str = uni.getStorageSync(x.date)
    if (str) {
      x.list = JSON.parse(str)
    } else {
      x.list = []
    }
  })

  // 当前日期，是否有日程
  const item = activeItem.value
  if(!item.list || item.list.length <= 0) {
    scheduleRef.value.hide()
  }
}

// 获取上个月剩余天数
function getPreMonthDays(m: dayjs.Dayjs) {
  const list: any[] = [];
  const firstDay = m.startOf('month').day() // 获取当月第一天是星期几;星期日为 0，星期六为 6
  if (firstDay == 1) { //表示上个月无剩余天数
    return list;
  }

  let month = curMonth.value;
  let year = curYear.value;
  month--;
  if (month == 0) {
    year--;
    month = 12;
  }
  
  /** 
   * 假设当月的第一天是星期四，则 firstDay 为 4 
   * 星期一 ~ 星期三 为上个月的最后 3 天
   * 上个月，要显示的天数就为 (firstDay - 1)
   */ 
  const days = dayjs(`${year}-${month}`).daysInMonth(); // 获取上个月的天数
  for (let i = 1; i <= firstDay - 1; i++) {
    const day = days - (firstDay - 1 - i)
    list.push({ year, month, day, date: format(year, month, day), extra: true })
  }

  return list;
}

// 获取下个月要显示的天数
function getNextMonthDays(m: dayjs.Dayjs) {
  const list: any[] = [];
  const lastDay = m.endOf('month').day(); // 获取当月最后一天是星期几
  const nextDays = lastDay == 0 ? 7 : lastDay;

  let month = curMonth.value;
  let year = curYear.value;
  month++;
  if (month > 12) {
    year++;
    month = 1;
  }

  /**
   * 假设当月的最后一天是星期六，则 nextDays 为 6
   * 星期天 为下个月的第 1 天
   * 下个月，要显示的天数为 (7 - nextDays)
   */
  for(let day = 1; day <= 7 - nextDays; day++) {
    list.push({ year, month, day, date: format(year, month, day), extra: true })
  }

  return list
}

const format = (year: number, month: number, day: number) => {
  return `${year}-${month < 10 ? '0': ''}${month}-${day < 10 ? '0': ''}${day}`
}

const onClickDay = async (e: any, item: any) => {
  activeItem.value = item
  setActiveDate(activeItem.value.date)

  if(!item.list || item.list.length <= 0) {
    scheduleRef.value.hide()
  } else {
    scheduleRef.value.show()
  }
  
  await nextTick()
  scrollName.value = 'date_' + item.date;
}

const gotoPrevMonth = () => {
  curMonth.value = curMonth.value - 1;
  if (curMonth.value < 1) {
    curYear.value = curYear.value - 1;
    curMonth.value = 12;
  }

  list.value = getDayList()
  scheduleRef.value.hide()
}

const gotoNextMonth = () => {
  curMonth.value = curMonth.value + 1;
  // 如果超过12表示下一年;重置日期
  if (curMonth.value > 12) {
    curYear.value = curYear.value + 1;
    curMonth.value = 1;
  }

  list.value = getDayList()
  scheduleRef.value.hide()
}

const gotoMonth = (year: number, month: number) => {
  curYear.value = year
  curMonth.value = month
  list.value = getDayList()
  scheduleRef.value.hide()
}

const refreshList = () => {
  if (list.value) {
    const newList = list.value
    getScheduleList(newList)
    list.value = newList
  }
}

defineExpose({
  showToday,
  gotoPrevMonth,
  gotoNextMonth,
  gotoMonth,
  refreshList
})
</script>

<style lang="scss" scoped>
.container {
  height: var(--height);
  display: flex;
  flex-direction: column;

  .weeks {
    width: 100%;
    height: 50rpx;
    display: flex;
    .week {
      width: calc(100% / 7);
      line-height: 50rpx;
      text-align: center;
      background-color: #EBEDF0;
      border: 1px solid #D4D7DE;
      box-sizing: border-box;
    }
  }
  .days-scroll {
    width: 100%;
    flex: 1;
    overflow: hidden;
  }
  .days {
    display: flex;
    flex-wrap: wrap;
    height: calc(var(--height) - 50rpx);
    .day {
      width: calc(100% / 7);
      height: calc((var(--height) - 50rpx) / 5);
      border: 1px solid #D4D7DE;
      box-sizing: border-box;
      position: relative;
      &.today {
        background-color: #d9ecff;
      }
      &.active {
        border: 2px solid #337ecc;

        .schedule-wrap {
          margin-top: -1rpx;
        }
      }
    }

    .text {
      line-height: 50rpx;
      &.extra {
        color: #A8ABB2;
      }
    }

    .schedule {
      margin-bottom: 2rpx;
      .text {
        font-size: 22rpx;
        overflow: hidden;
      }
      .default {
        background-color: #409EFF;
      }
    }
  }
}
</style>