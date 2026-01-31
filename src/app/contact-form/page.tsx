"use client";

import { ContactForm } from "@/components/contacts/ContactForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function ContactFormPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold tracking-tight">Contact Form</h1>
          <p className="text-muted-foreground mt-1">
            Create or edit a contact with validated fields.
          </p>
        </div>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Contact Details</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            <ContactForm
              mode="create"
              onSubmit={(values) => {
                console.log("SUBMIT VALUES:", values);
                alert("Submitted! Check the console.");
              }}
              onCancel={() => alert("Cancel")}
            />
          </CardContent>
        </Card>

        <p className="mt-6 text-xs text-muted-foreground">
          Local test page. You can remove this route once the real Add/Edit pages are wired.
        </p>
      </div>
    </div>
  );
}
