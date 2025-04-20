import Link from 'next/link';
// NOTE:
// This will be implemented as a modal pop-up on top of the Home page.
// Keeping this route so users can still go directly to /auth/forgot-password if needed.
export default function ForgotPasswordPage() {
	return ( 
    <>
      <h1>Forgot Password</h1>
      <h2>
        <Link href="/auth/sign-in">Back to sign in</Link>
      </h2>
    </>
    );
}