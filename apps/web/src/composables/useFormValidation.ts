import { reactive, ref } from 'vue'
import type { ZodSchema } from 'zod'

interface FieldErrors {
  [key: string]: string | undefined
}

/**
 * 表單驗證 Composable
 * 封裝 Zod 驗證邏輯，提供響應式錯誤狀態
 *
 * @example
 * const { errors, validate, clearErrors } = useFormValidation(loginSchema)
 * const isValid = validate({ email, password })
 */
export function useFormValidation<T extends Record<string, unknown>>(schema: ZodSchema<T>) {
  const errors = reactive<FieldErrors>({})
  const isValidating = ref(false)

  /**
   * 驗證資料
   * @returns true if valid, false if invalid
   */
  function validate(data: unknown): data is T {
    isValidating.value = true
    clearErrors()

    const result = schema.safeParse(data)

    if (!result.success) {
      result.error.issues.forEach((err) => {
        const field = err.path[0]
        if (field && typeof field === 'string') {
          errors[field] = err.message
        }
      })
      isValidating.value = false
      return false
    }

    isValidating.value = false
    return true
  }

  /**
   * 驗證單一欄位
   */
  function validateField(field: keyof T, value: unknown): boolean {
    const partialData = { [field]: value }
    const result = schema.safeParse(partialData)

    if (!result.success) {
      const fieldError = result.error.issues.find((err) => err.path[0] === field)
      if (fieldError) {
        errors[field as string] = fieldError.message
        return false
      }
    }

    delete errors[field as string]
    return true
  }

  /**
   * 清除所有錯誤
   */
  function clearErrors() {
    Object.keys(errors).forEach((key) => {
      delete errors[key]
    })
  }

  /**
   * 清除特定欄位錯誤
   */
  function clearFieldError(field: keyof T) {
    delete errors[field as string]
  }

  return {
    errors,
    isValidating,
    validate,
    validateField,
    clearErrors,
    clearFieldError
  }
}
