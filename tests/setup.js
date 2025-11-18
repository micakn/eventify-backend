// tests/setup.js
// Configuración global para tests

import { jest } from '@jest/globals';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Aumentar timeout para operaciones de base de datos
jest.setTimeout(30000);

// Silenciar logs durante tests (opcional)
const originalConsole = global.console;

global.console = {
  ...originalConsole,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};