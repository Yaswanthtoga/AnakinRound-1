import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema"

const pool = new Pool({
    connectionString: "postgres://admin:admin@localhost:5432/irctcdb"
})

pool.connect()
pool.on('connect',()=>{console.log("DB Connection Established")})
export const db = drizzle(pool,{ schema:schema });