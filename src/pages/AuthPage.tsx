import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookOpen, Eye, EyeOff, Loader2 } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
// Schemas
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = z
  .object({
    displayName: z.string().min(2, "Name is too short").max(80, "Name is too long").optional(),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Types
type LoginFormData = z.infer<typeof loginSchema>;
interface SignupFormData extends z.infer<typeof signupSchema> {}

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
const { user, signIn, signUp } = useAuth();

  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);

  // Decide default tab from path
  const defaultTab = useMemo(() => {
    if (location.pathname === "/register") return "signup";
    return "login";
  }, [location.pathname]);

  // SEO: Title, description, canonical
  useEffect(() => {
    document.title = "Church Management Login & Signup | ECHAD SI Agent";
    const metaDesc = document.querySelector('meta[name="description"]');
    const canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;

    if (!metaDesc) {
      const m = document.createElement("meta");
      m.name = "description";
      m.content = "Secure church management login and signup for the ECHAD SI Agent dashboard.";
      document.head.appendChild(m);
    } else {
      metaDesc.setAttribute(
        "content",
        "Secure church management login and signup for the ECHAD SI Agent dashboard."
      );
    }

    if (!canonical) {
      const link = document.createElement("link");
      link.rel = "canonical";
      link.href = window.location.href;
      document.head.appendChild(link);
    } else {
      canonical.href = window.location.href;
    }
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      const from = (location.state as any)?.from || "/dashboard";
      navigate(from, { replace: true });
    }
  }, [user, navigate, location.state]);

  // Login form
  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    formState: { errors: loginErrors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const onLogin = async (data: LoginFormData) => {
    setIsLoggingIn(true);
    try {
      const { error } = await signIn(data.email, data.password);
      if (error) {
        toast({
          title: "Sign in failed",
          description: error.message || "Please check your credentials and try again.",
          variant: "destructive",
        });
        return;
      }
      toast({ title: "Welcome back!", description: "You have been successfully signed in." });
      const from = (location.state as any)?.from || "/dashboard";
      navigate(from, { replace: true });
    } catch (e: any) {
      toast({ title: "Sign in failed", description: e.message || "Unexpected error.", variant: "destructive" });
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Signup form
  const {
    register: registerSignup,
    handleSubmit: handleSubmitSignup,
    formState: { errors: signupErrors },
  } = useForm<SignupFormData>({ resolver: zodResolver(signupSchema) });

  const onSignup = async (data: SignupFormData) => {
    setIsSigningUp(true);
    try {
      const { error } = await signUp(data.email, data.password, data.displayName);
      if (error) {
        toast({ title: "Sign up failed", description: error.message, variant: "destructive" });
        return;
      }

      // Attempt to assign default role if session exists (email confirmations disabled)
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData.session) {
        await supabase.rpc("assign_default_member_role");
        toast({ title: "Account created", description: "You're all set. Redirecting..." });
        navigate("/dashboard", { replace: true });
      } else {
        toast({
          title: "Confirm your email",
          description: "We sent you a confirmation link. Please verify to complete signup.",
        });
      }
    } catch (e: any) {
      toast({ title: "Sign up failed", description: e.message || "Unexpected error.", variant: "destructive" });
    } finally {
      setIsSigningUp(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-church-blue/5 flex items-center justify-center p-4">
      <main className="w-full max-w-md" role="main">
        <header className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-4" aria-label="Go to home">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-sm">
              <BookOpen className="h-6 w-6 text-primary-foreground" aria-hidden="true" />
            </div>
            <span className="text-2xl font-bold text-primary">ECHAD SI Agent</span>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Church Management Login and Signup</h1>
          <p className="text-muted-foreground">Access or create your church management account</p>
        </header>

        <section aria-label="Authentication forms">
          <Tabs defaultValue={defaultTab} className="w-full">
            
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Sign In</CardTitle>
                  <CardDescription>Enter your email and password to access your account</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitLogin(onLogin)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email Address</Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="pastor@yourchurch.com"
                        autoComplete="email"
                        {...registerLogin("email")}
                        className={loginErrors.email ? "border-destructive" : ""}
                        aria-invalid={!!loginErrors.email}
                      />
                      {loginErrors.email && (
                        <p className="text-sm text-destructive">{loginErrors.email.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="login-password"
                          type={showLoginPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          autoComplete="current-password"
                          {...registerLogin("password")}
                          className={loginErrors.password ? "border-destructive" : ""}
                          aria-invalid={!!loginErrors.password}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowLoginPassword((s) => !s)}
                          aria-label={showLoginPassword ? "Hide password" : "Show password"}
                        >
                          {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      {loginErrors.password && (
                        <p className="text-sm text-destructive">{loginErrors.password.message}</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                        Forgot password?
                      </Link>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoggingIn}>
                      {isLoggingIn ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="signup">
              <Card>
                <CardHeader>
                  <CardTitle>Create Account</CardTitle>
                  <CardDescription>Sign up with your email to start managing your church</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitSignup(onSignup)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Display Name</Label>
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="e.g. Pastor John Doe"
                        autoComplete="name"
                        {...registerSignup("displayName")}
                      />
                      {signupErrors.displayName && (
                        <p className="text-sm text-destructive">{signupErrors.displayName.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email Address</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="pastor@yourchurch.com"
                        autoComplete="email"
                        {...registerSignup("email")}
                        className={signupErrors.email ? "border-destructive" : ""}
                        aria-invalid={!!signupErrors.email}
                      />
                      {signupErrors.email && (
                        <p className="text-sm text-destructive">{signupErrors.email.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="signup-password"
                          type={showSignupPassword ? "text" : "password"}
                          placeholder="Create a strong password"
                          autoComplete="new-password"
                          {...registerSignup("password")}
                          className={signupErrors.password ? "border-destructive" : ""}
                          aria-invalid={!!signupErrors.password}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowSignupPassword((s) => !s)}
                          aria-label={showSignupPassword ? "Hide password" : "Show password"}
                        >
                          {showSignupPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      {signupErrors.password && (
                        <p className="text-sm text-destructive">{signupErrors.password.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-confirm">Confirm Password</Label>
                      <Input
                        id="signup-confirm"
                        type="password"
                        placeholder="Re-enter your password"
                        autoComplete="new-password"
                        {...registerSignup("confirmPassword")}
                        className={signupErrors.confirmPassword ? "border-destructive" : ""}
                        aria-invalid={!!signupErrors.confirmPassword}
                      />
                      {signupErrors.confirmPassword && (
                        <p className="text-sm text-destructive">{signupErrors.confirmPassword.message}</p>
                      )}
                    </div>

                    <Button type="submit" className="w-full" disabled={isSigningUp}>
                      {isSigningUp ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      By signing up, you agree to our terms and privacy policy.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-4 p-4 bg-muted/50 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">
              Sign in or create an account with your church credentials.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AuthPage;
