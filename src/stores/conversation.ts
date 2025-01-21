import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { computedAsync } from '@vueuse/core'
import type { ChatLunaConversation } from '@/lib/types'
import { getConversationList } from '@/apis/conversation'

export const useConversation = defineStore(
  'conversation',
  () => {
    let conversationList = ref<ChatLunaConversation[]>([])

    let fetchConversationList = computedAsync(
      async () => {
        const response = await getConversationList()
        conversationList.value = response
        return response
      },
      [],
      {
        lazy: true
      }
    )

    const groupedConversationList = computed(() => {
      const now = new Date()
      const currentYear = now.getFullYear()
      const oneDay = 24 * 60 * 60 * 1000

      // Helper function to format date label
      const getDateLabel = (date: Date): string => {
        const diff = now.getTime() - date.getTime()
        const days = Math.floor(diff / oneDay)
        const convYear = date.getFullYear()

        // If conversation is from a previous year
        if (convYear < currentYear) {
          // If older than current year, group by specific year
          if (convYear < currentYear - 1) {
            return '更早'
          }
          return `${convYear}年`
        }

        // Current year grouping
        if (days === 0) return '今天'
        if (days < 7) return `${days}天前`
        if (days < 30) return `${Math.floor(days / 7)}周前`
        return `${Math.floor(days / 30)}个月前`
      }

      // Group conversations by date
      const groupedMap = new Map<string, ChatLunaConversation[]>()
      const conversationList = fetchConversationList.value

      if (!conversationList) {
        return []
      }

      conversationList.forEach((conv) => {
        const convDate = new Date(conv.createdTime)
        const label = getDateLabel(convDate)

        if (!groupedMap.has(label)) {
          groupedMap.set(label, [])
        }
        groupedMap.get(label)?.push(conv)
      })

      // Convert map to sorted array
      const result = Array.from(groupedMap.entries())
        .map(([time, conversations]) => ({
          time,
          conversations: conversations.sort(
            (a, b) =>
              new Date(b.createdTime).getTime() -
              new Date(a.createdTime).getTime()
          )
        }))
        // Custom sort order: 今天 -> X天前 -> X周前 -> X个月前 -> 年份 -> 更早
        .sort((a, b) => {
          const order = ['今天', '天前', '周前', '个月前', '年', '更早']
          const getOrderIndex = (time: string) => {
            return order.findIndex((prefix) => time.endsWith(prefix))
          }
          const orderA = getOrderIndex(a.time)
          const orderB = getOrderIndex(b.time)

          if (orderA === orderB) {
            // If same category, sort by actual date
            return b.conversations[0].createdTime.localeCompare(
              a.conversations[0].createdTime
            )
          }
          return orderA - orderB
        })

      return result
    })

    return {
      conversationList,
      fetchConversationList,
      groupedConversationList
    }
  },
  {
    persist: true
  }
)
