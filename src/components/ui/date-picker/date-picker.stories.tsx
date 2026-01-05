import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { Label } from '../label';
import { DatePicker } from './date-picker';

const meta: Meta<typeof DatePicker> = {
  title: 'UI/DatePicker/DatePicker',
  component: DatePicker,
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

export const Default: Story = {
  render: function Render() {
    const [date, setDate] = useState<Date>();
    return <DatePicker value={date} onChange={setDate} />;
  },
};

export const WithLabel: Story = {
  render: function Render() {
    const [date, setDate] = useState<Date>();
    return (
      <div className="space-y-2">
        <Label>Datum isporuke</Label>
        <DatePicker value={date} onChange={setDate} />
      </div>
    );
  },
};

export const WithValue: Story = {
  render: function Render() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    return <DatePicker value={date} onChange={setDate} />;
  },
};

export const CustomPlaceholder: Story = {
  render: function Render() {
    const [date, setDate] = useState<Date>();
    return (
      <DatePicker
        value={date}
        onChange={setDate}
        placeholder="Izaberite datum rođenja"
      />
    );
  },
};

export const WithHelperText: Story = {
  render: function Render() {
    const [date, setDate] = useState<Date>();
    return (
      <DatePicker
        value={date}
        onChange={setDate}
        helperText="Izaberite datum do kada narudžbina mora biti isporučena."
      />
    );
  },
};

export const WithError: Story = {
  render: function Render() {
    const [date, setDate] = useState<Date>();
    return (
      <DatePicker
        value={date}
        onChange={setDate}
        errorText="Datum isporuke je obavezan."
      />
    );
  },
};

export const Disabled: Story = {
  render: function Render() {
    return (
      <DatePicker
        disabled
        placeholder="Onemogućeno"
      />
    );
  },
};

export const FormExample: Story = {
  render: function Render() {
    const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>
            Datum početka <span className="text-destructive">*</span>
          </Label>
          <DatePicker
            value={startDate}
            onChange={setStartDate}
            placeholder="Od"
          />
        </div>
        <div className="space-y-2">
          <Label>
            Datum završetka <span className="text-destructive">*</span>
          </Label>
          <DatePicker
            value={endDate}
            onChange={setEndDate}
            placeholder="Do"
          />
        </div>
      </div>
    );
  },
};

export const AllStates: Story = {
  render: function Render() {
    const [date1, setDate1] = useState<Date>();
    const [date2, setDate2] = useState<Date | undefined>(new Date());
    const [date3, setDate3] = useState<Date>();
    const [date4, setDate4] = useState<Date>();

    return (
      <div className="space-y-4">
        <DatePicker value={date1} onChange={setDate1} placeholder="Podrazumevano" />
        <DatePicker value={date2} onChange={setDate2} />
        <DatePicker
          value={date3}
          onChange={setDate3}
          helperText="Sa pomoćnim tekstom"
        />
        <DatePicker
          value={date4}
          onChange={setDate4}
          errorText="Ovo polje je obavezno"
        />
        <DatePicker disabled placeholder="Onemogućeno" />
      </div>
    );
  },
};
