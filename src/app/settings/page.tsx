'use client';

import { useSettings } from '@/contexts/SettingsContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';

export default function SettingsPage() {
  const { settings, updateSettings, loading } = useSettings();
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    try {
      await updateSettings({
        ...settings,
        reminderDays: Number(formData.get('reminderDays')),
        emailNotifications: formData.get('emailNotifications') === 'on',
        emailAddress: formData.get('emailAddress') as string,
        emailTemplate: formData.get('emailTemplate') as string,
      });

      toast({
        title: 'Settings saved',
        description: 'Your settings have been updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save settings. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your notification preferences and email settings.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>
              Configure when and how you want to be notified about upcoming birthdays.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reminderDays">Reminder Days</Label>
              <Input
                type="number"
                id="reminderDays"
                name="reminderDays"
                defaultValue={settings.reminderDays}
                min={1}
                max={30}
                className="max-w-[180px]"
              />
              <p className="text-sm text-muted-foreground">
                Get notified this many days before each birthday.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Email Notifications</CardTitle>
            <CardDescription>
              Set up email notifications for birthday reminders.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive email reminders for upcoming birthdays.
                </p>
              </div>
              <Switch
                name="emailNotifications"
                defaultChecked={settings.emailNotifications}
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="emailAddress">Email Address</Label>
              <Input
                type="email"
                id="emailAddress"
                name="emailAddress"
                placeholder="your@email.com"
                defaultValue={settings.emailAddress}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emailTemplate">Email Template</Label>
              <Textarea
                id="emailTemplate"
                name="emailTemplate"
                defaultValue={settings.emailTemplate}
                rows={6}
                className="font-mono text-sm"
              />
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Available placeholders:</p>
                <ul className="list-disc list-inside">
                  <li>{'{name}'} - Person's name</li>
                  <li>{'{age}'} - Age they will turn</li>
                  <li>{'{days}'} - Days until birthday</li>
                  <li>{'{sender}'} - Your email address</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" size="lg">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
