import Link from 'next/link';

export default function Home() {
	return (
		<main>
			<h1> Home Page</h1>
			<h2>
				<Link href="/auth/sign-in">Sign in</Link>
				<br />
				<Link href="/auth/sign-up">Sign up</Link>
				<br />
				<Link href="/dashboard/poster">Post Tasks</Link>
				<br />
				<Link href="/dashboard/performer">Do Tasks</Link>
				<br />
			</h2>
		</main>
	);
}
