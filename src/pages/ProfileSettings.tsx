import { useState } from "react";
import { User, Mail, Building2, Briefcase, Phone, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfiles";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ProfileSettings() {
  const { user } = useAuth();
  const { data: profile, refetch } = useProfile();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    department: profile?.department || "",
    position: profile?.position || "",
    phone: profile?.phone || "",
    bio: profile?.bio || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...formData,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast.success(t("common.saveSuccess"));
      refetch();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(t("common.errorOccurred"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl py-8 space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gradient-cyber">
          {t("topbar.profileSettings")}
        </h1>
        <p className="text-muted-foreground mt-2">
          {t("common.updateYourProfile")}
        </p>
      </div>

      <div className="grid gap-6">
        {/* Account Information Card */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              {t("profile.accountInformation")}
            </CardTitle>
            <CardDescription>
              {t("profile.accountDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {t("auth.email")}
              </Label>
              <Input
                id="email"
                type="email"
                value={user?.email || ""}
                disabled
                className="bg-muted/50 cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground">
                {t("profile.emailCannotChange")}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information Card */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              {t("profile.personalInformation")}
            </CardTitle>
            <CardDescription>
              {t("profile.personalDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="full_name">
                    {t("auth.fullName")}
                  </Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder={t("auth.enterFullName")}
                    className="input-modern"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {t("profile.phone")}
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+55 (21) 99999-9999"
                    className="input-modern"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department" className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    {t("users.department")}
                  </Label>
                  <Input
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder={t("profile.enterDepartment")}
                    className="input-modern"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position" className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    {t("profile.position")}
                  </Label>
                  <Input
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    placeholder={t("profile.enterPosition")}
                    className="input-modern"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">
                  {t("profile.bio")}
                </Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder={t("profile.enterBio")}
                  rows={4}
                  className="input-modern resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  {t("profile.bioDesc")}
                </p>
              </div>

              <Separator className="divider-glow" />

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.history.back()}
                  className="btn-glass"
                >
                  {t("common.cancel")}
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="btn-3d"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("common.saving")}
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {t("common.save")}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Security Card */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>{t("profile.security")}</CardTitle>
            <CardDescription>
              {t("profile.securityDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              className="btn-glass"
              onClick={() => {
                window.location.href = '/auth/reset-password';
              }}
            >
              {t("profile.changePassword")}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
