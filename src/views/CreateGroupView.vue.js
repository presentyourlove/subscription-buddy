import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useGroupStore } from '../stores/groupStore';
import { useUserStore } from '../stores/userStore';
import { useI18n } from 'vue-i18n';
import { useChatStore } from '../stores/chatStore';
import BaseInput from '../components/BaseInput.vue';
import BaseButton from '../components/BaseButton.vue';
import BaseTextarea from '../components/BaseTextarea.vue';
const router = useRouter();
const groupStore = useGroupStore();
const userStore = useUserStore();
const chatStore = useChatStore(); // Init chatStore
const { t } = useI18n();
import { DEFAULTS } from '../utils/constants';
const form = reactive({
    title: '',
    description: '',
    price: '',
    slots: ''
});
const handleSubmit = async () => {
    if (!userStore.user) {
        alert(t('create.form.loginRequired'));
        return;
    }
    try {
        // Check for pending reviews
        const pendingGroupId = await chatStore.checkPendingReviews(userStore.user);
        if (pendingGroupId) {
            if (confirm(t('create.form.pendingReview', { groupId: pendingGroupId }))) {
                router.push(`/chat/${pendingGroupId}`);
            }
            return;
        }
        await groupStore.addGroup({
            title: form.title,
            description: form.description,
            price: Number(form.price),
            slots: Number(form.slots),
            serviceName: form.title, // Use title as serviceName
            hostId: userStore.user.uid,
            hostName: userStore.user.displayName || t('common.anonymous'),
            hostAvatar: userStore.user.photoURL || ''
        });
        alert(t('create.form.success'));
        router.push('/');
    }
    catch (err) {
        // Error is handled in store, simply stay on page to show it
        console.error(err);
    }
};
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "max-w-2xl mx-auto px-4 py-8" },
});
/** @type {__VLS_StyleScopedClasses['max-w-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-8']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-xl" },
});
/** @type {__VLS_StyleScopedClasses['bg-white/5']} */ ;
/** @type {__VLS_StyleScopedClasses['backdrop-blur-md']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white/10']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['p-8']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-xl']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({
    ...{ class: "text-3xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent" },
});
/** @type {__VLS_StyleScopedClasses['text-3xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gradient-to-r']} */ ;
/** @type {__VLS_StyleScopedClasses['from-purple-400']} */ ;
/** @type {__VLS_StyleScopedClasses['to-pink-500']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-clip-text']} */ ;
/** @type {__VLS_StyleScopedClasses['text-transparent']} */ ;
(__VLS_ctx.$t('create.title'));
__VLS_asFunctionalElement1(__VLS_intrinsics.form, __VLS_intrinsics.form)({
    ...{ onSubmit: (__VLS_ctx.handleSubmit) },
    ...{ class: "space-y-6" },
});
/** @type {__VLS_StyleScopedClasses['space-y-6']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
const __VLS_0 = BaseInput;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    modelValue: (__VLS_ctx.form.title),
    label: (__VLS_ctx.$t('create.form.serviceName')),
    placeholder: (__VLS_ctx.$t('create.form.servicePlaceholder')),
    required: true,
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.form.title),
    label: (__VLS_ctx.$t('create.form.serviceName')),
    placeholder: (__VLS_ctx.$t('create.form.servicePlaceholder')),
    required: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
const __VLS_5 = BaseTextarea;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent1(__VLS_5, new __VLS_5({
    modelValue: (__VLS_ctx.form.description),
    label: (__VLS_ctx.$t('create.form.description')),
    required: true,
    rows: "3",
    placeholder: (__VLS_ctx.$t('create.form.descPlaceholder')),
}));
const __VLS_7 = __VLS_6({
    modelValue: (__VLS_ctx.form.description),
    label: (__VLS_ctx.$t('create.form.description')),
    required: true,
    rows: "3",
    placeholder: (__VLS_ctx.$t('create.form.descPlaceholder')),
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "grid grid-cols-2 gap-6" },
});
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-6']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
const __VLS_10 = BaseInput || BaseInput;
// @ts-ignore
const __VLS_11 = __VLS_asFunctionalComponent1(__VLS_10, new __VLS_10({
    modelValue: (__VLS_ctx.form.price),
    modelModifiers: { number: true, },
    label: (__VLS_ctx.$t('create.form.price')),
    type: "number",
    required: true,
    min: "0",
}));
const __VLS_12 = __VLS_11({
    modelValue: (__VLS_ctx.form.price),
    modelModifiers: { number: true, },
    label: (__VLS_ctx.$t('create.form.price')),
    type: "number",
    required: true,
    min: "0",
}, ...__VLS_functionalComponentArgsRest(__VLS_11));
const { default: __VLS_15 } = __VLS_13.slots;
{
    const { prefix: __VLS_16 } = __VLS_13.slots;
    // @ts-ignore
    [$t, $t, $t, $t, $t, $t, handleSubmit, form, form, form,];
}
// @ts-ignore
[];
var __VLS_13;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
const __VLS_17 = BaseInput;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent1(__VLS_17, new __VLS_17({
    modelValue: (__VLS_ctx.form.slots),
    modelModifiers: { number: true, },
    label: (__VLS_ctx.$t('create.form.slots')),
    type: "number",
    required: true,
    min: "1",
    max: (__VLS_ctx.DEFAULTS.MAX_SLOTS),
}));
const __VLS_19 = __VLS_18({
    modelValue: (__VLS_ctx.form.slots),
    modelModifiers: { number: true, },
    label: (__VLS_ctx.$t('create.form.slots')),
    type: "number",
    required: true,
    min: "1",
    max: (__VLS_ctx.DEFAULTS.MAX_SLOTS),
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "pt-4" },
});
/** @type {__VLS_StyleScopedClasses['pt-4']} */ ;
const __VLS_22 = BaseButton || BaseButton;
// @ts-ignore
const __VLS_23 = __VLS_asFunctionalComponent1(__VLS_22, new __VLS_22({
    type: "submit",
    loading: (__VLS_ctx.groupStore.loading),
    disabled: (__VLS_ctx.groupStore.loading),
}));
const __VLS_24 = __VLS_23({
    type: "submit",
    loading: (__VLS_ctx.groupStore.loading),
    disabled: (__VLS_ctx.groupStore.loading),
}, ...__VLS_functionalComponentArgsRest(__VLS_23));
const { default: __VLS_27 } = __VLS_25.slots;
if (__VLS_ctx.groupStore.loading) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.$t('create.form.processing'));
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.$t('create.form.submit'));
}
// @ts-ignore
[$t, $t, $t, form, DEFAULTS, groupStore, groupStore, groupStore,];
var __VLS_25;
if (__VLS_ctx.groupStore.error) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-red-400 text-center text-sm" },
    });
    /** @type {__VLS_StyleScopedClasses['text-red-400']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
    (__VLS_ctx.groupStore.error);
}
// @ts-ignore
[groupStore, groupStore,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
//# sourceMappingURL=CreateGroupView.vue.js.map