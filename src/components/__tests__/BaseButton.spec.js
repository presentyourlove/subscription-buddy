import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import BaseButton from '../BaseButton.vue'

describe('BaseButton.vue', () => {
  it('renders default slot content', () => {
    const wrapper = mount(BaseButton, {
      slots: {
        default: 'Click Me'
      }
    })
    expect(wrapper.text()).toContain('Click Me')
  })

  it('shows loading text when loading prop is true', () => {
    const wrapper = mount(BaseButton, {
      props: {
        loading: true
      },
      slots: {
        default: 'Click Me'
      }
    })
    expect(wrapper.text()).toContain('處理中...')
    expect(wrapper.text()).not.toContain('Click Me')
  })

  it('disables button when loading prop is true', () => {
    const wrapper = mount(BaseButton, {
      props: {
        loading: true
      }
    })
    expect(wrapper.element.disabled).toBe(true)
  })

  it('renders icon slot', () => {
    const wrapper = mount(BaseButton, {
      slots: {
        icon: '<span class="icon">🚀</span>'
      }
    })
    expect(wrapper.find('.icon').exists()).toBe(true)
    expect(wrapper.text()).toContain('🚀')
  })

  it('applies custom attributes', () => {
    const wrapper = mount(BaseButton, {
      attrs: {
        type: 'submit',
        'aria-label': 'Submit Button'
      }
    })
    expect(wrapper.attributes('type')).toBe('submit')
    expect(wrapper.attributes('aria-label')).toBe('Submit Button')
  })
})
