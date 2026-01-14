import { ref, computed, watch } from 'vue';
const props = withDefaults(defineProps(), {
    alt: '',
    fallbackSrc: '',
    placeholderIcon: '👤',
    showPlaceholder: true,
    imageClass: '',
    containerClass: ''
});
const imageRef = ref(null);
const isLoading = ref(true);
const hasError = ref(false);
const currentSrc = computed(() => {
    if (hasError.value && props.fallbackSrc) {
        return props.fallbackSrc;
    }
    return props.src || '';
});
const handleLoad = () => {
    isLoading.value = false;
};
const handleError = () => {
    hasError.value = true;
    isLoading.value = false;
};
// Reset loading state when src changes
watch(() => props.src, () => {
    if (props.src) {
        isLoading.value = true;
        hasError.value = false;
    }
});
const __VLS_defaults = {
    alt: '',
    fallbackSrc: '',
    placeholderIcon: '👤',
    showPlaceholder: true,
    imageClass: '',
    containerClass: ''
};
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "relative" },
    ...{ class: (__VLS_ctx.containerClass) },
});
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
if (__VLS_ctx.isLoading && __VLS_ctx.showPlaceholder) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800 animate-pulse rounded-full flex items-center justify-center" },
    });
    /** @type {__VLS_StyleScopedClasses['absolute']} */ ;
    /** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
    /** @type {__VLS_StyleScopedClasses['bg-gradient-to-br']} */ ;
    /** @type {__VLS_StyleScopedClasses['from-gray-700']} */ ;
    /** @type {__VLS_StyleScopedClasses['to-gray-800']} */ ;
    /** @type {__VLS_StyleScopedClasses['animate-pulse']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
    if (__VLS_ctx.placeholderIcon) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "text-gray-500" },
        });
        /** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
        (__VLS_ctx.placeholderIcon);
    }
}
__VLS_asFunctionalElement1(__VLS_intrinsics.img)({
    ...{ onLoad: (__VLS_ctx.handleLoad) },
    ...{ onError: (__VLS_ctx.handleError) },
    ref: "imageRef",
    src: (__VLS_ctx.currentSrc),
    alt: (__VLS_ctx.alt),
    loading: "lazy",
    ...{ class: ([__VLS_ctx.imageClass, { 'opacity-0': __VLS_ctx.isLoading, 'opacity-100': !__VLS_ctx.isLoading }]) },
    ...{ class: "transition-opacity duration-300" },
});
/** @type {__VLS_StyleScopedClasses['opacity-0']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-100']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-opacity']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
// @ts-ignore
[containerClass, isLoading, isLoading, isLoading, showPlaceholder, placeholderIcon, placeholderIcon, handleLoad, handleError, currentSrc, alt, imageClass,];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
    props: {},
});
export default {};
//# sourceMappingURL=LazyImage.vue.js.map