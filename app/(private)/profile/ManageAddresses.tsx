"use client";

import AddressSelector from "@/components/AddressSelector";
import { Address } from "@/schemas/address";
import { Stack } from "@mantine/core";
import { useState } from "react";

export default function ManageAddresses() {
  const [addresses, setAddresses] = useState<Address[]>([]);

  return (
    <Stack gap="md">
      <AddressSelector mode="manage" onAddressChange={setAddresses} />
    </Stack>
  );
}
