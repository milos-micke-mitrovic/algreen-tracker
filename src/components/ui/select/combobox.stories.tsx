import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { Label } from '../label';
import { Combobox } from './combobox';

const meta: Meta<typeof Combobox> = {
  title: 'UI/Select/Combobox',
  component: Combobox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

const cities = [
  { value: 'beograd', label: 'Beograd' },
  { value: 'novi-sad', label: 'Novi Sad' },
  { value: 'nis', label: 'Niš' },
  { value: 'kragujevac', label: 'Kragujevac' },
  { value: 'subotica', label: 'Subotica' },
  { value: 'zrenjanin', label: 'Zrenjanin' },
  { value: 'pancevo', label: 'Pančevo' },
  { value: 'cacak', label: 'Čačak' },
  { value: 'novi-pazar', label: 'Novi Pazar' },
  { value: 'leskovac', label: 'Leskovac' },
];

const skills = [
  { value: 'react', label: 'React' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'nodejs', label: 'Node.js' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'csharp', label: 'C#' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'sql', label: 'SQL' },
  { value: 'mongodb', label: 'MongoDB' },
];

// =============================================================================
// SINGLE SELECT STORIES
// =============================================================================

export const Default: Story = {
  render: function Render() {
    const [value, setValue] = useState<string>();
    return (
      <Combobox
        options={cities}
        value={value}
        onValueChange={setValue}
      />
    );
  },
};

export const SingleWithLabel: Story = {
  render: function Render() {
    const [value, setValue] = useState<string>();
    return (
      <div className="space-y-2">
        <Label>Grad</Label>
        <Combobox
          options={cities}
          value={value}
          onValueChange={setValue}
        />
      </div>
    );
  },
};

export const SingleWithValue: Story = {
  render: function Render() {
    const [value, setValue] = useState<string>('beograd');
    return (
      <Combobox
        options={cities}
        value={value}
        onValueChange={setValue}
      />
    );
  },
};

export const SingleWithHelperText: Story = {
  render: function Render() {
    const [value, setValue] = useState<string>();
    return (
      <Combobox
        options={cities}
        value={value}
        onValueChange={setValue}
        helperText="Izaberite grad iz liste."
      />
    );
  },
};

export const SingleWithError: Story = {
  render: function Render() {
    const [value, setValue] = useState<string>();
    return (
      <Combobox
        options={cities}
        value={value}
        onValueChange={setValue}
        errorText="Grad je obavezan."
      />
    );
  },
};

export const SingleDisabled: Story = {
  render: function Render() {
    return (
      <Combobox
        options={cities}
        disabled
        placeholder="Onemogućeno"
      />
    );
  },
};

// =============================================================================
// MULTIPLE SELECT STORIES
// =============================================================================

export const Multiple: Story = {
  render: function Render() {
    const [value, setValue] = useState<string[]>([]);
    return (
      <Combobox
        multiple
        options={skills}
        value={value}
        onValueChange={setValue}
      />
    );
  },
};

export const MultipleWithLabel: Story = {
  render: function Render() {
    const [value, setValue] = useState<string[]>([]);
    return (
      <div className="space-y-2">
        <Label>Veštine</Label>
        <Combobox
          multiple
          options={skills}
          value={value}
          onValueChange={setValue}
        />
      </div>
    );
  },
};

export const MultipleWithValues: Story = {
  render: function Render() {
    const [value, setValue] = useState<string[]>(['react', 'typescript']);
    return (
      <Combobox
        multiple
        options={skills}
        value={value}
        onValueChange={setValue}
      />
    );
  },
};

export const MultipleManySelected: Story = {
  render: function Render() {
    const [value, setValue] = useState<string[]>([
      'react',
      'typescript',
      'nodejs',
      'python',
      'java',
    ]);
    return (
      <Combobox
        multiple
        options={skills}
        value={value}
        onValueChange={setValue}
      />
    );
  },
};

export const MultipleCustomMaxDisplay: Story = {
  render: function Render() {
    const [value, setValue] = useState<string[]>([
      'react',
      'typescript',
      'nodejs',
      'python',
    ]);
    return (
      <Combobox
        multiple
        options={skills}
        value={value}
        onValueChange={setValue}
        maxDisplay={5}
      />
    );
  },
};

export const MultipleWithHelperText: Story = {
  render: function Render() {
    const [value, setValue] = useState<string[]>([]);
    return (
      <Combobox
        multiple
        options={skills}
        value={value}
        onValueChange={setValue}
        helperText="Izaberite jednu ili više veština."
      />
    );
  },
};

export const MultipleWithError: Story = {
  render: function Render() {
    const [value, setValue] = useState<string[]>([]);
    return (
      <Combobox
        multiple
        options={skills}
        value={value}
        onValueChange={setValue}
        errorText="Morate izabrati bar jednu veštinu."
      />
    );
  },
};

export const MultipleDisabled: Story = {
  render: function Render() {
    return (
      <Combobox
        multiple
        options={skills}
        value={['react', 'typescript']}
        disabled
      />
    );
  },
};

// =============================================================================
// SHARED STORIES
// =============================================================================

export const CustomPlaceholders: Story = {
  render: function Render() {
    const [value, setValue] = useState<string>();
    return (
      <Combobox
        options={cities}
        value={value}
        onValueChange={setValue}
        placeholder="Izaberite grad..."
        searchPlaceholder="Pretraži gradove..."
        emptyMessage="Grad nije pronađen."
      />
    );
  },
};

export const WithDisabledOptions: Story = {
  render: function Render() {
    const [value, setValue] = useState<string>();
    const optionsWithDisabled = [
      { value: 'beograd', label: 'Beograd' },
      { value: 'novi-sad', label: 'Novi Sad', disabled: true },
      { value: 'nis', label: 'Niš' },
      { value: 'kragujevac', label: 'Kragujevac', disabled: true },
      { value: 'subotica', label: 'Subotica' },
    ];
    return (
      <Combobox
        options={optionsWithDisabled}
        value={value}
        onValueChange={setValue}
        placeholder="Neki gradovi su onemogućeni"
      />
    );
  },
};

export const ManyOptions: Story = {
  render: function Render() {
    const [value, setValue] = useState<string>();
    const manyOptions = Array.from({ length: 50 }, (_, i) => ({
      value: `option-${i + 1}`,
      label: `Opcija ${i + 1}`,
    }));
    return (
      <Combobox
        options={manyOptions}
        value={value}
        onValueChange={setValue}
        placeholder="Izaberite opciju..."
        searchPlaceholder="Pretraži 50 opcija..."
      />
    );
  },
};

export const AllSingleStates: Story = {
  render: function Render() {
    const [value1, setValue1] = useState<string>();
    const [value2, setValue2] = useState<string>('beograd');
    const [value3, setValue3] = useState<string>();
    const [value4, setValue4] = useState<string>();

    return (
      <div className="space-y-4">
        <Combobox
          options={cities}
          value={value1}
          onValueChange={setValue1}
          placeholder="Podrazumevano"
        />
        <Combobox
          options={cities}
          value={value2}
          onValueChange={setValue2}
        />
        <Combobox
          options={cities}
          value={value3}
          onValueChange={setValue3}
          helperText="Sa pomoćnim tekstom"
        />
        <Combobox
          options={cities}
          value={value4}
          onValueChange={setValue4}
          errorText="Ovo polje je obavezno"
        />
        <Combobox
          options={cities}
          disabled
          placeholder="Onemogućeno"
        />
      </div>
    );
  },
};

export const AllMultipleStates: Story = {
  render: function Render() {
    const [value1, setValue1] = useState<string[]>([]);
    const [value2, setValue2] = useState<string[]>(['react', 'typescript']);
    const [value3, setValue3] = useState<string[]>([]);
    const [value4, setValue4] = useState<string[]>([]);

    return (
      <div className="space-y-4">
        <Combobox
          multiple
          options={skills}
          value={value1}
          onValueChange={setValue1}
          placeholder="Podrazumevano"
        />
        <Combobox
          multiple
          options={skills}
          value={value2}
          onValueChange={setValue2}
        />
        <Combobox
          multiple
          options={skills}
          value={value3}
          onValueChange={setValue3}
          helperText="Sa pomoćnim tekstom"
        />
        <Combobox
          multiple
          options={skills}
          value={value4}
          onValueChange={setValue4}
          errorText="Ovo polje je obavezno"
        />
        <Combobox
          multiple
          options={skills}
          value={['react']}
          disabled
        />
      </div>
    );
  },
};
