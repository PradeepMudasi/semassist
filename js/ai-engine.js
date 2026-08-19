// SemAssist - Intelligent Mock AI Engine for Semester Exam Preparation
class SemAssistAI {
  constructor() {
    this.knowledgeBase = {
      // Operating Systems
      "paging": {
        topic: "Paging & Virtual Memory in Operating Systems",
        explanation: `### 🧠 Topic Breakdown: Paging in Operating Systems

**1. Core Concept:**
Paging is a memory management scheme that eliminates the need for contiguous allocation of physical memory. It permits the physical address space of a process to be non-contiguous.

- **Logical Memory** is divided into fixed-size blocks called **Pages**.
- **Physical Memory (RAM)** is divided into equal fixed-size blocks called **Frames**.
- **Page Table**: Hardware-assisted map translating Logical Page Numbers (\`p\`) to Physical Frame Numbers (\`f\`).

---

### 📊 Address Translation Mechanism
\`\`\`
Logical Address = [ Page Number (p) | Offset (d) ]
Physical Address = [ Frame Number (f) | Offset (d) ]
\`\`\`

1. CPU generates a logical address containing Page Number (\`p\`) and Offset (\`d\`).
2. \`p\` is used as an index into the **Page Table**.
3. The corresponding Frame Number (\`f\`) is retrieved.
4. Physical Address is formulated as \`Frame (f) * Page Size + Offset (d)\`.

---

### 🎯 Key Exam Comparison: Paging vs Segmentation
| Feature | Paging | Segmentation |
| :--- | :--- | :--- |
| **Block Size** | Fixed size | Variable size (user view) |
| **Fragmentation** | Suffers from **Internal Fragmentation** | Suffers from **External Fragmentation** |
| **Visibility** | Invisible to programmer | Visible to programmer |

> 💡 **Exam Tip**: When asked about the Translation Lookaside Buffer (TLB), remember Effective Memory Access Time (EMAT) formula:  
> \`EMAT = Hit_Ratio * (TLB_time + Mem_time) + (1 - Hit_Ratio) * (TLB_time + 2 * Mem_time)\``
      },

      "deadlock": {
        topic: "Deadlocks & Banker's Algorithm",
        explanation: `### 🔒 Deadlock Conditions & Banker's Algorithm

A deadlock is a situation where a set of processes are blocked because each process is holding a resource and waiting for another resource held by some other process.

#### 1. The 4 Necessary Coffman Conditions:
1. **Mutual Exclusion**: Non-shareable resource.
2. **Hold and Wait**: Process holds one resource while waiting for another.
3. **No Preemption**: Resources cannot be forcibly taken away.
4. **Circular Wait**: $P_0 \\rightarrow P_1 \\rightarrow P_2 \\dots \\rightarrow P_0$.

---

#### 2. Banker's Algorithm (Deadlock Avoidance)
Used by the OS to ensure that resource allocation leaves the system in a **Safe State**.

- **Need Matrix Calculation**:
  $$\\text{Need}[i][j] = \\text{Max}[i][j] - \\text{Allocation}[i][j]$$

- **Algorithm Steps**:
  1. Let \`Work = Available\` and \`Finish[i] = false\` for all $i$.
  2. Find an index $i$ such that \`Finish[i] == false\` and \`Need[i] <= Work\`.
  3. If found, \`Work = Work + Allocation[i]\`, \`Finish[i] = true\`. Repeat.
  4. If all \`Finish[i] == true\`, the state is **SAFE**.`
      },

      // Data Structures & Algorithms
      "dijkstra": {
        topic: "Dijkstra's Shortest Path Algorithm",
        explanation: `### ⚡ Dijkstra's Algorithm (Single Source Shortest Path)

Dijkstra's algorithm finds the shortest path from a starting node to all other vertices in a weighted graph with **non-negative edge weights**.

---

### 🛠️ Algorithm Steps (Greedy Approach):
1. Maintain a set of visited vertices and an array \`dist[]\` initialized to $\\infty$, with \`dist[source] = 0\`.
2. Use a **Min-Priority Queue (Min-Heap)** storing \`(distance, vertex)\`.
3. Extract the unvisited vertex $u$ with minimum \`dist[u]\`.
4. **Edge Relaxation**: For each neighbor $v$ of $u$:
   \`\`\`cpp
   if (dist[u] + weight(u, v) < dist[v]) {
       dist[v] = dist[u] + weight(u, v);
       pq.push({dist[v], v});
   }
   \`\`\`
5. Repeat until the priority queue is empty.

---

### ⏱️ Time & Space Complexity:
- **Time Complexity**: $\\mathcal{O}((V + E) \\log V)$ using an adjacency list and binary heap.
- **Space Complexity**: $\\mathcal{O}(V)$ for distance array and priority queue.

> ⚠️ **Common Exam Trap**: Dijkstra's fails if there are **negative weight edges**! For negative edges, use **Bellman-Ford Algorithm** ($\\\\mathcal{O}(V \\\\cdot E)$).`
      },

      // DBMS
      "normalization": {
        topic: "Database Normalization (1NF, 2NF, 3NF, BCNF)",
        explanation: `### 🗄️ Database Normalization Guide

Normalization is the process of organizing data in a database to reduce data redundancy and eliminate insertion, update, and deletion anomalies.

---

### 📌 Summary of Normal Forms:
1. **1NF (First Normal Form)**:
   - Each column contains **atomic** (indivisible) values.
   - No repeating groups or arrays.

2. **2NF (Second Normal Form)**:
   - Must be in 1NF.
   - **No Partial Dependency**: Every non-prime attribute must be fully functionally dependent on the entire primary key (no sub-key dependencies).

3. **3NF (Third Normal Form)**:
   - Must be in 2NF.
   - **No Transitive Dependency**: Non-prime attributes must not depend on other non-prime attributes ($X \\rightarrow Y$, where neither is key).

4. **BCNF (Boyce-Codd Normal Form - 3.5NF)**:
   - For every functional dependency $X \\rightarrow Y$, $X$ **MUST be a Super Key**.`
      },

      // Computer Networks
      "tcp": {
        topic: "TCP vs UDP & 3-Way Handshake",
        explanation: `### 🌐 Transport Layer: TCP vs UDP & Handshake

---

### 1. TCP 3-Way Handshake Connection Protocol:
1. **Step 1 (SYN)**: Client sends \`SYN (Sequence Number = x)\` to initiate connection.
2. **Step 2 (SYN-ACK)**: Server replies with \`SYN + ACK (Seq = y, Ack = x + 1)\`.
3. **Step 3 (ACK)**: Client confirms with \`ACK (Seq = x + 1, Ack = y + 1)\`. Connection Established!

---

### 2. TCP vs UDP Exam Quick Reference:
| Characteristic | TCP (Transmission Control Protocol) | UDP (User Datagram Protocol) |
| :--- | :--- | :--- |
| **Connection** | Connection-oriented | Connectionless |
| **Reliability** | Guaranteed delivery (Retransmissions) | Best effort (No retransmission) |
| **Ordering** | In-order byte stream | Unordered packets |
| **Speed** | Slower (Overhead of ACKs & flow control) | Extremely fast & lightweight |
| **Use Cases** | Web (HTTP/HTTPS), Email (SMTP), File Transfer | DNS, Live Video Streaming, VoIP, Online Gaming |`
      }
    };
  }

  // Generate realistic response based on prompt text & type
  async generateResponse(prompt, type = 'general', contextSubject = null) {
    const rawPrompt = prompt || '';
    const p = rawPrompt.toLowerCase();

    // 1. MCQ Quiz Generation
    if (type === 'mcq' || p.includes('mcq') || p.includes('quiz') || p.includes('multiple choice')) {
      return this.getMcqQuizResponse(rawPrompt, contextSubject);
    }

    // 2. Important Exam Questions
    if (type === 'questions' || p.includes('important question') || p.includes('exam question') || p.includes('questions for') || p.includes('recurring')) {
      return this.getImportantQuestionsResponse(rawPrompt, contextSubject);
    }

    // 3. Summarize Notes
    if (type === 'summarize' || p.includes('summarize') || p.includes('summary') || p.includes('cheatsheet')) {
      return this.getSummaryResponse(rawPrompt, contextSubject);
    }

    // 4. Study Plan
    if (type === 'plan' || p.includes('study plan') || p.includes('revision plan') || p.includes('schedule') || p.includes('timetable')) {
      return this.getStudyPlanResponse(rawPrompt);
    }

    // 5. Explain Topic
    return this.getExplanationResponse(rawPrompt, contextSubject);
  }

  getExplanationResponse(prompt, contextSubject) {
    const p = (prompt || '').toLowerCase();
    // Check keyword matches in knowledge base
    if (p.includes('page') || p.includes('paging') || p.includes('virtual memory') || p.includes('segmentation')) {
      return {
        text: this.knowledgeBase.paging.explanation,
        subjectTag: "Operating Systems (CS301)",
        suggestedNotesTitle: "Virtual Memory & Paging Mechanics"
      };
    }

    if (p.includes('deadlock') || p.includes('banker') || p.includes('semaphore') || p.includes('mutex')) {
      return {
        text: this.knowledgeBase.deadlock.explanation,
        subjectTag: "Operating Systems (CS301)",
        suggestedNotesTitle: "Deadlock Prevention & Banker's Algorithm"
      };
    }

    if (p.includes('dijkstra') || p.includes('shortest path') || p.includes('graph') || p.includes('bfs') || p.includes('dfs')) {
      return {
        text: this.knowledgeBase.dijkstra.explanation,
        subjectTag: "Data Structures & Algorithms (CS302)",
        suggestedNotesTitle: "Dijkstra's Algorithm & Graph Traversal"
      };
    }

    if (p.includes('normal') || p.includes('acid') || p.includes('dbms') || p.includes('sql') || p.includes('bcnf')) {
      return {
        text: this.knowledgeBase.normalization.explanation,
        subjectTag: "Database Management (CS303)",
        suggestedNotesTitle: "Relational Normalization: 1NF to BCNF"
      };
    }

    if (p.includes('tcp') || p.includes('osi') || p.includes('handshake') || p.includes('udp') || p.includes('subnet')) {
      return {
        text: this.knowledgeBase.tcp.explanation,
        subjectTag: "Computer Networks (CS304)",
        suggestedNotesTitle: "TCP/IP Protocol Stack & 3-Way Handshake"
      };
    }

    // Generic high-yield technical explanation
    const subjectName = contextSubject || "Semester Engineering Syllabus";
    return {
      text: `### 🎓 Core Academic Explanation: ${prompt.toUpperCase()}

Here is a structured, exam-oriented conceptual breakdown for **${subjectName}**:

---

#### 1. Definition & Core Objective
The primary objective of this concept is to optimize resource utilization, ensure deterministic execution, and provide scalable performance within modern computational systems.

---

#### 2. Key Architecture & Working Principle
- **Component A (Input / Ingestion)**: Receives primitive state data, validates bounds, and stages for transformation.
- **Component B (Processing Kernel)**: Implements algorithmic state transitions with verified invariants.
- **Component C (Synchronization & Output)**: Commits mutations atomically to prevent race conditions and maintain state consistency.

---

#### 3. Standard Exam Formulae & Invariants
\`\`\`
Efficiency Metric (η) = (Useful Work Done) / (Total Allocated Resources)
Time Complexity: O(log N) average, O(N) worst-case
Space Overhead: O(1) auxiliary space
\`\`\`

---

#### 4. Top 3 Recurring Semester Exam Questions
1. **[5 Marks]**: State and prove the fundamental correctness theorem for this concept.
2. **[10 Marks]**: Compare and contrast the trade-offs of this approach versus traditional naive methods.
3. **[Numerical]**: Given system constraints ($N=1024, K=4$), compute the theoretical throughput.

> 💡 **Study Strategy**: Memorize the architectural diagram and state transitions — this accounts for 60% of rubric marks!`,
      subjectTag: contextSubject || "General Exam Prep",
      suggestedNotesTitle: `Key Summary: ${prompt.slice(0, 30)}`
    };
  }

  getSummaryResponse(prompt, contextSubject) {
    return {
      text: `### 📝 Executive Revision Summary & Cheatsheet

Here is your high-density revision summary formatted for rapid memorization:

---

#### 🎯 Fundamental Rules & Axioms:
- **Rule 1**: Always verify boundary conditions ($0, 1, \\infty$) before applying recursive transitions.
- **Rule 2**: Identify whether the optimal substructure property holds to decide between **Greedy** and **Dynamic Programming**.
- **Rule 3**: Check for concurrency race conditions whenever shared state is mutated across threads.

---

#### 🧠 Memory Mnemonics:
- **ACID**: **A**tomicity, **C**onsistency, **I**solation, **D**urability
- **OSI 7 Layers**: **P**lease **D**o **N**ot **T**hrow **S**ausage **P**izza **A**way
- **Deadlock Coffman Conditions**: **M**utual Exclusion, **H**old & Wait, **N**o Preemption, **C**ircular Wait (*"Must Have No Conflict"*)

---

#### ⚡ 2-Minute Rapid-Fire Cheatsheet:
| Concept | Time Complexity | Primary Advantage | Typical Trap |
| :--- | :--- | :--- | :--- |
| **AVL Tree** | $\\mathcal{O}(\\log N)$ | Guaranteed balance | Complex rotation logic |
| **Dijkstra** | $\\mathcal{O}((V+E)\\log V)$ | Fast shortest path | Fails on negative edges |
| **Banker's Algo** | $\\mathcal{O}(M \\cdot N^2)$ | Deadlock prevention | Conservative resource locking |

> 📌 *You can click **"Save to Notes"** below to store this cheatsheet directly in your SemAssist Notes Manager!*`,
      subjectTag: contextSubject || "Revision Notes",
      suggestedNotesTitle: "Rapid Exam Revision Cheatsheet"
    };
  }

  getImportantQuestionsResponse(p, contextSubject) {
    return {
      text: `### 🎯 Top Expected Semester Exam Questions (High-Yield 2026)

Based on past 5 years of university question papers, these questions have an **85%+ probability of appearing**:

---

#### 🟢 Section A: Short Answer Questions (2 - 3 Marks each)
1. **Explain the difference between Preemptive and Non-Preemptive scheduling.** *(Hint: Mention context switch overhead and response time)*
2. **Define Thrashing in Operating Systems.** Under what condition does thrashing occur?
3. **What is a B+ Tree and why is it preferred over a Binary Search Tree for database indexing?**
4. **Differentiate between TCP and UDP headers.** State their respective header sizes (20 bytes vs 8 bytes).

---

#### 🔵 Section B: Analytical & Numerical Questions (5 - 8 Marks each)
1. **Derive the Effective Memory Access Time (EMAT)** with a TLB hit ratio of 90%, TLB access time of 20ns, and main memory access time of 100ns.
2. **Run Dijkstra's algorithm** on a given 6-node weighted graph. Show distance table updates after each step.
3. **Given the Functional Dependencies**:  
   \`R(A, B, C, D, E) with F = { A -> BC, CD -> E, B -> D, E -> A }\`  
   Find all Candidate Keys and determine the highest Normal Form of $R$.

---

#### 🟣 Section C: Comprehensive 10-Mark Questions
1. **Explain the Banker's Algorithm with a complete working numerical example.** Include the Allocation, Max, Available, and Need matrices and prove the Safe Sequence.
2. **Explain the OSI 7-Layer Architecture.** Describe the responsibilities, protocols, and data units (PDU) of each layer in detail.`,
      subjectTag: contextSubject || "Exam Question Bank",
      suggestedNotesTitle: "High-Probability Exam Questions"
    };
  }

  getMcqQuizResponse(p, contextSubject) {
    const mcqs = [
      {
        question: "1. In an Operating System, which of the following is NOT one of Coffman's four necessary conditions for Deadlock?",
        options: [
          "Mutual Exclusion",
          "Hold and Wait",
          "Preemption Allowed",
          "Circular Wait"
        ],
        correctIndex: 2,
        explanation: "'No Preemption' is the necessary condition. If preemption is allowed, deadlocks cannot occur because resources can be reclaimed."
      },
      {
        question: "2. What is the worst-case time complexity of searching an element in an AVL Tree with N nodes?",
        options: [
          "O(1)",
          "O(log N)",
          "O(N)",
          "O(N log N)"
        ],
        correctIndex: 1,
        explanation: "AVL trees are self-balancing BSTs that guarantee height h <= 1.44 log2(N), ensuring strict O(log N) worst-case time for search, insertion, and deletion."
      },
      {
        question: "3. A relational schema is in Boyce-Codd Normal Form (BCNF) if for every functional dependency X -> Y:",
        options: [
          "Y is a prime attribute",
          "X is a Super Key",
          "X is a candidate key and Y is atomic",
          "There is no multi-valued dependency"
        ],
        correctIndex: 1,
        explanation: "BCNF is a stricter version of 3NF where every determinant (left hand side X) MUST be a Super Key."
      },
      {
        question: "4. What is the default header size of a standard TCP packet without optional fields?",
        options: [
          "8 Bytes",
          "16 Bytes",
          "20 Bytes",
          "32 Bytes"
        ],
        correctIndex: 2,
        explanation: "Standard TCP header is 20 bytes (up to 60 bytes with options). In contrast, UDP header is fixed at 8 bytes."
      }
    ];

    return {
      text: `### 🧪 Interactive Exam MCQ Practice Set

Test your exam readiness with these high-frequency semester questions. Click your answers below to check instant explanations!`,
      mcqs: mcqs,
      subjectTag: contextSubject || "Interactive MCQ Quiz",
      suggestedNotesTitle: "Exam MCQ Practice & Answers"
    };
  }

  getStudyPlanResponse(p) {
    return {
      text: `### 📅 AI-Generated 3-Day Rapid Semester Revision Schedule

Here is an optimized revision roadmap designed to maximize your marks before finals:

---

#### 🌟 Day 1: High-Weightage Core Theory & Formulas
- **09:00 AM - 11:30 AM**: **Operating Systems** (Virtual Memory, Paging, Deadlock Banker's Algo)
- **11:45 AM - 01:15 PM**: *Active Recall*: Solve 3 past-paper questions without looking at notes.
- **02:30 PM - 05:00 PM**: **Database Management** (ACID Transactions, 2PL, 1NF-BCNF Normalization)
- **07:30 PM - 09:30 PM**: **Computer Networks** (TCP 3-Way Handshake, Subnetting Math Drills)

---

#### 🌟 Day 2: Algorithms, Problem Solving & Proofs
- **09:00 AM - 12:00 PM**: **Data Structures** (Trees, Graph Traversals, Dijkstra & Kruskal algorithms)
- **01:30 PM - 03:30 PM**: **Artificial Intelligence** (Minimax Tree, Alpha-Beta Pruning calculations)
- **04:30 PM - 07:00 PM**: Solve 1 Full Previous Year University Question Paper (timed 2.5 hours).
- **08:30 PM - 10:00 PM**: Review mistakes and compile rapid formula sheets.

---

#### 🌟 Day 3: Final Polishing & Mock Testing
- **Morning**: Rapid flashcard revision of all key acronyms, definitions, and Big-O tables.
- **Afternoon**: AI Assistant Quiz mode on your weakest subject areas.
- **Evening**: Relax, organize stationery/hall ticket, and get 8 hours of sleep for peak cognitive focus!`,
      subjectTag: "Revision Timetable",
      suggestedNotesTitle: "3-Day Exam Revision Schedule"
    };
  }
}

// Global AI Instance
window.semAssistAI = new SemAssistAI();
