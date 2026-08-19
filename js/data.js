// SemAssist - Initial Mock Data
const INITIAL_DATA = {
  student: {
    name: "Alex Chen",
    email: "alex.chen@university.edu",
    major: "Computer Science & Engineering",
    semester: "6th Semester - Spring 2026",
    university: "Tech Institute of Engineering",
    targetGpa: "3.85 / 4.0",
    dailyGoalHours: 3.5,
    streakDays: 8,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
  },

  subjects: [
    {
      id: "sub-1",
      code: "CS301",
      name: "Operating Systems",
      professor: "Dr. Ronald Vance",
      credits: 4,
      examDate: "2026-05-24T09:30:00",
      color: "indigo",
      gradient: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
      tag: "Core Technical",
      topics: [
        { id: "t1-1", title: "Processes & Threads Management", completed: true },
        { id: "t1-2", title: "CPU Scheduling Algorithms (FCFS, SJF, RR)", completed: true },
        { id: "t1-3", title: "Process Synchronization & Semaphores", completed: true },
        { id: "t1-4", title: "Classic IPC Problems (Dining Philosophers, Readers-Writers)", completed: true },
        { id: "t1-5", title: "Deadlock Detection, Prevention & Banker's Algorithm", completed: true },
        { id: "t1-6", title: "Memory Management: Paging & Segmentation", completed: true },
        { id: "t1-7", title: "Virtual Memory & Page Replacement (FIFO, LRU, Optimal)", completed: true },
        { id: "t1-8", title: "File Systems Architecture & Allocation Methods", completed: true },
        { id: "t1-9", title: "Disk Scheduling Algorithms (SCAN, C-SCAN, LOOK)", completed: true },
        { id: "t1-10", title: "I/O Hardware & Device Drivers", completed: false },
        { id: "t1-11", title: "OS Security & Protection Mechanisms", completed: false },
        { id: "t1-12", title: "Virtualization & Hypervisors (Type 1 & 2)", completed: false }
      ]
    },
    {
      id: "sub-2",
      code: "CS302",
      name: "Data Structures & Algorithms",
      professor: "Prof. Sarah Lin",
      credits: 4,
      examDate: "2026-05-28T14:00:00",
      color: "blue",
      gradient: "linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)",
      tag: "Core Technical",
      topics: [
        { id: "t2-1", title: "Asymptotic Analysis & Big-O Notation", completed: true },
        { id: "t2-2", title: "Arrays, Linked Lists, Stacks & Queues", completed: true },
        { id: "t2-3", title: "Binary Trees & BST Operations", completed: true },
        { id: "t2-4", title: "Self-Balancing Trees (AVL, Red-Black Trees)", completed: true },
        { id: "t2-5", title: "Heaps & Priority Queues", completed: true },
        { id: "t2-6", title: "Hashing & Collision Resolution Strategies", completed: true },
        { id: "t2-7", title: "Graph Representations, BFS & DFS", completed: true },
        { id: "t2-8", title: "Shortest Paths (Dijkstra, Bellman-Ford, Floyd-Warshall)", completed: true },
        { id: "t2-9", title: "Minimum Spanning Trees (Kruskal, Prim)", completed: true },
        { id: "t2-10", title: "Divide and Conquer (MergeSort, QuickSort)", completed: true },
        { id: "t2-11", title: "Dynamic Programming (0/1 Knapsack, LCS, LIS)", completed: true },
        { id: "t2-12", title: "Greedy Algorithms & Huffman Coding", completed: false },
        { id: "t2-13", title: "Trie & String Matching (KMP, Rabin-Karp)", completed: false }
      ]
    },
    {
      id: "sub-3",
      code: "CS303",
      name: "Database Management Systems",
      professor: "Dr. Arvind Mehta",
      credits: 3,
      examDate: "2026-06-02T09:30:00",
      color: "purple",
      gradient: "linear-gradient(135deg, #9333ea 0%, #c026d3 100%)",
      tag: "Core Technical",
      topics: [
        { id: "t3-1", title: "ER Diagrams & Relational Model Mapping", completed: true },
        { id: "t3-2", title: "Relational Algebra & Tuple Relational Calculus", completed: true },
        { id: "t3-3", title: "Advanced SQL (Joins, Nested Queries, Aggregates)", completed: true },
        { id: "t3-4", title: "Functional Dependencies & Normal Forms (1NF to BCNF)", completed: true },
        { id: "t3-5", title: "Transaction Processing & ACID Properties", completed: true },
        { id: "t3-6", title: "Concurrency Control & 2-Phase Locking (2PL)", completed: true },
        { id: "t3-7", title: "Crash Recovery & Write-Ahead Logging (WAL)", completed: false },
        { id: "t3-8", title: "Indexing, B-Trees & B+ Tree File Organization", completed: false },
        { id: "t3-9", title: "Query Optimization & Cost Estimation", completed: false },
        { id: "t3-10", title: "NoSQL Databases & CAP Theorem Overview", completed: false }
      ]
    },
    {
      id: "sub-4",
      code: "CS304",
      name: "Computer Networks",
      professor: "Dr. Elena Rostova",
      credits: 3,
      examDate: "2026-06-08T14:00:00",
      color: "emerald",
      gradient: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
      tag: "Core Technical",
      topics: [
        { id: "t4-1", title: "OSI 7-Layer Model vs TCP/IP Protocol Architecture", completed: true },
        { id: "t4-2", title: "Physical Layer: Transmission Media & Modulation", completed: true },
        { id: "t4-3", title: "Data Link Layer: Framing, Error Detection (CRC) & ARQ", completed: true },
        { id: "t4-4", title: "MAC Sublayer: CSMA/CD, CSMA/CA & Ethernet", completed: true },
        { id: "t4-5", title: "Network Layer: IPv4/IPv6 Addressing & Subnetting (CIDR)", completed: true },
        { id: "t4-6", title: "Routing Protocols (RIP, OSPF, BGP)", completed: false },
        { id: "t4-7", title: "Transport Layer: UDP vs TCP 3-Way Handshake", completed: false },
        { id: "t4-8", title: "TCP Flow & Congestion Control (Slow Start, AIMD)", completed: false },
        { id: "t4-9", title: "Application Layer: DNS, HTTP/HTTPS, FTP, SMTP", completed: false },
        { id: "t4-10", title: "Network Security: Firewalls, TLS/SSL & Cryptography", completed: false },
        { id: "t4-11", title: "Software-Defined Networking (SDN) Basics", completed: false }
      ]
    },
    {
      id: "sub-5",
      code: "CS305",
      name: "Artificial Intelligence & ML",
      professor: "Prof. Kenneth Hayes",
      credits: 3,
      examDate: "2026-06-15T09:30:00",
      color: "amber",
      gradient: "linear-gradient(135deg, #d97706 0%, #f59e0b 100%)",
      tag: "Elective",
      topics: [
        { id: "t5-1", title: "Agent Types, Environments & Problem Formulations", completed: true },
        { id: "t5-2", title: "Uninformed vs Heuristic Search (A*, Greedy Best-First)", completed: true },
        { id: "t5-3", title: "Adversarial Search & Minimax with Alpha-Beta Pruning", completed: true },
        { id: "t5-4", title: "Constraint Satisfaction Problems (CSP)", completed: false },
        { id: "t5-5", title: "Knowledge Representation & First-Order Logic", completed: false },
        { id: "t5-6", title: "Supervised Learning: Linear/Logistic Regression, Decision Trees", completed: false },
        { id: "t5-7", title: "Support Vector Machines (SVM) & Kernel Trick", completed: false },
        { id: "t5-8", title: "Unsupervised Learning: K-Means & Hierarchical Clustering", completed: false },
        { id: "t5-9", title: "Artificial Neural Networks & Backpropagation", completed: false },
        { id: "t5-10", title: "Evaluation Metrics (Precision, Recall, F1, ROC-AUC)", completed: false }
      ]
    }
  ],

  tasks: [
    {
      id: "task-1",
      title: "Revise Virtual Memory & Page Replacement (FIFO, LRU, Optimal)",
      subjectId: "sub-1",
      subjectCode: "CS301",
      priority: "high",
      due: "Today, 5:00 PM",
      completed: false
    },
    {
      id: "task-2",
      title: "Solve 5 Practice Graph Problems (Dijkstra & Prim's Algorithm)",
      subjectId: "sub-2",
      subjectCode: "CS302",
      priority: "high",
      due: "Today, 8:00 PM",
      completed: false
    },
    {
      id: "task-3",
      title: "Write summary note on 2-Phase Locking (2PL) & Strict 2PL",
      subjectId: "sub-3",
      subjectCode: "CS303",
      priority: "medium",
      due: "Today, 10:30 PM",
      completed: true
    },
    {
      id: "task-4",
      title: "Review Subnetting and CIDR calculation formulas",
      subjectId: "sub-4",
      subjectCode: "CS304",
      priority: "low",
      due: "Tomorrow, 11:00 AM",
      completed: false
    },
    {
      id: "task-5",
      title: "Run AI Practice Quiz on Alpha-Beta Pruning mechanics",
      subjectId: "sub-5",
      subjectCode: "CS305",
      priority: "medium",
      due: "Tomorrow, 4:00 PM",
      completed: false
    }
  ],

  notes: [
    {
      id: "note-1",
      title: "Deadlock Conditions & Banker's Safety Algorithm",
      subjectId: "sub-1",
      subjectCode: "CS301",
      subjectName: "Operating Systems",
      createdAt: "2026-05-10T14:20:00",
      tags: ["Exam Crucial", "Algorithms", "Deadlock"],
      content: `## 4 Necessary Conditions for Deadlock (Coffman Conditions)
1. **Mutual Exclusion**: At least one resource must be held in a non-shareable mode.
2. **Hold and Wait**: A process must currently hold at least 1 resource and request additional resources held by other processes.
3. **No Preemption**: Resources cannot be forcibly preempted from a process holding them; they must be released voluntarily.
4. **Circular Wait**: A closed loop of processes exists where each process waits for a resource held by the next process in the cycle.

## Banker's Algorithm (Dijkstra)
- **Safety Algorithm Formula**:
  - \`Need[i][j] = Max[i][j] - Allocation[i][j]\`
  - Find process \`P_i\` such that \`Finish[i] == false\` and \`Need[i] <= Work\`.
  - \`Work = Work + Allocation[i]\`, set \`Finish[i] = true\`.
  - If all \`Finish[i] == true\`, the system is in a **Safe State** with no deadlock!

## Frequent 10-Mark Exam Question:
Given Allocation Matrix and Max Matrix, calculate the Need Matrix and determine if the state is safe with exact Safe Sequence.`
    },
    {
      id: "note-2",
      title: "Binary Search Trees vs AVL Trees Complexity Cheatsheet",
      subjectId: "sub-2",
      subjectCode: "CS302",
      subjectName: "Data Structures & Algorithms",
      createdAt: "2026-05-08T11:15:00",
      tags: ["Trees", "Big-O", "Revision"],
      content: `## BST vs AVL Tree Comparison
- **Standard BST**:
  - Average Search/Insert/Delete: \`O(log N)\`
  - Worst Case (Skewed Tree): \`O(N)\`
- **AVL Tree (Self-Balancing)**:
  - Balance Factor: \`BF = height(Left) - height(Right)\` must be in \`{-1, 0, +1}\`.
  - Search, Insertion, Deletion guaranteed: \`O(log N)\` in all cases.

## AVL Rotations Guide:
1. **Left-Left (LL) Case**: Single Right Rotation.
2. **Right-Right (RR) Case**: Single Left Rotation.
3. **Left-Right (LR) Case**: Left rotation on Left Child, followed by Right rotation on Node.
4. **Right-Left (RL) Case**: Right rotation on Right Child, followed by Left rotation on Node.`
    },
    {
      id: "note-3",
      title: "ACID Properties & Database Normalization (1NF to BCNF)",
      subjectId: "sub-3",
      subjectCode: "CS303",
      subjectName: "Database Management Systems",
      createdAt: "2026-05-06T16:45:00",
      tags: ["Transactions", "Normalization", "SQL"],
      content: `## ACID Properties Breakdown:
- **Atomicity**: All operations succeed or all roll back ("All or Nothing"). Maintained by Recovery Manager / WAL.
- **Consistency**: Database transitions from one valid state to another. Maintained by Integrity Constraints.
- **Isolation**: Concurrent transactions execute as if running serially. Maintained by Concurrency Control / 2PL.
- **Durability**: Committed transactions persist permanently even during power crashes. Maintained by Redo Logs / Non-volatile storage.

## Normal Forms Summary:
- **1NF**: Atomic values only (no multi-valued or composite attributes).
- **2NF**: In 1NF + No Partial Dependency (every non-prime attribute fully depends on entire candidate key).
- **3NF**: In 2NF + No Transitive Dependency (non-prime cannot determine another non-prime).
- **BCNF (Boyce-Codd)**: For every Functional Dependency \`X -> Y\`, \`X\` must be a Super Key!`
    },
    {
      id: "note-4",
      title: "OSI 7 Layers vs TCP/IP Protocol Stack Breakdown",
      subjectId: "sub-4",
      subjectCode: "CS304",
      subjectName: "Computer Networks",
      createdAt: "2026-05-04T09:10:00",
      tags: ["Protocols", "Networking", "Architecture"],
      content: `## OSI 7-Layer Mnemonic:
*"Please Do Not Throw Sausage Pizza Away"*
1. **Physical Layer**: Bits over physical medium (Cables, Hubs, Repeaters).
2. **Data Link Layer**: Frames, MAC addressing, Error detection (Switches, Bridges, CRC).
3. **Network Layer**: Packets, IP addressing, Path routing (Routers, ICMP, OSPF).
4. **Transport Layer**: Segments/Datagrams, End-to-end delivery (TCP, UDP, Port numbers).
5. **Session Layer**: Dialog control, Synchronization checkpoints.
6. **Presentation Layer**: Encryption, Data formatting, Compression (TLS/SSL, JPEG, ASCII).
7. **Application Layer**: User services & protocols (HTTP, DNS, SMTP, FTP).

## TCP 3-Way Handshake:
1. Client -> Server: \`SYN\` (Seq = x)
2. Server -> Client: \`SYN + ACK\` (Seq = y, Ack = x + 1)
3. Client -> Server: \`ACK\` (Seq = x + 1, Ack = y + 1)`
    },
    {
      id: "note-5",
      title: "Supervised vs Unsupervised ML Algorithms & Evaluation Metrics",
      subjectId: "sub-5",
      subjectCode: "CS305",
      subjectName: "Artificial Intelligence & ML",
      createdAt: "2026-05-02T18:30:00",
      tags: ["Machine Learning", "Formulas", "Metrics"],
      content: `## Classification Metrics:
- **Precision**: \`TP / (TP + FP)\` (Quality of positive predictions)
- **Recall (Sensitivity)**: \`TP / (TP + FN)\` (Quantity of actual positives found)
- **F1-Score**: \`2 * (Precision * Recall) / (Precision + Recall)\` (Harmonic mean)
- **Accuracy**: \`(TP + TN) / (TP + TN + FP + FN)\`

## Alpha-Beta Pruning Rule:
- \`alpha\`: Best value that the MAX player can guarantee so far (starts at -inf).
- \`beta\`: Best value that the MIN player can guarantee so far (starts at +inf).
- **Prune Condition**: Whenever \`beta <= alpha\`, prune the remaining subtree branches!`
    }
  ],

  studyPlan: [
    {
      id: "sp-1",
      day: "Today",
      time: "09:00 AM - 10:30 AM",
      subjectCode: "CS301",
      subjectName: "Operating Systems",
      topic: "Page Replacement Algorithms (FIFO, LRU, Optimal Simulation)",
      status: "completed",
      urgency: "high"
    },
    {
      id: "sp-2",
      day: "Today",
      time: "11:00 AM - 01:00 PM",
      subjectCode: "CS302",
      subjectName: "Data Structures & Algorithms",
      topic: "Graph Traversal & Dijkstra's Algorithm Problem Solving",
      status: "in-progress",
      urgency: "high"
    },
    {
      id: "sp-3",
      day: "Today",
      time: "03:30 PM - 05:00 PM",
      subjectCode: "CS303",
      subjectName: "Database Management Systems",
      topic: "2-Phase Locking Protocols & ACID Concurrency Questions",
      status: "scheduled",
      urgency: "medium"
    },
    {
      id: "sp-4",
      day: "Today",
      time: "07:30 PM - 09:00 PM",
      subjectCode: "CS301",
      subjectName: "Operating Systems",
      topic: "Banker's Algorithm Numerical Exam Problems Review",
      status: "scheduled",
      urgency: "high"
    },
    {
      id: "sp-5",
      day: "Tomorrow",
      time: "09:30 AM - 11:30 AM",
      subjectCode: "CS304",
      subjectName: "Computer Networks",
      topic: "Subnetting Practice & IPv4 Classless CIDR Masks",
      status: "scheduled",
      urgency: "medium"
    },
    {
      id: "sp-6",
      day: "Tomorrow",
      time: "02:00 PM - 04:00 PM",
      subjectCode: "CS305",
      subjectName: "Artificial Intelligence & ML",
      topic: "Minimax Tree & Alpha-Beta Pruning Calculation Drills",
      status: "scheduled",
      urgency: "low"
    },
    {
      id: "sp-7",
      day: "Tomorrow",
      time: "05:30 PM - 07:00 PM",
      subjectCode: "CS302",
      subjectName: "Data Structures & Algorithms",
      topic: "Dynamic Programming Knapsack & LCS Code Walkthrough",
      status: "scheduled",
      urgency: "high"
    }
  ],

  notifications: [
    {
      id: "notif-1",
      title: "⏰ OS Exam Countdown Alert",
      message: "Operating Systems exam is in 12 days. 3 syllabus topics are still pending!",
      time: "10m ago",
      read: false,
      type: "exam"
    },
    {
      id: "notif-2",
      title: "🔥 Study Streak Maintained!",
      message: "You've studied 8 consecutive days. You are in the top 5% of prepared students!",
      time: "2h ago",
      read: false,
      type: "streak"
    },
    {
      id: "notif-3",
      title: "✨ AI Quiz Ready",
      message: "New 10-question MCQ practice set generated for Data Structures & Algorithms.",
      time: "1d ago",
      read: true,
      type: "quiz"
    }
  ],

  chatHistory: [
    {
      id: "msg-1",
      sender: "ai",
      timestamp: "Just now",
      text: "👋 Hi Alex! I'm your **SemAssist Exam AI**. What subject or topic are you tackling today? You can choose a quick action below or ask me anything from your semester syllabus!"
    }
  ]
};

// Expose globally
if (typeof window !== 'undefined') {
  window.INITIAL_DATA = INITIAL_DATA;
}
if (typeof global !== 'undefined') {
  global.INITIAL_DATA = INITIAL_DATA;
}

