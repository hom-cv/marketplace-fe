"use client";

import { BANKS } from "@/constants/banks";
import { Select, SelectProps } from "@mantine/core";

interface BankSelectProps extends Omit<SelectProps, "data"> {
  value?: string;
  onChange?: (value: string | null) => void;
}

export default function BankSelect({
  value,
  onChange,
  ...props
}: BankSelectProps) {
  const selectedBank = value ? BANKS.find((b) => b.code === value) : null;

  return (
    <Select
      {...props}
      value={value}
      onChange={onChange}
      data={BANKS.map((bank) => ({
        value: bank.code,
        label: bank.name,
      }))}
      searchable
      maxDropdownHeight={200}
      comboboxProps={{
        position: "bottom",
      }}
    />
  );
}
