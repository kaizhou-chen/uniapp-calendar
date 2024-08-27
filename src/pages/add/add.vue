<template>
  <view></view>
</template>

<script lang="ts" setup>
import { onShow } from '@dcloudio/uni-app'

onShow(() => {
  setTimeout(async () => {
    await uni.switchTab({
      url: '/pages/index/index',
    })

    uni.navigateTo({
      url: '/pages/create/create'
    })
  }, 200)
})
</script>

<style lang="scss" scoped></style>