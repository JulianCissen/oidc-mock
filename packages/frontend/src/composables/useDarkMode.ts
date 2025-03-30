import { ref, watch } from 'vue';
import { useQuasar } from 'quasar';

// Create a singleton pattern to ensure the same state is shared across components
const darkModeState = ref(false);
let initialized = false;

export const useDarkMode = () => {
    const quasar = useQuasar();

    const initDarkMode = () => {
        if (!initialized) {
            const isDark = window.localStorage.getItem('darkMode') === 'true';
            darkModeState.value = isDark;
            quasar.dark.set(isDark);
            initialized = true;

            // Set up a watcher to react to darkModeState changes
            watch(darkModeState, (value) => {
                quasar.dark.set(value);
                window.localStorage.setItem('darkMode', value.toString());
            });
        }
    };

    const toggleDarkMode = () => {
        darkModeState.value = !darkModeState.value;
    };

    return {
        initDarkMode,
        toggleDarkMode,
        isDarkMode: () => quasar.dark.isActive,
        darkMode: darkModeState, // Expose the reactive state for components to bind to
    };
};
