import type { Page, Route } from '@playwright/test';

const CSRF_COOKIE = 'csrftoken=e2e-mock-csrf; Path=/; SameSite=Lax';

type RecordedRegister = { email: string; password: string };

export type SignUpMockOptions = {
  onRegister?: (body: RecordedRegister) => void;
  registerStatus?: number;
  registerBody?: unknown;
};

async function fulfillJson(
  route: Route,
  status: number,
  body: unknown,
  extraHeaders?: Record<string, string>,
) {
  await route.fulfill({
    status,
    contentType: 'application/json',
    headers: extraHeaders,
    body: JSON.stringify(body),
  });
}

/** Baseline routes for register flow; backend is not used in E2E. */
export async function installAppApiMocks(
  page: Page,
  signUp?: SignUpMockOptions,
) {
  // Match only HTTP API paths (/api/...), not Vite source modules (/src/api/...).
  await page.route('**/*', async (route) => {
    const url = new URL(route.request().url());
    const path = url.pathname;
    if (!path.startsWith('/api/')) {
      await route.continue();
      return;
    }
    const method = route.request().method();

    if (path === '/api/health' && method === 'GET') {
      await fulfillJson(route, 200, { status: 'ok' });
      return;
    }

    if (path === '/api/auth/me' && method === 'GET') {
      await fulfillJson(route, 401, { detail: 'Unauthorized' });
      return;
    }

    if (path === '/api/auth/csrf' && method === 'GET') {
      await fulfillJson(
        route,
        200,
        { detail: 'ok' },
        { 'Set-Cookie': CSRF_COOKIE },
      );
      return;
    }

    if (path === '/api/auth/register' && method === 'POST') {
      const body = route.request().postDataJSON() as RecordedRegister;
      signUp?.onRegister?.(body);
      const status = signUp?.registerStatus ?? 201;
      const payload =
        signUp?.registerBody ??
        (status === 201
          ? { id: 42, email: body.email }
          : { detail: 'A user with that email already exists.' });
      await fulfillJson(route, status, payload);
      return;
    }

    await fulfillJson(route, 404, {
      detail: `Unmocked route: ${method} ${path}`,
    });
  });
}
