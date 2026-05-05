import { NextResponse } from "next/server";

export type ApiJson<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export function ok<T>(data: T, status = 200) {
  return NextResponse.json<ApiJson<T>>({ success: true, data }, { status });
}

export function created<T>(data: T) {
  return ok(data, 201);
}

export function fail(error: string, status = 400) {
  return NextResponse.json<ApiJson<never>>({ success: false, error }, { status });
}

export async function readJson<T extends Record<string, unknown>>(request: Request): Promise<T> {
  try {
    return (await request.json()) as T;
  } catch {
    return {} as T;
  }
}

export function requireFields(payload: Record<string, unknown>, fields: string[]) {
  return fields.find((field) => {
    const value = payload[field];
    return value === undefined || value === null || value === "";
  });
}
