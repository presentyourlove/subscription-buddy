import { z } from 'zod'

/**
 * 建立拼團表單驗證 Schema
 */
export const createGroupSchema = z.object({
  title: z.string().min(2, '拼團名稱至少需要 2 個字元').max(50, '拼團名稱不得超過 50 個字元'),
  description: z.string().min(1, '請輸入說明').max(500, '說明不得超過 500 個字元'),
  price: z.number().min(1, '金額必須大於 0').max(10000, '金額不得超過 10,000'),
  slots: z.number().min(1, '人數至少需要 1 人').max(10, '人數不得超過 10 人')
})

export type CreateGroupFormData = z.infer<typeof createGroupSchema>
