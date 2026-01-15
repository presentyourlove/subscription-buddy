import { ref, computed, onMounted } from 'vue';
import { watchDebounced } from '@vueuse/core';
import { useGroupStore } from '../stores/groupStore';
import UserRating from '../components/UserRating.vue';
import LazyImage from '../components/LazyImage.vue';
import { getServiceLogo } from '../utils/serviceUtils';
import { GROUP_STATUS } from '../utils/constants';
const groupStore = useGroupStore();
const searchQuery = ref('');
const debouncedQuery = ref('');
const imageErrorMap = ref({});
watchDebounced(searchQuery, (value) => {
    debouncedQuery.value = value;
}, { debounce: 300 });
onMounted(() => {
    groupStore.fetchGroups();
});
// ... (omitted middle part if contiguous it's fine, but here startLine 154) ...
// Actually I need to split this replacement or just replace the block I verify.
// I will replace imageErrorMap init at 154 and handleImageError at 185 separately?
// Or just replace the ref definition first.
/* Correct logic: */
// I will just replace the ref line.
onMounted(() => {
    groupStore.fetchGroups();
});
const filteredGroups = computed(() => {
    let result = groupStore.groups;
    // 1. Search Filter
    if (debouncedQuery.value) {
        const lowerQ = debouncedQuery.value.toLowerCase();
        result = result.filter((g) => g.title.toLowerCase().includes(lowerQ) || g.description.toLowerCase().includes(lowerQ));
    }
    // 2. Sort by Status (OPEN -> FULL -> CLOSED)
    const statusWeight = {
        [GROUP_STATUS.OPEN]: 1,
        [GROUP_STATUS.FULL]: 2,
        [GROUP_STATUS.CLOSED]: 3
    };
    return result.sort((a, b) => {
        const wA = statusWeight[a.status] || 99; // Default to end if unknown
        const wB = statusWeight[b.status] || 99;
        return wA - wB;
    });
});
const handleImageError = (id) => {
    if (id)
        imageErrorMap.value[String(id)] = true;
};
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" },
});
/** @type {__VLS_StyleScopedClasses['max-w-7xl']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:px-8']} */ ;
/** @type {__VLS_StyleScopedClasses['py-8']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "text-center mb-12" },
});
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-12']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({
    ...{ class: "text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-4" },
});
/** @type {__VLS_StyleScopedClasses['text-4xl']} */ ;
/** @type {__VLS_StyleScopedClasses['md:text-5xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-extrabold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-transparent']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-clip-text']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gradient-to-r']} */ ;
/** @type {__VLS_StyleScopedClasses['from-purple-400']} */ ;
/** @type {__VLS_StyleScopedClasses['to-pink-600']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
(__VLS_ctx.$t('home.heroTitle'));
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "text-lg text-gray-400 max-w-2xl mx-auto whitespace-pre-line" },
});
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['whitespace-pre-line']} */ ;
(__VLS_ctx.$t('home.heroSubtitle'));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex justify-center mb-8" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
let __VLS_0;
/** @ts-ignore @type {typeof __VLS_components.routerLink | typeof __VLS_components.RouterLink | typeof __VLS_components.routerLink | typeof __VLS_components.RouterLink} */
routerLink;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    to: "/create",
    ...{ class: "group relative inline-flex items-center justify-center px-8 py-3 text-base font-bold text-white transition-all duration-200 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full hover:from-purple-500 hover:to-pink-500 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/40 hover:-translate-y-1" },
}));
const __VLS_2 = __VLS_1({
    to: "/create",
    ...{ class: "group relative inline-flex items-center justify-center px-8 py-3 text-base font-bold text-white transition-all duration-200 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full hover:from-purple-500 hover:to-pink-500 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/40 hover:-translate-y-1" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['px-8']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-base']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gradient-to-r']} */ ;
/** @type {__VLS_StyleScopedClasses['from-purple-600']} */ ;
/** @type {__VLS_StyleScopedClasses['to-pink-600']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:from-purple-500']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:to-pink-500']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-purple-500/30']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:shadow-purple-500/40']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:-translate-y-1']} */ ;
const { default: __VLS_5 } = __VLS_3.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "mr-2 text-xl" },
});
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
(__VLS_ctx.$t('home.createLink'));
// @ts-ignore
[$t, $t, $t,];
var __VLS_3;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "mb-8 relative max-w-xl mx-auto" },
});
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" },
});
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['inset-y-0']} */ ;
/** @type {__VLS_StyleScopedClasses['left-0']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-3']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['pointer-events-none']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "text-gray-400" },
});
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.input)({
    value: (__VLS_ctx.searchQuery),
    type: "text",
    ...{ class: "block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl leading-5 bg-white/5 text-gray-300 placeholder-gray-500 focus:outline-none focus:bg-white/10 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm backdrop-blur-sm transition-all" },
    placeholder: (__VLS_ctx.$t('home.searchPlaceholder')),
});
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-10']} */ ;
/** @type {__VLS_StyleScopedClasses['pr-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white/10']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['leading-5']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['placeholder-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:bg-white/10']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-purple-500']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:border-purple-500']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['backdrop-blur-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
if (__VLS_ctx.groupStore.loading) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex justify-center py-12" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['py-12']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500" },
    });
    /** @type {__VLS_StyleScopedClasses['animate-spin']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['h-12']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-12']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-t-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-b-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-purple-500']} */ ;
}
else if (__VLS_ctx.groupStore.error) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "text-center py-12 text-red-400" },
    });
    /** @type {__VLS_StyleScopedClasses['text-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['py-12']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-red-400']} */ ;
    (__VLS_ctx.groupStore.error);
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" },
    });
    /** @type {__VLS_StyleScopedClasses['grid']} */ ;
    /** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
    /** @type {__VLS_StyleScopedClasses['md:grid-cols-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['lg:grid-cols-3']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-6']} */ ;
    for (const [group] of __VLS_vFor((__VLS_ctx.filteredGroups))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            key: (group.id),
            ...{ class: "group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10" },
        });
        /** @type {__VLS_StyleScopedClasses['group']} */ ;
        /** @type {__VLS_StyleScopedClasses['relative']} */ ;
        /** @type {__VLS_StyleScopedClasses['bg-white/5']} */ ;
        /** @type {__VLS_StyleScopedClasses['backdrop-blur-md']} */ ;
        /** @type {__VLS_StyleScopedClasses['border']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-white/10']} */ ;
        /** @type {__VLS_StyleScopedClasses['rounded-2xl']} */ ;
        /** @type {__VLS_StyleScopedClasses['p-6']} */ ;
        /** @type {__VLS_StyleScopedClasses['hover:bg-white/10']} */ ;
        /** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
        /** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
        /** @type {__VLS_StyleScopedClasses['hover:-translate-y-1']} */ ;
        /** @type {__VLS_StyleScopedClasses['hover:shadow-xl']} */ ;
        /** @type {__VLS_StyleScopedClasses['hover:shadow-purple-500/10']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "absolute top-4 right-4 px-2 py-1 text-xs rounded-full border" },
            ...{ class: ({
                    'bg-green-500/20 text-green-300 border-green-500/30': group.status === __VLS_ctx.GROUP_STATUS.OPEN,
                    'bg-gray-500/20 text-gray-300 border-gray-500/30': group.status === __VLS_ctx.GROUP_STATUS.CLOSED,
                    'bg-red-500/20 text-red-300 border-red-500/30': group.status === __VLS_ctx.GROUP_STATUS.FULL
                }) },
        });
        /** @type {__VLS_StyleScopedClasses['absolute']} */ ;
        /** @type {__VLS_StyleScopedClasses['top-4']} */ ;
        /** @type {__VLS_StyleScopedClasses['right-4']} */ ;
        /** @type {__VLS_StyleScopedClasses['px-2']} */ ;
        /** @type {__VLS_StyleScopedClasses['py-1']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
        /** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
        /** @type {__VLS_StyleScopedClasses['border']} */ ;
        /** @type {__VLS_StyleScopedClasses['bg-green-500/20']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-green-300']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-green-500/30']} */ ;
        /** @type {__VLS_StyleScopedClasses['bg-gray-500/20']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-gray-300']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-gray-500/30']} */ ;
        /** @type {__VLS_StyleScopedClasses['bg-red-500/20']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-red-300']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-red-500/30']} */ ;
        (__VLS_ctx.$t(`group.status.${group.status}`));
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "h-16 mb-4 flex items-center" },
        });
        /** @type {__VLS_StyleScopedClasses['h-16']} */ ;
        /** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
        if (group.id && __VLS_ctx.getServiceLogo(group.title) && !__VLS_ctx.imageErrorMap[group.id]) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
                ...{ onError: (...[$event]) => {
                        if (!!(__VLS_ctx.groupStore.loading))
                            return;
                        if (!!(__VLS_ctx.groupStore.error))
                            return;
                        if (!(group.id && __VLS_ctx.getServiceLogo(group.title) && !__VLS_ctx.imageErrorMap[group.id]))
                            return;
                        __VLS_ctx.handleImageError(group.id);
                        // @ts-ignore
                        [$t, $t, searchQuery, groupStore, groupStore, groupStore, filteredGroups, GROUP_STATUS, GROUP_STATUS, GROUP_STATUS, getServiceLogo, imageErrorMap, handleImageError,];
                    } },
                src: (__VLS_ctx.getServiceLogo(group.title)),
                ...{ class: "h-full max-w-[50%] object-contain" },
                alt: "Service Logo",
            });
            /** @type {__VLS_StyleScopedClasses['h-full']} */ ;
            /** @type {__VLS_StyleScopedClasses['max-w-[50%]']} */ ;
            /** @type {__VLS_StyleScopedClasses['object-contain']} */ ;
        }
        else {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl shadow-lg shadow-purple-500/30" },
            });
            /** @type {__VLS_StyleScopedClasses['w-12']} */ ;
            /** @type {__VLS_StyleScopedClasses['h-12']} */ ;
            /** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
            /** @type {__VLS_StyleScopedClasses['bg-gradient-to-br']} */ ;
            /** @type {__VLS_StyleScopedClasses['from-purple-500']} */ ;
            /** @type {__VLS_StyleScopedClasses['to-pink-500']} */ ;
            /** @type {__VLS_StyleScopedClasses['flex']} */ ;
            /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
            /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
            /** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
            /** @type {__VLS_StyleScopedClasses['shadow-lg']} */ ;
            /** @type {__VLS_StyleScopedClasses['shadow-purple-500/30']} */ ;
        }
        __VLS_asFunctionalElement1(__VLS_intrinsics.h3, __VLS_intrinsics.h3)({
            ...{ class: "text-xl font-bold text-white mb-2" },
        });
        /** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
        /** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-white']} */ ;
        /** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
        (group.title);
        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
            ...{ class: "text-gray-400 text-sm mb-4 line-clamp-2 h-10" },
        });
        /** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
        /** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
        /** @type {__VLS_StyleScopedClasses['line-clamp-2']} */ ;
        /** @type {__VLS_StyleScopedClasses['h-10']} */ ;
        (group.description);
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex items-center justify-between text-sm py-3 border-t border-white/10" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
        /** @type {__VLS_StyleScopedClasses['py-3']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-t']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-white/10']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex flex-col" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "text-gray-500" },
        });
        /** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
        (__VLS_ctx.$t('home.card.pricePerMonth'));
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "font-bold text-purple-300 text-lg" },
        });
        /** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-purple-300']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
        (group.price);
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "text-xs text-gray-500" },
        });
        /** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
        (__VLS_ctx.$t('home.card.month'));
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex flex-col items-end" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
        /** @type {__VLS_StyleScopedClasses['items-end']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "text-gray-500" },
        });
        /** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
        (__VLS_ctx.$t('home.card.slots'));
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "font-bold text-white" },
        });
        /** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-white']} */ ;
        (group.slots);
        (__VLS_ctx.$t('home.card.people'));
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex items-center justify-between mt-4 pt-4 border-t border-white/10" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
        /** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
        /** @type {__VLS_StyleScopedClasses['pt-4']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-t']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-white/10']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex items-center gap-2" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center text-xs overflow-hidden" },
        });
        /** @type {__VLS_StyleScopedClasses['w-6']} */ ;
        /** @type {__VLS_StyleScopedClasses['h-6']} */ ;
        /** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
        /** @type {__VLS_StyleScopedClasses['bg-gray-600']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
        /** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
        if (group.hostAvatar) {
            const __VLS_6 = LazyImage;
            // @ts-ignore
            const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
                src: (group.hostAvatar),
                imageClass: "w-full h-full object-cover",
                containerClass: "w-full h-full",
                showPlaceholder: (false),
            }));
            const __VLS_8 = __VLS_7({
                src: (group.hostAvatar),
                imageClass: "w-full h-full object-cover",
                containerClass: "w-full h-full",
                showPlaceholder: (false),
            }, ...__VLS_functionalComponentArgsRest(__VLS_7));
        }
        else {
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        }
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "text-xs text-gray-400 flex items-center gap-1" },
        });
        /** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['gap-1']} */ ;
        (group.hostName || __VLS_ctx.$t('home.card.anonymous'));
        const __VLS_11 = UserRating;
        // @ts-ignore
        const __VLS_12 = __VLS_asFunctionalComponent1(__VLS_11, new __VLS_11({
            uid: (group.hostId),
        }));
        const __VLS_13 = __VLS_12({
            uid: (group.hostId),
        }, ...__VLS_functionalComponentArgsRest(__VLS_12));
        let __VLS_16;
        /** @ts-ignore @type {typeof __VLS_components.routerLink | typeof __VLS_components.RouterLink | typeof __VLS_components.routerLink | typeof __VLS_components.RouterLink} */
        routerLink;
        // @ts-ignore
        const __VLS_17 = __VLS_asFunctionalComponent1(__VLS_16, new __VLS_16({
            to: ('/groups/' + group.id),
            ...{ class: "px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-xs font-medium transition-colors" },
        }));
        const __VLS_18 = __VLS_17({
            to: ('/groups/' + group.id),
            ...{ class: "px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-xs font-medium transition-colors" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_17));
        /** @type {__VLS_StyleScopedClasses['px-4']} */ ;
        /** @type {__VLS_StyleScopedClasses['py-2']} */ ;
        /** @type {__VLS_StyleScopedClasses['bg-white/10']} */ ;
        /** @type {__VLS_StyleScopedClasses['hover:bg-white/20']} */ ;
        /** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
        /** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
        /** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
        const { default: __VLS_21 } = __VLS_19.slots;
        (__VLS_ctx.$t('home.card.details'));
        // @ts-ignore
        [$t, $t, $t, $t, $t, $t, getServiceLogo,];
        var __VLS_19;
        // @ts-ignore
        [];
    }
    if (__VLS_ctx.groupStore.hasMore && !__VLS_ctx.searchQuery && !__VLS_ctx.debouncedQuery) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex justify-center mt-12" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
            ...{ onClick: (...[$event]) => {
                    if (!!(__VLS_ctx.groupStore.loading))
                        return;
                    if (!!(__VLS_ctx.groupStore.error))
                        return;
                    if (!(__VLS_ctx.groupStore.hasMore && !__VLS_ctx.searchQuery && !__VLS_ctx.debouncedQuery))
                        return;
                    __VLS_ctx.groupStore.fetchNextPage();
                    // @ts-ignore
                    [searchQuery, groupStore, groupStore, debouncedQuery,];
                } },
            disabled: (__VLS_ctx.groupStore.loading),
            ...{ class: "px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-medium transition-colors flex items-center gap-2" },
        });
        /** @type {__VLS_StyleScopedClasses['px-6']} */ ;
        /** @type {__VLS_StyleScopedClasses['py-3']} */ ;
        /** @type {__VLS_StyleScopedClasses['bg-white/10']} */ ;
        /** @type {__VLS_StyleScopedClasses['hover:bg-white/20']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-white']} */ ;
        /** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
        /** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
        /** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
        if (__VLS_ctx.groupStore.loading) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" },
            });
            /** @type {__VLS_StyleScopedClasses['animate-spin']} */ ;
            /** @type {__VLS_StyleScopedClasses['h-4']} */ ;
            /** @type {__VLS_StyleScopedClasses['w-4']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-2']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-white/30']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-t-white']} */ ;
            /** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
        }
        (__VLS_ctx.groupStore.loading ? '載入中...' : '載入更多');
    }
}
if (!__VLS_ctx.groupStore.loading && __VLS_ctx.filteredGroups.length === 0) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "text-center py-20" },
    });
    /** @type {__VLS_StyleScopedClasses['text-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['py-20']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-gray-500 text-lg" },
    });
    /** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
    (__VLS_ctx.$t('home.emptyState'));
    let __VLS_22;
    /** @ts-ignore @type {typeof __VLS_components.routerLink | typeof __VLS_components.RouterLink | typeof __VLS_components.routerLink | typeof __VLS_components.RouterLink} */
    routerLink;
    // @ts-ignore
    const __VLS_23 = __VLS_asFunctionalComponent1(__VLS_22, new __VLS_22({
        to: "/create",
        ...{ class: "inline-block mt-4 text-purple-400 hover:text-purple-300 font-medium" },
    }));
    const __VLS_24 = __VLS_23({
        to: "/create",
        ...{ class: "inline-block mt-4 text-purple-400 hover:text-purple-300 font-medium" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_23));
    /** @type {__VLS_StyleScopedClasses['inline-block']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-purple-400']} */ ;
    /** @type {__VLS_StyleScopedClasses['hover:text-purple-300']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
    const { default: __VLS_27 } = __VLS_25.slots;
    (__VLS_ctx.$t('home.createLink'));
    // @ts-ignore
    [$t, $t, groupStore, groupStore, groupStore, groupStore, filteredGroups,];
    var __VLS_25;
}
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
//# sourceMappingURL=HomeView.vue.js.map