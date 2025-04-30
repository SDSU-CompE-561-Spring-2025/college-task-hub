"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import { Mail, PhoneCall } from "lucide-react";

interface ContactPopupProps {
  email: string;
  phone_number: string;
}

export default function ContactPopup({ email, phone_number }: ContactPopupProps) {
  return (
    <Dialog>
     {/* Use asChild so ShadCN doesn't wrap our button with another button */}
      <DialogTrigger asChild>
        <button className="rounded-10 bg-sky-600 hover:bg-sky-700 text-white px-8 py-2 rounded-full">
          Contact
        </button>
      </DialogTrigger>
      
      <DialogContent className="bg-gray-300 max-w-md p-6">
        <DialogHeader className="flex flex-col items-center mt-5 p-1">
          <DialogTitle className="text-2xl">Contact</DialogTitle>
        </DialogHeader>

        <div className="h-px bg-gray-300 my-1" />

        <div className="space-y-3">
          {/* Email Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">Email</span>
              <Mail className="h-5 w-5" />
            </div>
            <div className="bg-white px-4 py-3 text-base">
              {email}
            </div>
          </div>

          {/* Phone Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">Phone</span>
              <PhoneCall className="h-5 w-5" />
            </div>
            <div className="bg-white px-4 py-3 text-base">
              {phone_number}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

