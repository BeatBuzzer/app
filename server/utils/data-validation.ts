export function isValidSpotifyID(spotifyID: string): boolean {
  return spotifyID.match(/^[a-zA-Z0-9]+$/) !== null; // base62
}