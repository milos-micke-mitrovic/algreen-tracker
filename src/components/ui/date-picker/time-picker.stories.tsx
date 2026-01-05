import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { Label } from '../label';
import { TimePicker } from './time-picker';

const meta: Meta<typeof TimePicker> = {
  title: 'UI/DatePicker/TimePicker',
  component: TimePicker,
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
  render: function Render() {
    const [time, setTime] = useState<string>();
    return <TimePicker value={time} onChange={setTime} />;
  },
};

export const WithLabel: Story = {
  render: function Render() {
    const [time, setTime] = useState<string>();
    return (
      <div className="space-y-2">
        <Label>Vreme početka</Label>
        <TimePicker value={time} onChange={setTime} />
      </div>
    );
  },
};

export const WithValue: Story = {
  render: function Render() {
    const [time, setTime] = useState<string | undefined>('09:30');
    return <TimePicker value={time} onChange={setTime} />;
  },
};

export const CustomPlaceholder: Story = {
  render: function Render() {
    const [time, setTime] = useState<string>();
    return (
      <TimePicker
        value={time}
        onChange={setTime}
        placeholder="Kada počinjete?"
      />
    );
  },
};

export const WithHelperText: Story = {
  render: function Render() {
    const [time, setTime] = useState<string>();
    return (
      <TimePicker
        value={time}
        onChange={setTime}
        helperText="Izaberite vreme početka smene."
      />
    );
  },
};

export const WithError: Story = {
  render: function Render() {
    const [time, setTime] = useState<string>();
    return (
      <TimePicker
        value={time}
        onChange={setTime}
        errorText="Vreme je obavezno."
      />
    );
  },
};

export const Disabled: Story = {
  render: function Render() {
    return <TimePicker disabled placeholder="Onemogućeno" />;
  },
};

export const MinuteStep30: Story = {
  render: function Render() {
    const [time, setTime] = useState<string>();
    return (
      <div className="space-y-2">
        <Label>Korak: 30 minuta</Label>
        <TimePicker value={time} onChange={setTime} minuteStep={30} />
      </div>
    );
  },
};

export const MinuteStep5: Story = {
  render: function Render() {
    const [time, setTime] = useState<string>();
    return (
      <div className="space-y-2">
        <Label>Korak: 5 minuta</Label>
        <TimePicker value={time} onChange={setTime} minuteStep={5} />
      </div>
    );
  },
};

export const MinuteStep60: Story = {
  render: function Render() {
    const [time, setTime] = useState<string>();
    return (
      <div className="space-y-2">
        <Label>Korak: 60 minuta (samo sati)</Label>
        <TimePicker value={time} onChange={setTime} minuteStep={60} />
      </div>
    );
  },
};

export const AllStates: Story = {
  render: function Render() {
    const [time1, setTime1] = useState<string>();
    const [time2, setTime2] = useState<string | undefined>('14:00');
    const [time3, setTime3] = useState<string>();
    const [time4, setTime4] = useState<string>();

    return (
      <div className="space-y-4">
        <TimePicker
          value={time1}
          onChange={setTime1}
          placeholder="Podrazumevano"
        />
        <TimePicker value={time2} onChange={setTime2} />
        <TimePicker
          value={time3}
          onChange={setTime3}
          helperText="Sa pomoćnim tekstom"
        />
        <TimePicker
          value={time4}
          onChange={setTime4}
          errorText="Ovo polje je obavezno"
        />
        <TimePicker disabled placeholder="Onemogućeno" />
      </div>
    );
  },
};
