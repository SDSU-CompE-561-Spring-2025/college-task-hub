// components/SignInForm.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { signIn } from '@/lib/api/users';
import { UserSignIn } from '@/types/users';
import { useRouter } from 'next/navigation';

interface SignInFormProps {
  onSuccess?: () => void;
  role: 'performer' | 'poster'; // Accept role as a prop
}

export default function SignInForm({ onSuccess, role }: SignInFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<UserSignIn>({
    email: '',
    password: '',
    grant_type: 'password',
    scope: '',
    client_id: null,
    client_secret: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 1) Client‑side required‑field check
    if (!formData.email.trim() || !formData.password) {
      setError('Email and password are both required.');
      return;
    }

    setLoading(true);
    try {
      const response = await signIn(formData);
			const token = response.access_token; 
			localStorage.setItem('access_token', token); 

			const res = await fetch('http://localhost:8000/api/user/me', {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			const userData = await res.json();  

			localStorage.setItem('user_id', userData.id.toString());
			console.log("Logged in as user:", userData);  
			
      console.log('User signed in successfully:', response);

      if (onSuccess) {
        onSuccess();
      }
      router.push(`/dashboard/${role}`);
    } catch (err: any) {
      console.error('Error signing in:', err);
      if (err.response?.status === 401) {
        setError('The email or password you entered is incorrect.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label className="block font-semibold mb-1">Email</label>
        <input
          type="email"
          placeholder="Required"
          className="w-full p-2 rounded-lg bg-gray-100"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Password</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Required"
            className="w-full p-2 rounded-lg bg-gray-100 pr-10"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <Button
          className="bg-sky-500 text-xl rounded-lg p-5 hover:bg-sky-600 disabled:opacity-50"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Signing in…' : 'Sign In Now'}
        </Button>
      </div>

      <div className="flex justify-center mt-2 mb-4 text-sm cursor-pointer">
        <h1>Forgot Password?</h1>
      </div>

      <p className="text-gray-400 text-sm text-center mx-12">
        By tapping the “Sign In Now" button, you agree to TaskU’s Terms, including a waiver of your
        jury trial right, and Privacy Policy. We may text you a verification code. Msg & data rates
        apply.
      </p>
    </form>
  );
}
