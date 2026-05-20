import { LaundryResourceType } from "@prisma/client";
import { z } from "zod";

export const idParamSchema = z.object({
  id: z.string().uuid()
});

export const availabilityQuerySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
});

export const laundryAvailabilityQuerySchema = availabilityQuerySchema.extend({
  resourceType: z.nativeEnum(LaundryResourceType).default(LaundryResourceType.WASHER),
  resourceNumber: z.coerce.number().int().positive().default(1)
});

export const createLaundryBookingSchema = z.object({
  resourceType: z.nativeEnum(LaundryResourceType),
  resourceNumber: z.number().int().positive(),
  startsAt: z.string().datetime()
});

export const createGroundBookingSchema = z.object({
  startsAt: z.string().datetime()
});

export type LaundryAvailabilityQuery = z.infer<typeof laundryAvailabilityQuerySchema>;
export type CreateLaundryBookingInput = z.infer<typeof createLaundryBookingSchema>;
export type AvailabilityQuery = z.infer<typeof availabilityQuerySchema>;
export type CreateGroundBookingInput = z.infer<typeof createGroundBookingSchema>;
