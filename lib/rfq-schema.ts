import { z } from "zod";

export const RFQSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  contactPerson: z.string().min(2, "Contact person is required"),
  email: z.string().email("Valid email is required"),
  country: z.string().min(2, "Country is required"),
  quantityKg: z.coerce.number().min(100, "Minimum quantity is 100 kg"),
  productInterest: z
    .array(z.enum(["tilapia", "carp", "marine", "custom"]))
    .min(1, "Select at least one product category"),
  message: z.string().optional(),
});

export type RFQFormData = z.infer<typeof RFQSchema>;

export type RFQResult =
  | { success: true; id: string }
  | { success: false; error: string };
