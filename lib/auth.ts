// lib/auth.ts
import { NextRequest } from 'next/server';
import { jwtVerify } from "jose";

/**
 * Retrieves the JWT secret key from environment variables.
 * Throws an error if the secret key is not set.
 * @returns {Uint8Array} The secret key encoded as a Uint8Array.
 */
export const getJwtSecretKey = (): Uint8Array => {
    const secret = process.env.JWT_SECRET;
    if (!secret || secret.length === 0) {
        throw new Error("The environment variable JWT_SECRET is not set.");
    }
    return new TextEncoder().encode(secret);
};

/**
 * Verifies a JWT token using the secret key.
 * @param {string} token - The JWT to verify.
 * @returns {Promise<import('jose').JWTPayload>} The decoded payload of the token if valid.
 * @throws {Error} If the token is expired or invalid.
 */
export async function verifyJwtToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, getJwtSecretKey());
        return payload;
    } catch (error) {
        console.error("JWT Verification Error:", error);
        throw new Error("Your token has expired or is invalid.");
    }
}

/**
 * @param {NextRequest} req - The incoming NextRequest object from an API route or middleware.
 * @returns {Promise<string | null>} A promise that resolves to the user's ID string, or null if not authenticated.
 */
export async function getUserIdFromRequest(req: NextRequest): Promise<string | null> {
    // 1. Get the token from the request's cookies.
    // Ensure the cookie name 'session-token' matches what you set in your login API.
    const token = req.cookies.get("session-token")?.value;

    if (!token) {
      return null;
    }

    try {
      // 2. Verify the token is valid.
      const payload = await verifyJwtToken(token);
      
      // 3. Extract the user ID from the 'sub' (subject) claim of the token.
      const userId = payload.sub as string | null;
      return userId;
      
    } catch (error) {
      // If verification fails (e.g., token is expired), return null.
      return null;
    }
}