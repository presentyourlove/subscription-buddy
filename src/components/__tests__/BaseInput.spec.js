import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import BaseInput from '../BaseInput.vue'

describe('BaseInput.vue', () => {
  it('renders label when passed', () => {
    const label = 'Username'
    const wrapper = mount(BaseInput, {
      props: {
        label
      }
    })
    expect(wrapper.text()).toMatch(label)
  })

  it('renders input value correctly', () => {
    const wrapper = mount(BaseInput, {
      props: {
        modelValue: 'test value'
      }
    })
    const input = wrapper.find('input')
    expect(input.element.value).toBe('test value')
  })

  it('emits update:modelValue on input', async () => {
    const wrapper = mount(BaseInput, {
      props: {
        modelValue: ''
      }
    })
    const input = wrapper.find('input')
    await input.setValue('new value')
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['new value'])
  })

  it('renders prefix slot', () => {
    const wrapper = mount(BaseInput, {
      slots: {
        prefix: '<span class="prefix">@</span>'
      }
    })
    expect(wrapper.find('.prefix').exists()).toBe(true)
    expect(wrapper.text()).toContain('@')
  })

  it('applies padding class when prefix slot is present', () => {
    const wrapper = mount(BaseInput, {
      slots: {
        prefix: '<span>$</span>'
      }
    })
    const input = wrapper.find('input')
    expect(input.classes()).toContain('pl-8')
  })

  it('applies custom attributes', () => {
    const wrapper = mount(BaseInput, {
      attrs: {
        type: 'email',
        placeholder: 'Enter email'
      }
    })
    const input = wrapper.find('input')
    expect(input.attributes('type')).toBe('email')
    expect(input.attributes('placeholder')).toBe('Enter email')
  })
})
