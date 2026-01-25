import type { Meta, StoryObj } from '@storybook/vue3'

import UserRating from './UserRating.vue'

const meta: Meta<typeof UserRating> = {
  title: 'Components/UserRating',
  component: UserRating,
  tags: ['autodocs'],
  argTypes: {
    initialData: { control: 'object' },
    uid: { control: 'text' }
  }
}

export default meta
type Story = StoryObj<typeof UserRating>

export const NoRating: Story = {
  args: {
    // initialData with 0 count simulates new user
    initialData: { ratingSum: 0, ratingCount: 0 }
  }
}

export const HighRating: Story = {
  args: {
    initialData: { ratingSum: 50, ratingCount: 10 } // 5.0
  }
}

export const AverageRating: Story = {
  args: {
    initialData: { ratingSum: 35, ratingCount: 10 } // 3.5
  }
}

export const LoadingState: Story = {
  args: {
    uid: 'dummy-uid-to-trigger-loading'
    // No initialData triggers fetch logic
  },
  parameters: {
    // We expect this to try fetching and maybe fail or hang in loading if mocked
    // Ideally we'd mock the network request here if were advanced
  }
}
