// tests/core.test.ts

import { test, expect, vi } from 'vitest';
import * as core from '@actions/core';

// Mock de @actions/core
vi.mock('@actions/core', () => ({
  setOutput: vi.fn(),
  setFailed: vi.fn(),
}));

test('Teste une fonction utilisant @actions/core', () => {
  // Ton test qui utilise @actions/core
  core.setOutput('clé', 'valeur');
  expect(core.setOutput).toHaveBeenCalledWith('clé', 'valeur');
});
