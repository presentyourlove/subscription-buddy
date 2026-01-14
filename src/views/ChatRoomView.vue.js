import { ref, onMounted, onUnmounted, computed, watch, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useUserStore } from '../stores/userStore';
import { useChatStore } from '../stores/chatStore';
import { useGroupStore } from '../stores/groupStore';
import { useFirestoreDoc } from '../composables/useFirestoreDoc';
import { useNotification } from '../composables/useNotification';
import LazyImage from '../components/LazyImage.vue';
import { useVirtualList } from '@vueuse/core';
import { GROUP_STATUS, DEFAULTS } from '../utils/constants';
const maxRating = DEFAULTS.MAX_RATING;
const { t } = useI18n();
const route = useRoute();
const chatStore = useChatStore();
const userStore = useUserStore();
const groupStore = useGroupStore();
const notification = useNotification();
const groupId = route.params.id;
// Use composable for chat meta (confirmation status)
const { data: chatMeta } = useFirestoreDoc('chats', groupId);
const hasConfirmed = computed(() => {
    if (!chatMeta.value || !chatMeta.value.confirmedUsers || !userStore.user)
        return false;
    return chatMeta.value.confirmedUsers.includes(userStore.user.uid);
});
const isDealClosed = computed(() => {
    // Logic: Deal is closed if confirmed users count matches participants count
    if (!chatMeta.value || !chatMeta.value.confirmedUsers)
        return false;
    const participants = chatMeta.value.participants || [];
    const confirmed = chatMeta.value.confirmedUsers || [];
    // If everyone confirmed
    return participants.length > 0 && confirmed.length >= participants.length;
});
// Watch deal closed to auto-update group status (Only Host can do this)
watch(isDealClosed, async (val) => {
    if (val && chatMeta.value && userStore.user) {
        await groupStore.updateGroupStatus(groupId, GROUP_STATUS.CLOSED);
    }
});
const newMessage = ref('');
const initChat = async () => {
    if (!userStore.user)
        return;
    // Prevent double init
    if (chatStore.unsubscribe)
        return;
    try {
        // 1. Join Chat (ensure participant)
        await chatStore.joinChat(groupId, userStore.user);
        // 2. Subscribe messages
        chatStore.subscribeToMessages(groupId);
        // Note: Chat meta is now handled by useFirestoreDoc composable
    }
    catch (err) {
        notification.error(t('chat.errorJoin', { error: err.message }));
    }
};
onMounted(() => {
    initChat();
});
// Watch for auth ready if page refreshed
watch(() => userStore.user, (val) => {
    if (val)
        initChat();
});
onUnmounted(() => {
    chatStore.unsubscribeFromMessages();
    // Note: chatMeta unsubscription is handled by useFirestoreDoc composable
});
// Virtual Scroll Logic
// Virtual Scroll Logic
const { list, containerProps, wrapperProps, scrollTo } = useVirtualList(computed(() => chatStore.messages), {
    itemHeight: 80, // Estimated height as requested
    overscan: 10
});
// Auto-scroll logic
const scrollToBottom = () => {
    if (chatStore.messages.length > 0) {
        scrollTo(chatStore.messages.length - 1);
    }
};
// Watch messages to auto scroll
watch(() => chatStore.messages, () => {
    nextTick(() => {
        scrollToBottom();
    });
}, { deep: true });
const handleSend = async () => {
    if (!newMessage.value.trim())
        return;
    if (!userStore.user)
        return;
    try {
        await chatStore.sendMessage(newMessage.value, userStore.user);
        newMessage.value = '';
    }
    catch (err) {
        notification.error(t('chat.errorSend', { error: err.message }));
    }
};
const handleConfirm = async () => {
    if (!confirm(t('chat.confirmDealPrompt')))
        return;
    if (!userStore.user)
        return;
    try {
        await chatStore.confirmDeal(groupId, userStore.user);
    }
    catch (err) {
        notification.error(t('chat.errorConfirm', { error: err.message }));
    }
};
const formatTime = (timestamp) => {
    if (!timestamp)
        return '...';
    return new Date(timestamp.seconds * 1000).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });
};
// --- Rating System ---
const showRatingModal = ref(false);
const ratingTarget = ref(null); // { uid, name, avatar }
const ratingScore = ref(DEFAULTS.MAX_RATING); // Use constant
const ratingComment = ref('');
const participantsInfo = computed(() => {
    // We need complete info (name, avatar) for participants.
    // Ideally userStore or chatStore should provide this.
    // Strategy: Extract unique senders from message history as a MVP solution for participant info.
    if (!chatStore.messages)
        return [];
    const senders = {};
    chatStore.messages.forEach((m) => {
        if (m.senderId !== userStore.user?.uid) {
            senders[m.senderId] = {
                uid: m.senderId,
                name: m.senderName,
                avatar: m.senderAvatar || ''
            };
        }
    });
    return Object.values(senders);
});
const setRating = (score, target) => {
    ratingScore.value = score;
    ratingTarget.value = target;
};
const handleRate = async () => {
    if (!ratingTarget.value || !userStore.user)
        return;
    try {
        await chatStore.rateUser(groupId, ratingTarget.value.uid, ratingScore.value, userStore.user.uid);
        notification.success(t('chat.successRate', { name: ratingTarget.value.name, score: ratingScore.value }));
        showRatingModal.value = false;
        ratingComment.value = ''; // Reset
        // Refresh meta logic? useFirestoreDoc handles it.
    }
    catch (err) {
        notification.error(t('chat.errorRate', { error: err }));
    }
};
const checkRated = (targetUid) => {
    if (!chatMeta.value || !chatMeta.value.ratings || !userStore.user)
        return false;
    const myRatings = chatMeta.value.ratings[userStore.user.uid];
    return myRatings && myRatings[targetUid] !== undefined;
};
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
if (__VLS_ctx.userStore.user) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex flex-col h-[calc(100vh-64px)] max-w-4xl mx-auto bg-[#0f172a]" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
    /** @type {__VLS_StyleScopedClasses['h-[calc(100vh-64px)]']} */ ;
    /** @type {__VLS_StyleScopedClasses['max-w-4xl']} */ ;
    /** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
    /** @type {__VLS_StyleScopedClasses['bg-[#0f172a]']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "bg-amber-500/10 border-b border-amber-500/20 p-3 flex flex-col items-center justify-center text-amber-500 text-sm font-medium text-center gap-1" },
    });
    /** @type {__VLS_StyleScopedClasses['bg-amber-500/10']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-b']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-amber-500/20']} */ ;
    /** @type {__VLS_StyleScopedClasses['p-3']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-amber-500']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-1']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.$t('chat.safetyCredit'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.$t('chat.safetyRights'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "bg-white/5 backdrop-blur-md border-b border-white/10 p-4 flex justify-between items-center" },
    });
    /** @type {__VLS_StyleScopedClasses['bg-white/5']} */ ;
    /** @type {__VLS_StyleScopedClasses['backdrop-blur-md']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-b']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-white/10']} */ ;
    /** @type {__VLS_StyleScopedClasses['p-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    let __VLS_0;
    /** @ts-ignore @type {typeof __VLS_components.routerLink | typeof __VLS_components.RouterLink | typeof __VLS_components.routerLink | typeof __VLS_components.RouterLink} */
    routerLink;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
        to: (`/groups/${__VLS_ctx.groupId}`),
        ...{ class: "text-gray-400 hover:text-white transition-colors" },
    }));
    const __VLS_2 = __VLS_1({
        to: (`/groups/${__VLS_ctx.groupId}`),
        ...{ class: "text-gray-400 hover:text-white transition-colors" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    /** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
    /** @type {__VLS_StyleScopedClasses['hover:text-white']} */ ;
    /** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
    const { default: __VLS_5 } = __VLS_3.slots;
    (__VLS_ctx.$t('chat.backToDetail'));
    // @ts-ignore
    [userStore, $t, $t, $t, groupId,];
    var __VLS_3;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "font-bold text-white flex flex-col items-center" },
    });
    /** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-white']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.$t('chat.title'));
    if (__VLS_ctx.isDealClosed) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "text-xs text-green-400 mt-0.5" },
        });
        /** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-green-400']} */ ;
        /** @type {__VLS_StyleScopedClasses['mt-0.5']} */ ;
        (__VLS_ctx.$t('chat.closedLabel'));
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    if (!__VLS_ctx.hasConfirmed) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
            ...{ onClick: (__VLS_ctx.handleConfirm) },
            disabled: (__VLS_ctx.chatStore.loading),
            ...{ class: "bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-500/30 text-xs px-4 py-2 rounded-full transition-colors flex items-center gap-1" },
        });
        /** @type {__VLS_StyleScopedClasses['bg-green-600/20']} */ ;
        /** @type {__VLS_StyleScopedClasses['hover:bg-green-600/30']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-green-400']} */ ;
        /** @type {__VLS_StyleScopedClasses['border']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-green-500/30']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
        /** @type {__VLS_StyleScopedClasses['px-4']} */ ;
        /** @type {__VLS_StyleScopedClasses['py-2']} */ ;
        /** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
        /** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['gap-1']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (__VLS_ctx.$t('chat.confirmDeal'));
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "text-xs text-green-500 font-medium px-3 py-1.5 border border-green-500/30 rounded-full bg-green-500/10" },
        });
        /** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-green-500']} */ ;
        /** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
        /** @type {__VLS_StyleScopedClasses['px-3']} */ ;
        /** @type {__VLS_StyleScopedClasses['py-1.5']} */ ;
        /** @type {__VLS_StyleScopedClasses['border']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-green-500/30']} */ ;
        /** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
        /** @type {__VLS_StyleScopedClasses['bg-green-500/10']} */ ;
        (__VLS_ctx.$t('chat.confirmed'));
    }
    if (__VLS_ctx.isDealClosed) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "bg-green-900/20 p-2 flex justify-center border-b border-green-500/20" },
        });
        /** @type {__VLS_StyleScopedClasses['bg-green-900/20']} */ ;
        /** @type {__VLS_StyleScopedClasses['p-2']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-b']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-green-500/20']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-1 rounded-full text-xs" },
        });
        /** @type {__VLS_StyleScopedClasses['bg-green-500/10']} */ ;
        /** @type {__VLS_StyleScopedClasses['border']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-green-500/20']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-green-400']} */ ;
        /** @type {__VLS_StyleScopedClasses['px-4']} */ ;
        /** @type {__VLS_StyleScopedClasses['py-1']} */ ;
        /** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
        (__VLS_ctx.$t('chat.systemClosed'));
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...(__VLS_ctx.containerProps),
        ...{ class: "flex-1 p-4 scroll-smooth" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
    /** @type {__VLS_StyleScopedClasses['p-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['scroll-smooth']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...(__VLS_ctx.wrapperProps),
    });
    for (const [{ data: msg }] of __VLS_vFor((__VLS_ctx.list))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            key: (msg.id),
            ...{ class: "flex mb-4" },
            ...{ class: (msg.senderId === __VLS_ctx.userStore.user.uid ? 'justify-end' : 'justify-start') },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
        if (msg.senderId !== __VLS_ctx.userStore.user.uid) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "mr-2 flex-shrink-0" },
            });
            /** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
            /** @type {__VLS_StyleScopedClasses['flex-shrink-0']} */ ;
            const __VLS_6 = LazyImage;
            // @ts-ignore
            const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
                src: (msg.senderAvatar || 'https://via.placeholder.com/40'),
                imageClass: "w-8 h-8 rounded-full border border-white/20",
                containerClass: "w-8 h-8",
            }));
            const __VLS_8 = __VLS_7({
                src: (msg.senderAvatar || 'https://via.placeholder.com/40'),
                imageClass: "w-8 h-8 rounded-full border border-white/20",
                containerClass: "w-8 h-8",
            }, ...__VLS_functionalComponentArgsRest(__VLS_7));
        }
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "max-w-[70%] rounded-2xl px-4 py-2 text-sm" },
            ...{ class: (msg.senderId === __VLS_ctx.userStore.user.uid
                    ? 'bg-purple-600 text-white rounded-br-none'
                    : 'bg-white/10 text-gray-200 rounded-bl-none border border-white/5') },
        });
        /** @type {__VLS_StyleScopedClasses['max-w-[70%]']} */ ;
        /** @type {__VLS_StyleScopedClasses['rounded-2xl']} */ ;
        /** @type {__VLS_StyleScopedClasses['px-4']} */ ;
        /** @type {__VLS_StyleScopedClasses['py-2']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
        if (msg.senderId !== __VLS_ctx.userStore.user.uid) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "text-xs text-gray-500 mb-1" },
            });
            /** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
            /** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
            /** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
            (msg.senderName);
        }
        (msg.text);
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "text-[10px] opacity-50 text-right mt-1" },
        });
        /** @type {__VLS_StyleScopedClasses['text-[10px]']} */ ;
        /** @type {__VLS_StyleScopedClasses['opacity-50']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-right']} */ ;
        /** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
        (__VLS_ctx.formatTime(msg.createdAt));
        // @ts-ignore
        [userStore, userStore, userStore, userStore, $t, $t, $t, $t, $t, isDealClosed, isDealClosed, hasConfirmed, handleConfirm, chatStore, containerProps, wrapperProps, list, formatTime,];
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "p-4 bg-white/5 backdrop-blur-md border-t border-white/10" },
    });
    /** @type {__VLS_StyleScopedClasses['p-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['bg-white/5']} */ ;
    /** @type {__VLS_StyleScopedClasses['backdrop-blur-md']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-t']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-white/10']} */ ;
    if (__VLS_ctx.isDealClosed) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "text-center text-gray-500 text-sm py-2" },
        });
        /** @type {__VLS_StyleScopedClasses['text-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
        /** @type {__VLS_StyleScopedClasses['py-2']} */ ;
        (__VLS_ctx.$t('chat.inputClosed'));
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.form, __VLS_intrinsics.form)({
            ...{ onSubmit: (__VLS_ctx.handleSend) },
            ...{ class: "flex gap-2" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.input)({
            value: (__VLS_ctx.newMessage),
            type: "text",
            placeholder: (__VLS_ctx.$t('chat.inputPlaceholder')),
            ...{ class: "flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-white focus:outline-none focus:border-purple-500 transition-colors" },
            disabled: (__VLS_ctx.chatStore.loading),
        });
        /** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
        /** @type {__VLS_StyleScopedClasses['bg-white/5']} */ ;
        /** @type {__VLS_StyleScopedClasses['border']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-white/10']} */ ;
        /** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
        /** @type {__VLS_StyleScopedClasses['px-4']} */ ;
        /** @type {__VLS_StyleScopedClasses['py-2']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-white']} */ ;
        /** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
        /** @type {__VLS_StyleScopedClasses['focus:border-purple-500']} */ ;
        /** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
            type: "submit",
            disabled: (__VLS_ctx.chatStore.loading || !__VLS_ctx.newMessage.trim()),
            ...{ class: "bg-purple-600 hover:bg-purple-700 text-white rounded-full p-2 px-4 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" },
        });
        /** @type {__VLS_StyleScopedClasses['bg-purple-600']} */ ;
        /** @type {__VLS_StyleScopedClasses['hover:bg-purple-700']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-white']} */ ;
        /** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
        /** @type {__VLS_StyleScopedClasses['p-2']} */ ;
        /** @type {__VLS_StyleScopedClasses['px-4']} */ ;
        /** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
        /** @type {__VLS_StyleScopedClasses['disabled:opacity-50']} */ ;
        /** @type {__VLS_StyleScopedClasses['disabled:cursor-not-allowed']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)({
            xmlns: "http://www.w3.org/2000/svg",
            ...{ class: "h-5 w-5" },
            viewBox: "0 0 20 20",
            fill: "currentColor",
        });
        /** @type {__VLS_StyleScopedClasses['h-5']} */ ;
        /** @type {__VLS_StyleScopedClasses['w-5']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
            d: "M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z",
        });
    }
    if (__VLS_ctx.showRatingModal) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50" },
        });
        /** @type {__VLS_StyleScopedClasses['fixed']} */ ;
        /** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
        /** @type {__VLS_StyleScopedClasses['bg-black/80']} */ ;
        /** @type {__VLS_StyleScopedClasses['backdrop-blur-sm']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['p-4']} */ ;
        /** @type {__VLS_StyleScopedClasses['z-50']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "bg-[#1e293b] rounded-2xl p-6 w-full max-w-sm border border-white/10" },
        });
        /** @type {__VLS_StyleScopedClasses['bg-[#1e293b]']} */ ;
        /** @type {__VLS_StyleScopedClasses['rounded-2xl']} */ ;
        /** @type {__VLS_StyleScopedClasses['p-6']} */ ;
        /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
        /** @type {__VLS_StyleScopedClasses['max-w-sm']} */ ;
        /** @type {__VLS_StyleScopedClasses['border']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-white/10']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.h3, __VLS_intrinsics.h3)({
            ...{ class: "text-lg font-bold text-white mb-4 text-center" },
        });
        /** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
        /** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-white']} */ ;
        /** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-center']} */ ;
        (__VLS_ctx.$t('chat.ratePartner'));
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex flex-col items-center gap-4" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
        /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
        const __VLS_11 = LazyImage;
        // @ts-ignore
        const __VLS_12 = __VLS_asFunctionalComponent1(__VLS_11, new __VLS_11({
            src: (__VLS_ctx.ratingTarget?.avatar || 'https://via.placeholder.com/60'),
            imageClass: "w-16 h-16 rounded-full border-2 border-purple-500",
            containerClass: "w-16 h-16",
        }));
        const __VLS_13 = __VLS_12({
            src: (__VLS_ctx.ratingTarget?.avatar || 'https://via.placeholder.com/60'),
            imageClass: "w-16 h-16 rounded-full border-2 border-purple-500",
            containerClass: "w-16 h-16",
        }, ...__VLS_functionalComponentArgsRest(__VLS_12));
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "text-gray-300 font-medium" },
        });
        /** @type {__VLS_StyleScopedClasses['text-gray-300']} */ ;
        /** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
        (__VLS_ctx.ratingTarget?.name);
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex gap-2" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
        for (const [star] of __VLS_vFor((5))) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
                ...{ onClick: (...[$event]) => {
                        if (!(__VLS_ctx.userStore.user))
                            return;
                        if (!(__VLS_ctx.showRatingModal))
                            return;
                        __VLS_ctx.ratingScore = star;
                        // @ts-ignore
                        [$t, $t, $t, isDealClosed, chatStore, chatStore, handleSend, newMessage, newMessage, showRatingModal, ratingTarget, ratingTarget, ratingScore,];
                    } },
                key: (star),
                type: "button",
                ...{ class: "text-2xl transition-transform hover:scale-110" },
                ...{ class: (star <= __VLS_ctx.ratingScore ? 'text-yellow-400' : 'text-gray-600') },
            });
            /** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
            /** @type {__VLS_StyleScopedClasses['transition-transform']} */ ;
            /** @type {__VLS_StyleScopedClasses['hover:scale-110']} */ ;
            // @ts-ignore
            [ratingScore,];
        }
        __VLS_asFunctionalElement1(__VLS_intrinsics.textarea, __VLS_intrinsics.textarea)({
            value: (__VLS_ctx.ratingComment),
            placeholder: (__VLS_ctx.$t('chat.ratingPlaceholder')),
            rows: "3",
            ...{ class: "w-full bg-black/20 rounded-lg p-3 text-sm text-white border border-white/10 focus:border-purple-500 outline-none resize-none" },
        });
        /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
        /** @type {__VLS_StyleScopedClasses['bg-black/20']} */ ;
        /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
        /** @type {__VLS_StyleScopedClasses['p-3']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-white']} */ ;
        /** @type {__VLS_StyleScopedClasses['border']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-white/10']} */ ;
        /** @type {__VLS_StyleScopedClasses['focus:border-purple-500']} */ ;
        /** @type {__VLS_StyleScopedClasses['outline-none']} */ ;
        /** @type {__VLS_StyleScopedClasses['resize-none']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex gap-2 w-full mt-2" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
        /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
        /** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.userStore.user))
                        return;
                    if (!(__VLS_ctx.showRatingModal))
                        return;
                    __VLS_ctx.showRatingModal = false;
                    // @ts-ignore
                    [$t, showRatingModal, ratingComment,];
                } },
            ...{ class: "flex-1 bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg transition-colors" },
        });
        /** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
        /** @type {__VLS_StyleScopedClasses['bg-white/10']} */ ;
        /** @type {__VLS_StyleScopedClasses['hover:bg-white/20']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-white']} */ ;
        /** @type {__VLS_StyleScopedClasses['py-2']} */ ;
        /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
        /** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
        (__VLS_ctx.$t('profile.edit.cancel'));
        __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
            ...{ onClick: (__VLS_ctx.handleRate) },
            ...{ class: "flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-colors font-medium" },
        });
        /** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
        /** @type {__VLS_StyleScopedClasses['bg-purple-600']} */ ;
        /** @type {__VLS_StyleScopedClasses['hover:bg-purple-700']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-white']} */ ;
        /** @type {__VLS_StyleScopedClasses['py-2']} */ ;
        /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
        /** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
        /** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
        (__VLS_ctx.$t('chat.submitRating', { score: __VLS_ctx.ratingScore }));
    }
}
// @ts-ignore
[$t, $t, ratingScore, handleRate,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
//# sourceMappingURL=ChatRoomView.vue.js.map