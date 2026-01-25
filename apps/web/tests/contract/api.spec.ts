import { PactV3, MatchersV3 } from '@pact-foundation/pact'
import path from 'path'
import { describe, it, expect } from 'vitest'
import axios from 'axios' // Assuming axios or fetch is used. Using axios for simplicity in test.

const { Like } = MatchersV3

const provider = new PactV3({
    consumer: 'SubscriptionBuddyWeb',
    provider: 'SubscriptionBuddyFunctions',
    dir: path.resolve(process.cwd(), '../../pacts'),
})

describe('API Contract Test', () => {
    it('get feature flags', async () => {
        // Define the expected interaction
        await provider.addInteraction({
            states: [{ description: 'feature flags exist' }],
            uponReceiving: 'a request for feature flags',
            withRequest: {
                method: 'GET',
                path: '/api/features',
                headers: { Accept: 'application/json' }
            },
            willRespondWith: {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
                body: Like({
                    enable_new_chat_ui: false,
                    maintenance_mode: false
                })
            },
        })

        // Execute the request via the Pact Mock Server
        await provider.executeTest(async (mockServer) => {
            // Here we would normally call our actual API client
            // e.g. await api.getFeatures({ baseUrl: mockServer.url })
            // For demonstration, direct call:
            const response = await axios.get(`${mockServer.url}/api/features`, {
                headers: { Accept: 'application/json' }
            })

            expect(response.data).toEqual({
                enable_new_chat_ui: false,
                maintenance_mode: false
            })
        })
    })
})
