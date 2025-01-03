import { exportJWK, generateKeyPair } from 'jose';
import crypto from 'crypto';

export const generateJWKS = async () => {
    const keyPair = await generateKeyPair('RS256');
    const privateKey = await exportJWK(keyPair.privateKey);
    const publicKey = await exportJWK(keyPair.publicKey);

    // generate kid
    const kid = crypto.randomBytes(16).toString('hex');
    publicKey.kid = kid;
    publicKey.alg = 'RS256';
    publicKey.use = 'sig';

    const jwks = {
        keys: [publicKey],
    };

    return { jwks, privateKey };
};
