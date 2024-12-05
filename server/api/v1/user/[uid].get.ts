import {
  serverSupabaseServiceRole,
  serverSupabaseUser,
} from "#supabase/server";

import type {
  ProfileError,
  GetProfileParam,
  GetProfileResponse,
} from "~/types/api/user";

/**
 * Endpoint to get a user by id
 * @returns {Object} - User object
 * @throws {400} - Invalid userId
 * @throws {401} - Unauthenticated
 * @throws {500} - Internal Server Error
 */

// check regex userId
/*if (!userId || !isValidSpotifyID(userId!)) {
        setResponseStatus(event, 400);
        return {error: 'invalid userId'};
    }*/
export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  if (!user?.id) {
    setResponseStatus(event, 401);
    return { error: "unauthenticated" };
  }

  const client = serverSupabaseServiceRole(event);
  const param: GetProfileParam = { userid: user.id };

  const {
    data,
    error,
  }: {
    data: GetProfileResponse | null;
    error: ProfileError | null;
  } = await client.rpc("get_profile_information", param as never);

  if (error) {
    setResponseStatus(event, 500);
    return { error: error.message };
  }

  console.log(data)
  return data;
});
