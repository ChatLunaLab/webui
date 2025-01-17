<script setup lang="ts">
import { inject, provide, ref, type Ref } from 'vue'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import LucideSpinner from '@/components/icons/LucideSpinner.vue'
import { signup } from '@/apis/auth'
import { useRouter } from 'vue-router'
import { useToast } from '@/components/ui/toast/use-toast'

const { toast } = useToast()

const status = inject<Ref<string>>('status')
const router = useRouter()
const isLoading = ref(false)

async function onSubmit(event: Event) {
  event.preventDefault()
  isLoading.value = true

  const form = new FormData(event.target as HTMLFormElement)

  try {
    await signup({
      email: form.get('email') as string,
      password: form.get('password') as string,
      username: form.get('name') as string,
    })

    router.push('/home')

  } catch (error: any) {
    toast({
      title: '注册时出现错误！',
      description: error?.response?.data?.message ?? error.message,
      variant: 'destructive'
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex flex-col space-y-2 text-center">
    <h1 class="text-2xl font-semibold tracking-tight">创建账户</h1>
  </div>
  <div :class="cn('grid gap-6', $attrs.class ?? '')">
    <form @submit="onSubmit">
      <div class="grid gap-3">
        <div class="grid gap-1">
          <Label class="sr-only" for="name">昵称</Label>
          <Input id="name" name="name" placeholder="昵称" :disabled="isLoading" />
        </div>
        <div class="grid gap-1">
          <Label class="sr-only" for="email">电子邮件</Label>
          <Input
            id="email"
            name="email"
            placeholder="邮件地址"
            type="email"
            auto-capitalize="none"
            auto-complete="email"
            auto-correct="off"
            :disabled="isLoading"
          />
        </div>
        <div class="grid gap-1">
          <Label class="sr-only" for="password">密码</Label>
          <Input
            id="password"
            placeholder="密码"
            name="password"
            auto-complete="password"
            type="password"
            :disabled="isLoading"
          />
        </div>
        <Button :disabled="isLoading">
          <LucideSpinner v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
          注册
        </Button>

        <div class="flex flex-row my-4 justify-center">
          <Checkbox class="mt-0.5" id="terms" />
          <Label for="terms" class="pl-2 text-sm text-muted-foreground">
            同意我们的
            <a
              href="/terms"
              class="underline underline-offset-4 hover:text-primary"
            >
              服务条款
            </a>
            和
            <a
              href="/privacy"
              class="underline underline-offset-4 hover:text-primary"
            >
              隐私政策
            </a>
            。
          </Label>
        </div>
      </div>
    </form>
  </div>

  <Separator label="或" />

  <div class="px-8 text-center text-sm text-muted-foreground">
    已经有账户了？
    <a
      class="underline underline-offset-4 hover:text-primary cursor-pointer"
      @click="status = 'signin'"
    >
      登录
    </a>
  </div>
</template>
