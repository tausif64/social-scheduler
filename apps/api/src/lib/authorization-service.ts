// Save as: apps/api/src/lib/authorization-service.ts
// The one place OPENFGA_STORE_ID / OPENFGA_MODEL_ID get read. Everything
// else in the app calls AuthorizationService.can(...) — nothing else should
// import OpenFgaClient directly or touch these env vars again.

import { OpenFgaClient } from "@openfga/sdk";

const fga = new OpenFgaClient({
  apiUrl: process.env.OPENFGA_API_URL!, // http://localhost:8080 in local dev
  storeId: process.env.OPENFGA_STORE_ID!, // printed by setup-openfga.sh
  // Optional but recommended once you're past local dev: pins every check
  // to the exact model version you tested against, so the store can gain a
  // newer model later (e.g. you add a relation) without silently changing
  // what already-deployed code checks against. Safe to omit for now — if
  // unset, OpenFGA just uses the store's latest model automatically.
  authorizationModelId: process.env.OPENFGA_MODEL_ID,
});

export const AuthorizationService = {
  async can(
    userId: string,
    relation: string,
    objectType: "organization" | "workspace",
    objectId: string
  ): Promise<boolean> {
    const { allowed } = await fga.check({
      user: `user:${userId}`,
      relation,
      object: `${objectType}:${objectId}`,
    });
    return allowed ?? false;
  },
};