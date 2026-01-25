"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toUserDTO = exports.toGroupDTO = exports.mapDocumentToDTO = void 0;
/**
 * Generic mapper to convert Firestore DocumentSnapshot to DTO
 * @param doc Firestore DocumentSnapshot
 * @param transform Function to transform data
 */
const mapDocumentToDTO = (doc, transform) => {
    if (!doc.exists)
        return null;
    return transform(doc.data(), doc.id);
};
exports.mapDocumentToDTO = mapDocumentToDTO;
/**
 * Maps raw Firestore data to GroupDTO
 * Explicitly selects allowed fields to prevent data leakage
 */
const toGroupDTO = (data, id) => {
    var _a, _b, _c;
    return {
        id,
        name: data.name || '',
        description: data.description || '',
        platform: data.platform || '',
        price: Number(data.price) || 0,
        cycle: data.cycle || 'monthly',
        currency: data.currency || 'TWD',
        maxMembers: Number(data.maxMembers) || 4,
        currentMembers: Number(data.currentMembers) || 1,
        ownerId: data.ownerId || '',
        status: data.status || 'open',
        tags: Array.isArray(data.tags) ? data.tags : [],
        createdAt: ((_c = (_b = (_a = data.createdAt) === null || _a === void 0 ? void 0 : _a.toDate) === null || _b === void 0 ? void 0 : _b.call(_a)) === null || _c === void 0 ? void 0 : _c.toISOString()) ||
            new Date().toISOString()
        // updatedAt is optional
    };
};
exports.toGroupDTO = toGroupDTO;
/**
 * Maps raw Firestore data to UserDTO
 */
const toUserDTO = (data, id) => {
    var _a, _b, _c;
    return {
        id,
        displayName: data.displayName || 'Anonymous',
        photoURL: data.photoURL,
        // Email handled conditionally in higher layers if needed, strictly guarded here
        // email: data.email ... policy decision
        createdAt: ((_c = (_b = (_a = data.createdAt) === null || _a === void 0 ? void 0 : _a.toDate) === null || _b === void 0 ? void 0 : _b.call(_a)) === null || _c === void 0 ? void 0 : _c.toISOString()) ||
            new Date().toISOString()
    };
};
exports.toUserDTO = toUserDTO;
//# sourceMappingURL=mappers.js.map