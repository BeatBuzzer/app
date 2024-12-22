/**
 * Spotify ID regex
 */
export const spotifyIDRegex = /^[a-zA-Z0-9]+$/; // base62

/**
 * Check if a string is a valid Spotify ID
 * @param spotifyID - The string to check
 * @returns Whether the string is a valid Spotify ID
 */
export function isValidSpotifyID(spotifyID: string): boolean {
    return spotifyID.match(spotifyIDRegex) !== null; // base62
}

/**
 * Check if a string is a valid UUID
 * @param uuid - The string to check
 * @returns Whether the string is a valid UUID
 */
export function isValidUUID(uuid: string): boolean {
    if(uuid.length !== 36) return false;
    return uuid.match(/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/) !== null;
}