"use client";

import { Button, Container, Title } from "@mantine/core";
import { IconMapPin, IconPencil } from "@tabler/icons-react";
import { useState } from "react";
import EditProfile from "./EditProfile";
import ManageAddresses from "./ManageAddresses";
import styles from "./Profile.module.css";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("edit-profile");

  const tabs = [
    {
      id: "edit-profile",
      label: "Edit Profile",
      icon: <IconPencil size={16} />,
      component: <EditProfile />,
    },
    {
      id: "addresses",
      label: "Addresses",
      icon: <IconMapPin size={16} />,
      component: <ManageAddresses />,
    },
  ];

  return (
    <Container size="lg" py="xl">
      <Title order={2} mb="xl">
        Profile Settings
      </Title>

      <div className={styles.profileCard}>
        <div className={styles.tabList}>
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "filled" : "transparent"}
              onClick={() => setActiveTab(tab.id)}
              leftSection={tab.icon}
              justify="flex-start"
              fullWidth
            >
              {tab.label}
            </Button>
          ))}
        </div>

        <div className={styles.tabContent}>
          {tabs.find((tab) => tab.id === activeTab)?.component}
        </div>
      </div>
    </Container>
  );
}
