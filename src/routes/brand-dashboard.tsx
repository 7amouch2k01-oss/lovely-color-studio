import { createFileRoute } from "@tanstack/react-router";

import { ProtectedRoleDashboard } from "@/components/ProtectedRoleDashboard";

export const Route = createFileRoute("/brand-dashboard")({
  head: () => ({
    meta: [
      { title: "Brand Dashboard — Styly" },
      { name: "description", content: "Brand workspace for campaigns, creator discovery, and Styly collaboration requests." },
      { property: "og:title", content: "Brand Dashboard — Styly" },
      { property: "og:description", content: "Manage brand campaigns and influencer collaborations inside Styly." },
    ],
  }),
  component: BrandDashboardPage,
});

function BrandDashboardPage() {
  return <ProtectedRoleDashboard role="brand" />;
}