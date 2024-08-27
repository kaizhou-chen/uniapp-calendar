<script setup lang="ts">
import { ref, onMounted, watchEffect } from 'vue'

const props = defineProps<{
  year: number,
  month: number
}>()

const emit = defineEmits<{
  'select': [year: number, month: number]
}>()

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()

const popupRef = ref()

const years = ref()
const months = ref()
const pickerValue = ref()

onMounted(() => {
  const currentYear = new Date().getFullYear()
  years.value = Array.from({ length: 20 }, (_, i) => currentYear + i - 10)
  months.value = Array.from({ length: 12 }, (_, i) => i + 1)
})

const onChange = (e: any) => {
  pickerValue.value = e.detail.value
}

const open = () => {
  pickerValue.value = [
    years.value.indexOf(props.year), 
    months.value.indexOf(props.month)
  ]
  popupRef.value.open()
}

const close = () => {
  popupRef.value.close()
}

const confirm = () => {
  const [year, month] = pickerValue.value
  emit('select', years.value[year], months.value[month])
  close()
}
</script>

<template>
  <view class="navbar" :style="{ 'padding-top': safeAreaInsets?.top + 'px'}">
    <!-- logo文字 -->
    <view class="logo">
      <text class="logo-title" @tap="open">
        {{ props.year }} 年 {{ props.month }} 月
      </text>
      <text class="logo-text"></text>
    </view>
  </view>

  <uni-popup ref="popupRef" type="center" :mask-click="false">
    <view class="picker-wrap">
      <picker-view :indicator-style="'height: 50px;'" :value="pickerValue" @change="onChange" class="picker-view">
        <picker-view-column>
          <view class="item" v-for="(item, index) in years" :key="index">{{ item }}</view>
        </picker-view-column>
        <picker-view-column>
          <view class="item" v-for="(item, index) in months" :key="index">{{ item }}</view>
        </picker-view-column>
      </picker-view>

      <view class="btn-group">
        <text @click="close">取消</text>
        <text @click="confirm">确定</text>
      </view>
    </view>
  </uni-popup>
</template>

<style lang="scss">
/* 自定义导航条 */
.navbar {
  position: relative;
  display: flex;
  flex-direction: column;
  padding-top: 20px;

  .logo {
    display: flex;
    align-items: center;
    height: 64rpx;
    padding-left: 30rpx;
    padding-top: 20rpx;
    .logo-title {
      line-height: 28rpx;
      font-weight: bold;
    }
    .logo-text {
      flex: 1;
      line-height: 28rpx;
      margin: 2rpx 0 0 20rpx;
      padding-left: 20rpx;
      border-left: 1rpx solid #fff;
      font-size: 26rpx;
    }
  }
}

.picker-wrap {
  width: calc(100vw - 60rpx);
  margin: 0 30rpx;
  background-color: #fff;
  border-radius: 20rpx;
  box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);
  margin-top: 20rpx;
  overflow: hidden;;
}
.picker-view {
  height: 400rpx; 
  margin: 40rpx 160rpx;
}
.item {
  line-height: 100rpx;
  text-align: center;
}
.btn-group {
  display: flex;
  justify-content: flex-end;
  background-color: #fff;
  margin-top: 24rpx;
  height: 80rpx;

  text {
    width: 120rpx;
    height: 60rpx;
    line-height: 60rpx;
    text-align: center;
    color: #409EFF;
  }
}
</style>