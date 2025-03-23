import { defineStore } from 'pinia';

enum ErrorTypes {
    NONE = 'none',
    NOT_FOUND = 'notFound',
    GENERIC = 'generic',
}

export const useErrorStore = defineStore('error', {
    state: () => ({
        type: ErrorTypes.NONE,
    }),

    getters: {
        errored: (state) => state.type !== ErrorTypes.NONE,
        isNotFoundError: (state) => state.type === ErrorTypes.NOT_FOUND,
    },

    actions: {
        setNotFound() {
            this.type = ErrorTypes.NOT_FOUND;
        },

        setGenericError() {
            this.type = ErrorTypes.GENERIC;
        },

        clearError() {
            this.type = ErrorTypes.NONE;
        },
    },
});
