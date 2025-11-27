"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import RootLayout from "@/app/LayoutPage";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    privateContent: false,
    privatePinned: false,
    privateLiked: false,
    notificationsEnabled: true,
    emailUpdates: true,
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <RootLayout>
      <div className="flex">
        <main className="ml-64 flex-1 p-8">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-foreground mb-8">
              Settings
            </h1>

            {/* Privacy Settings */}
            <Card className="border-border mb-6">
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>
                  Control who can see your content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">
                      Private Content
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Hide your uploaded content
                    </p>
                  </div>
                  <Switch
                    checked={settings.privateContent}
                    onChange={() => handleToggle("privateContent")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">
                      Private Pinned
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Hide your pinned content
                    </p>
                  </div>
                  <Switch
                    checked={settings.privatePinned}
                    onChange={() => handleToggle("privatePinned")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Private Liked</p>
                    <p className="text-sm text-muted-foreground">
                      Hide your liked content
                    </p>
                  </div>
                  <Switch
                    checked={settings.privateLiked}
                    onChange={() => handleToggle("privateLiked")}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                  Manage how you receive updates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">
                      Push Notifications
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Receive in-app notifications
                    </p>
                  </div>
                  <Switch
                    checked={settings.notificationsEnabled}
                    onChange={() => handleToggle("notificationsEnabled")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Email Updates</p>
                    <p className="text-sm text-muted-foreground">
                      Receive email notifications
                    </p>
                  </div>
                  <Switch
                    checked={settings.emailUpdates}
                    onChange={() => handleToggle("emailUpdates")}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-border mt-6 border-destructive/50">
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-destructive text-destructive-foreground hover:opacity-90">
                  Log Out
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-destructive text-destructive hover:bg-destructive/10 bg-transparent"
                >
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </RootLayout>
  );
}
