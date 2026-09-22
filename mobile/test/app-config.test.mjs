import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';

const projectUrl = new URL('../', import.meta.url);

async function readJson(relativePath) {
  const contents = await readFile(new URL(relativePath, projectUrl), 'utf8');
  return JSON.parse(contents);
}

test('Expo configuration identifies the Seawolf Rides mobile app', async () => {
  const { expo } = await readJson('app.json');

  assert.equal(expo.name, 'Seawolf Rides');
  assert.equal(expo.slug, 'seawolf-rides');
  assert.equal(expo.orientation, 'portrait');
});

test('the package entrypoint and configured image assets exist', async () => {
  const packageJson = await readJson('package.json');
  const { expo } = await readJson('app.json');
  const configuredAssets = [
    expo.icon,
    expo.android.adaptiveIcon.foregroundImage,
    expo.android.adaptiveIcon.backgroundImage,
    expo.android.adaptiveIcon.monochromeImage,
    expo.web.favicon,
  ];

  await access(new URL(packageJson.main, projectUrl));
  await Promise.all(configuredAssets.map((asset) => access(new URL(asset, projectUrl))));
});
