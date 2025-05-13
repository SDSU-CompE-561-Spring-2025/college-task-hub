"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import { Mail, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ContactPopupProps {
  email: string;
  phone_number: string;
}

export default function ContactPopup({ email, phone_number }: ContactPopupProps) {
  return (
    <Dialog>
     {/* Use asChild so ShadCN doesn't wrap our button with another button */}
      <DialogTrigger asChild>
        <Button type="submit" className="bg-sky-500 hover:bg-sky-600">Contact</Button>
      </DialogTrigger>
      
      <DialogContent className="bg-gray-100 max-w-md p-6">
        <DialogHeader className="flex flex-col items-center mt-5 p-1">
          <DialogTitle className="text-2xl font-bold mb-6">Contact</DialogTitle>
        </DialogHeader>

        <div className="h-px bg-black my-1" />

        <div className="space-y-3">
          {/* Email Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="block text-medium font-medium text-black mb-1">Email</span>
              <Mail className="h-4 w-4" />
            </div>
            <div className="rounded-md border border-gray-300 bg-white rounded-md px-4 py-2 text-base w-full">
              {email}
            </div>
          </div>

          {/* Phone Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="block text-medium font-medium text-black mb-1">Phone</span>
              <PhoneCall className="h-4 w-4" />
            </div>
            <div className="rounded-md border border-gray-300 bg-white rounded-md px-4 py-2 text-base w-full">
              {phone_number}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

