import {
  deleteRule,
  reorderRules,
  toggleRuleActive,
} from "@/actions/ruleActions";
import AdminRuleListClient from "@/components/AdminRuleListClient";
import { prisma } from "@/lib/prisma";


async function getRules() {
  return prisma.rule.findMany({
    orderBy: {
      order: "asc",
    },
  });
}

export default async function AdminRuleList() {
  const rules = await getRules();

  return (
    <AdminRuleListClient
      rules={rules}
      toggleRuleActive={toggleRuleActive}
      deleteRule={deleteRule}
      reorderRules={reorderRules}
    />
  );
}