import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../src/index.css', import.meta.url), 'utf8');

const tokenPattern = /--([a-z0-9-]+):\s*(#[0-9a-fA-F]{6})\s*;/g;
const tokens = {};

for (const match of css.matchAll(tokenPattern)) {
  tokens[match[1]] = match[2].toLowerCase();
}

const darkChecks = [
  ['text-primary', 12],
  ['text-secondary', 8],
  ['text-muted', 4.5],
  ['accent-gold', 4.5],
  ['accent-success', 4.5],
  ['accent-danger', 4.5],
  ['border-primary', 3],
  ['border-hover', 4.5],
];

const lightChecks = [
  ['text-primary-light', 12],
  ['text-secondary-light', 8],
  ['text-muted-light', 4.5],
  ['accent-gold-light', 4.5],
  ['accent-success-light', 4.5],
  ['accent-danger-light', 4.5],
  ['border-primary-light', 3],
  ['border-hover-light', 4.5],
];

function luminance(hex) {
  const channels = [1, 3, 5].map((start) => parseInt(hex.slice(start, start + 2), 16) / 255);
  const linear = channels.map((channel) => (
    channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  ));

  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function contrastRatio(foreground, background) {
  const [lighter, darker] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
}

function runChecks(label, backgroundToken, checks) {
  const background = tokens[backgroundToken];
  if (!background) {
    throw new Error(`Missing background token --${backgroundToken}`);
  }

  return checks.map(([token, minimum]) => {
    const color = tokens[token];
    if (!color) {
      throw new Error(`Missing token --${token}`);
    }

    const ratio = contrastRatio(color, background);

    return {
      label,
      token,
      color,
      background,
      minimum,
      ratio,
      pass: ratio >= minimum,
    };
  });
}

const results = [
  ...runChecks('dark', 'bg-primary', darkChecks),
  ...runChecks('light', 'bg-primary-light', lightChecks),
];

const failures = results.filter((result) => !result.pass);

for (const result of results) {
  const status = result.pass ? 'PASS' : 'FAIL';
  console.log(
    `${status} ${result.label} --${result.token} ${result.color} vs ${result.background}: `
      + `${result.ratio.toFixed(2)}:1 >= ${result.minimum}:1`,
  );
}

if (failures.length > 0) {
  console.error(`\nContrast audit failed: ${failures.length} token(s) below threshold.`);
  process.exit(1);
}

console.log('\nContrast audit passed.');
