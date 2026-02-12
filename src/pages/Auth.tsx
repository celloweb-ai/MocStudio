import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, User, AlertCircle, Loader2, ArrowLeft, Sun, Moon, Globe } from "lucide-react";
import loginLogo from "@/assets/login-logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const resetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;
type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

type AuthView = "main" | "forgot-password" | "reset-password";

export default function Auth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, signIn, signUp, resetPassword, updatePassword, loading: authLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [view, setView] = useState<AuthView>("main");

  useEffect(() => {
    if (searchParams.get("type") === "recovery") {
      setView("reset-password");
    }
  }, [searchParams]);

  useEffect(() => {
    if (user && view !== "reset-password") {
      navigate("/");
    }
  }, [user, navigate, view]);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { fullName: "", email: "", password: "", confirmPassword: "" },
  });

  const forgotForm = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const resetForm = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);
    const { error } = await signIn(data.email, data.password);
    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        setError(t("auth.invalidCredentials"));
      } else if (error.message.includes("Email not confirmed")) {
        setError(t("auth.emailNotConfirmed"));
      } else {
        setError(error.message);
      }
    }
    setIsLoading(false);
  };

  const handleSignup = async (data: SignupFormData) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    const { error } = await signUp(data.email, data.password, data.fullName);
    if (error) {
      if (error.message.includes("already registered")) {
        setError(t("auth.alreadyRegistered"));
      } else {
        setError(error.message);
      }
    } else {
      setSuccessMessage(t("auth.accountCreated"));
      signupForm.reset();
    }
    setIsLoading(false);
  };

  const handleForgotPassword = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    const { error } = await resetPassword(data.email);
    if (error) {
      setError(error.message);
    } else {
      setSuccessMessage(t("auth.resetLinkSent"));
    }
    setIsLoading(false);
  };

  const handleResetPassword = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    const { error } = await updatePassword(data.password);
    if (error) {
      setError(error.message);
    } else {
      setSuccessMessage(t("auth.passwordUpdated"));
      setTimeout(() => navigate("/"), 2000);
    }
    setIsLoading(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4 relative">
      {/* Top-right controls */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleLanguage}
          className="text-muted-foreground hover:text-foreground"
          title={language === "en" ? "Português" : "English"}
        >
          <Globe className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="text-muted-foreground hover:text-foreground"
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-2">
            <img src={loginLogo} alt="MOC Studio" className="h-28 w-auto object-contain" />
          </div>
          <p className="text-muted-foreground text-sm">{t("auth.platform")}</p>
        </div>

        <Card className="border-border/50 shadow-xl">
          {/* Forgot Password View */}
          {view === "forgot-password" && (
            <>
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl">{t("auth.forgotPasswordTitle")}</CardTitle>
                <CardDescription>{t("auth.forgotPasswordDesc")}</CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                {successMessage && (
                  <Alert className="mb-4 border-primary/50 bg-primary/10">
                    <AlertDescription className="text-primary">{successMessage}</AlertDescription>
                  </Alert>
                )}
                <Form {...forgotForm}>
                  <form onSubmit={forgotForm.handleSubmit(handleForgotPassword)} className="space-y-4">
                    <FormField
                      control={forgotForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("auth.email")}</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input {...field} type="email" placeholder={t("auth.enterEmail")} className="pl-10" disabled={isLoading} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full gradient-primary" disabled={isLoading}>
                      {isLoading ? (
                        <><Loader2 className="h-4 w-4 mr-2 animate-spin" />{t("auth.sending")}</>
                      ) : t("auth.sendResetLink")}
                    </Button>
                  </form>
                </Form>
                <Button
                  variant="ghost"
                  className="w-full mt-4 text-muted-foreground"
                  onClick={() => { setView("main"); setError(null); setSuccessMessage(null); }}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {t("auth.backToSignIn")}
                </Button>
              </CardContent>
            </>
          )}

          {/* Reset Password View */}
          {view === "reset-password" && (
            <>
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl">{t("auth.setNewPassword")}</CardTitle>
                <CardDescription>{t("auth.setNewPasswordDesc")}</CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                {successMessage && (
                  <Alert className="mb-4 border-primary/50 bg-primary/10">
                    <AlertDescription className="text-primary">{successMessage}</AlertDescription>
                  </Alert>
                )}
                <Form {...resetForm}>
                  <form onSubmit={resetForm.handleSubmit(handleResetPassword)} className="space-y-4">
                    <FormField
                      control={resetForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("auth.newPassword")}</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input {...field} type="password" placeholder={t("auth.enterNewPassword")} className="pl-10" disabled={isLoading} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={resetForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("auth.confirmPassword")}</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input {...field} type="password" placeholder={t("auth.confirmNewPassword")} className="pl-10" disabled={isLoading} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full gradient-primary" disabled={isLoading}>
                      {isLoading ? (
                        <><Loader2 className="h-4 w-4 mr-2 animate-spin" />{t("auth.updating")}</>
                      ) : t("auth.updatePassword")}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </>
          )}

          {/* Main Login/Signup View */}
          {view === "main" && (
            <>
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl">{t("auth.welcome")}</CardTitle>
                <CardDescription>{t("auth.subtitle")}</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="login">{t("auth.signIn")}</TabsTrigger>
                    <TabsTrigger value="signup">{t("auth.signUp")}</TabsTrigger>
                  </TabsList>

                  {error && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {successMessage && (
                    <Alert className="mb-4 border-primary/50 bg-primary/10">
                      <AlertDescription className="text-primary">{successMessage}</AlertDescription>
                    </Alert>
                  )}

                  <TabsContent value="login">
                    <Form {...loginForm}>
                      <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                        <FormField
                          control={loginForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("auth.email")}</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  <Input {...field} type="email" placeholder={t("auth.enterEmail")} className="pl-10" disabled={isLoading} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={loginForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center justify-between">
                                <FormLabel>{t("auth.password")}</FormLabel>
                                <Button
                                  type="button"
                                  variant="link"
                                  className="px-0 h-auto text-xs text-muted-foreground hover:text-primary"
                                  onClick={() => { setView("forgot-password"); setError(null); setSuccessMessage(null); }}
                                >
                                  {t("auth.forgotPassword")}
                                </Button>
                              </div>
                              <FormControl>
                                <div className="relative">
                                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  <Input {...field} type="password" placeholder={t("auth.enterPassword")} className="pl-10" disabled={isLoading} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" className="w-full gradient-primary" disabled={isLoading}>
                          {isLoading ? (
                            <><Loader2 className="h-4 w-4 mr-2 animate-spin" />{t("auth.signingIn")}</>
                          ) : t("auth.signIn")}
                        </Button>
                      </form>
                    </Form>
                  </TabsContent>

                  <TabsContent value="signup">
                    <Form {...signupForm}>
                      <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
                        <FormField
                          control={signupForm.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("auth.fullName")}</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  <Input {...field} placeholder={t("auth.enterFullName")} className="pl-10" disabled={isLoading} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={signupForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("auth.email")}</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  <Input {...field} type="email" placeholder={t("auth.enterEmail")} className="pl-10" disabled={isLoading} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={signupForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("auth.password")}</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  <Input {...field} type="password" placeholder={t("auth.createPassword")} className="pl-10" disabled={isLoading} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={signupForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("auth.confirmPassword")}</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  <Input {...field} type="password" placeholder={t("auth.confirmYourPassword")} className="pl-10" disabled={isLoading} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" className="w-full gradient-primary" disabled={isLoading}>
                          {isLoading ? (
                            <><Loader2 className="h-4 w-4 mr-2 animate-spin" />{t("auth.creatingAccount")}</>
                          ) : t("auth.createAccount")}
                        </Button>
                      </form>
                    </Form>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="text-center text-xs text-muted-foreground">
                <p className="w-full">
                  {t("auth.termsNotice")}
                </p>
              </CardFooter>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
