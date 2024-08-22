<template>
  <view class="wrap" :style="{ 'padding-bottom': paddingBottom + 'px', 'box-sizing': 'border-box' }">
    <scroll-view style="flex: 1;">
      <ScheduleForm ref="formRef" type="edit" @submit="onSubmit"></ScheduleForm>
    </scroll-view>

    <view class="operator">
      <text style="float: right;" @tap="onRemove">删除</text>
    </view>
  </view>
</template>

<script lang="ts" setup>
import ScheduleForm from '@/components/ScheduleForm.vue'
import { ref, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { useCalendarStore } from '@/stores/index'

const props = defineProps<{
  id: number
}>()

const store = useCalendarStore()
const { activeDate } = storeToRefs(store)

const formRef = ref()

const paddingBottom = ref(0)

onLoad(() => {
  uni.getSystemInfo({
    success: function (res) {
      const { bottom } = res.safeAreaInsets!
      paddingBottom.value = bottom
    }
  })
})

onShow(async () => {
  await nextTick()

  const str = uni.getStorageSync(activeDate.value!)
  if (str) {
    const list = JSON.parse(str)
    const obj = list.find((x: any) => x.id == props.id)
    formRef.value.initEdit(obj)
  }
})

const onSubmit = (data: any) => {
  uni.navigateBack()
}

const onRemove = () => {
  uni.showModal({
    title: '提示',
    content: '确定要删除吗？',
    success: (res) => {
      if (res.confirm) {
        doRemove();
      }
    }
  })
}

const doRemove = () => {
  const key = activeDate.value!
  const str = uni.getStorageSync(key)
  if (str) {
    const list = JSON.parse(str)
    const index = list.findIndex((x: any) => x.id == props.id)
    list.splice(index, 1)
    uni.setStorageSync(key, JSON.stringify(list))

    uni.showToast({icon: 'none', title: '删除成功'})
    uni.navigateBack()
  }
}
</script>

<style lang="scss">
page {
  height: 100%;
  background-color: #F5F7FA;
}
.wrap {
  height: 100%;
  display: flex;
  flex-direction: column;;
}
.operator {
  height: 40rpx;
  padding: 20rpx;
  background-color: #337ecc;
  color: #fff;
}
</style>