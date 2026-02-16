import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import loginLogo from "@/assets/login-logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { t } = useLanguage();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/");
  };

  const features = [
    t("login.feature1"),
    t("login.feature2"),
    t("login.feature3"),
    t("login.feature4"),
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f59e0b' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10 flex flex-col justify-between p-12">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center">
              <img src={loginLogo} alt="MOC Studio" className="h-12 w-12 object-contain" />
            </div>
            <div>
              <span className="text-2xl font-bold text-foreground">MOC Studio</span>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">{t("login.managementOfChange")}</p>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground leading-tight">
                {t("login.streamline")}
                <br />
                <span className="text-gradient">{t("login.changeManagement")}</span>
                <br />
                {t("login.operations")}
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-md">{t("login.platformDesc")}</p>

            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            © 2024 MOC Studio. Enterprise Oil & Gas Solutions.
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center">
              <img src={loginLogo} alt="MOC Studio" className="h-10 w-10 object-contain" />
            </div>
            <span className="text-xl font-bold text-foreground">MOC Studio</span>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-bold text-foreground">{t("login.welcomeBack")}</h2>
            <p className="text-muted-foreground mt-2">{t("login.signInToContinue")}</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t("login.email")}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">{t("login.password")}</Label>
                  <a href="#" className="text-sm text-primary hover:underline">{t("login.forgotPassword")}</a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="password" type={showPassword ? "text" : "password"} placeholder={t("login.enterPassword")} value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 pr-10" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">{t("login.keepSignedIn")}</label>
            </div>

            <Button type="submit" className="w-full gradient-primary text-primary-foreground h-11">
              {t("login.signIn")}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </form>

          <div className="glass-card rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground">
              <span className="text-primary font-medium">{t("login.demoMode")}</span> {t("login.demoNotice")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
