'use client';

import { useBirthday } from '@/contexts/BirthdayContext';
import { useSettings } from '@/contexts/SettingsContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useState } from 'react';
import Link from 'next/link';
import { Birthday } from '@/types/Birthday';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, CheckCircleIcon, BellIcon } from 'lucide-react';

export default function CheckupPage() {
  const { birthdays, loading: birthdaysLoading } = useBirthday();
  const { settings, loading: settingsLoading } = useSettings();
  const { toast } = useToast();
  const [processing, setProcessing] = useState(false);

  const shouldSendNotification = (birthday: Birthday) => {
    const birthDate = new Date(birthday.date);
    const today = new Date();
    const lastNotified = birthday.lastNotified ? new Date(birthday.lastNotified) : null;
    
    // Calculate days until birthday
    const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    if (nextBirthday < today) {
      nextBirthday.setFullYear(today.getFullYear() + 1);
    }
    const daysUntil = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    // Check if notification should be sent
    if (daysUntil <= settings.reminderDays) {
      // If never notified or last notification was more than reminderDays ago
      if (!lastNotified || 
          Math.ceil((today.getTime() - lastNotified.getTime()) / (1000 * 60 * 60 * 24)) >= settings.reminderDays) {
        return true;
      }
    }
    return false;
  };

  const getDaysUntilBirthday = (date: string) => {
    const birthDate = new Date(date);
    const today = new Date();
    const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    if (nextBirthday < today) {
      nextBirthday.setFullYear(today.getFullYear() + 1);
    }
    return Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  const checkBirthdays = async () => {
    if (!settings.emailNotifications || !settings.emailAddress) {
      toast({
        title: "Email notifications are disabled",
        description: "Please enable email notifications and set an email address in settings.",
        variant: "destructive"
      });
      return;
    }

    setProcessing(true);
    let sentCount = 0;

    try {
      for (const birthday of birthdays) {
        if (shouldSendNotification(birthday)) {
          const response = await fetch('/api/send-birthday-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ birthday, settings }),
          });

          if (response.ok) {
            sentCount++;
          }
        }
      }

      toast({
        title: "Birthday check completed",
        description: `Sent ${sentCount} birthday notification${sentCount !== 1 ? 's' : ''}.`
      });
    } catch (error) {
      toast({
        title: "Error checking birthdays",
        description: "An error occurred while checking birthdays.",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  if (birthdaysLoading || settingsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const sortedBirthdays = [...birthdays].sort((a, b) => {
    return getDaysUntilBirthday(a.date) - getDaysUntilBirthday(b.date);
  });

  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Birthday Checkup</h1>
          <p className="text-muted-foreground">
            Check and send birthday notifications to your contacts.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellIcon className="h-5 w-5" />
            Notification Control
          </CardTitle>
          <CardDescription>
            Send notifications for upcoming birthdays.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={checkBirthdays} 
            disabled={processing}
            className="w-full md:w-auto"
            size="lg"
          >
            {processing ? "Checking birthdays..." : "Check & Send Notifications"}
          </Button>
        </CardContent>
      </Card>

      {birthdays.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-6">
              <p className="text-muted-foreground">No birthdays found.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Birthday List
            </CardTitle>
            <CardDescription>
              Upcoming birthdays sorted by date.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {sortedBirthdays.map((birthday) => {
              const daysUntil = getDaysUntilBirthday(birthday.date);
              return (
                <div 
                  key={birthday.id} 
                  className={`p-4 rounded-lg border ${
                    shouldSendNotification(birthday) 
                      ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10' 
                      : birthday.lastNotified 
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/10'
                        : 'border-gray-200 dark:border-gray-800'
                  }`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{birthday.name}</h3>
                        <Badge variant={daysUntil <= 7 ? "destructive" : daysUntil <= 30 ? "yellow" : "secondary"}>
                          {daysUntil} days
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Birthday: {new Date(birthday.date).toLocaleDateString()}
                      </p>
                      {birthday.lastNotified && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <CheckCircleIcon className="h-3 w-3" />
                          Last notified: {new Date(birthday.lastNotified).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="text-sm">
                      {shouldSendNotification(birthday) && (
                        <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                          Notification pending
                        </Badge>
                      )}
                      {birthday.lastNotified && !shouldSendNotification(birthday) && (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          Notified
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/edit-birthday/${birthday.id}`}>
                        Edit
                      </Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
