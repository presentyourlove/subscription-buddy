import { ref, onUnmounted, watch, isRef } from 'vue';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
/**
 * Composable for real-time Firestore document listening
 * @param collectionName - Firestore collection name
 * @param docId - Document ID (can be reactive ref or string)
 * @returns Reactive data, loading state, and error
 */
export function useFirestoreDoc(collectionName, docId) {
    const data = ref(null);
    const loading = ref(true);
    const error = ref(null);
    let unsubscribe = null;
    const subscribe = (id) => {
        // Cleanup previous subscription
        if (unsubscribe) {
            unsubscribe();
            unsubscribe = null;
        }
        if (!id) {
            data.value = null;
            loading.value = false;
            return;
        }
        loading.value = true;
        error.value = null;
        unsubscribe = onSnapshot(doc(db, collectionName, id), (snapshot) => {
            if (snapshot.exists()) {
                data.value = { id: snapshot.id, ...snapshot.data() };
            }
            else {
                data.value = null;
            }
            loading.value = false;
        }, (err) => {
            error.value = err;
            loading.value = false;
        });
    };
    // Initialize subscription
    const initialId = isRef(docId) ? docId.value : docId;
    subscribe(initialId);
    // Watch for docId changes if reactive
    if (isRef(docId)) {
        watch(docId, (newId) => {
            subscribe(newId);
        });
    }
    // Cleanup on unmount
    onUnmounted(() => {
        if (unsubscribe) {
            unsubscribe();
        }
    });
    return {
        data,
        loading,
        error
    };
}
//# sourceMappingURL=useFirestoreDoc.js.map