
export interface ProviderResponse {
  content: string;
  provider: string;
  model: string;
  input_tokens?: number;
  output_tokens?: number;
}

export interface BaseProvider {
  systemPrompt: string;
  name: string;
  model: string;
  generate(prompt: string, options?: { temperature?: number; max_tokens?: number }): Promise<ProviderResponse>;
}

