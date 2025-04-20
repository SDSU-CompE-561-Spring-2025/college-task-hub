import Link from 'next/link';
// NOTE:
// This will be implemented as a modal pop-up on top of the Home page.
// Keeping this route so users can still go directly to /auth/sign-up if needed.
export default function SignUpPage() {
	return (
    <>  
    <h1>SignUp Page</h1>
        <h2>
            <Link href="/auth/sign-in">Already have an account? Sign in</Link>
        </h2>
    </>
);
}

