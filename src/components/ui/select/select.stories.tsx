import type { Meta, StoryObj } from '@storybook/react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  SelectField,
} from './select';

const meta: Meta<typeof Select> = {
  title: 'UI/Select/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
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
  ),
};

export const WithGroups: Story = {
  render: () => (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Izaberite grad" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Srbija</SelectLabel>
          <SelectItem value="beograd">Beograd</SelectItem>
          <SelectItem value="novi-sad">Novi Sad</SelectItem>
          <SelectItem value="nis">Niš</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Crna Gora</SelectLabel>
          <SelectItem value="podgorica">Podgorica</SelectItem>
          <SelectItem value="budva">Budva</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

export const WithHelperText: Story = {
  render: () => (
    <SelectField helperText="Izaberite kategoriju proizvoda">
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Kategorija" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="electronics">Elektronika</SelectItem>
          <SelectItem value="clothing">Odeća</SelectItem>
          <SelectItem value="food">Hrana</SelectItem>
        </SelectContent>
      </Select>
    </SelectField>
  ),
};

export const WithError: Story = {
  render: () => (
    <SelectField errorText="Ovo polje je obavezno">
      <Select>
        <SelectTrigger hasError>
          <SelectValue placeholder="Izaberite ulogu" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="admin">Administrator</SelectItem>
          <SelectItem value="user">Korisnik</SelectItem>
          <SelectItem value="guest">Gost</SelectItem>
        </SelectContent>
      </Select>
    </SelectField>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Select disabled>
      <SelectTrigger>
        <SelectValue placeholder="Onemogućeno" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option1">Opcija 1</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const WithDisabledItems: Story = {
  render: () => (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Izaberite plan" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="free">Besplatan</SelectItem>
        <SelectItem value="basic">Osnovni</SelectItem>
        <SelectItem value="pro" disabled>
          Pro (uskoro)
        </SelectItem>
        <SelectItem value="enterprise" disabled>
          Enterprise (uskoro)
        </SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const StatusSelect: Story = {
  render: () => (
    <Select defaultValue="in_progress">
      <SelectTrigger>
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="pending">Na čekanju</SelectItem>
        <SelectItem value="in_progress">U toku</SelectItem>
        <SelectItem value="completed">Završeno</SelectItem>
        <SelectItem value="cancelled">Otkazano</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const RoleSelect: Story = {
  render: () => (
    <div className="space-y-2">
      <label className="text-sm font-medium">Uloga korisnika</label>
      <Select defaultValue="worker">
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="admin">Administrator</SelectItem>
          <SelectItem value="manager">Menadžer</SelectItem>
          <SelectItem value="worker">Radnik</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};
