"use client";

import { use } from "react";
import { OperationsDashboard } from "@/components/operations-dashboard";

export default function DashboardPage({ params }) {
  const { role } = use(params);
  return <OperationsDashboard role={role} />;
}
