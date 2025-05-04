import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPinPlus, ArrowRightCircle } from "lucide-react"; 

export default function AddressBar() {
  return (
    <div className="flex items-center border-2 border-black rounded-lg px-4 w-[350px] gap-2">
      {/* Left icon */}
      <MapPinPlus className="text-black h-6 w-6" />

      {/* Input */}
      <Input 
        placeholder="Address"
        className="text-lg placeholder:text-gray-500 flex-grow"
      />

      {/* Right button */}
      <ArrowRightCircle className="h-6 w-6 text-black" />

      {/*  as button tho it is weird with the ui: <Button variant="ghost" size="icon" className="h-6 w-6 p-0" >
        <ArrowRightCircle className="h-6 w-6 text-black" />
      </Button> */}
    </div>
  );
}
