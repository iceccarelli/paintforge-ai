import { z } from "zod";

/** Matches the pilot application form fields exactly. */
export const pilotInquirySchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("A valid work email is required"),
  phone: z.string().optional().or(z.literal("")),
  company: z.string().min(2, "Company name is required"),
  message: z.string().min(10, "Tell us a little about your projects").max(4000),
});

export type PilotInquiry = z.infer<typeof pilotInquirySchema>;
