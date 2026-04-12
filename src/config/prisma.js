// 
// 1. Purpose
//    Creates a PrismaClient instance that every repository
//    file imports. This way we have a single shared connection pool 
//    to the database, and we can easily manage it in one place.
//
//
// 2. How it works
//    - Import PrismaClient from the generated package
//    - Create one instance
//    - Export it so repositories can share it
//

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;
