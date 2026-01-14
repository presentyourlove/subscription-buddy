import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useFirestoreDoc } from './useFirestoreDoc';
import * as firestore from 'firebase/firestore';
import { ref } from 'vue';
vi.mock('firebase/firestore', () => ({
    onSnapshot: vi.fn(),
    doc: vi.fn()
}));
vi.mock('../firebase/config', () => ({
    db: {}
}));
describe('useFirestoreDoc', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    it('should not subscribe if docId is null', () => {
        const docId = ref(null);
        useFirestoreDoc('collection', docId);
        expect(firestore.onSnapshot).not.toHaveBeenCalled();
    });
    it('should subscribe when docId is provided', () => {
        const docId = ref('123');
        useFirestoreDoc('collection', docId);
        expect(firestore.onSnapshot).toHaveBeenCalled();
    });
});
//# sourceMappingURL=useFirestoreDoc.spec.js.map