<template>
  <view>
    <ScheduleForm ref="formRef" type="create" @submit="onSubmit"></ScheduleForm>
  </view>
</template>

<script lang="ts" setup>
import { ref, nextTick } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import ScheduleForm from '@/components/ScheduleForm.vue'

const formRef = ref()

onShow(async() => {
  await nextTick()
  formRef.value.initCreate()
})

const onSubmit = (data: any) => {
  setTimeout(() => {
    uni.switchTab({
      url: '/pages/index/index',
    })
  }, 400)
}
</script>

<style lang="scss">
page {
  height: 100%;
  background-color: #F5F7FA;
}
</style>