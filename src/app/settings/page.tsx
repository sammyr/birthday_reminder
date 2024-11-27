'use client';

import React, { useState } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from 'next/link';
import { ArrowLeft, Bell, Mail, Save, Clock, AlertCircle } from 'lucide-react';

export default function SettingsPage() {
  const { settings, updateSettings } = useSettings();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    reminderDays: settings.reminderDays,
    emailNotifications: settings.emailNotifications,
    emailTemplate: settings.emailTemplate,
    emailAddress: settings.emailAddress,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'reminderDays' ? parseInt(value, 10) : value,
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      emailNotifications: checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await updateSettings(formData);
      toast({
        title: 'Einstellungen gespeichert',
        description: 'Ihre Einstellungen wurden erfolgreich aktualisiert.',
      });
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Beim Speichern der Einstellungen ist ein Fehler aufgetreten.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Einstellungen</h1>
          <p className="text-muted-foreground mt-1">Verwalten Sie Ihre Benachrichtigungen und E-Mail-Einstellungen</p>
        </div>
        <Link
          href="/"
          className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zurück zum Kalender
        </Link>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <CardTitle>Benachrichtigungen</CardTitle>
            </div>
            <CardDescription>
              Legen Sie fest, wann und wie Sie an Geburtstage erinnert werden möchten
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="reminderDays" className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Erinnerung (Tage im Voraus)</span>
              </Label>
              <Input
                type="number"
                id="reminderDays"
                name="reminderDays"
                value={formData.reminderDays}
                onChange={handleInputChange}
                min={1}
                max={30}
                className="max-w-[200px]"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <CardTitle>E-Mail-Einstellungen</CardTitle>
            </div>
            <CardDescription>
              Konfigurieren Sie Ihre E-Mail-Benachrichtigungen
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="emailNotifications"
                    checked={formData.emailNotifications}
                    onCheckedChange={handleSwitchChange}
                  />
                  <div>
                    <Label htmlFor="emailNotifications" className="text-sm font-medium">
                      E-Mail-Benachrichtigungen {formData.emailNotifications ? 'aktiviert' : 'deaktiviert'}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {formData.emailNotifications 
                        ? 'Sie erhalten E-Mail-Benachrichtigungen für anstehende Geburtstage' 
                        : 'Aktivieren Sie diese Option, um E-Mail-Benachrichtigungen zu erhalten'}
                    </p>
                  </div>
                </div>
                {!formData.emailNotifications && (
                  <AlertCircle className="text-muted-foreground w-5 h-5" />
                )}
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="emailAddress">E-Mail-Adresse</Label>
                  <Input
                    type="email"
                    id="emailAddress"
                    name="emailAddress"
                    value={formData.emailAddress}
                    onChange={handleInputChange}
                    placeholder="ihre.email@beispiel.de"
                    className="max-w-md"
                  />
                </div>

                <Separator className="my-6" />

                <div className="space-y-2">
                  <Label htmlFor="emailTemplate">E-Mail-Vorlage</Label>
                  <div className="bg-gray-50 p-4 rounded-lg mb-2">
                    <h4 className="text-sm font-medium mb-2">Verfügbare Variablen:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <code className="bg-white px-2 py-1 rounded text-sm">{'{name}'}</code>
                      <code className="bg-white px-2 py-1 rounded text-sm">{'{date}'}</code>
                      <code className="bg-white px-2 py-1 rounded text-sm">{'{days_until}'}</code>
                    </div>
                  </div>
                  <Textarea
                    id="emailTemplate"
                    name="emailTemplate"
                    value={formData.emailTemplate}
                    onChange={handleInputChange}
                    placeholder="Beispiel: Hallo! Der Geburtstag von {name} ist in {days_until} Tagen am {date}."
                    className="min-h-[150px]"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Passen Sie die E-Mail-Vorlage an Ihre Bedürfnisse an. Die Variablen werden automatisch mit den entsprechenden Werten ersetzt.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSaving} className="min-w-[150px]">
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Wird gespeichert...' : 'Speichern'}
          </Button>
        </div>
      </form>
    </div>
  );
}
