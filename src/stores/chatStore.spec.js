import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useChatStore } from './chatStore';
import chatService from '../services/chatService';
vi.mock('../services/chatService', () => ({
    default: {
        joinChat: vi.fn(),
        subscribeToMessages: vi.fn(),
        sendMessage: vi.fn(),
        confirmDeal: vi.fn(),
        rateUser: vi.fn(),
        leaveChat: vi.fn()
    }
}));
describe('ChatStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        vi.clearAllMocks();
    });
    it('joinChat should call service', async () => {
        const store = useChatStore();
        await store.joinChat('g1', {});
        expect(chatService.joinChat).toHaveBeenCalled();
    });
    it('sendMessage should call service', async () => {
        const store = useChatStore();
        await store.sendMessage('g1', 'hi', {});
        expect(chatService.sendMessage).toHaveBeenCalled();
    });
});
//# sourceMappingURL=chatStore.spec.js.map