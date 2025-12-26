import { useState } from 'react';
import { AlertCircle, Check, Info, TriangleAlert, Trash2, Edit, Plus, MoreHorizontal, Mail, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input, PasswordInput } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectField,
  SearchableSelect,
  MultiSelect,
} from '@/components/ui/select';
import { DatePicker, TimePicker, DateTimePicker } from '@/components/ui/date-picker';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { ColumnDef } from '@tanstack/react-table';
import { DataTable, DataTableColumnHeader } from '@/components/ui/table';
import { showToast } from '@/lib/toast';

const gradovi = [
  { value: 'beograd', label: 'Beograd' },
  { value: 'novisad', label: 'Novi Sad' },
  { value: 'nis', label: 'Niš' },
  { value: 'kragujevac', label: 'Kragujevac' },
  { value: 'subotica', label: 'Subotica' },
];

const vestine = [
  { value: 'react', label: 'React' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'nodejs', label: 'Node.js' },
  { value: 'python', label: 'Python' },
  { value: 'sql', label: 'SQL' },
];

// Sample data for DataTable
interface Zaposleni {
  id: string;
  ime: string;
  email: string;
  uloga: string;
  status: 'aktivan' | 'pauza' | 'offline';
  sati: number;
}

const zaposleniData: Zaposleni[] = [
  { id: '1', ime: 'Marko Marković', email: 'marko@algreen.rs', uloga: 'Radnik', status: 'aktivan', sati: 40 },
  { id: '2', ime: 'Ana Anić', email: 'ana@algreen.rs', uloga: 'Radnik', status: 'pauza', sati: 32 },
  { id: '3', ime: 'Petar Petrović', email: 'petar@algreen.rs', uloga: 'Menadžer', status: 'offline', sati: 45 },
  { id: '4', ime: 'Jovana Jovanović', email: 'jovana@algreen.rs', uloga: 'Radnik', status: 'aktivan', sati: 38 },
  { id: '5', ime: 'Milan Milanović', email: 'milan@algreen.rs', uloga: 'Radnik', status: 'aktivan', sati: 42 },
  { id: '6', ime: 'Sara Sarić', email: 'sara@algreen.rs', uloga: 'Dizajner', status: 'aktivan', sati: 35 },
  { id: '7', ime: 'Nikola Nikolić', email: 'nikola@algreen.rs', uloga: 'Developer', status: 'pauza', sati: 28 },
  { id: '8', ime: 'Jelena Jelenić', email: 'jelena@algreen.rs', uloga: 'HR', status: 'aktivan', sati: 40 },
  { id: '9', ime: 'Stefan Stefanović', email: 'stefan@algreen.rs', uloga: 'Radnik', status: 'offline', sati: 0 },
  { id: '10', ime: 'Maja Majić', email: 'maja@algreen.rs', uloga: 'Menadžer', status: 'aktivan', sati: 44 },
  { id: '11', ime: 'Luka Lukić', email: 'luka@algreen.rs', uloga: 'Radnik', status: 'aktivan', sati: 39 },
  { id: '12', ime: 'Nina Ninić', email: 'nina@algreen.rs', uloga: 'Developer', status: 'aktivan', sati: 41 },
];

const statusBadgeVariant = {
  aktivan: 'success',
  pauza: 'warning',
  offline: 'secondary',
} as const;

const statusLabels = {
  aktivan: 'Aktivan',
  pauza: 'Na pauzi',
  offline: 'Offline',
};

const zaposleniColumns: ColumnDef<Zaposleni>[] = [
  {
    accessorKey: 'ime',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ime" />
    ),
    cell: ({ row }) => <div className="font-medium">{row.getValue('ime')}</div>,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: 'uloga',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Uloga" />
    ),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as keyof typeof statusBadgeVariant;
      return <Badge variant={statusBadgeVariant[status]}>{statusLabels[status]}</Badge>;
    },
  },
  {
    accessorKey: 'sati',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sati" className="justify-end" />
    ),
    cell: ({ row }) => <div className="text-right">{row.getValue('sati')}</div>,
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const zaposleni = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <span className="sr-only">Otvori meni</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Akcije</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(zaposleni.email)}>
              Kopiraj email
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Izmeni
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Obriši
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function HomePage() {
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [clearableInput, setClearableInput] = useState('Tekst za brisanje');
  const [clearableTextarea, setClearableTextarea] = useState('Duži tekst za brisanje');
  const [radioValue, setRadioValue] = useState('option1');
  const [searchableValue, setSearchableValue] = useState('');
  const [multiValue, setMultiValue] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [selectedDateTime, setSelectedDateTime] = useState<Date>();

  return (
    <div className="space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">UI Komponente</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Pregled svih dostupnih komponenti u aplikaciji
        </p>
      </div>

      {/* Buttons */}
      <Section title="Button" description="Dugmići sa različitim varijantama, veličinama i ikonama">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button variant="default">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="success">Success</Button>
            <Button variant="warning">Warning</Button>
            <Button variant="info">Info</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm">Mali</Button>
            <Button size="default">Srednji</Button>
            <Button size="lg">Veliki</Button>
            <Button size="icon"><Plus className="h-4 w-4" /></Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button startIcon={<Plus className="h-4 w-4" />}>Sa početnom ikonom</Button>
            <Button endIcon={<Mail className="h-4 w-4" />}>Sa krajnjom ikonom</Button>
            <Button startIcon={<Search className="h-4 w-4" />} endIcon={<Check className="h-4 w-4" />}>
              Obe ikone
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button disabled>Onemogućen</Button>
            <Button variant="outline" disabled>Onemogućen</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button loading>Učitavanje</Button>
            <Button variant="secondary" loading>Učitavanje</Button>
            <Button variant="outline" loading>Učitavanje</Button>
          </div>
        </div>
      </Section>

      {/* Spinner */}
      <Section title="Spinner" description="Indikator učitavanja">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Spinner size="sm" />
            <span className="text-sm text-muted-foreground">Mali</span>
          </div>
          <div className="flex items-center gap-2">
            <Spinner size="md" />
            <span className="text-sm text-muted-foreground">Srednji</span>
          </div>
          <div className="flex items-center gap-2">
            <Spinner size="lg" />
            <span className="text-sm text-muted-foreground">Veliki</span>
          </div>
          <div className="flex items-center gap-2">
            <Spinner className="text-primary" />
            <span className="text-sm text-muted-foreground">Primary</span>
          </div>
          <div className="flex items-center gap-2">
            <Spinner className="text-success" />
            <span className="text-sm text-muted-foreground">Success</span>
          </div>
        </div>
      </Section>

      {/* Alerts */}
      <Section title="Alert" description="Obaveštenja sa različitim statusima">
        <div className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Podrazumevano</AlertTitle>
            <AlertDescription>Ovo je podrazumevano obaveštenje.</AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Greška</AlertTitle>
            <AlertDescription>Došlo je do greške prilikom obrade zahteva.</AlertDescription>
          </Alert>
          <Alert variant="success">
            <Check className="h-4 w-4" />
            <AlertTitle>Uspešno</AlertTitle>
            <AlertDescription>Operacija je uspešno završena.</AlertDescription>
          </Alert>
          <Alert variant="warning">
            <TriangleAlert className="h-4 w-4" />
            <AlertTitle>Upozorenje</AlertTitle>
            <AlertDescription>Obratite pažnju na ovu poruku.</AlertDescription>
          </Alert>
          <Alert variant="info">
            <Info className="h-4 w-4" />
            <AlertTitle>Informacija</AlertTitle>
            <AlertDescription>Evo nekih korisnih informacija.</AlertDescription>
          </Alert>
        </div>
      </Section>

      {/* Badges */}
      <Section title="Badge" description="Oznake za statusne indikatore">
        <div className="flex flex-wrap gap-2">
          <Badge variant="default">Primary</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="info">Info</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </Section>

      {/* Card */}
      <Section title="Card" description="Kartica za grupisanje sadržaja">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Naslov kartice</CardTitle>
              <CardDescription>Opis kartice ide ovde</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Sadržaj kartice. Ovde možete staviti bilo šta.</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Otkaži</Button>
              <Button>Sačuvaj</Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Statistika</CardTitle>
              <CardDescription>Pregled za ovaj mesec</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">128</div>
              <p className="text-sm text-muted-foreground">Ukupno zadataka</p>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* Form Elements - Input */}
      <Section title="Input" description="Polja za unos teksta sa ikonama, pomoćnim tekstom i validacijom">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="input-basic">Osnovni input</Label>
              <Input id="input-basic" placeholder="Unesite tekst..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="input-icon">Sa ikonom</Label>
              <Input id="input-icon" placeholder="Pretražite..." startIcon={<Search className="h-4 w-4" />} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="input-helper">Sa pomoćnim tekstom</Label>
              <Input
                id="input-helper"
                placeholder="email@primer.com"
                startIcon={<Mail className="h-4 w-4" />}
                helperText="Koristite vašu poslovnu email adresu"
              />
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="input-error">Sa greškom</Label>
              <Input
                id="input-error"
                placeholder="Unesite email"
                startIcon={<Mail className="h-4 w-4" />}
                errorText="Email adresa nije validna"
                defaultValue="nevalidan-email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="input-clearable">Clearable</Label>
              <Input
                id="input-clearable"
                placeholder="Unesite tekst..."
                clearable
                value={clearableInput}
                onChange={(e) => setClearableInput(e.target.value)}
                onClear={() => setClearableInput('')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="input-disabled">Onemogućen</Label>
              <Input id="input-disabled" placeholder="Ne može se menjati" disabled />
            </div>
          </div>
        </div>
      </Section>

      {/* Password Input */}
      <Section title="Password Input" description="Polje za unos lozinke sa prikazivanjem/skrivanjem">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="password-basic">Lozinka</Label>
            <PasswordInput id="password-basic" placeholder="Unesite lozinku..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password-helper">Sa pomoćnim tekstom</Label>
            <PasswordInput
              id="password-helper"
              placeholder="Unesite lozinku..."
              helperText="Minimalno 8 karaktera"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password-error">Sa greškom</Label>
            <PasswordInput
              id="password-error"
              placeholder="Unesite lozinku..."
              errorText="Lozinka mora imati najmanje 8 karaktera"
              defaultValue="123"
            />
          </div>
        </div>
      </Section>

      {/* Textarea */}
      <Section title="Textarea" description="Polje za unos dužeg teksta">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="textarea-basic">Osnovni</Label>
              <Textarea id="textarea-basic" placeholder="Unesite duži tekst..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="textarea-helper">Sa pomoćnim tekstom</Label>
              <Textarea
                id="textarea-helper"
                placeholder="Opišite problem..."
                helperText="Maksimalno 500 karaktera"
              />
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="textarea-error">Sa greškom</Label>
              <Textarea
                id="textarea-error"
                placeholder="Unesite opis..."
                errorText="Opis je obavezan"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="textarea-clearable">Clearable</Label>
              <Textarea
                id="textarea-clearable"
                placeholder="Unesite tekst..."
                clearable
                value={clearableTextarea}
                onChange={(e) => setClearableTextarea(e.target.value)}
                onClear={() => setClearableTextarea('')}
              />
            </div>
          </div>
        </div>
      </Section>

      {/* Select */}
      <Section title="Select" description="Padajući meni za izbor opcije">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Osnovni select</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Izaberite opciju" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="option1">Opcija 1</SelectItem>
                  <SelectItem value="option2">Opcija 2</SelectItem>
                  <SelectItem value="option3">Opcija 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Sa pomoćnim tekstom</Label>
              <SelectField helperText="Izaberite jednu od ponuđenih opcija">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Izaberite ulogu" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="user">Korisnik</SelectItem>
                    <SelectItem value="guest">Gost</SelectItem>
                  </SelectContent>
                </Select>
              </SelectField>
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Sa greškom</Label>
              <SelectField errorText="Morate izabrati opciju">
                <Select>
                  <SelectTrigger hasError>
                    <SelectValue placeholder="Izaberite status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Aktivan</SelectItem>
                    <SelectItem value="inactive">Neaktivan</SelectItem>
                  </SelectContent>
                </Select>
              </SelectField>
            </div>
          </div>
        </div>
      </Section>

      {/* Searchable Select */}
      <Section title="Searchable Select" description="Padajući meni sa pretragom">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Grad</Label>
            <SearchableSelect
              options={gradovi}
              value={searchableValue}
              onValueChange={setSearchableValue}
              placeholder="Izaberite grad..."
              searchPlaceholder="Pretražite gradove..."
              helperText="Pretražite i izaberite grad"
            />
          </div>
          <div className="space-y-2">
            <Label>Sa greškom</Label>
            <SearchableSelect
              options={gradovi}
              placeholder="Izaberite grad..."
              errorText="Morate izabrati grad"
            />
          </div>
        </div>
      </Section>

      {/* Multi Select */}
      <Section title="Multi Select" description="Izbor više opcija sa pretragom">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Veštine</Label>
            <MultiSelect
              options={vestine}
              value={multiValue}
              onValueChange={setMultiValue}
              placeholder="Izaberite veštine..."
              searchPlaceholder="Pretražite veštine..."
              helperText="Izaberite sve relevantne veštine"
            />
          </div>
          <div className="space-y-2">
            <Label>Sa greškom</Label>
            <MultiSelect
              options={vestine}
              placeholder="Izaberite veštine..."
              errorText="Morate izabrati bar jednu veštinu"
            />
          </div>
        </div>
      </Section>

      {/* Date & Time Pickers */}
      <Section title="Date & Time Pickers" description="Izbor datuma i vremena">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <Label>Datum</Label>
            <DatePicker
              value={selectedDate}
              onChange={setSelectedDate}
              helperText="Izaberite datum"
            />
          </div>
          <div className="space-y-2">
            <Label>Vreme</Label>
            <TimePicker
              value={selectedTime}
              onChange={setSelectedTime}
              helperText="Izaberite vreme"
            />
          </div>
          <div className="space-y-2">
            <Label>Datum i vreme</Label>
            <DateTimePicker
              value={selectedDateTime}
              onChange={setSelectedDateTime}
              helperText="Izaberite datum i vreme"
            />
          </div>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Sa greškom</Label>
            <DatePicker
              placeholder="Izaberite datum..."
              errorText="Datum je obavezan"
            />
          </div>
          <div className="space-y-2">
            <Label>Onemogućen</Label>
            <DatePicker
              placeholder="Izaberite datum..."
              disabled
            />
          </div>
        </div>
      </Section>

      {/* Radio & Checkbox */}
      <Section title="Radio & Checkbox" description="Izbor opcija">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <Label>Radio grupa</Label>
            <RadioGroup value={radioValue} onValueChange={setRadioValue}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option1" id="radio-option1" />
                <Label htmlFor="radio-option1">Opcija 1</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option2" id="radio-option2" />
                <Label htmlFor="radio-option2">Opcija 2</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option3" id="radio-option3" />
                <Label htmlFor="radio-option3">Opcija 3</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="space-y-4">
            <Label>Checkbox</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="checkbox-example"
                  checked={checkboxChecked}
                  onCheckedChange={(checked) => setCheckboxChecked(checked === true)}
                />
                <Label htmlFor="checkbox-example">Prihvatam uslove korišćenja</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="checkbox-disabled" disabled />
                <Label htmlFor="checkbox-disabled" className="text-muted-foreground">Onemogućena opcija</Label>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Dialog */}
      <Section title="Dialog" description="Modalni prozor za interakciju">
        <Dialog>
          <DialogTrigger asChild>
            <Button>Otvori dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Naslov dialoga</DialogTitle>
              <DialogDescription>
                Ovo je opis dialoga. Ovde možete staviti dodatne informacije.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p>Sadržaj dialoga ide ovde.</p>
            </div>
            <DialogFooter>
              <Button variant="outline">Otkaži</Button>
              <Button>Potvrdi</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Section>

      {/* Dropdown Menu */}
      <Section title="Dropdown Menu" description="Padajući meni sa akcijama">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <MoreHorizontal className="mr-2 h-4 w-4" />
              Akcije
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Moje akcije</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Izmeni
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Plus className="mr-2 h-4 w-4" />
              Dodaj novo
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Obriši
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Section>

      {/* DataTable */}
      <Section title="DataTable" description="Napredna tabela sa sortiranjem, paginacijom i akcijama">
        <DataTable columns={zaposleniColumns} data={zaposleniData} pageSize={5} />
      </Section>

      {/* Toast */}
      <Section title="Toast" description="Obaveštenja koja se prikazuju privremeno">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => showToast.success('Uspešno sačuvano!')}>
            Success Toast
          </Button>
          <Button variant="outline" onClick={() => showToast.error('Došlo je do greške!')}>
            Error Toast
          </Button>
          <Button variant="outline" onClick={() => showToast.warning('Upozorenje!')}>
            Warning Toast
          </Button>
          <Button variant="outline" onClick={() => showToast.info('Informacija')}>
            Info Toast
          </Button>
          <Button variant="outline" onClick={() => showToast.saved()}>
            Sačuvano
          </Button>
          <Button variant="outline" onClick={() => showToast.deleted()}>
            Obrisano
          </Button>
        </div>
      </Section>
    </div>
  );
}

function Section({
  title,
  description,
  children
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <div className="rounded-lg border bg-card p-6">
        {children}
      </div>
    </section>
  );
}
