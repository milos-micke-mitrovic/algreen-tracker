import { useState } from 'react';
import {
  Building2,
  Bell,
  Factory,
  Palette,
  Shield,
  Save,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { showToast } from '@/lib/toast';
import { useTenantStore } from '@/stores/tenant-store';

/**
 * Settings page with multiple tabs
 */
export function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const tenant = useTenantStore((s) => s.tenant);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Podešavanja</h1>
        <p className="text-muted-foreground">Upravljanje podešavanjima sistema</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="flex h-auto flex-wrap gap-1 bg-transparent p-0">
          <TabsTrigger value="general" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">Opšte</span>
          </TabsTrigger>
          <TabsTrigger value="production" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Factory className="h-4 w-4" />
            <span className="hidden sm:inline">Proizvodnja</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Obaveštenja</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Izgled</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Bezbednost</span>
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <GeneralSettings tenantName={tenant?.name} />
        </TabsContent>

        {/* Production Settings */}
        <TabsContent value="production">
          <ProductionSettings />
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance">
          <AppearanceSettings />
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <SecuritySettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function GeneralSettings({ tenantName }: { tenantName?: string }) {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    showToast.success('Podešavanja sačuvana');
    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informacije o firmi</CardTitle>
          <CardDescription>Osnovni podaci o vašoj firmi</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="companyName">Naziv firme</Label>
              <Input id="companyName" defaultValue={tenantName || ''} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pib">PIB</Label>
              <Input id="pib" placeholder="123456789" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Adresa</Label>
            <Textarea id="address" placeholder="Ulica i broj, grad, poštanski broj" rows={2} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Telefon</Label>
              <Input id="phone" placeholder="+381 11 123 4567" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="info@firma.rs" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Regionalna podešavanja</CardTitle>
          <CardDescription>Jezik, vremenska zona i format datuma</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Jezik</Label>
              <Select defaultValue="sr">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sr">Srpski (latinica)</SelectItem>
                  <SelectItem value="sr-cyrl">Srpski (ćirilica)</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Vremenska zona</Label>
              <Select defaultValue="europe-belgrade">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="europe-belgrade">Europe/Belgrade (CET)</SelectItem>
                  <SelectItem value="utc">UTC</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Format datuma</Label>
              <Select defaultValue="dd-mm-yyyy">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dd-mm-yyyy">DD.MM.YYYY</SelectItem>
                  <SelectItem value="mm-dd-yyyy">MM/DD/YYYY</SelectItem>
                  <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} loading={isSaving}>
          <Save className="mr-2 h-4 w-4" />
          Sačuvaj izmene
        </Button>
      </div>
    </div>
  );
}

function ProductionSettings() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    showToast.success('Podešavanja proizvodnje sačuvana');
    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Podešavanja proizvodnje</CardTitle>
          <CardDescription>Konfigurisanje proizvodnog procesa</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Automatsko pokretanje koraka</Label>
              <p className="text-sm text-muted-foreground">
                Automatski pokreni sledeći korak nakon završetka prethodnog
              </p>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Obavezne napomene za probleme</Label>
              <p className="text-sm text-muted-foreground">
                Zahtevaj da radnik unese napomenu prilikom prijave problema
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Prikaz svih naloga na tabletu</Label>
              <p className="text-sm text-muted-foreground">
                Radnici vide sve naloge, ne samo one za svoje odeljenje
              </p>
            </div>
            <Switch />
          </div>

          <div className="space-y-2">
            <Label>Podrazumevani prioritet naloga</Label>
            <Select defaultValue="normal">
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Nizak</SelectItem>
                <SelectItem value="normal">Normalan</SelectItem>
                <SelectItem value="high">Visok</SelectItem>
                <SelectItem value="urgent">Hitan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Upozorenje za rok (sati pre isteka)</Label>
            <Input type="number" defaultValue={24} className="w-full sm:w-48" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Proizvodna linija</CardTitle>
          <CardDescription>
            Koraci u proizvodnom procesu - za promenu redosleda kontaktirajte administratora
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border bg-muted/30 p-4 text-center text-muted-foreground">
            Konfiguracija proizvodne linije dolazi uskoro...
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} loading={isSaving}>
          <Save className="mr-2 h-4 w-4" />
          Sačuvaj izmene
        </Button>
      </div>
    </div>
  );
}

function NotificationSettings() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    showToast.success('Podešavanja obaveštenja sačuvana');
    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Email obaveštenja</CardTitle>
          <CardDescription>Podesite koja email obaveštenja želite da primate</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Novi nalog</Label>
              <p className="text-sm text-muted-foreground">
                Obaveštenje kada se kreira novi nalog
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Problem prijavljen</Label>
              <p className="text-sm text-muted-foreground">
                Obaveštenje kada radnik prijavi problem
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Nalog završen</Label>
              <p className="text-sm text-muted-foreground">
                Obaveštenje kada se nalog završi
              </p>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Probijanje roka</Label>
              <p className="text-sm text-muted-foreground">
                Obaveštenje kada nalog probije rok
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Push obaveštenja</CardTitle>
          <CardDescription>Obaveštenja u aplikaciji</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Omogući push obaveštenja</Label>
              <p className="text-sm text-muted-foreground">
                Primajte obaveštenja u real-time
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Zvuk obaveštenja</Label>
              <p className="text-sm text-muted-foreground">
                Reprodukuj zvuk za nova obaveštenja
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} loading={isSaving}>
          <Save className="mr-2 h-4 w-4" />
          Sačuvaj izmene
        </Button>
      </div>
    </div>
  );
}

function AppearanceSettings() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    // In real app, this would update the theme
    showToast.success(`Tema promenjena na: ${newTheme}`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tema</CardTitle>
          <CardDescription>Izaberite svetlu, tamnu ili sistemsku temu</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            {(['light', 'dark', 'system'] as const).map((t) => (
              <button
                key={t}
                onClick={() => handleThemeChange(t)}
                className={cn(
                  'flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors',
                  theme === t
                    ? 'border-primary bg-primary/5'
                    : 'border-muted hover:border-muted-foreground/50'
                )}
              >
                <div
                  className={cn(
                    'h-16 w-full rounded-md',
                    t === 'light' && 'bg-white border',
                    t === 'dark' && 'bg-zinc-900',
                    t === 'system' && 'bg-gradient-to-r from-white to-zinc-900'
                  )}
                />
                <span className="text-sm font-medium">
                  {t === 'light' && 'Svetla'}
                  {t === 'dark' && 'Tamna'}
                  {t === 'system' && 'Sistemska'}
                </span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tablet prikaz</CardTitle>
          <CardDescription>Podešavanja za tablet interfejs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Veliki font</Label>
              <p className="text-sm text-muted-foreground">
                Povećaj veličinu fonta na tabletu
              </p>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Visoki kontrast</Label>
              <p className="text-sm text-muted-foreground">
                Pojačaj kontrast za bolju vidljivost
              </p>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Animacije</Label>
              <p className="text-sm text-muted-foreground">
                Prikaži animacije i tranzicije
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SecuritySettings() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    showToast.success('Bezbednosna podešavanja sačuvana');
    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sesija i pristup</CardTitle>
          <CardDescription>Podešavanja bezbednosti sesije</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Automatsko odjavljivanje (minuta neaktivnosti)</Label>
            <Select defaultValue="30">
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minuta</SelectItem>
                <SelectItem value="30">30 minuta</SelectItem>
                <SelectItem value="60">1 sat</SelectItem>
                <SelectItem value="120">2 sata</SelectItem>
                <SelectItem value="never">Nikada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Pamti uređaj</Label>
              <p className="text-sm text-muted-foreground">
                Ne zahtevaj ponovnu prijavu sa poznatih uređaja
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lozinke</CardTitle>
          <CardDescription>Politika lozinki za korisnike</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Minimalna dužina lozinke</Label>
            <Select defaultValue="8">
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6">6 karaktera</SelectItem>
                <SelectItem value="8">8 karaktera</SelectItem>
                <SelectItem value="10">10 karaktera</SelectItem>
                <SelectItem value="12">12 karaktera</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Zahtevaj specijalne karaktere</Label>
              <p className="text-sm text-muted-foreground">
                Lozinka mora sadržati broj i specijalni karakter
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="space-y-2">
            <Label>Istek lozinke (dana)</Label>
            <Select defaultValue="90">
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 dana</SelectItem>
                <SelectItem value="60">60 dana</SelectItem>
                <SelectItem value="90">90 dana</SelectItem>
                <SelectItem value="never">Nikada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} loading={isSaving}>
          <Save className="mr-2 h-4 w-4" />
          Sačuvaj izmene
        </Button>
      </div>
    </div>
  );
}
