import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailLogin, setShowEmailLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loginWithEmail, createUserWithEmail } = useAuth();
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
    } catch (error: any) {
      console.error('Login error:', error);
      
      // If error suggests Google auth not configured, show email login
      if (error.code === 'auth/configuration-not-found' || 
          error.message?.includes('not properly configured')) {
        setShowEmailLogin(true);
        toast({
          title: 'Google sign-in unavailable',
          description: 'Please use email and password instead.',
          variant: 'default',
        });
      } else {
        toast({
          title: 'Error',
          description: error.message || 'Failed to log in. Please try again.',
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleEmailLogin = async (type: 'login' | 'signup') => {
    if (!email || !password) {
      toast({
        title: 'Missing information',
        description: 'Please enter both email and password',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    try {
      if (type === 'login') {
        await loginWithEmail(email, password);
      } else {
        await createUserWithEmail(email, password);
      }
      
      toast({
        title: 'Success',
        description: 'You have successfully logged in',
      });
      setLocation('/');
    } catch (error: any) {
      console.error('Email login error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Authentication failed. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="w-full max-w-md backdrop-blur-md bg-white/20 rounded-xl shadow-2xl p-8 border border-white/30">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative w-24 h-24 mb-6">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 shadow-lg animate-pulse"></div>
            <div className="absolute inset-1 rounded-full bg-white flex items-center justify-center">
              <span className="material-icons text-5xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">public</span>
            </div>
          </div>
          
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
            <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Xeno
            </span>
          </h1>
          <p className="text-white/80 max-w-xs">
            Your secure browser with powerful ad-blocking capabilities
          </p>
        </div>

        {!showEmailLogin ? (
          <div className="flex flex-col space-y-5">
            <button 
              onClick={handleLogin}
              disabled={isLoading}
              className="group relative w-full h-12 overflow-hidden rounded-lg bg-white text-lg shadow"
            >
              <div className="absolute inset-0 w-3 bg-purple-600 transition-all duration-500 ease-out group-hover:w-full"></div>
              <div className="relative flex items-center justify-center text-purple-600 group-hover:text-white space-x-2">
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3" />
                    </svg>
                    <span>Sign in with Google</span>
                  </>
                )}
              </div>
            </button>
            
            <div className="flex items-center my-4">
              <div className="flex-grow h-px bg-white/30"></div>
              <p className="mx-4 text-white/70">or</p>
              <div className="flex-grow h-px bg-white/30"></div>
            </div>
            
            <button 
              onClick={() => setShowEmailLogin(true)}
              className="w-full h-12 px-6 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium border border-white/30 transition-colors duration-300"
            >
              Sign in with Email
            </button>
            
            <div className="pt-4 text-center">
              <span className="text-white/70 text-sm">
                By signing in, you agree to our Terms of Service and Privacy Policy
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col space-y-4 text-white">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-purple-400"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-purple-400"
              />
            </div>
            
            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => handleEmailLogin('login')}
                disabled={isLoading}
                className="flex-1 h-10 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium border border-white/30 transition-colors duration-300"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
              
              <button
                onClick={() => handleEmailLogin('signup')}
                disabled={isLoading}
                className="flex-1 h-10 rounded-lg bg-purple-500 hover:bg-purple-600 text-white font-medium transition-colors duration-300"
              >
                {isLoading ? 'Creating...' : 'Create Account'}
              </button>
            </div>
            
            <button
              onClick={() => setShowEmailLogin(false)}
              className="text-white/70 text-sm hover:text-white underline mt-4 transition-colors"
            >
              ← Back to sign in options
            </button>
            
            <div className="pt-2 text-center">
              <span className="text-white/70 text-sm">
                By signing in, you agree to our Terms of Service and Privacy Policy
              </span>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-8 flex space-x-2">
        <div className="h-2 w-2 rounded-full bg-white/50"></div>
        <div className="h-2 w-2 rounded-full bg-white"></div>
        <div className="h-2 w-2 rounded-full bg-white/50"></div>
      </div>
    </div>
  );
}