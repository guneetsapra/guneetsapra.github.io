import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await login();
      toast({
        title: 'Success',
        description: 'You have successfully logged in',
      });
      setLocation('/');
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Error',
        description: 'Failed to log in. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <div className="flex flex-col items-center text-center mb-6">
          <span className="material-icons text-6xl text-primary mb-4">public</span>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">AdBlocker Browser</h1>
          <p className="text-neutral-500">
            Sign in to access your custom browser with ad-blocking capabilities
          </p>
        </div>

        <div className="flex flex-col space-y-4">
          <Button 
            onClick={handleLogin}
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="material-icons animate-spin mr-2">refresh</span>
                Signing in...
              </>
            ) : (
              <>
                <span className="material-icons mr-2">login</span>
                Sign in with Google
              </>
            )}
          </Button>
          
          <div className="text-center pt-4 text-sm text-neutral-500">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </div>
        </div>
      </div>
    </div>
  );
}