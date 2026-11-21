"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { AttendeeSettings } from "./actions";
import { updateAttendeeSettings } from "./actions";

type Props = { initial: AttendeeSettings };

export function AttendeeSettingsForm({ initial }: Props) {
  const [settings, setSettings] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const [saving, setSaving] = useState(false);

  const dirty = JSON.stringify(settings) !== JSON.stringify(saved);

  function set(key: keyof AttendeeSettings, value: boolean) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  async function save() {
    setSaving(true);
    const result = await updateAttendeeSettings(settings);
    setSaving(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    setSaved(settings);
    toast.success("Preferences saved");
  }

  const rows: Array<{ key: keyof AttendeeSettings; label: string; description: string }> = [
    { key: "emailNotifications", label: "Email Notifications", description: "Receive email updates about your registered events" },
    { key: "marketingEmails", label: "Marketing Emails", description: "Receive emails about new events and features" },
    { key: "publicProfile", label: "Public Profile", description: "Allow other users to see your profile" },
    { key: "showAttendance", label: "Show Event Attendance", description: "Show which events you're attending to other users" },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>Choose what updates you want to receive and what others can see</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {rows.map((row) => (
            <div key={row.key} className="flex items-center justify-between space-x-2">
              <Label htmlFor={row.key} className="flex flex-col space-y-1">
                <span>{row.label}</span>
                <span className="text-sm text-muted-foreground">{row.description}</span>
              </Label>
              <Switch
                id={row.key}
                checked={settings[row.key]}
                onCheckedChange={(value) => set(row.key, value)}
                className="border-white/10 data-[state=checked]:bg-p1"
              />
            </div>
          ))}
        </CardContent>
      </Card>
      <div className="flex items-center gap-4">
        <Button onClick={save} disabled={!dirty || saving} className="rounded-md bg-p1 font-semibold text-[#05121a] hover:bg-[#7bf6ff]">
          {saving ? "Saving..." : "Save preferences"}
        </Button>
        {dirty && <span className="text-sm text-[#8b93a3]">Unsaved changes</span>}
      </div>
    </div>
  );
}
