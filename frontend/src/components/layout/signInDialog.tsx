import { useState } from "react"
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
  } from "@/components/ui/dialog"
  import { Button } from "@/components/ui/button"
  
  export function SignInDialog() {

	const [role, setRole] = useState<"performer" | "poster">("performer")
	const [showPassword, setShowPassword] = useState(false)

	return (
		<Dialog>

			<DialogTrigger asChild>
		  		<Button className="bg-sky-600 hover:bg-sky-700 text-white rounded-lg px-4 text-lg font-semibold hover:cursor-pointer">
					Sign In
				</Button>
			</DialogTrigger>

			<DialogContent className="backdrop-blur-sm bg-white dark:bg-gray-900/80">
			
				<DialogTitle className="text-5xl mb-4">
					Sign In
				</DialogTitle>

				<div className="flex justify-center">
        		  	<div className="flex bg-gray-200 rounded-full items-center h-10">
					  	<button
        		      	onClick={() => setRole("performer")}
        		      	className={`px-4 py-2 rounded-full transition ${
        		        	role === "performer"
        		          	? "bg-black text-white"
        		        	: "text-gray-600"
        		      	}`}
        		    	>
        		      	Do Tasks
        		    	</button>
        		    	<button
        		      	onClick={() => setRole("poster")}
        		      	className={`px-4 py-2 rounded-full transition ${
        		        	role === "poster"
        		          	? "bg-black text-white"
        		          	: "text-gray-600"
        		      	}`}
        		    	>
        		      	Post Tasks
        		    	</button>
        		  	</div>
        		</div>
			  	
			  	<form>
					<div className="mx-2 my-4">
						<h1 className="font-semibold">Email</h1>
						<input
						  type="email"
						  placeholder="Required"
						  className="w-full p-2 border rounded-lg bg-gray-200"
						/>
					</div>

					<div className="mx-2 my-4">
						<h1 className="font-semibold">Password</h1>
						<div className="relative">
							<input
								type={showPassword ? "text" : "password"} // 👈 toggle type
								placeholder="Required"
								className="w-full p-2 border rounded-lg bg-gray-200 pr-10"
							/>
							<button
								type="button"
								className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600"
								onClick={() => setShowPassword((prev) => !prev)}
							>
								{showPassword ? "Hide" : "Show"}
							</button>
						</div>
					</div>	

					<div className="flex justify-center mt-8">
					  <Button className="bg-sky-500 text-xl rounded-lg p-5" type="submit">
					    Sign In Now
					  </Button>
					</div>
					<div className="flex justify-center mt-2 mb-4 text-sm">
						<h1>Forgot Password?</h1>
					</div>

					<p className="text-gray-400 text-sm text-center mx-12">By tapping the “Sign In Now" button, you agree to TaskU’s Terms, 
						including a waiver of your jury trial right, and Privacy Policy. 
						We may text you a verification code. Msg & data rates apply.</p>
			  	</form>

			</DialogContent>

	  	</Dialog>
	)
  }
  