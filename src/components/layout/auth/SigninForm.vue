<script setup lang="ts">
import { inject, ref, type Ref,watch, watchEffect } from 'vue'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { signin } from '@/apis/auth'
import { useRouter } from 'vue-router'
import { useToast } from '@/components/ui/toast/use-toast'
import  LucideSpinner  from '@/components/icons/LucideSpinner.vue'

const { toast } = useToast()

const status = inject<Ref<string>>('status')
const router = useRouter()
const isLoading = ref(false)

async function onSubmit(event: Event) {
  event.preventDefault()
  isLoading.value = true

  // get email and password
  const form = new FormData(event.target as HTMLFormElement)

  try {
    await signin({
      email: form.get('email') as string,
      password: form.get('password') as string
    })

    router.replace('/home')

    toast({
      title: '登录成功！',
      description: '欢迎回来！',
      variant: 'default'
    });
  } catch (error: any) {
    toast({
        title: '登录时出现错误！',
        description: error?.response?.data?.message ?? error.message,
        variant: 'destructive'
      });
  } finally {
    isLoading.value = false
  }


}
</script>

<template>
  <div class="flex flex-col space-y-2 text-center">
    <h1 class="text-2xl font-semibold tracking-tight">登录账户</h1>
  </div>
  <div :class="cn('grid gap-6', $attrs.class ?? '')">
    <form @submit="onSubmit">
      <div class="grid gap-3">
        <div class="grid gap-1">
          <Label class="sr-only" for="email">电子邮件或用户名</Label>
          <Input
            id="email"
            name="email"
            type="text"
            placeholder="邮件地址或用户名"
            :disabled="isLoading"
          />
        </div>
        <div class="grid gap-1">
          <Label class="sr-only" for="password">密码</Label>
          <Input
            id="password"
            name='password'
            placeholder="密码"
            auto-complete="password"
            type="password"
            :disabled="isLoading"
          />
        </div>
        <Button :disabled="isLoading">
          <LucideSpinner v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
          登录
        </Button>
      </div>
    </form>
  </div>

  <Separator label="或" />

  <div class="px-8 text-center text-sm text-muted-foreground">
    还没有账户？
    <a
      class="underline underline-offset-4 hover:text-primary cursor-pointer"
      @click="status = 'signup'"
    >
      注册
    </a>
  </div>

  <!-- <div class="px-8 text-center text-sm text-muted-foreground">
   忘记了密码？
    <a class="underline underline-offset-4 hover:text-primary cursor-pointer">
      重置密码
    </a>
  </div> -->
</template>
