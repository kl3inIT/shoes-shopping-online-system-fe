export interface ChatApiData {
  input: string;
  output: string;
  sources: string[];
  logs: string[];
}

export interface ChatRequestDto {
  message: string;
}
