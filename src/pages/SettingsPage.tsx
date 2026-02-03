import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bell, Lock, User, CreditCard, Palette, Languages } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "next-themes";
import { useLanguage, Language } from "@/contexts/LanguageContext";

const SettingsPage = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(true);
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully",
    });
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value as Language);
    toast({
      title: t("settings.title"),
      description: `Language changed to ${value === "en" ? "English" : value === "hi" ? "हिंदी" : "Hinglish"}`,
    });
  };

  return (
    <DashboardLayout>
      <div className="p-6 md:p-10">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black mb-2">{t("settings.title")}</h1>
          <p className="text-base text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <Tabs defaultValue="account" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 lg:w-auto gap-1">
            <TabsTrigger value="account" className="gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">{t("settings.account")}</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Lock className="w-4 h-4" />
              <span className="hidden sm:inline">{t("settings.security")}</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">{t("settings.notifications")}</span>
            </TabsTrigger>
            <TabsTrigger value="billing" className="gap-2">
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline">{t("settings.billing")}</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="gap-2">
              <Palette className="w-4 h-4" />
              <span className="hidden sm:inline">{t("settings.appearance")}</span>
            </TabsTrigger>
            <TabsTrigger value="language" className="gap-2">
              <Languages className="w-4 h-4" />
              <span className="hidden sm:inline">{t("settings.language")}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  Update your account details and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" placeholder="Enter your username" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company Name</Label>
                  <Input id="company" placeholder="Enter your company name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select defaultValue="utc">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utc">UTC</SelectItem>
                      <SelectItem value="est">Eastern Time</SelectItem>
                      <SelectItem value="pst">Pacific Time</SelectItem>
                      <SelectItem value="cst">Central Time</SelectItem>
                      <SelectItem value="ist">India Standard Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleSaveSettings}>Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>Change your account password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
                <Button onClick={handleSaveSettings}>Update Password</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>
                  Add an extra layer of security to your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Enable 2FA</p>
                    <p className="text-sm text-muted-foreground">
                      Secure your account with two-factor authentication
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
                <CardDescription>
                  Manage your email notification preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Activity Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Get notified about account activity
                    </p>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Marketing Emails</p>
                    <p className="text-sm text-muted-foreground">
                      Receive news and product updates
                    </p>
                  </div>
                  <Switch
                    checked={marketingEmails}
                    onCheckedChange={setMarketingEmails}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Push Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Get push notifications on your devices
                    </p>
                  </div>
                  <Switch
                    checked={pushNotifications}
                    onCheckedChange={setPushNotifications}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>Manage your payment information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border border-border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-8 rounded bg-primary/10 flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">•••• •••• •••• 4242</p>
                        <p className="text-sm text-muted-foreground">Expires 12/25</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
                <Button variant="outline">Add Payment Method</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Billing History</CardTitle>
                <CardDescription>View your past invoices and payments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-lg border border-border"
                    >
                      <div>
                        <p className="font-medium">Invoice #{1234 + i}</p>
                        <p className="text-sm text-muted-foreground">
                          March {i}, 2024
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="font-medium">₹499</p>
                        <Button variant="ghost" size="sm">
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("settings.theme")}</CardTitle>
                <CardDescription>Choose your preferred theme</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Theme Mode</Label>
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="language" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Languages className="w-5 h-5" />
                  {t("settings.language")}
                </CardTitle>
                <CardDescription>{t("settings.languageDesc")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label>{t("settings.language")}</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        language === "en" ? "border-2 border-accent bg-accent/5" : ""
                      }`}
                      onClick={() => handleLanguageChange("en")}
                    >
                      <CardContent className="p-4 text-center">
                        <div className="text-3xl mb-2">🇬🇧</div>
                        <p className="font-bold">English</p>
                        <p className="text-sm text-muted-foreground">International</p>
                      </CardContent>
                    </Card>
                    <Card
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        language === "hi" ? "border-2 border-accent bg-accent/5" : ""
                      }`}
                      onClick={() => handleLanguageChange("hi")}
                    >
                      <CardContent className="p-4 text-center">
                        <div className="text-3xl mb-2">🇮🇳</div>
                        <p className="font-bold">हिंदी</p>
                        <p className="text-sm text-muted-foreground">Hindi</p>
                      </CardContent>
                    </Card>
                    <Card
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        language === "hinglish" ? "border-2 border-accent bg-accent/5" : ""
                      }`}
                      onClick={() => handleLanguageChange("hinglish")}
                    >
                      <CardContent className="p-4 text-center">
                        <div className="text-3xl mb-2">🔀</div>
                        <p className="font-bold">Hinglish</p>
                        <p className="text-sm text-muted-foreground">Hindi + English</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-2">Preview:</p>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>• {t("nav.home")} - {t("nav.dashboard")}</p>
                    <p>• {t("common.buyNow")} - {t("common.viewDetails")}</p>
                    <p>• {t("section.featuredTools")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
