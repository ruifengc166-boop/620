// ===== 模型路由层接口 (14.2) =====
export interface ModelRequest {
  mode: "official" | "planning" | "long_context" | "promotion" | "multi_compare" | "risk_review";
  prompt: string;
  input: Record<string, any>;
  options?: {
    temperature?: number;
    max_tokens?: number;
    stream?: boolean;
  };
}

export interface ModelResponse {
  provider: string;
  model: string;
  mode: string;
  content: string;
  usage?: {
    input_tokens: number;
    output_tokens: number;
    cost_points: number;
  };
  risk_flags?: string[];
}

// ===== 多版本生成接口 (14.3) =====
export interface MultiGenerateRequest {
  task_type: string;
  event_type: string;
  input: Record<string, any>;
  card_styles: Array<"official" | "concise" | "promotion" | "highlight" | "creative">;
  model_modes: Array<"official" | "planning" | "promotion">;
}

export interface GenerationCard {
  id: string;
  title: string;
  style: string;
  model_mode: string;
  content: string;
  summary: string;
  risk_level: "low" | "medium" | "high";
  created_at: string;
}

// ===== 风控接口 (14.4) =====
export interface RiskReviewRequest {
  content: string;
  material_type: string;
  usage_context: "internal" | "submission" | "public_release" | "social_media";
}

export interface RiskReviewResponse {
  risk_level: "low" | "medium" | "high";
  risks: Array<{
    type: string;
    text: string;
    reason: string;
    suggestion: string;
    requires_human_review: boolean;
  }>;
  pending_verification: string[];
  sanitized_suggestion?: string;
}

// ===== 脱敏接口 (14.5) =====
export interface DesensitizeRequest {
  content: string;
}

export interface DesensitizeEntity {
  type: "person" | "phone" | "id_number" | "address" | "company" | "project" | "amount" | "internal_marker";
  original: string;
  replacement: string;
}

export interface DesensitizeResponse {
  sanitized_content: string;
  entities: DesensitizeEntity[];
  risk_level: "low" | "medium" | "high";
}

// ===== 数据表定义 (22) =====
export interface User {
  id: string;
  phone_email: string;
  nickname: string;
  role_type: string;
  membership_level: string;
  points_balance: number;
  created_at: Date;
  updated_at: Date;
}

export interface Template {
  id: string;
  name: string;
  category: string;
  priority_level: "P0" | "P1" | "P2";
  description: string;
  target_roles: string[];
  input_schema: Record<string, any>;
  output_materials: string[];
  risk_level: string;
  is_active: boolean;
}

export interface Generation {
  id: string;
  user_id: string;
  task_type: string;
  event_type: string;
  generation_mode: string;
  model_provider: string;
  model_name: string;
  metadata: Record<string, any>;
  risk_level: string;
  points_used: number;
  created_at: Date;
}

export interface SavedMaterial {
  id: string;
  user_id: string;
  title: string;
  material_type: string;
  content: string;
  risk_level: string;
  user_confirmed_safe: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface RiskReview {
  id: string;
  user_id: string;
  generation_id: string;
  risk_level: string;
  risk_summary: string;
  created_at: Date;
}

export interface PointsLog {
  id: string;
  user_id: string;
  action_type: string;
  points_change: number;
  related_generation_id: string;
  created_at: Date;
}
