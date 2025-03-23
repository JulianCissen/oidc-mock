/**
 * Replace environment variables in a string with their values.
 * @param jsonString The string to replace environment variables in.
 * @returns The string with environment variables replaced.
 */
export const replaceEnvVars = (jsonString: string): string => {
    return jsonString.replace(/\$\{([^}]+)\}/g, (match, envVarName) => {
        const envValue = process.env[envVarName];
        if (envValue === undefined) {
            console.warn(`Environment variable ${envVarName} not found.`);
            return match; // Return the original match if env var doesn't exist.
        }
        return envValue;
    });
};
