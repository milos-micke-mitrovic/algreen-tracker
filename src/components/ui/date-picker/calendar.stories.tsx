import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';

import { Calendar } from './calendar';

const meta: Meta<typeof Calendar> = {
  title: 'UI/DatePicker/Calendar',
  component: Calendar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: function Render() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border"
      />
    );
  },
};

export const SingleSelection: Story = {
  render: function Render() {
    const [date, setDate] = useState<Date | undefined>();
    return (
      <div className="space-y-4">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
        />
        <p className="text-sm text-muted-foreground">
          Izabrano: {date ? date.toLocaleDateString('sr-Latn') : 'Nije izabrano'}
        </p>
      </div>
    );
  },
};

export const RangeSelection: Story = {
  render: function Render() {
    const [range, setRange] = useState<DateRange | undefined>();
    return (
      <div className="space-y-4">
        <Calendar
          mode="range"
          selected={range}
          onSelect={setRange}
          className="rounded-md border"
          numberOfMonths={1}
        />
        <p className="text-sm text-muted-foreground">
          {range?.from && range?.to
            ? `${range.from.toLocaleDateString('sr-Latn')} - ${range.to.toLocaleDateString('sr-Latn')}`
            : range?.from
            ? `Od: ${range.from.toLocaleDateString('sr-Latn')}`
            : 'Izaberite opseg datuma'}
        </p>
      </div>
    );
  },
};

export const MultipleMonths: Story = {
  render: function Render() {
    const [range, setRange] = useState<DateRange | undefined>();
    return (
      <Calendar
        mode="range"
        selected={range}
        onSelect={setRange}
        className="rounded-md border"
        numberOfMonths={2}
      />
    );
  },
};

export const WithDisabledDates: Story = {
  render: function Render() {
    const [date, setDate] = useState<Date | undefined>();
    const today = new Date();

    return (
      <div className="space-y-4">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
          disabled={(date) => date < today}
        />
        <p className="text-xs text-muted-foreground">
          Datumi pre današnjeg dana su onemogućeni.
        </p>
      </div>
    );
  },
};

export const DisabledWeekends: Story = {
  render: function Render() {
    const [date, setDate] = useState<Date | undefined>();

    return (
      <div className="space-y-4">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
          disabled={(date) => date.getDay() === 0 || date.getDay() === 6}
        />
        <p className="text-xs text-muted-foreground">
          Vikendi su onemogućeni.
        </p>
      </div>
    );
  },
};

export const WithFooter: Story = {
  render: function Render() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    return (
      <div className="rounded-md border">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
        />
        <div className="border-t p-3">
          <button
            onClick={() => setDate(new Date())}
            className="text-sm text-primary hover:underline"
          >
            Danas
          </button>
        </div>
      </div>
    );
  },
};

export const WithWeekNumbers: Story = {
  render: function Render() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border"
        showWeekNumber
      />
    );
  },
};

export const HideOutsideDays: Story = {
  render: function Render() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border"
        showOutsideDays={false}
      />
    );
  },
};
