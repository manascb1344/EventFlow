import { sql } from 'drizzle-orm/sql';
import { client, db } from './drizzle';
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function dropAllTables() {
    const tables = await db.execute<{ tablename: string }>(sql`
        SELECT tablename 
        FROM pg_tables
        WHERE schemaname = 'public';
    `);

    const tableNames = tables.map((row: { tablename: string }) => row.tablename);
    
    if (tableNames.length === 0) {
        console.log("No tables found in database.");
        await client.end();
        rl.close();
        return;
    }

    console.log("The following tables will be dropped:");
    tableNames.forEach((table: string) => console.log(`- ${table}`));
    
    rl.question('\nAre you sure you want to drop these tables? (yes/no): ', async (answer: string) => {
        if (answer.toLowerCase() === 'yes') {
            await db.execute(sql`
                DO $$ 
                DECLARE
                    drop_query text;
                BEGIN
                    SELECT string_agg('DROP TABLE IF EXISTS "' || tablename || '" CASCADE;', ' ')
                    INTO drop_query
                    FROM pg_tables
                    WHERE schemaname = 'public';
                    
                    IF drop_query IS NOT NULL THEN
                        EXECUTE drop_query;
                    END IF;
                END $$;
            `);
            console.log("All tables dropped successfully.");
        } else {
            console.log("Operation cancelled.");
        }
        await client.end();
        rl.close();
    });
}

dropAllTables().catch(console.error);
