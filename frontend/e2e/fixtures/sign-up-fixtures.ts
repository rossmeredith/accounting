import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../..',
);

export type SignUpFixture = {
  email: string;
  password: string;
};

export type SignUpFixturesFile = {
  success: SignUpFixture;
  duplicate_email: SignUpFixture;
};

export const signUpFixtures: SignUpFixturesFile = JSON.parse(
  readFileSync(path.join(repoRoot, 'test-fixtures/sign-up.json'), 'utf8'),
) as SignUpFixturesFile;
