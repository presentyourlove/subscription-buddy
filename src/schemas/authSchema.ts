import { z } from 'zod'

/**
 * 登入表單驗證 Schema
 */
export const loginSchema = z.object({
  email: z.string().min(1, '請輸入電子郵件').email('請輸入有效的電子郵件格式'),
  password: z.string().min(6, '密碼至少需要 6 個字元')
})

/**
 * 註冊表單驗證 Schema
 */
export const registerSchema = loginSchema.extend({
  displayName: z.string().min(2, '顯示名稱至少需要 2 個字元').max(20, '顯示名稱不得超過 20 個字元')
})

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
