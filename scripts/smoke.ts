import 'dotenv/config';

const webUrl = process.env.APP_URL ?? 'http://localhost:3001';
const apiUrl = process.env.BACKEND_API_URL ?? 'http://localhost:4000';

async function check(url: string, description: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${description} failed with status ${response.status}`);
  }
  console.log(`OK ${description} (${url})`);
}

async function main() {
  await check(`${apiUrl}/healthz`, 'API health');
  await check(`${apiUrl}/v1/demo/metrics`, 'API demo metrics');
  await check(`${apiUrl}/v1/demo/outcomes`, 'API operational outcomes');
  await check(`${apiUrl}/v1/champion/cohorts`, 'API champion cohorts');
  await check(`${webUrl}/`, 'Web home');
  await check(`${webUrl}/demo`, 'Web demo page');
  await check(`${webUrl}/sitemap.xml`, 'Web sitemap');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
