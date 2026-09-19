import type { TopicTheoryContent } from "@/content/theory/types";

export const databaseIndexingTheory: TopicTheoryContent = {
  summary:
    "A database index is a separate, sorted data structure that maps column values to the rows that hold them, so a query can jump to matching rows in a handful of page reads instead of scanning the whole table.",
  whatItIs: [
    "A table on disk is a heap: rows sit in pages in whatever order they were inserted. Finding every row where email equals a given value means reading every page and comparing every row, and that work grows in direct proportion to the table size. An index is a second structure, maintained alongside the table, that keeps the values of one or more columns in sorted order together with a pointer to each row.",
    "Almost every relational database implements the default index as a B-tree. Internal pages hold separator keys and child pointers, leaf pages hold the actual keys with their row pointers (a page number and slot in PostgreSQL, a primary key value in InnoDB secondary indexes), and all leaves sit at the same depth. Because a single 8 KB page holds hundreds of keys, a tree that covers millions of rows is only three or four levels tall, so a lookup costs three or four page reads regardless of how many rows exist.",
    "The query planner decides whether to use an index. It keeps statistics per column (number of distinct values, most common values, a histogram) and estimates how many rows a predicate will select. A highly selective predicate on an indexed column is served by an index scan. A predicate that matches a large fraction of the table is often cheaper as a sequential scan, since following thousands of row pointers into random heap pages costs more than reading the pages in order.",
    "Indexes are not free. Every INSERT, every DELETE, and every UPDATE that touches an indexed column must also modify each affected index, and a full leaf page has to split, which writes two leaves and updates the parent. Indexes also take disk space and buffer pool memory. The engineering task is to create the few indexes that match the predicates and sort orders queries actually use, and to remove the ones that only slow writes down.",
  ],
  howItWorks: [
    "Step 1: a query arrives and the planner checks the catalog for indexes whose leading columns match the predicates, join conditions, or ORDER BY of the query.",
    "Step 2: for each candidate plan the planner estimates cost from column statistics: how many rows the predicate selects, how many index pages and heap pages that implies, and whether the heap fetches would be random or sequential.",
    "Step 3: with an index scan chosen, the executor reads the root page, compares the search key against the separators, and follows one child pointer per level until it reaches a leaf. Each level rules out all but one subtree.",
    "Step 4: at the leaf, a binary search over the sorted keys finds the first matching entry. For a range or a prefix match the executor keeps walking forward through the leaf chain while the keys still match.",
    "Step 5: each matching entry carries a row pointer, so the executor fetches that heap page and slot to return the full row. If every column the query needs is already in the index, the heap fetch is skipped entirely (an index only scan).",
    "Step 6: on writes, the engine inserts the new key into every index in sorted position, splitting a full leaf and promoting a separator to the parent when necessary. The same descent that makes reads cheap makes each write cost one or more extra page writes per index.",
  ],
  commonMistakes: [
    {
      title: "Composite index in the wrong column order",
      explanation:
        "An index on (last_name, first_name) sorts by last_name first. A filter on first_name alone has no leading prefix to descend by, so the planner cannot use the index and scans the table, even though the column is in the index.",
      fix: "Order columns so that the ones used with equality in most queries come first, followed by the column used for a range or sort. Create a second index if two query shapes need different leading columns.",
    },
    {
      title: "Wrapping the indexed column in a function",
      explanation:
        "WHERE lower(email) = ... or WHERE date(created_at) = ... compares an expression, not the column the index stores. The planner cannot prove the expression preserves the index order, so the index is ignored.",
      fix: "Either rewrite the predicate to compare the raw column, or create an expression index on lower(email) so the stored keys match the predicate exactly.",
    },
    {
      title: "Adding an index for every column",
      explanation:
        "Each index is another B-tree to update on every write. A table with ten indexes turns a single row insert into ten index inserts plus occasional page splits, and the extra pages compete for buffer pool memory with the data itself.",
      fix: "Add indexes only for predicates and sorts that appear in real query plans, check usage statistics such as pg_stat_user_indexes, and drop indexes that are never scanned.",
    },
    {
      title: "Expecting an index to help a low selectivity predicate",
      explanation:
        "A filter like status = 'active' that matches 90 percent of the rows would force the executor to follow a row pointer into a random heap page for nearly every row, which is slower than reading the heap in order. The planner correctly chooses a sequential scan and the index sits unused.",
      fix: "Index columns whose values narrow the result down, or use a partial index (WHERE status = 'pending') that only covers the small, frequently queried subset.",
    },
  ],
  interviewQuestions: [
    {
      question:
        "Why is a B-tree lookup O(log n) and what does that mean in page reads?",
      answer:
        "Each internal page holds hundreds of separator keys, so every level divides the remaining search space by hundreds. A tree over a million rows is typically three or four levels tall, so a point lookup reads three or four index pages plus one heap page. A sequential scan on the same table reads every page, tens of thousands of them, and doubles when the table doubles.",
    },
    {
      question: "What is the leftmost prefix rule for composite indexes?",
      answer:
        "An index on (a, b, c) can serve predicates on a, on a and b, or on a, b, and c, because the keys are sorted by a first. A predicate on b alone or on c alone cannot descend the tree, since matching values are scattered under every a. Equality on a combined with a range on b still works, but a range on a followed by equality on b only uses the index for a.",
      codeExample: {
        language: "sql",
        code: `CREATE INDEX users_name_idx ON users (last_name, first_name);

-- uses the index (full key)
SELECT * FROM users WHERE last_name = 'Lovelace' AND first_name = 'Ada';
-- uses the index (leading prefix)
SELECT * FROM users WHERE last_name = 'Lovelace';
-- cannot use the index: no leading column
SELECT * FROM users WHERE first_name = 'Ada';`,
      },
    },
    {
      question:
        "What is a covering index and when does the planner use an index only scan?",
      answer:
        "A covering index contains every column the query reads, either as key columns or as INCLUDE columns. The executor can answer from the leaf entries and skip the heap fetch, as long as the visibility map shows the heap page has no rows that need a visibility check. This removes the random heap reads that make index scans expensive on wide result sets.",
      codeExample: {
        language: "sql",
        code: `CREATE INDEX orders_customer_idx
  ON orders (customer_id) INCLUDE (total, created_at);

-- every referenced column is in the index: Index Only Scan
SELECT total, created_at FROM orders WHERE customer_id = 42;`,
      },
    },
    {
      question:
        "Why might the planner ignore an index that matches the WHERE clause?",
      answer:
        "The planner compares estimated costs, not just applicability. If the statistics say the predicate selects a large share of the table, the random heap fetches of an index scan cost more than a sequential read of the whole table. Stale statistics, a function around the column, or a type mismatch that forces a cast can also make the index unusable.",
    },
    {
      question:
        "What happens inside a B-tree when a leaf page is full and a new key arrives?",
      answer:
        "The leaf splits: roughly half its keys stay, the other half move to a newly allocated leaf, and the first key of the new leaf is copied into the parent as a separator. If the parent is also full it splits the same way, and a split of the root adds a new level. This keeps every leaf at the same depth, which is the balance property that guarantees the logarithmic lookup cost.",
      codeExample: {
        language: "sql",
        code: `-- one row, three indexes: one heap write plus three B-tree inserts,
-- each of which may split a full leaf and update its parent
INSERT INTO users (id, email, last_name, first_name)
VALUES (13, 'donald@example.com', 'Knuth', 'Donald');`,
      },
    },
  ],
  relatedTopicIds: [
    "caching-strategies",
    "http-request-lifecycle",
    "rate-limiting",
    "heap-stack",
  ],
};
