import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { ExpenseEntry } from './interfaces/expense-entry.interface';

@Injectable()
export class ParseService {
  private readonly apiKey: string;
  private readonly apiUrl = 'https://api.anthropic.com/v1/chat/completions';

  constructor(private config: ConfigService) {
    const key = this.config.get<string>('CLAUDE_API_KEY');
    if (!key) {
      throw new Error('CLAUDE_API_KEY not defined in .env');
    }
    this.apiKey = key;   
  }

  async parseText(text: string): Promise<ExpenseEntry[]> {
// inside ParseService.parseText

const payload = {
  model: 'claude-3-5-haiku-latest',
  messages: [
    {
      role: 'system',
      content: `
You are an assistant that extracts expenses from user text.
Respond ONLY with a raw JSON array of objects—no markdown, no code fences, no extra text.
Each object must have:
- amount (number)
- currency (string)
- category (string)
- date (YYYY-MM-DD)
- optional time (string)
- optional note (string)
Do NOT include id.
      `.trim(),
    },
    { role: 'user', content: text },
  ],
  max_tokens_to_sample: 1000,
  temperature: 0,
};


try {
  const response = await axios.post(
    this.apiUrl,
    payload,
    {
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.apiKey,
        'Anthropic-Version': '2023-06-01',
      },
    },
  );

  const jsonText = response.data.choices[0].message.content.trim();
  const clean = jsonText.replace(/```(json)?/g, '').trim();
  const items: Omit<ExpenseEntry, 'id'>[] = JSON.parse(clean);
  return items.map(item => ({ id: uuidv4(), ...item }));
} catch (err: any) {
  console.error('Claude error response:', err.response?.data);
  throw new HttpException(
    'Failed to parse expenses via Claude: ' + (err.response?.data.error?.message || err.message),
    HttpStatus.BAD_GATEWAY,
  );
}

  }
}
