<template>
  <view v-if="visible">
    <view class="head">
      <view>{{ activeItem ? `${activeItem.year}年${activeItem.month}月${activeItem.day}日` : '' }}</view>
      <view class="icon" @tap="hide">
        <image src="/static/down.png" class="icon"></image>
      </view>
    </view>
    <scroll-view scroll-y class="wrap">
      <view v-for="item in activeItem.list" :key="item.id" @tap="onEdit(item)">
        <view class="item">
          <view class="time">
            <view>{{ dayjs(item.begin).format('HH:mm') }}</view>
            <view>{{ dayjs(item.end).format('HH:mm') }}</view>
          </view>
          <view class="type"></view>
          <view class="content">
            <view class="title">{{ item.title }}</view>
            <view class="text">{{ item.note }}</view>
            <view class="text">{{ item.location }}</view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { ref } from 'vue'

const props = defineProps<{
  activeItem?: any
}>()

const visible = ref(false)

const hide = () => {
  visible.value = false
}

const show = () => {
  visible.value = true
}

const onEdit = (item: any) => {
  uni.navigateTo({
    url: `/pages/edit/edit?id=${item.id}`
  })
}

defineExpose({
  show,
  hide
})
</script>

<style lang="scss" scoped>
.head {
  display: flex; 
  padding: 1rpx 12rpx;
  background-color: #EBEDF0; 

  .icon {
    margin-left: auto;
  }
}

.wrap {
  height: 360rpx;
  overflow: hidden;

  .item {
    display: flex;
    height: 100rpx;
    padding: 8rpx 0rpx;
    border-bottom: 1px solid #D4D7DE;

    .time {
      width: calc(100% / 7);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    .type {
      width: 16rpx;
      background-color: #409EFF;
    }
    .content {
      flex: 1;
      padding-left: 12rpx;
      .title {
        font-weight: bold;
      }
      .text {
        font-size: 24rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}

.icon {
  width: 36rpx; 
  height: 36rpx;
}
</style>