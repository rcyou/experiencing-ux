import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const prerender = false;

const json = (body: Record<string, string>, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.formData();
    const firstName = data.get('firstName')?.toString().trim();
    const lastName = data.get('lastName')?.toString().trim();
    const email = data.get('email')?.toString().trim();
    const linkedin = data.get('linkedin')?.toString().trim();

    if (!firstName || !lastName || !email || !linkedin) {
      return json({ error: 'All fields are required.' }, 400);
    }

    const { AIRTABLE_ACCESS_TOKEN, AIRTABLE_BASE_ID, AIRTABLE_TABLE_NAME } = env;

    const airtableUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`;

    const response = await fetch(airtableUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${AIRTABLE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: {
          'First Name': firstName,
          'Last Name': lastName,
          'Email Address': email,
          'LinkedIn URL': linkedin,
        },
      }),
    });

    if (!response.ok) {
      const errLog = await response.text();
      console.error('Airtable Error:', errLog);
      return json({ error: 'Failed to save registration.' }, 500);
    }

    return json({ message: "Thanks for joining! We'll be in touch soon." }, 200);
  } catch (error) {
    console.error('Submit form error:', error);
    return json({ error: 'Internal Server Error' }, 500);
  }
};