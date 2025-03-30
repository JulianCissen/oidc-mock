import { exportJWK, generateKeyPair } from 'jose';

/**
 * Generate a JSON Web Key Set (JWKS) and a private key.
 * @returns JWKS and private key.
 */
export const generateJWKS = async () => {
    const keyPair = await generateKeyPair('RS256', { extractable: true });
    const cryptoKey = await exportJWK(keyPair.privateKey);

    const jwks = {
        keys: [cryptoKey],
    };

    return jwks;
};
