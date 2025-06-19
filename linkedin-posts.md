What is 'Vectorized Processing'?



MonetDB/X100 was awarded the CIDR Test of Time Award for its inception of vectorized execution.

Modern CPUs offer tremendous parallelism and instruction throughput, but traditional database engines struggle to use this power efficiently. 

Most relational database systems still rely on the 'Volcano-style' iterator model, which processes one tuple at a time.

This limits opportunities for compiler optimizations like loop pipelining and leading to poor CPU utilization.

To tackle these problems, the paper introduces "MonetDB/X100", a new query engine based on vectorized query execution model!

The idea is simple:
✅ Operate on batches of small columnar blocks called 'vectors', instead of processing each row individually.

✅ This approach reduces CPU instruction overhead and cache misses, resulting in improved query processing performance.

X100 achieves dramatic performance improvements (up to 100x faster than traditional engines) by balancing CPU efficiency and memory bandwidth usage.

It performs close to hand-optimized C code and outperforms commercial and academic systems on TPC-H queries.

Note that this paper was the inspiration for DuckDB’s vectorized execution engine.

Today this model is used by most of the cloud data warehouses/query engines such as Snowflake, Databricks, Google BigQuery to improve the performance of complex analytical queries.

Paper link: https://www.cidrdb.org/cidr2005/papers/P19.pdf
