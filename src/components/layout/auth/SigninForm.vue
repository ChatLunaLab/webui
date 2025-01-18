<script setup lang="ts">
import { inject, ref, type Ref, watch, watchEffect } from 'vue'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { signin } from '@/apis/auth'
import { useRouter } from 'vue-router'
import { useToast } from '@/components/ui/toast/use-toast'
import LucideSpinner from '@/components/icons/LucideSpinner.vue'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

const { toast } = useToast()

const status = inject<Ref<string>>('status')
const router = useRouter()
const isLoading = ref(false)

const formSchema = toTypedSchema(
  z.object({
    email: z
      .string({ required_error: '邮箱或用户名不能为空' })
      // if null
      .min(1, '邮箱或用户名不能为空')
      .max(50, '邮箱或用户名长度不能超过50个字符'),
    password: z
      .string({ required_error: '密码不能为空' })
      .min(5, '密码长度至少为5位')
      .max(20, '密码长度最多为20位')
  })
)

const { handleSubmit, isFieldDirty } = useForm({
  validationSchema: formSchema
})

const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true

  try {
    await signin({
      email: values.email,
      password: values.password
    })

    router.replace('/home')

    toast({
      title: '登录成功！',
      description: '欢迎回来！',
      variant: 'default'
    })
  } catch (error: any) {
    toast({
      title: '登录时出现错误！',
      description: error?.response?.data?.message ?? error.message,
      variant: 'destructive'
    })
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="flex flex-col space-y-2 text-center">
    <h1 class="text-2xl font-semibold tracking-tight">登录账户</h1>
  </div>
  <div :class="cn('grid gap-6', $attrs.class ?? '')">
    <form @submit="onSubmit" class="grid gap-3">
      <FormField
        class="grid gap-1"
        v-slot="{ componentField }"
        :validate-on-blur="!isFieldDirty"
        name="email"
      >
        <FormItem>
          <FormControl>
            <Label class="sr-only" for="email">电子邮件或用户名</Label>
            <Input
              id="email"
              v-bind="componentField"
              type="text"
              placeholder="邮件地址或用户名"
              :disabled="isLoading"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField
        class="grid gap-1"
        :validate-on-blur="!isFieldDirty"
        v-slot="{ componentField }"
        autocomplete="current-password"
        name="password"
      >
        <FormItem>
          <FormControl>
            <Label class="sr-only" for="password">密码</Label>
            <Input
              id="password"
              v-bind="componentField"
              placeholder="密码"
              type="password"
              :disabled="isLoading"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <Button :disabled="isLoading" type="submit">
        <LucideSpinner v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
        登录
      </Button>
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
