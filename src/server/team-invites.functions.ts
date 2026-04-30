import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { z } from "zod";

import { inviteStylyMember } from "./team-invites.server";

const inviteStylyMemberSchema = z.object({
  email: z.string().trim().email().max(255),
  fullName: z.string().trim().min(2).max(120),
  department: z.string().trim().max(80).optional(),
  position: z.string().trim().max(80).optional(),
  phone: z.string().trim().max(40).optional(),
  note: z.string().trim().max(500).optional(),
  accessToken: z.string().min(20),
});

export const sendStylyMemberInvite = createServerFn({ method: "POST" })
  .inputValidator((data) => inviteStylyMemberSchema.parse(data))
  .handler(async ({ data }) => {
    const origin = getRequestHeader("origin");
    return inviteStylyMember({
      ...data,
      redirectTo: origin ? `${origin}/auth` : undefined,
    });
  });
