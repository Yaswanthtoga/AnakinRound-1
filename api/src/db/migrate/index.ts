import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import "dotenv/config";

try {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL
    })
    
    const db = drizzle(pool);
    const main = async ()=>{
        console.log("Migration Started");
        await migrate(db,{migrationsFolder:"drizzle"})
        console.log("Migration Completed");
        process.exit(0);
    }
    main();
} catch (error) {
    console.log(error)
    process.exit(1);
}