<template>
    <timestamp-value v-if="isTimestamp" :value="valueAsNumber" />
    <span v-else>{{ formattedValue }}</span>
</template>

<script setup lang="ts">
import TimestampValue from './TimestampValue.vue';
import { computed } from 'vue';

type Props = {
    name: string;
    value: unknown;
};

const props = defineProps<Props>();

/**
 * List of standard JWT claim names that represent timestamps
 *
 * Standards:
 * - exp: JWT RFC 7519 (JSON Web Token) - Expiration Time
 *   When the token expires (https://datatracker.ietf.org/doc/html/rfc7519#section-4.1.4)
 *
 * - iat: JWT RFC 7519 (JSON Web Token) - Issued At
 *   When the token was issued (https://datatracker.ietf.org/doc/html/rfc7519#section-4.1.6)
 *
 * - nbf: JWT RFC 7519 (JSON Web Token) - Not Before
 *   When the token starts being valid (https://datatracker.ietf.org/doc/html/rfc7519#section-4.1.5)
 *
 * - auth_time: OpenID Connect Core 1.0 - Authentication Time
 *   When the end-user authentication occurred (https://openid.net/specs/openid-connect-core-1_0.html#IDToken)
 *
 * - updated_at: OpenID Connect Core 1.0 - Standard Claims - Updated At
 *   When the user's information was last updated (https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims)
 */
const TIME_CLAIMS = [
    'exp', // Expiration Time
    'iat', // Issued At
    'nbf', // Not Before
    'auth_time', // Authentication Time
    'updated_at', // Last Updated
];

/**
 * Check if the provided value is a timestamp based on name and value
 */
const isTimestamp = computed((): boolean => {
    return TIME_CLAIMS.includes(props.name) && typeof props.value === 'number';
});

/**
 * Safely convert the value to number for the TimestampValue component
 */
const valueAsNumber = computed((): number => {
    return typeof props.value === 'number' ? props.value : 0;
});

/**
 * Format the value for display
 */
const formattedValue = computed((): string => {
    return JSON.stringify(props.value, null, 2);
});
</script>
