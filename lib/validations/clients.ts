import { z } from "zod";
import { CLIENT_STATUSES, CLIENT_TYPES } from "@/types/clients";

const optionalTrimmed = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .nullable()
    .transform((v) => (v ? v : null));

export const createClientSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(120),
  email: z
    .string()
    .trim()
    .max(190)
    .optional()
    .nullable()
    .transform((v) => (v ? v : null))
    .refine((v) => v === null || z.string().email().safeParse(v).success, {
      message: "Enter a valid email address",
    }),
  phone: optionalTrimmed(40),
  address: optionalTrimmed(190),
  type: z.enum(CLIENT_TYPES).optional().default("Buyer"),
  budget: optionalTrimmed(60),
  intent: optionalTrimmed(80),
  status: z.enum(CLIENT_STATUSES).optional().default("Active"),
});

export const updateClientSchema = createClientSchema.partial();

export type CreateClientInput = z.infer<typeof createClientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;
