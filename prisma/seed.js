// ==
// Seed script for Book Club API
//
// 1. Purpose
//    Populates the database with sample data so the API has
//    something to work with right away. Creates users, books,
//    clubs, memberships, and reading list entries.
//
// 2. How to run
//    npx prisma db seed
//
// 3. What it creates
//    - 3 users (passwords are hashed with bcrypt)
//    - 6 books across different genres
//    - 2 clubs, each owned by a different user
//    - Club memberships (owners auto-added, plus some cross-joins)
//    - Reading list entries with different statuses
//
// 4. Notes
//    - Uses upsert so running it twice won't crash on duplicates
//    - The passwords for all seed users are "password123"
//
// ==

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // --- Users ---
  // All passwords are "password123" — just for testing
  const passwordHash = await bcrypt.hash("password123", 10);

  const alice = await prisma.user.upsert({
    where: { email: "alice@example.com" },
    update: {},
    create: {
      username: "alice",
      email: "alice@example.com",
      passwordHash,
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: "bob@example.com" },
    update: {},
    create: {
      username: "bob",
      email: "bob@example.com",
      passwordHash,
    },
  });

  const charlie = await prisma.user.upsert({
    where: { email: "charlie@example.com" },
    update: {},
    create: {
      username: "charlie",
      email: "charlie@example.com",
      passwordHash,
    },
  });

  console.log("Created users: alice, bob, charlie");

  // --- Books ---
  const books = [];

  const bookData = [
    {
      title: "Dune",
      author: "Frank Herbert",
      isbn: "9780441013593",
      genre: "Science Fiction",
      pageCount: 688,
    },
    {
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      isbn: "9780547928227",
      genre: "Fantasy",
      pageCount: 300,
    },
    {
      title: "1984",
      author: "George Orwell",
      isbn: "9780451524935",
      genre: "Dystopian",
      pageCount: 328,
    },
    {
      title: "Pride and Prejudice",
      author: "Jane Austen",
      isbn: "9780141439518",
      genre: "Romance",
      pageCount: 432,
    },
    {
      title: "The Martian",
      author: "Andy Weir",
      isbn: "9780553418026",
      genre: "Science Fiction",
      pageCount: 369,
    },
    {
      title: "Educated",
      author: "Tara Westover",
      isbn: "9780399590504",
      genre: "Memoir",
      pageCount: 334,
    },
  ];

  for (const data of bookData) {
    const book = await prisma.book.upsert({
      where: { isbn: data.isbn },
      update: {},
      create: data,
    });
    books.push(book);
  }

  console.log(`Created ${books.length} books`);

  // --- Clubs ---
  // Delete existing clubs first to avoid duplicate member issues on re-seed
  await prisma.club.deleteMany({
    where: {
      name: { in: ["Sci-Fi Enthusiasts", "Classic Literature Club"] },
    },
  });

  const scifiClub = await prisma.club.create({
    data: {
      name: "Sci-Fi Enthusiasts",
      description: "We read sci-fi and talk about it. That's pretty much it.",
      isPrivate: false,
      ownerId: alice.id,
    },
  });

  const classicsClub = await prisma.club.create({
    data: {
      name: "Classic Literature Club",
      description: "For people who like the old stuff.",
      isPrivate: false,
      ownerId: bob.id,
    },
  });

  console.log("Created clubs: Sci-Fi Enthusiasts, Classic Literature Club");

  // --- Club Members ---
  // Owners get added as members with "owner" role
  // Then we add some cross-memberships

  await prisma.clubMember.createMany({
    data: [
      { clubId: scifiClub.id, userId: alice.id, role: "owner" },
      { clubId: scifiClub.id, userId: bob.id, role: "member" },
      { clubId: classicsClub.id, userId: bob.id, role: "owner" },
      { clubId: classicsClub.id, userId: charlie.id, role: "member" },
    ],
  });

  console.log("Added club memberships");

  // --- Reading List Entries ---
  // Dune and The Martian go in the sci-fi club
  // Pride and Prejudice and 1984 go in the classics club

  await prisma.readingList.createMany({
    data: [
      {
        clubId: scifiClub.id,
        bookId: books[0].id, // Dune
        status: "finished",
        startedAt: new Date("2025-01-15"),
        finishedAt: new Date("2025-02-28"),
      },
      {
        clubId: scifiClub.id,
        bookId: books[4].id, // The Martian
        status: "reading",
        startedAt: new Date("2025-03-01"),
      },
      {
        clubId: classicsClub.id,
        bookId: books[3].id, // Pride and Prejudice
        status: "reading",
        startedAt: new Date("2025-02-01"),
      },
      {
        clubId: classicsClub.id,
        bookId: books[2].id, // 1984
        status: "planned",
      },
    ],
  });

  console.log("Added reading list entries");
  console.log("Seed complete!");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });