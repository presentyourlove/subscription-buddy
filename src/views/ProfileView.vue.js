import { ref, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/userStore';
import UserRating from '../components/UserRating.vue';
import { db } from '../firebase/config';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import BaseInput from '../components/BaseInput.vue';
import BaseButton from '../components/BaseButton.vue';
import { useI18n } from 'vue-i18n';
const router = useRouter();
const userStore = useUserStore();
const { t } = useI18n();
const isEditing = ref(false);
const loading = ref(false);
const loadingHistory = ref(false);
const globalError = ref(null);
const activeTab = ref('hosted');
const hostedGroups = ref([]);
const joinedGroups = ref([]);
const editForm = ref({
    displayName: '',
    photoURL: ''
});
const openEditModal = () => {
    editForm.value = {
        displayName: userStore.user?.displayName || '',
        photoURL: userStore.user?.photoURL || ''
    };
    isEditing.value = true;
};
const handleUpdate = async () => {
    loading.value = true;
    try {
        await userStore.updateUserProfile(editForm.value.displayName, editForm.value.photoURL);
        isEditing.value = false;
    }
    catch (e) {
        alert(t('profile.error.updateFailed') + ': ' + e.message);
    }
    finally {
        loading.value = false;
    }
};
const fetchHistory = async () => {
    if (!userStore.user?.uid)
        return;
    loadingHistory.value = true;
    globalError.value = null; // Clear previous errors
    try {
        // 1. Hosted Groups
        const qHosted = query(collection(db, 'groups'), where('hostId', '==', userStore.user.uid));
        const snapHosted = await getDocs(qHosted);
        hostedGroups.value = snapHosted.docs.map((d) => ({ id: d.id, ...d.data() }));
        // 2. Joined Chats -> Groups
        const qChats = query(collection(db, 'chats'), where('participants', 'array-contains', userStore.user.uid));
        const snapChats = await getDocs(qChats);
        const joined = [];
        for (const cDoc of snapChats.docs) {
            const groupId = cDoc.id;
            // Skip if I am the host
            if (hostedGroups.value.find((g) => g.id === groupId))
                continue;
            try {
                const gRef = doc(db, 'groups', groupId);
                const gSnap = await getDoc(gRef);
                if (gSnap.exists()) {
                    joined.push({ id: gSnap.id, ...gSnap.data() });
                }
            }
            catch (innerErr) {
                console.warn('Skipping invalid group ref:', groupId, innerErr);
            }
        }
        joinedGroups.value = joined;
    }
    catch (e) {
        console.error('Fetch history failed:', e);
        globalError.value = t('profile.error.fetchFailed') + ': ' + e.message;
    }
    finally {
        loadingHistory.value = false;
    }
};
const formatDate = (ts) => {
    if (!ts)
        return '';
    try {
        const date = ts.seconds ? new Date(ts.seconds * 1000) : new Date(ts);
        return date.toLocaleDateString();
    }
    catch (e) {
        return 'Invalid Date';
    }
};
const navigateTo = (group) => {
    if (activeTab.value === 'joined') {
        router.push(`/chat/${group.id}`);
    }
    else {
        router.push(`/groups/${group.id}`);
    }
};
const currentList = computed(() => {
    return activeTab.value === 'hosted' ? hostedGroups.value : joinedGroups.value;
});
// Initialize
watch(() => userStore.user, (val) => {
    if (val && val.uid) {
        fetchHistory();
    }
}, { immediate: true });
const imageErrorMap = ref({});
const handleImageError = (id) => {
    if (id)
        imageErrorMap.value[id] = true;
};
const getServiceLogo = (title) => {
    if (!title)
        return undefined;
    const t = title.toLowerCase();
    if (t.includes('netflix'))
        return 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg';
    if (t.includes('spotify'))
        return 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg';
    if (t.includes('youtube'))
        return 'https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg';
    if (t.includes('disney'))
        return 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg';
    if (t.includes('apple') || t.includes('icloud'))
        return 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg';
    if (t.includes('nintendo') || t.includes('switch'))
        return 'https://upload.wikimedia.org/wikipedia/commons/0/0d/Nintendo.svg';
    if (t.includes('chatgpt') || t.includes('openai'))
        return 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg';
    return undefined;
};
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-white" },
});
/** @type {__VLS_StyleScopedClasses['max-w-4xl']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:px-8']} */ ;
/** @type {__VLS_StyleScopedClasses['py-8']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
if (__VLS_ctx.globalError) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "bg-red-500/10 border border-red-500 text-red-200 p-4 rounded-xl mb-6" },
    });
    /** @type {__VLS_StyleScopedClasses['bg-red-500/10']} */ ;
    /** @type {__VLS_StyleScopedClasses['border']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-red-500']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-red-200']} */ ;
    /** @type {__VLS_StyleScopedClasses['p-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    (__VLS_ctx.$t('common.errorTitle'));
    (__VLS_ctx.globalError);
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-sm mt-1" },
    });
    /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
    (__VLS_ctx.$t('common.refreshHint'));
}
if (!__VLS_ctx.userStore.user) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "text-center py-20 text-gray-400" },
    });
    /** @type {__VLS_StyleScopedClasses['text-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['py-20']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "animate-spin text-4xl mb-4" },
    });
    /** @type {__VLS_StyleScopedClasses['animate-spin']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-4xl']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    (__VLS_ctx.$t('common.loadingData'));
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 mb-8 flex flex-col md:flex-row items-center gap-8 shadow-xl" },
    });
    /** @type {__VLS_StyleScopedClasses['bg-white/5']} */ ;
    /** @type {__VLS_StyleScopedClasses['backdrop-blur-md']} */ ;
    /** @type {__VLS_StyleScopedClasses['border']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-white/10']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-2xl']} */ ;
    /** @type {__VLS_StyleScopedClasses['p-8']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
    /** @type {__VLS_StyleScopedClasses['md:flex-row']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-8']} */ ;
    /** @type {__VLS_StyleScopedClasses['shadow-xl']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "relative group" },
    });
    /** @type {__VLS_StyleScopedClasses['relative']} */ ;
    /** @type {__VLS_StyleScopedClasses['group']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "w-32 h-32 rounded-full overflow-hidden border-4 border-white/10 shadow-lg bg-gray-700 flex items-center justify-center text-4xl" },
    });
    /** @type {__VLS_StyleScopedClasses['w-32']} */ ;
    /** @type {__VLS_StyleScopedClasses['h-32']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-white/10']} */ ;
    /** @type {__VLS_StyleScopedClasses['shadow-lg']} */ ;
    /** @type {__VLS_StyleScopedClasses['bg-gray-700']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-4xl']} */ ;
    if (__VLS_ctx.userStore.user.photoURL) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
            src: (__VLS_ctx.userStore.user.photoURL),
            ...{ class: "w-full h-full object-cover" },
        });
        /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
        /** @type {__VLS_StyleScopedClasses['h-full']} */ ;
        /** @type {__VLS_StyleScopedClasses['object-cover']} */ ;
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-1 text-center md:text-left" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['md:text-left']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({
        ...{ class: "text-3xl font-bold mb-2 flex items-center justify-center md:justify-start gap-3" },
    });
    /** @type {__VLS_StyleScopedClasses['text-3xl']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['md:justify-start']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
    (__VLS_ctx.userStore.user.displayName || __VLS_ctx.$t('profile.defaultName'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (__VLS_ctx.openEditModal) },
        ...{ class: "text-sm bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors text-gray-300" },
        'aria-label': "Edit profile",
    });
    /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
    /** @type {__VLS_StyleScopedClasses['bg-white/10']} */ ;
    /** @type {__VLS_StyleScopedClasses['hover:bg-white/20']} */ ;
    /** @type {__VLS_StyleScopedClasses['p-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-gray-300']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-gray-400 mb-4" },
    });
    /** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
    (__VLS_ctx.userStore.user.email);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "inline-flex items-center gap-2 bg-black/20 px-4 py-2 rounded-xl border border-white/5" },
    });
    /** @type {__VLS_StyleScopedClasses['inline-flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['bg-black/20']} */ ;
    /** @type {__VLS_StyleScopedClasses['px-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['py-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
    /** @type {__VLS_StyleScopedClasses['border']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-white/5']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "text-gray-400 text-sm" },
    });
    /** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
    (__VLS_ctx.$t('profile.reputation'));
    const __VLS_0 = UserRating;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
        uid: (__VLS_ctx.userStore.user.uid),
        size: "lg",
    }));
    const __VLS_2 = __VLS_1({
        uid: (__VLS_ctx.userStore.user.uid),
        size: "lg",
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    if (__VLS_ctx.isEditing) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "mb-8 bg-white/5 border border-white/10 rounded-2xl p-6" },
        });
        /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
        /** @type {__VLS_StyleScopedClasses['bg-white/5']} */ ;
        /** @type {__VLS_StyleScopedClasses['border']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-white/10']} */ ;
        /** @type {__VLS_StyleScopedClasses['rounded-2xl']} */ ;
        /** @type {__VLS_StyleScopedClasses['p-6']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.h3, __VLS_intrinsics.h3)({
            ...{ class: "text-lg font-bold mb-4" },
        });
        /** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
        /** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
        /** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
        (__VLS_ctx.$t('profile.edit.title'));
        __VLS_asFunctionalElement1(__VLS_intrinsics.form, __VLS_intrinsics.form)({
            ...{ onSubmit: (__VLS_ctx.handleUpdate) },
            ...{ class: "space-y-4" },
        });
        /** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
        const __VLS_5 = BaseInput;
        // @ts-ignore
        const __VLS_6 = __VLS_asFunctionalComponent1(__VLS_5, new __VLS_5({
            modelValue: (__VLS_ctx.editForm.displayName),
            label: (__VLS_ctx.$t('profile.edit.displayName')),
            required: true,
        }));
        const __VLS_7 = __VLS_6({
            modelValue: (__VLS_ctx.editForm.displayName),
            label: (__VLS_ctx.$t('profile.edit.displayName')),
            required: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_6));
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
        const __VLS_10 = BaseInput;
        // @ts-ignore
        const __VLS_11 = __VLS_asFunctionalComponent1(__VLS_10, new __VLS_10({
            modelValue: (__VLS_ctx.editForm.photoURL),
            label: (__VLS_ctx.$t('profile.edit.photoURL')),
            placeholder: "https://...",
            type: "url",
        }));
        const __VLS_12 = __VLS_11({
            modelValue: (__VLS_ctx.editForm.photoURL),
            label: (__VLS_ctx.$t('profile.edit.photoURL')),
            placeholder: "https://...",
            type: "url",
        }, ...__VLS_functionalComponentArgsRest(__VLS_11));
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex gap-4 pt-2" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
        /** @type {__VLS_StyleScopedClasses['pt-2']} */ ;
        const __VLS_15 = BaseButton || BaseButton;
        // @ts-ignore
        const __VLS_16 = __VLS_asFunctionalComponent1(__VLS_15, new __VLS_15({
            type: "submit",
            loading: (__VLS_ctx.loading),
        }));
        const __VLS_17 = __VLS_16({
            type: "submit",
            loading: (__VLS_ctx.loading),
        }, ...__VLS_functionalComponentArgsRest(__VLS_16));
        const { default: __VLS_20 } = __VLS_18.slots;
        (__VLS_ctx.$t('profile.edit.save'));
        // @ts-ignore
        [globalError, globalError, $t, $t, $t, $t, $t, $t, $t, $t, $t, userStore, userStore, userStore, userStore, userStore, userStore, openEditModal, isEditing, handleUpdate, editForm, editForm, loading,];
        var __VLS_18;
        __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
            ...{ onClick: (...[$event]) => {
                    if (!!(!__VLS_ctx.userStore.user))
                        return;
                    if (!(__VLS_ctx.isEditing))
                        return;
                    __VLS_ctx.isEditing = false;
                    // @ts-ignore
                    [isEditing,];
                } },
            type: "button",
            ...{ class: "bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-xl font-bold transition-colors w-full" },
        });
        /** @type {__VLS_StyleScopedClasses['bg-white/10']} */ ;
        /** @type {__VLS_StyleScopedClasses['hover:bg-white/20']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-white']} */ ;
        /** @type {__VLS_StyleScopedClasses['px-6']} */ ;
        /** @type {__VLS_StyleScopedClasses['py-2']} */ ;
        /** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
        /** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
        /** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
        /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
        (__VLS_ctx.$t('profile.edit.cancel'));
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "mb-6 border-b border-white/10 flex gap-8" },
    });
    /** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-b']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-white/10']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-8']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (...[$event]) => {
                if (!!(!__VLS_ctx.userStore.user))
                    return;
                __VLS_ctx.activeTab = 'hosted';
                // @ts-ignore
                [$t, activeTab,];
            } },
        ...{ class: "pb-3 text-lg font-bold transition-colors border-b-2" },
        ...{ class: (__VLS_ctx.activeTab === 'hosted'
                ? 'border-purple-500 text-white'
                : 'border-transparent text-gray-500 hover:text-gray-300') },
    });
    /** @type {__VLS_StyleScopedClasses['pb-3']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
    /** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-b-2']} */ ;
    (__VLS_ctx.$t('profile.tabs.hosted'));
    (__VLS_ctx.hostedGroups.length);
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (...[$event]) => {
                if (!!(!__VLS_ctx.userStore.user))
                    return;
                __VLS_ctx.activeTab = 'joined';
                // @ts-ignore
                [$t, activeTab, activeTab, hostedGroups,];
            } },
        ...{ class: "pb-3 text-lg font-bold transition-colors border-b-2" },
        ...{ class: (__VLS_ctx.activeTab === 'joined'
                ? 'border-purple-500 text-white'
                : 'border-transparent text-gray-500 hover:text-gray-300') },
    });
    /** @type {__VLS_StyleScopedClasses['pb-3']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
    /** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-b-2']} */ ;
    (__VLS_ctx.$t('profile.tabs.joined'));
    (__VLS_ctx.joinedGroups.length);
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-sm text-gray-400 mb-4 flex items-center gap-1 font-medium bg-blue-500/10 p-2 rounded-lg border border-blue-500/20" },
    });
    /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-1']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
    /** @type {__VLS_StyleScopedClasses['bg-blue-500/10']} */ ;
    /** @type {__VLS_StyleScopedClasses['p-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
    /** @type {__VLS_StyleScopedClasses['border']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-blue-500/20']} */ ;
    (__VLS_ctx.$t('profile.info.chatRetention'));
    if (__VLS_ctx.loadingHistory) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex justify-center py-12" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['py-12']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500" },
        });
        /** @type {__VLS_StyleScopedClasses['animate-spin']} */ ;
        /** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
        /** @type {__VLS_StyleScopedClasses['h-8']} */ ;
        /** @type {__VLS_StyleScopedClasses['w-8']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-t-2']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-b-2']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-purple-500']} */ ;
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "grid gap-4" },
        });
        /** @type {__VLS_StyleScopedClasses['grid']} */ ;
        /** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
        for (const [group] of __VLS_vFor((__VLS_ctx.currentList))) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ onClick: (...[$event]) => {
                        if (!!(!__VLS_ctx.userStore.user))
                            return;
                        if (!!(__VLS_ctx.loadingHistory))
                            return;
                        __VLS_ctx.navigateTo(group);
                        // @ts-ignore
                        [$t, $t, activeTab, joinedGroups, loadingHistory, currentList, navigateTo,];
                    } },
                key: (group.id),
                ...{ class: "bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between hover:bg-white/10 transition-colors cursor-pointer" },
            });
            /** @type {__VLS_StyleScopedClasses['bg-white/5']} */ ;
            /** @type {__VLS_StyleScopedClasses['border']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-white/10']} */ ;
            /** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
            /** @type {__VLS_StyleScopedClasses['p-4']} */ ;
            /** @type {__VLS_StyleScopedClasses['flex']} */ ;
            /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
            /** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
            /** @type {__VLS_StyleScopedClasses['hover:bg-white/10']} */ ;
            /** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
            /** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "flex items-center gap-4" },
            });
            /** @type {__VLS_StyleScopedClasses['flex']} */ ;
            /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
            /** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "h-12 w-12 flex items-center justify-center rounded-lg overflow-hidden bg-white/5" },
            });
            /** @type {__VLS_StyleScopedClasses['h-12']} */ ;
            /** @type {__VLS_StyleScopedClasses['w-12']} */ ;
            /** @type {__VLS_StyleScopedClasses['flex']} */ ;
            /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
            /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
            /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
            /** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
            /** @type {__VLS_StyleScopedClasses['bg-white/5']} */ ;
            if (group.id && __VLS_ctx.getServiceLogo(group.title) && !__VLS_ctx.imageErrorMap[group.id]) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
                    ...{ onError: (...[$event]) => {
                            if (!!(!__VLS_ctx.userStore.user))
                                return;
                            if (!!(__VLS_ctx.loadingHistory))
                                return;
                            if (!(group.id && __VLS_ctx.getServiceLogo(group.title) && !__VLS_ctx.imageErrorMap[group.id]))
                                return;
                            __VLS_ctx.handleImageError(group.id);
                            // @ts-ignore
                            [getServiceLogo, imageErrorMap, handleImageError,];
                        } },
                    src: (__VLS_ctx.getServiceLogo(group.title)),
                    ...{ class: "h-full w-full object-contain" },
                    alt: "Service Logo",
                });
                /** @type {__VLS_StyleScopedClasses['h-full']} */ ;
                /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
                /** @type {__VLS_StyleScopedClasses['object-contain']} */ ;
            }
            else {
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ class: "text-2xl" },
                });
                /** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
                (__VLS_ctx.activeTab === 'hosted' ? '👑' : '👋');
            }
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
            __VLS_asFunctionalElement1(__VLS_intrinsics.h3, __VLS_intrinsics.h3)({
                ...{ class: "font-bold text-lg" },
            });
            /** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
            /** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
            (group.title);
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "text-xs px-2 py-0.5 rounded border" },
                ...{ class: ({
                        'border-green-500/30 text-green-300 bg-green-500/10': group.status === 'OPEN',
                        'border-red-500/30 text-red-300 bg-red-500/10': group.status === 'FULL',
                        'border-gray-500/30 text-gray-400 bg-gray-500/10': group.status === 'CLOSED'
                    }) },
            });
            /** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
            /** @type {__VLS_StyleScopedClasses['px-2']} */ ;
            /** @type {__VLS_StyleScopedClasses['py-0.5']} */ ;
            /** @type {__VLS_StyleScopedClasses['rounded']} */ ;
            /** @type {__VLS_StyleScopedClasses['border']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-green-500/30']} */ ;
            /** @type {__VLS_StyleScopedClasses['text-green-300']} */ ;
            /** @type {__VLS_StyleScopedClasses['bg-green-500/10']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-red-500/30']} */ ;
            /** @type {__VLS_StyleScopedClasses['text-red-300']} */ ;
            /** @type {__VLS_StyleScopedClasses['bg-red-500/10']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-gray-500/30']} */ ;
            /** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
            /** @type {__VLS_StyleScopedClasses['bg-gray-500/10']} */ ;
            (group.status);
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "text-right" },
            });
            /** @type {__VLS_StyleScopedClasses['text-right']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "text-purple-300 font-bold" },
            });
            /** @type {__VLS_StyleScopedClasses['text-purple-300']} */ ;
            /** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
            (group.price);
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "text-xs text-gray-500" },
            });
            /** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
            /** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
            (__VLS_ctx.formatDate(group.createdAt));
            // @ts-ignore
            [activeTab, getServiceLogo, formatDate,];
        }
        if (__VLS_ctx.currentList.length === 0) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "text-center py-12 text-gray-500 bg-white/5 rounded-xl border border-dashed border-white/10" },
            });
            /** @type {__VLS_StyleScopedClasses['text-center']} */ ;
            /** @type {__VLS_StyleScopedClasses['py-12']} */ ;
            /** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
            /** @type {__VLS_StyleScopedClasses['bg-white/5']} */ ;
            /** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
            /** @type {__VLS_StyleScopedClasses['border']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-dashed']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-white/10']} */ ;
            (__VLS_ctx.$t('profile.emptyHistory'));
        }
    }
}
// @ts-ignore
[$t, currentList,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
//# sourceMappingURL=ProfileView.vue.js.map