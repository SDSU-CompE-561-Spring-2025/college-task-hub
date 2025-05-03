// components/SignUpDialog.tsx
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
  } from "@/components/ui/dialog"
  import { Button } from "@/components/ui/button"
  
  export function SignUpDialog() {
	return (
	  <Dialog>
		<DialogTrigger asChild>
		  	<Button className="bg-white text-sky-600 hover:bg-gray-100 rounded-lg px-4 text-lg font-semibold hover:cursor-pointer">
				Sign Up
			</Button>
		</DialogTrigger>
  
		{/* This is the content of the dialog */}
		<DialogContent className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80">
		  <DialogHeader>
			<DialogTitle>Sign Up</DialogTitle>
		  </DialogHeader>
		  {/* Sign-up form */}
		  <form className="space-y-4">
			<input
			  type="text"
			  placeholder="Username"
			  className="w-full p-2 border rounded"
			/>
			<input
			  type="email"
			  placeholder="Email"
			  className="w-full p-2 border rounded"
			/>
			<input
			  type="password"
			  placeholder="Password"
			  className="w-full p-2 border rounded"
			/>
			<Button type="submit">Sign Up</Button>
		  </form>
		</DialogContent>
	  </Dialog>
	)
  }
  