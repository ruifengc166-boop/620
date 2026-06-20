"use client";
import { Suspense } from "react";
import Link from "next/link";
import { taskDefinitions, commonFormFields, generationModeOptions, cardStyleOptions, activityTypeOptions } from "@/data/tasks";
import { demoAntiFraud, generateRiskCheckResult, type GenerationResult, type RiskCheckInfo } from "@/data/demoData";
import TaskFormInner from "./TaskFormInner";

export default function TaskFormPage() {
  return (
    <Suspense fallback={<div className="container-app py-12 text-center text-[#64748b]">加载中...</div>}>
      <TaskFormInner />
    </Suspense>
  );
}
