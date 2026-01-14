import { ref } from 'vue';
import { useUserStore } from '../stores/userStore';
import { useRouter, useRoute } from 'vue-router';
import BaseInput from '../components/BaseInput.vue';
import BaseButton from '../components/BaseButton.vue';
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const isLogin = ref(true);
const email = ref('');
const password = ref('');
const displayName = ref('');
const error = ref(null);
const loading = ref(false);
const handleSubmit = async () => {
    error.value = null;
    loading.value = true;
    try {
        if (isLogin.value) {
            await userStore.login(email.value, password.value);
        }
        else {
            await userStore.register(email.value, password.value, displayName.value);
        }
        const redirect = route.query.redirect || '/';
        router.push(redirect);
    }
    catch (err) {
        error.value = err.message;
    }
    finally {
        loading.value = false;
    }
};
const handleGoogleLogin = async () => {
    try {
        await userStore.loginWithGoogle();
        const redirect = route.query.redirect || '/';
        router.push(redirect);
    }
    catch (err) {
        error.value = err.message;
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
    ...{ class: "max-w-md mx-auto px-4 py-12" },
});
/** @type {__VLS_StyleScopedClasses['max-w-md']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-12']} */ ;
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
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex border-b border-white/10 mb-8" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white/10']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.isLogin = true;
            // @ts-ignore
            [isLogin,];
        } },
    ...{ class: "flex-1 pb-4 text-center font-medium transition-colors relative" },
    ...{ class: (__VLS_ctx.isLogin ? 'text-purple-400' : 'text-gray-400 hover:text-gray-300') },
});
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
(__VLS_ctx.$t('login.tabs.login'));
if (__VLS_ctx.isLogin) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "absolute bottom-0 left-0 w-full h-0.5 bg-purple-500 rounded-full" },
    });
    /** @type {__VLS_StyleScopedClasses['absolute']} */ ;
    /** @type {__VLS_StyleScopedClasses['bottom-0']} */ ;
    /** @type {__VLS_StyleScopedClasses['left-0']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['h-0.5']} */ ;
    /** @type {__VLS_StyleScopedClasses['bg-purple-500']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
}
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.isLogin = false;
            // @ts-ignore
            [isLogin, isLogin, isLogin, $t,];
        } },
    ...{ class: "flex-1 pb-4 text-center font-medium transition-colors relative" },
    ...{ class: (!__VLS_ctx.isLogin ? 'text-purple-400' : 'text-gray-400 hover:text-gray-300') },
});
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
(__VLS_ctx.$t('login.tabs.register'));
if (!__VLS_ctx.isLogin) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "absolute bottom-0 left-0 w-full h-0.5 bg-purple-500 rounded-full" },
    });
    /** @type {__VLS_StyleScopedClasses['absolute']} */ ;
    /** @type {__VLS_StyleScopedClasses['bottom-0']} */ ;
    /** @type {__VLS_StyleScopedClasses['left-0']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['h-0.5']} */ ;
    /** @type {__VLS_StyleScopedClasses['bg-purple-500']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
}
__VLS_asFunctionalElement1(__VLS_intrinsics.form, __VLS_intrinsics.form)({
    ...{ onSubmit: (__VLS_ctx.handleSubmit) },
    ...{ class: "space-y-6" },
});
/** @type {__VLS_StyleScopedClasses['space-y-6']} */ ;
if (!__VLS_ctx.isLogin) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    const __VLS_0 = BaseInput;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
        modelValue: (__VLS_ctx.displayName),
        label: (__VLS_ctx.$t('login.form.displayName')),
        placeholder: (__VLS_ctx.$t('login.form.displayNamePlaceholder')),
        required: true,
    }));
    const __VLS_2 = __VLS_1({
        modelValue: (__VLS_ctx.displayName),
        label: (__VLS_ctx.$t('login.form.displayName')),
        placeholder: (__VLS_ctx.$t('login.form.displayNamePlaceholder')),
        required: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
const __VLS_5 = BaseInput;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent1(__VLS_5, new __VLS_5({
    modelValue: (__VLS_ctx.email),
    label: (__VLS_ctx.$t('login.form.email')),
    type: "email",
    placeholder: (__VLS_ctx.$t('login.form.emailPlaceholder')),
    required: true,
}));
const __VLS_7 = __VLS_6({
    modelValue: (__VLS_ctx.email),
    label: (__VLS_ctx.$t('login.form.email')),
    type: "email",
    placeholder: (__VLS_ctx.$t('login.form.emailPlaceholder')),
    required: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
const __VLS_10 = BaseInput;
// @ts-ignore
const __VLS_11 = __VLS_asFunctionalComponent1(__VLS_10, new __VLS_10({
    modelValue: (__VLS_ctx.password),
    label: (__VLS_ctx.$t('login.form.password')),
    type: "password",
    placeholder: (__VLS_ctx.$t('login.form.passwordPlaceholder')),
    minlength: "6",
    required: true,
}));
const __VLS_12 = __VLS_11({
    modelValue: (__VLS_ctx.password),
    label: (__VLS_ctx.$t('login.form.password')),
    type: "password",
    placeholder: (__VLS_ctx.$t('login.form.passwordPlaceholder')),
    minlength: "6",
    required: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_11));
if (__VLS_ctx.error) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "text-red-400 text-sm text-center bg-red-500/10 p-2 rounded" },
    });
    /** @type {__VLS_StyleScopedClasses['text-red-400']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['bg-red-500/10']} */ ;
    /** @type {__VLS_StyleScopedClasses['p-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded']} */ ;
    (__VLS_ctx.$t(__VLS_ctx.error));
}
const __VLS_15 = BaseButton || BaseButton;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent1(__VLS_15, new __VLS_15({
    type: "submit",
    loading: (__VLS_ctx.loading),
    disabled: (__VLS_ctx.loading),
}));
const __VLS_17 = __VLS_16({
    type: "submit",
    loading: (__VLS_ctx.loading),
    disabled: (__VLS_ctx.loading),
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
const { default: __VLS_20 } = __VLS_18.slots;
(__VLS_ctx.isLogin ? __VLS_ctx.$t('login.form.submitLogin') : __VLS_ctx.$t('login.form.submitRegister'));
// @ts-ignore
[isLogin, isLogin, isLogin, isLogin, $t, $t, $t, $t, $t, $t, $t, $t, $t, $t, handleSubmit, displayName, email, password, error, error, loading, loading,];
var __VLS_18;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "text-xs text-gray-500 text-center mt-4" },
});
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
(__VLS_ctx.isLogin ? __VLS_ctx.$t('login.tabs.login') : __VLS_ctx.$t('login.tabs.register'));
(__VLS_ctx.$t('login.form.termsPrefix'));
let __VLS_21;
/** @ts-ignore @type {typeof __VLS_components.routerLink | typeof __VLS_components.RouterLink | typeof __VLS_components.routerLink | typeof __VLS_components.RouterLink} */
routerLink;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent1(__VLS_21, new __VLS_21({
    to: "/terms",
    ...{ class: "text-purple-400 hover:text-purple-300 underline" },
}));
const __VLS_23 = __VLS_22({
    to: "/terms",
    ...{ class: "text-purple-400 hover:text-purple-300 underline" },
}, ...__VLS_functionalComponentArgsRest(__VLS_22));
/** @type {__VLS_StyleScopedClasses['text-purple-400']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-purple-300']} */ ;
/** @type {__VLS_StyleScopedClasses['underline']} */ ;
const { default: __VLS_26 } = __VLS_24.slots;
(__VLS_ctx.$t('login.form.termsLink'));
// @ts-ignore
[isLogin, $t, $t, $t, $t,];
var __VLS_24;
(__VLS_ctx.$t('login.form.agree'));
let __VLS_27;
/** @ts-ignore @type {typeof __VLS_components.routerLink | typeof __VLS_components.RouterLink | typeof __VLS_components.routerLink | typeof __VLS_components.RouterLink} */
routerLink;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent1(__VLS_27, new __VLS_27({
    to: "/privacy",
    ...{ class: "text-purple-400 hover:text-purple-300 underline" },
}));
const __VLS_29 = __VLS_28({
    to: "/privacy",
    ...{ class: "text-purple-400 hover:text-purple-300 underline" },
}, ...__VLS_functionalComponentArgsRest(__VLS_28));
/** @type {__VLS_StyleScopedClasses['text-purple-400']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-purple-300']} */ ;
/** @type {__VLS_StyleScopedClasses['underline']} */ ;
const { default: __VLS_32 } = __VLS_30.slots;
(__VLS_ctx.$t('login.form.privacyLink'));
// @ts-ignore
[$t, $t,];
var __VLS_30;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "my-6 flex items-center" },
});
/** @type {__VLS_StyleScopedClasses['my-6']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-grow border-t border-white/10" },
});
/** @type {__VLS_StyleScopedClasses['flex-grow']} */ ;
/** @type {__VLS_StyleScopedClasses['border-t']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white/10']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "flex-shrink-0 mx-4 text-gray-500 text-sm" },
});
/** @type {__VLS_StyleScopedClasses['flex-shrink-0']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
(__VLS_ctx.$t('login.form.or'));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-grow border-t border-white/10" },
});
/** @type {__VLS_StyleScopedClasses['flex-grow']} */ ;
/** @type {__VLS_StyleScopedClasses['border-t']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white/10']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (__VLS_ctx.handleGoogleLogin) },
    ...{ class: "w-full bg-white text-gray-900 font-medium py-3 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-2" },
});
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-gray-100']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.img)({
    src: "https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg",
    ...{ class: "w-5 h-5" },
});
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
(__VLS_ctx.$t('login.form.googleLogin'));
// @ts-ignore
[$t, $t, handleGoogleLogin,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
//# sourceMappingURL=LoginView.vue.js.map