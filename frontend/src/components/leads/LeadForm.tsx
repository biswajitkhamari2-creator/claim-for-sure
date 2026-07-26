import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

// The backend endpoint might be relative to the window or a specific API base
const getApiBaseUrl = () => {
  if (typeof window !== "undefined" && window.location.hostname) {
    const host = window.location.hostname;
    const isLocal = host === "localhost" || host === "127.0.0.1" || host.startsWith("192.168.");
    if (!isLocal) return ""; 
    return `http://${host}:8000`;
  }
  return "http://localhost:8000";
};

const formSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  mobile_number: z.string().regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  insurance_company: z.string().optional(),
  claim_type: z.string().optional(),
  claim_status: z.string().optional(),
  description: z.string().optional(),
  privacy_policy: z.boolean().refine((val) => val === true, {
    message: "You must agree to the privacy policy",
  }),
});

export function LeadForm() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      mobile_number: "",
      email: "",
      insurance_company: "",
      claim_type: "",
      claim_status: "",
      description: "",
      privacy_policy: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      let rejection_letter_path = null;

      if (file) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `leads/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from("documents")
          .upload(filePath, file);

        if (uploadError) {
          throw new Error("Failed to upload document");
        }
        rejection_letter_path = filePath;
      }

      const res = await fetch(`${getApiBaseUrl()}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          rejection_letter_path,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to submit request");
      }

      toast.success("Request submitted successfully!");
      navigate({ to: "/free-claim-assessment/success" });
    } catch (error: any) {
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mobile_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mobile Number *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 9876543210" maxLength={10} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="your@email.com" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="insurance_company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Insurance Company</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Star Health, HDFC Ergo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="claim_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Claim Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select claim type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Health">Health Insurance</SelectItem>
                    <SelectItem value="Life">Life Insurance</SelectItem>
                    <SelectItem value="Motor">Motor Insurance</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="claim_status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Claim Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                    <SelectItem value="Delayed">Delayed</SelectItem>
                    <SelectItem value="Pending">Pending / In Process</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brief Description of the Issue</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Tell us what happened with your claim..." 
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel>Upload Rejection Letter (Optional)</FormLabel>
          <FormControl>
            <Input 
              type="file" 
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setFile(e.target.files[0]);
                } else {
                  setFile(null);
                }
              }} 
            />
          </FormControl>
          <p className="text-sm text-muted-foreground mt-1">Accepts PDF, JPG, PNG up to 5MB.</p>
        </FormItem>

        <FormField
          control={form.control}
          name="privacy_policy"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  I agree to the Privacy Policy and Terms of Service *
                </FormLabel>
                <p className="text-sm text-muted-foreground">
                  By checking this, you authorize our experts to contact you regarding your claim.
                </p>
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full md:w-auto min-w-[200px]" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Request Free Callback"
          )}
        </Button>
      </form>
    </Form>
  );
}
