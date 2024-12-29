import type { AuthenticationRequestQueryParams } from '../validators/oidc';
import { randomBytes } from 'crypto';

class SessionService {
    private sessionMap: Map<
        string,
        AuthenticationRequestQueryParams & { expires_at: Date }
    > = new Map();
    private readonly sessionDuration = 1000 * 60 * 15; // 15 minutes

    constructor() {
        // Clean up expired sessions every minute.
        setInterval(() => {
            const now = new Date();
            for (const [sessionId, session] of this.sessionMap) {
                if (session.expires_at < now) {
                    this.sessionMap.delete(sessionId);
                }
            }
        }, 1000 * 60);
    }

    public createSession(params: AuthenticationRequestQueryParams): string {
        const sessionId = randomBytes(16).toString('hex');
        const expiresAt = new Date(Date.now() + this.sessionDuration);
        this.sessionMap.set(sessionId, { ...params, expires_at: expiresAt });
        return sessionId;
    }

    public consumeSession(sessionId: string): AuthenticationRequestQueryParams {
        const session = this.sessionMap.get(sessionId);
        if (!session) {
            throw new Error('Session not found');
        }
        if (session.expires_at < new Date()) {
            throw new Error('Session expired');
        }
        this.sessionMap.delete(sessionId);
        return session;
    }
}

export const sessionService = new SessionService();
