<template>
   <div class="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Tài khoản của tôi</h1>
      <div class="space-y-5">
         <UCard>
            <template #header>
               <div class="flex items-center justify-between">
                  <h3 class="font-semibold">Thông tin cá nhân</h3>
                  <UButton size="sm" color="neutral" variant="ghost"
                     :icon="editing ? 'i-heroicons-x-mark' : 'i-heroicons-pencil'" @click="toggleEdit">
                     {{ editing ? 'Hủy' : 'Chỉnh sửa' }}
                  </UButton>
               </div>
            </template>

            <div v-if="!editing" class="space-y-4">
               <div class="flex items-center gap-4">
                  <div>
                     <p class="font-bold text-gray-900 text-xl">{{ authStore.user?.name }}</p>
                  </div>
               </div>
               <div class="grid grid-cols-2 gap-4 text-sm">
                  <div>
                     <p class="text-gray-400 text-xs font-medium mb-1">Số điện thoại</p>
                     <p class="text-gray-900">{{ authStore.user?.phone || 'Chưa cập nhật ' }}</p>
                  </div>
                  <div>
                     <p class="text-gray-400 text-xs font-medium mb-1">Tham gia từ</p>
                     <p class="text-gray-900">{{ formatDateShort(authStore.user?.createdAt || '') }}</p>
                  </div>
                  <div class="col-span-2">
                     <p class="text-gray-400 text-xs font-medium mb-1">Địa chỉ mặc định</p>
                     <p class="text-gray-900">{{ authStore.user?.address || 'Chưa cập nhật' }}</p>
                  </div>
               </div>
            </div>

            <form v-else class="space-y-4" @submit.prevent="saveProfile">
               <UFormField label="Họ và tên">
                  <UInput v-model="editForm.name" class="w-full" />
               </UFormField>
               <UFormField label="Số điện thoại">
                  <UInput v-model="editForm.phone" type="tel" class="w-full" />
               </UFormField>
               <UFormField label="Địa chỉ">
                  <UTextarea v-model="editForm.address" :rows="3" class="w-full" />
               </UFormField>
               <div class="flex justify-end gap-3">
                  <UButton color="neutral" variant="outline" @click="editing = false">Hủy</UButton>
                  <UButton type="submit" color="primary" :loading="saving">Lưu thay đổi</UButton>
               </div>
            </form>
         </UCard>

         <UCard>
            <template #header>
               <h3 class="font-semibold">Đổi mật khẩu</h3>
            </template>

            <UAlert v-if="!authStore.user?.username && !hasPassword" color="info" variant="soft"
               icon="i-heroicons-information-circle" title="Tài khoản Google"
               description="Bạn có thể đặt mật khẩu để đăng nhập bằng email." />

            <form class="space-y-4" @submit.prevent="changePass">
               <UFormField v-if="hasPassword" label="Mật khẩu hiện tại">
                  <UInput v-model="passForm.current" :type="showPass ? 'text' : 'password'" class="w-full" :trailing-icon="showPass ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'" >
                     <template #trailing>
                            <button type="button" @click="showPass = !showPass">
                                <UIcon :name="showPass ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'" />
                            </button>
                        </template>
                  </UInput>
               </UFormField>
               <UFormField label="Mật khẩu mới">
                  <UInput v-model="passForm.newPass" type="password" class="w-full" />
               </UFormField>
               <UFormField label="Xác nhận mật khẩu mới">
                  <UInput v-model="passForm.confirm" type="password" class="w-full" />
               </UFormField>
               <div class="flex justify-end">
                  <UButton type="submit" color="primary" :loading="changingPass">
                     {{ hasPassword ? 'Đổi mật khẩu' : 'Đặt mật khẩu' }}
                  </UButton>
               </div>
            </form>
         </UCard>
      </div>
   </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
useHead({ title: 'Thông tin cá nhân' })

const authStore = useAuthStore()
const orderStore = useOrderStore()
const { api } = useApi()
const toast = useToast()
const { formatDateShort } = useFormat()
const showPass = ref(false)
const editing = ref(false)
const saving = ref(false)
const changingPass = ref(false)
const hasPassword = ref(true)

const editForm = reactive({
   name: authStore.user?.name || '',
   phone: authStore.user?.phone || '',
   address: authStore.user?.address || '',
})

const passForm = reactive({ current: '', newPass: '', confirm: '' })

const orderStats = computed(() => [
   {
      label: 'Chờ xác nhận',
      count: orderStore.items.filter(o => o.status === 'PENDING').length,
      color: 'text-yellow-500',
   },
   {
      label: 'Đang giao',
      count: orderStore.items.filter(o => o.status === 'SHIPPING').length,
      color: 'text-blue-500',
   },
   {
      label: 'Đã giao',
      count: orderStore.items.filter(o => o.status === 'DELIVERED').length,
      color: 'text-green-500',
   },
])

function toggleEdit() {
   editing.value = !editing.value
   if (editing.value) {
      editForm.name = authStore.user?.name || ''
      editForm.phone = authStore.user?.phone || ''
      editForm.address = authStore.user?.address || ''
   }
}

async function saveProfile() {
   saving.value = true
   try {
      await authStore.updateProfile({
         name: editForm.name,
         phone: editForm.phone,
         address: editForm.address,
      })
      toast.add({ title: 'Cập nhật thành công', color: 'success' })
      editing.value = false
   } catch {
      toast.add({ title: 'Cập nhật thất bại', color: 'error' })
   } finally {
      saving.value = false
   }
}

async function changePass() {
   if (!passForm.newPass) return toast.add({ title: 'Nhập mật khẩu mới', color: 'error' })
   if (passForm.newPass.length < 6) return toast.add({ title: 'Mật khẩu tối thiểu 6 ký tự', color: 'error' })
   if (passForm.newPass !== passForm.confirm) return toast.add({ title: 'Mật khẩu không khớp', color: 'error' })

   changingPass.value = true
   try {
      await api('/auth/change-password', {
         method: 'POST',
         body: { currentPassword: passForm.current, newPassword: passForm.newPass },
      })
      toast.add({ title: 'Đổi mật khẩu thành công', color: 'success' })
      passForm.current = ''
      passForm.newPass = ''
      passForm.confirm = ''
   } catch (e: any) {
      toast.add({
         title: 'Thất bại',
         description: e?.data?.message || 'Mật khẩu hiện tại không đúng',
         color: 'error',
      })
   } finally {
      changingPass.value = false
   }
}

onMounted(async () => {
   await Promise.all([
      orderStore.fetchMyOrders(),
   ])
})
</script>