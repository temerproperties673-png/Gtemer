import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  phone: z.string().trim().min(5, "Phone is required").max(30),
  email: z.string().trim().email().max(255).optional().or(z.literal("")),
  message: z.string().trim().max(1000).optional(),
});

export function InquiryForm({
  propertyTitle,
  propertyId,
}: {
  propertyTitle?: string;
  propertyId?: string;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("leads").insert({
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email || null,
      message: parsed.data.message || null,
      property_id: propertyId || null,
      property_title: propertyTitle || null,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Failed to send. Please try again.");
      return;
    }
    toast.success("Thanks! Your inquiry has been sent. We'll be in touch shortly.");
    setForm({ name: "", phone: "", email: "", message: "" });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          required
          placeholder="Full Name"
          maxLength={100}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="h-12 w-full rounded-xl border border-input bg-background px-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        <input
          required
          type="tel"
          placeholder="Phone Number"
          maxLength={30}
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="h-12 w-full rounded-xl border border-input bg-background px-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>
      <input
        type="email"
        placeholder="Email (optional)"
        maxLength={255}
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="h-12 w-full rounded-xl border border-input bg-background px-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
      <textarea
        rows={4}
        maxLength={1000}
        placeholder={
          propertyTitle
            ? `I'd like more details on ${propertyTitle}...`
            : "Tell us what you're looking for..."
        }
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        className="w-full rounded-xl border border-input bg-background p-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
      <button
        type="submit"
        disabled={submitting}
        className="btn-primary w-full disabled:opacity-60"
      >
        {submitting ? "Sending..." : "Request Information"}
      </button>
      <p className="text-xs text-muted-foreground text-center">
        Pricing and payment plans shared privately on request.
      </p>
    </form>
  );
}
