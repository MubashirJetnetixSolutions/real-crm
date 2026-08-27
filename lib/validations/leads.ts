import { z } from "zod";
import { LEAD_STAGES, LEAD_STATUSES } from "@/types/leads";

const optionalTrimmed = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .nullable()
    .transform((v) => (v ? v : null));

export const createLeadSchema = z.object({
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
  propertyInterest: optionalTrimmed(190),
  budget: optionalTrimmed(60),
  preferredLocation: optionalTrimmed(190),
  notes: optionalTrimmed(2000),
  stage: z.enum(LEAD_STAGES).optional().default("New"),
  status: z.enum(LEAD_STATUSES).optional().default("Warm"),
  source: optionalTrimmed(80),
  agentId: z.number().int().positive().optional().nullable().default(null),
});

export const updateLeadSchema = createLeadSchema.partial();

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
