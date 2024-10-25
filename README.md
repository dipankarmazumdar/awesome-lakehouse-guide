# awesome-lakehouse-guide
----------------------------------------

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
    <td><a href="https://arxiv.org/abs/2310.08697" target="_blank">The Data Lakehouse: Data Warehousing & More<.a></td>
    <td>Lakehouse</td>
    <td>This paper discusses the evolution of data systems, focusing on the Data Lakehouse architecture. The authors explain how traditional RDBMS-OLAP systems, foundational for data warehousing, face challenges due to their rigid architecture and limitations in handling diverse analytical workloads. The Data Lakehouse architecture addresses these shortcomings by combining the strengths of data lakes (scalable storage for diverse data types) and data warehouses (efficient query performance and ACID transactions). Overall, the paper provides side-by-side comparisons of a data lakehouse and warehouse.</td>
  </tr>
  <tr>
    <td><a href="https://www.cidrdb.org/cidr2021/papers/cidr2021_paper17.pdf" target="_blank">Lakehouse: A New Generation of Open Platforms that Unify Data Warehousing and Advanced Analytics</a></td>
    <td>Lakehouse</td>
    <td>This paper introduces the Lakehouse architecture as a next-generation data management platform designed to unify the benefits of data lakes and data warehouses. Traditional data architectures often face challenges related to data complexity, delayed processing, and the high costs of managing separate lake and warehouse environments. The Lakehouse concept addresses these issues by enabling low-cost storage with ACID transactional capabilities, data versioning, and SQL performance similar to data warehouses.</td>
  </tr>
</table>
