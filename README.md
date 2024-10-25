# awesome-lakehouse-guide
----------------------------------------

## Research Papers - Data Engineering (Lakehouse, Distributed Systems, Open Source)

<table>
  <tr>
    <th>Paper Name</th>
    <th>Area</th>
    <th>Quick Summary</th>
  </tr>
  <tr>
    <td><a href="https://www.cs.cit.tum.de/fileadmin/w00cfj/dis/papers/btrblocks.pdf" target="_blank">BtrBlocks</a></td>
    <td>File Format</td>
    <td>BtrBlocks introduces an efficient columnar storage format aimed at optimizing compression and decompression for data lakes, particularly when dealing with large datasets in cloud environments. The paper highlights how BtrBlocks outperforms traditional formats like Apache Parquet in both compression ratio and decompression speed. By using a combination of lightweight encoding schemes and a novel floating-point compression method called `Pseudodecimal Encoding`, BtrBlocks achieves significant improvements in scan performance, making it particularly useful for cloud-native systems that rely on high-throughput network environments like AWS S3. Key benefits include a 2.2x increase in scan speed and a 1.8x reduction in costs when compared to Parquet</td>
  </tr>
  <tr>
    <td><a href="https://arxiv.org/abs/2310.08697" target="_blank">The Data Lakehouse: Data Warehousing & More</a></td>
    <td>Lakehouse</td>
    <td>This paper discusses the evolution of data systems, focusing on the Data Lakehouse architecture. The authors explain how traditional RDBMS-OLAP systems, foundational for data warehousing, face challenges due to their rigid architecture and limitations in handling diverse analytical workloads. The Data Lakehouse architecture addresses these shortcomings by combining the strengths of data lakes (scalable storage for diverse data types) and data warehouses (efficient query performance and ACID transactions). Overall, the paper provides side-by-side comparisons of a data lakehouse and warehouse.</td>
  </tr>
  <tr>
    <td><a href="https://www.cidrdb.org/cidr2021/papers/cidr2021_paper17.pdf" target="_blank">Lakehouse: A New Generation of Open Platforms that Unify Data Warehousing and Advanced Analytics</a></td>
    <td>Lakehouse</td>
    <td>This paper introduces the Lakehouse architecture as a next-generation data management platform designed to unify the benefits of data lakes and data warehouses. Traditional data architectures often face challenges related to data complexity, delayed processing, and the high costs of managing separate lake and warehouse environments. The Lakehouse concept addresses these issues by enabling low-cost storage with ACID transactional capabilities, data versioning, and SQL performance similar to data warehouses.</td>
  </tr>
    <tr>
    <td><a href="https://www.amazon.science/publications/the-story-of-aws-glue" target="_blank">The Story of AWS Glue</a></td>
    <td>Data Tools</td>
    <td>AWS Glue is a serverless data integration service that simplifies the extraction, transformation, and loading (ETL) of data across various sources. Initially designed for batch ETL jobs, AWS Glue has evolved into a more versatile tool, supporting interactive debugging and dynamic scaling, making it suitable for a wide range of data processing tasks. One of its key components is the AWS Glue Data Catalog, which serves as a scalable metadata service, allowing users to store datasets from various sources. The paper details the architectural evolution of AWS Glue over six years, including lessons learned from customer use cases such as loading data warehouses, integrating on-premises databases, and ingesting streaming data. </td>
  </tr>
  <tr>
    <td><a href="https://www.amazon.science/publications/auto-wlm-machine-learning-enhanced-workload-management-in-amazon-redshift" target="_blank">Auto-WLM: Machine learning enhanced workload management in Amazon Redshift</a></td>
    <td>Data Tools</td>
    <td>This paper explores Auto-WLM (Automatic Workload Management), which is a machine learning-based system used in Amazon Redshift to manage and optimize query workloads efficiently. Traditional workload management systems rely on static configurations and manual tuning, but Auto-WLM introduces an intelligent, automated approach that adjusts resources dynamically based on real-time conditions. This capability has been implemented in production, showing improvements in query throughput and resource utilization, particularly under complex and mixed workload scenarios. </td>
  </tr>
  <tr>
    <td><a href="https://www.vldb.org/pvldb/vol16/p3044-liu.pdf" target="_blank">A Deep Dive into Common Open Formats for Analytical DBMSs</a></td>
    <td>File Format</td>
    <td>This paper evaluates the suitability of open columnar storage formats—Apache Arrow, Parquet, and ORC—for analytical database management systems (DBMSs). It provides an in-depth analysis of the encoding techniques, compression methods, and performance trade-offs associated with these formats. Key insights include comparisons between various encoding methods such as Bit-Packed Encoding (BP), Dictionary Encoding (DICT), and Run-Length Encoding (RLE). The paper emphasizes the trade-offs between space efficiency and query performance across these formats, providing guidance on selecting the right format for different analytical workloads.</td>
  </tr>
  <tr>
    <td><a href="https://arxiv.org/pdf/2401.09621" target="_blank">XTABLE in Action: Seamless Interoperability in Data Lakes</a></td>
    <td>Storage</td>
    <td>The paper introduces XTable, a solution designed to enhance interoperability between open table formats (LSTs) like Delta Lake, Apache Hudi, and Apache Iceberg in data lakes. XTable facilitates seamless data translation without rewriting tables, allowing data stored in one format to be accessible in others without costly migrations. The paper goes over the internal architecture of XTable and presents some real-world applications.</td>
  </tr>
  <tr>
    <td><a href="https://asterios.katsifodimos.com/assets/publications/flink-deb.pdf" target="_blank">Apache FlinkTM: Stream and Batch Processing in a Single Engine</a></td>
    <td>Compute Engine</td>
    <td>The paper explores Apache Flink, an open-source stream and batch processing engine. Flink provides a unified system to handle real-time data streams and batch data processing. The core of Flink's architecture is a distributed dataflow engine that enables scalable, fault-tolerant, and low-latency processing of large datasets. Key capabilities include state management, event time processing, and exactly-once semantics. The paper goes over Flink's application to workloads such as real-time analytics, machine learning, and ETL pipelines</td>
  </tr>
    <tr>
    <td><a href="https://www.amazon.science/publications/automated-multidimensional-data-layouts-in-amazon-redshift" target="_blank">Automated multidimensional data layouts in Amazon Redshift</a></td>
    <td>Storage</td>
    <td>This paper explores the introduction of Multidimensional Data Layouts (MDDL) in Amazon Redshift, which enhances query performance by automatically optimizing the physical data layout. Traditional data layout techniques, such as single-column and compound sort keys, are effective for some queries but struggle with multi-column filtering. MDDL improves upon this by dynamically organizing data across multiple dimensions, allowing for more efficient data pruning and skipping. The paper claims that this layout achieves up to 85% reduction in workload runtime and up to 100× faster performance on specific queries</td>
  </tr>
   <tr>
    <td><a href="https://research.google/pubs/vortex-a-stream-oriented-storage-engine-for-big-data-analytics/" target="_blank">Vortex: A Stream-oriented Storage Engine For Big Data Analytics</a></td>
    <td>Storage</td>
    <td>The paper presents Vortex, a storage engine developed within Google BigQuery to support real-time and batch data analytics. Vortex operates as a stream-first system, capable of handling both types of workloads efficiently, addressing the challenges of managing petabyte-scale data ingestion and processing. It achieves sub-second data freshness and low-latency query performance. Vortex integrates with BigQuery's distributed query engine, Dremel, and leverages Google's Colossus file system for robust, disaster-resilient storage.</td>
  </tr>
</table>
