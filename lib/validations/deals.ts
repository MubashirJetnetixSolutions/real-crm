import { z } from "zod";

export const createDealSchema = z.object({
  title: z.string().trim().min(2, "Deal title must be at least 2 characters").max(190),
  clientId: z.number().int().positive("Select a client").nullable(),
  propertyId: z.number().int().positive().optional().nullable().default(null),
  price: z
    .number({ message: "Deal value must be a number" })
    .nonnegative("Deal value cannot be negative")
    .max(9_999_999_999_999, "Deal value is too large"),
  stage: z.string().trim().min(1).max(60).default("New Deal"),
  priority: z.string().trim().min(1).max(40).default("Normal"),
  agentId: z.number().int().positive().optional().nullable().default(null),
  notes: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .nullable()
    .transform((v) => (v ? v : null)),
  expectedCloseAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Expected close date must be a valid date")
    .optional()
    .nullable()
    .default(null),
});

export type CreateDealInput = z.infer<typeof createDealSchema>;
