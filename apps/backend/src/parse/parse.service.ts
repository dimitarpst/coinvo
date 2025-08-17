/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosError } from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { ExpenseEntry } from './interfaces/expense-entry.interface';

// ----- Types for Anthropic Chat Completions (OpenAI-compatible) -----
type ChatRole = 'system' | 'user' | 'assistant';
interface ChatMessage {
  role: ChatRole;
  content: string;
}
interface ChatChoice {
  index: number;
  message: ChatMessage;
  finish_reason?: string | null;
}
interface ChatCompletionsResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: ChatChoice[];
}

// ----- Zod schema to validate the model output at runtime -----
const ExpenseItemSchema = z.object({
  amount: z.number(),
  currency: z.string(),
  category: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().optional(),
  note: z.string().optional(),
});
const ExpenseArraySchema = z.array(ExpenseItemSchema);

@Injectable()
export class ParseService {
  private readonly apiKey: string;
  private readonly apiUrl = 'https://api.anthropic.com/v1/chat/completions';

  constructor(private config: ConfigService) {
    const key = this.config.get<string>('CLAUDE_API_KEY');
    if (!key) throw new Error('CLAUDE_API_KEY not defined in .env');
    this.apiKey = key;
  }

  private stripFences(s: string): string {
    // Remove leading/trailing ``` and ```json fences if model adds them
    return s
      .replace(/^\s*```(?:json)?\s*/i, '')
      .replace(/\s*```\s*$/i, '')
      .trim();
  }

  async parseText(text: string): Promise<ExpenseEntry[]> {
    // Chat Completions payload (Anthropic’s compatibility layer)
    const payload = {
      model: 'claude-3-5-haiku-latest', // cheaper + good
      messages: [
        {
          role: 'system' as const,
          content: [
            'You extract expenses from user text.',
            'Respond ONLY with a raw JSON array of objects:',
            '{amount:number,currency:string,category:string,date:"YYYY-MM-DD",time?:string,note?:string}',
            'NO markdown, NO code fences, NO commentary.',
          ].join('\n'),
        },
        { role: 'user' as const, content: text },
      ] as ChatMessage[],
      temperature: 0,
      max_tokens: 1000, // <- Chat Completions param name
    };

    try {
      const res = await axios.post<ChatCompletionsResponse>(
        this.apiUrl,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': this.apiKey,
            'Anthropic-Version': '2023-06-01',
          },
          timeout: 30_000,
        },
      );

      const choice0 = res.data.choices?.[0];
      if (!choice0 || typeof choice0.message?.content !== 'string') {
        throw new HttpException(
          'Claude returned no text content to parse.',
          HttpStatus.BAD_GATEWAY,
        );
      }

      const raw = choice0.message.content.trim();
      const clean = this.stripFences(raw);

      // Parse JSON safely
      let parsedUnknown: unknown;
      try {
        parsedUnknown = JSON.parse(clean);
      } catch (e) {
        // Surface the first 200 chars to help debug prompt issues
        throw new HttpException(
          'Model output was not valid JSON. Preview: ' + clean.slice(0, 200),
          HttpStatus.BAD_GATEWAY,
        );
      }

      // Validate shape
      const result = ExpenseArraySchema.safeParse(parsedUnknown);
      if (!result.success) {
        throw new HttpException(
          'Model JSON did not match expected schema: ' + result.error.message,
          HttpStatus.BAD_GATEWAY,
        );
      }

      // Add UUIDs
      const items = result.data.map((i) => ({ id: uuidv4(), ...i }));
      return items;
    } catch (err: unknown) {
      // Proper narrowing for Axios errors
      if (axios.isAxiosError(err)) {
        const ax = err as AxiosError<{ error?: { message?: string } }>;
        const msg =
          ax.response?.data?.error?.message || ax.message || 'Axios error';
        console.error('Claude Axios error:', ax.response?.status, msg);
        throw new HttpException(
          'Failed to parse expenses via Claude: ' + msg,
          HttpStatus.BAD_GATEWAY,
        );
      }
      const msg = err instanceof Error ? err.message : String(err);
      console.error('Claude error:', msg);
      throw new HttpException(
        'Failed to parse expenses via Claude: ' + msg,
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}
