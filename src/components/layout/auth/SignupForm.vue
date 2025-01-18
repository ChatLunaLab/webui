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

// 添加: 定义表单验证规则
const formSchema = toTypedSchema(
  z.object({
    name: z
      .string({ required_error: '昵称不能为空' })
      .min(1, '昵称不能为空')
      .max(50, '昵称长度不能超过50个字符'),
    email: z
      .string({ required_error: '邮箱不能为空' })
      .email('请输入有效的邮箱地址')
      .max(50, '邮箱长度不能超过50个字符'),
    password: z
      .string({ required_error: '密码不能为空' })
      .min(8, '密码长度至少为8位')
      .max(20, '密码长度最多为20位')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,20}$/,
        {
          message: '密码必须包含大小写字母、数字和特殊字符'
        }
      ),
    terms: z.boolean({ required_error: '请同意服务条款和隐私政策' })
  })
)

// 添加: 使用 useForm 和 handleSubmit 进行表单验证和提交处理
const { handleSubmit, isFieldDirty } = useForm({
  validationSchema: formSchema
})

const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true

  if (!values.terms) {
    toast({
      title: '请同意服务条款和隐私政策！',
      description: '请阅读并同意我们的服务条款和隐私政策。',
      variant: 'destructive'
    })
    isLoading.value = false
    return
  }

  try {
    await signup({
      email: values.email,
      password: values.password,
      username: values.name
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
})
</script>

<template>
  <div class="flex flex-col space-y-2 text-center">
    <h1 class="text-2xl font-semibold tracking-tight">创建账户</h1>
  </div>
  <div :class="cn('grid gap-6', $attrs.class ?? '')">
    <form @submit="onSubmit">
      <div class="grid gap-3">
        <!-- 添加: 使用 FormField 进行表单验证 -->
        <FormField
          class="grid gap-1"
          v-slot="{ componentField }"
          :validate-on-blur="!isFieldDirty"
          name="name"
        >
          <FormItem>
            <FormControl>
              <Label class="sr-only" for="name">昵称</Label>
              <Input
                id="name"
                v-bind="componentField"
                placeholder="昵称"
                :disabled="isLoading"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField
          class="grid gap-1"
          v-slot="{ componentField }"
          :validate-on-blur="!isFieldDirty"
          name="email"
        >
          <FormItem>
            <FormControl>
              <Label class="sr-only" for="email">电子邮件</Label>
              <Input
                id="email"
                v-bind="componentField"
                placeholder="邮件地址"
                type="email"
                auto-capitalize="none"
                auto-complete="email"
                auto-correct="off"
                :disabled="isLoading"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField
          class="grid gap-1"
          v-slot="{ componentField }"
          :validate-on-blur="!isFieldDirty"
          name="password"
        >
          <FormItem>
            <FormControl>
              <Label class="sr-only" for="password">密码</Label>
              <Input
                id="password"
                v-bind="componentField"
                placeholder="密码"
                auto-complete="password"
                type="password"
                :disabled="isLoading"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <Button :disabled="isLoading">
          <LucideSpinner v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
          注册
        </Button>

        <FormField
          v-slot="{ value, handleChange }"
          type="checkbox"
          name="terms"
        >
          <FormItem >
            <div class="flex flex-row my-4 justify-center">
              <Checkbox
                class="mt-1"
                :checked="value"
                @update:checked="handleChange"
              />

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
            <FormMessage />
          </FormItem>
        </FormField>
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
