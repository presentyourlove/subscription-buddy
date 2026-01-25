import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import BaseInput from './BaseInput.vue'

describe('BaseInput', () => {
  it('renders label when provided', () => {
    const wrapper = mount(BaseInput, {
      props: {
        label: 'Test Label'
      }
    })
    expect(wrapper.text()).toContain('Test Label')
  })

  it('emits update:modelValue when input changes', async () => {
    const wrapper = mount(BaseInput, {
      props: {
        modelValue: ''
      }
    })
    const input = wrapper.find('input')
    await input.setValue('new value')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['new value'])
  })

  it('renders prefix slot when provided', () => {
    const wrapper = mount(BaseInput, {
      slots: {
        prefix: '<span class="prefix-icon">Icon</span>'
      }
    })
    expect(wrapper.html()).toContain('prefix-icon')
    expect(wrapper.find('input').classes()).toContain('pl-8')
  })
})
