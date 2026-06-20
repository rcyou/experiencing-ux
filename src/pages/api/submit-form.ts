import type { APIRoute } from 'astro';

export const prerender = false; // Ensures this endpoint runs on-demand (SSR)

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const data = await request.formData();
    const firstName = data.get('firstName')?.toString().trim();
    const lastName = data.get('lastName')?.toString().trim();
    const email = data.get('email')?.toString().trim();
    const linkedin = data.get('linkedin')?.toString().trim();

    // 1. Server-side validation (Security Boundary)
    if (!firstName || !lastName || !email || !linkedin) {
      return new Response(JSON.stringify({ error: 'All fields are required.' }), { status: 400 });
    }

    // 2. Fetch Environment Variables from Cloudflare runtime
    const { AIRTABLE_ACCESS_TOKEN, AIRTABLE_BASE_ID, AIRTABLE_TABLE_NAME } = locals.runtime.env;

    // 3. Post data to Airtable REST API
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
      return new Response(JSON.stringify({ error: 'Failed to save registration.' }), { status: 500 });
    }

    // 4. Redirect safely back to a thank you state or landing page
    return Astro.redirect('/success');

  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
};