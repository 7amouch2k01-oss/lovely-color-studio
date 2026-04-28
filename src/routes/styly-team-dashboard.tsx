import { createFileRoute } from "@tanstack/react-router";

import { ProtectedRoleDashboard } from "@/components/ProtectedRoleDashboard";

export const Route = createFileRoute("/styly-team-dashboard")({
  head: () => ({
    meta: [
      { title: "Styly Team Dashboard" },
      { name: "description", content: "Styly team member workspace for brand approvals, operations, and platform analytics." },
      { property: "og:title", content: "Styly Team Dashboard" },
      { property: "og:description", content: "Operate brand onboarding and platform growth from the Styly team dashboard." },
    ],
  }),
  component: StylyTeamDashboardPage,
});

function StylyTeamDashboardPage() {
  return <ProtectedRoleDashboard role="styly_team" />;
}