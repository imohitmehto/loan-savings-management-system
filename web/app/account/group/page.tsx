"use client";

import React from "react";
import {
  PageLayout,
  PageHeader,
  CardContainer,
} from "@/components/common/layout";
import AccountGroupList from "@/components/account/AccountGroup/AccountGroupList";
import NavigationButton from "@/components/common/button/NavigationButton";

export default function AllAccountGroupsPage() {
  return (
    <PageLayout>
      <PageHeader
        title="Account Groups"
        subtitle="View and manage all account groups in the system."
        rightContent={
          <NavigationButton
            route="/account/group/new"
            label="+ Create New Group"
          />
        }
      />

      <CardContainer>
        <AccountGroupList />
      </CardContainer>
    </PageLayout>
  );
}
