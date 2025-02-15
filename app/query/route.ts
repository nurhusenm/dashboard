import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL_NON_POOLING!, { 
	ssl: 'require',
	max: 1,
	idle_timeout: 20,
	connect_timeout: 30,
	connection: {
		keepAlive: true
	}
});

async function listInvoices() {
	const data = await sql`
    SELECT invoices.amount, customers.name
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE invoices.amount = 666;
  `;

	return data;
}

export async function GET() {
	try {
		return Response.json(await listInvoices());
	} catch (error) {
		console.error('Query error:', error);
		return Response.json({ error }, { status: 500 });
	} finally {
		await sql.end();
	}
}
