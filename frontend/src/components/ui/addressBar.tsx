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
      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full" >
        <ArrowRightCircle className="h-12 w-12 text-black" />
      </Button>
    </div>
  );
}
