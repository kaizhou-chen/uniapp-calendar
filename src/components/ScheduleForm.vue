<template>
  <view>
    <uni-forms ref="formRef" :model="formData" :rules="rules">
      <uni-forms-item label="" name="title">
        <uni-easyinput type="text" focus v-model="formData.title" placeholder="标题" />
      </uni-forms-item>

      <uni-forms-item label="" name="time">
        <uni-datetime-picker type="datetime" v-model="formData.begin"  placeholder="开始" />
        <uni-datetime-picker type="datetime" v-model="formData.end"  placeholder="结束" />
      </uni-forms-item>

      <uni-forms-item label="" name="location">
        <uni-easyinput type="text" v-model="formData.location" placeholder="地点" />
      </uni-forms-item>

      <uni-forms-item label="" name="note">
        <uni-easyinput type="textarea" v-model="formData.note" placeholder="记事" />
      </uni-forms-item>
    </uni-forms>

    <button type="primary" class="btn" @tap="onSubmit">保存</button>
  </view>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useCalendarStore } from '@/stores/index'

const props = defineProps<{
  type: 'create' | 'edit'
}>()

const emit = defineEmits<{
  'submit': []
}>()

const store = useCalendarStore()
const { activeDate } = storeToRefs(store)

const formData = ref({
  title: '',
  begin: '',
  end: '',
  location: '',
  note: ''
})

const rules = {
  title: {
    rules: [
      {
        required: true,
        errorMessage: '请输入标题'
      }
    ]
  }
}

const formRef = ref()
const editId = ref()

onMounted(() => {
  if (props.type === 'create') {
    initCreate()
  }
})

const reset = () => {
  Object.assign(formData.value, {
    title: '',
    begin: '',
    end: '',
    location: '',
    note: ''
  })

  formRef.value.clearValidate();
}

const saveData = () => {
  const key = activeDate.value!
  const str = uni.getStorageSync(key)
  let list = str ? JSON.parse(str) : []
  
  const data: any = Object.assign({}, formData.value)
  if (props.type === 'create') {
    data.id = Date.now()
    list.push(data)
  } else if (props.type === 'edit') {
    data.id = editId.value
    const index = list.findIndex((item: any) => item.id === editId.value)
    list[index] = data
  }
  
  uni.setStorageSync(key, JSON.stringify(list))
}

const onSubmit = () => {
  formRef.value.validate()
    .then((res: any) => {
      saveData()
      reset()
      uni.showToast({ icon: 'none', title: '保存成功' })

      emit('submit')
    })
    .catch((err: any) => {
      console.log(err)
    }) 
}

const initCreate = () => {
  const now = dayjs()
  let begin = activeDate.value ? dayjs(activeDate.value) : now;
  begin = begin.set('hour', now.get('hour'))
  begin = begin.set('minute', now.get('minute'))
  begin = begin.set('second', now.get('second'))

  if (begin.minute() > 0) {
    begin = begin.add(1, 'hour')
  }
  let end = begin.add(1, 'hour')

  formData.value.begin = begin.format('YYYY-MM-DD HH:00:00')
  formData.value.end = end.format('YYYY-MM-DD HH:00:00')
}

const initEdit = (data: any) => {
  editId.value = data.id
  Object.assign(formData.value, data)
}

defineExpose({
  initCreate,
  initEdit
})
</script>

<style lang="scss">
.btn {
  margin: 0rpx 30rpx;
  border-radius: 30rpx;
}
</style>