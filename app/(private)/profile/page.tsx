"use client";

import { Button, Container, Title } from "@mantine/core";
import { IconCertificate, IconMapPin, IconPencil } from "@tabler/icons-react";
import { useState } from "react";
import EditProfile from "./EditProfile";
import ManageAddresses from "./ManageAddresses";
import styles from "./Profile.module.css";
import SellerVerification from "./SellerVerification";

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
    {
      id: "seller-verification",
      label: "Seller Verification",
      icon: <IconCertificate size={16} />,
      component: <SellerVerification />,
    },
  ];

  return (
    <Container size="lg" py="xl">
      <Title order={2} mb="xl">
        Profile Settings
      </Title>

      {/* Desktop View - Tabs */}
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

      {/* Mobile View - Stacked Sections */}
      {tabs.map((tab) => (
        <div key={tab.id} className={styles.mobileSection}>
          <div className={styles.sectionHeader}>
            {tab.icon} {tab.label}
          </div>
          {tab.component}
        </div>
      ))}
    </Container>
  );
}
