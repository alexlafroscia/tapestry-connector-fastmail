import "fetch-polyfill/install";

import JamClient from "jmap-jam";

/**
 * Input configured by `ui-config.json`
 */
declare const token: string;

export function getClient() {
  return new JamClient({
    sessionUrl: "https://api.fastmail.com/jmap/session",
    bearerToken: token,
  });
}
