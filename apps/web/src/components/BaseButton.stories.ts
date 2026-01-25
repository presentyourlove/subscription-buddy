import type { Meta, StoryObj } from '@storybook/vue3-vite'

import BaseButton from './BaseButton.vue'

const meta: Meta<typeof BaseButton> = {
  title: 'Components/BaseButton',
  component: BaseButton,
  tags: ['autodocs'],
  argTypes: {
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    default: { control: 'text', description: 'Button content' }
  },
  args: {
    default: 'Button',
    loading: false,
    disabled: false
  }
}

export default meta
type Story = StoryObj<typeof BaseButton>

export const Primary: Story = {
  render: (args) => ({
    components: { BaseButton },
    setup() {
      return { args }
    },
    template: '<BaseButton v-bind="args">{{ args.default }}</BaseButton>'
  }),
  args: {
    default: 'Primary Action'
  }
}

export const Loading: Story = {
  render: (args) => ({
    components: { BaseButton },
    setup() {
      return { args }
    },
    template: '<BaseButton v-bind="args">{{ args.default }}</BaseButton>'
  }),
  args: {
    loading: true,
    default: 'Processing...'
  }
}

export const Disabled: Story = {
  render: (args) => ({
    components: { BaseButton },
    setup() {
      return { args }
    },
    template: '<BaseButton v-bind="args">{{ args.default }}</BaseButton>'
  }),
  args: {
    disabled: true,
    default: 'Disabled'
  }
}
