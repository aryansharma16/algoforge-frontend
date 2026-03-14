/**
 * Searchable CS / interview topics — stored on journey as metadata.topicTags (string[]).
 * Primary journeyType enum still lives on the model; these are focus tags.
 */
export const CS_TOPIC_OPTIONS = [
  { id: 'DSA', label: 'DSA', group: 'Core' },
  { id: 'SYSTEM_DESIGN', label: 'System design', group: 'Core' },
  { id: 'DBMS', label: 'DBMS', group: 'Core' },
  { id: 'OS', label: 'Operating systems', group: 'Core' },
  { id: 'WEB_DEV', label: 'Web development', group: 'Core' },
  { id: 'NETWORKS', label: 'Computer networks', group: 'Core' },
  { id: 'OOP', label: 'OOP', group: 'Languages' },
  { id: 'JAVA', label: 'Java', group: 'Languages' },
  { id: 'PYTHON', label: 'Python', group: 'Languages' },
  { id: 'JAVASCRIPT', label: 'JavaScript', group: 'Languages' },
  { id: 'CPP', label: 'C++', group: 'Languages' },
  { id: 'ARRAYS', label: 'Arrays & hashing', group: 'DSA' },
  { id: 'TWO_POINTERS', label: 'Two pointers', group: 'DSA' },
  { id: 'SLIDING_WINDOW', label: 'Sliding window', group: 'DSA' },
  { id: 'STACK_QUEUE', label: 'Stack & queue', group: 'DSA' },
  { id: 'LINKED_LIST', label: 'Linked list', group: 'DSA' },
  { id: 'BINARY_TREE', label: 'Binary trees', group: 'DSA' },
  { id: 'BST', label: 'BST', group: 'DSA' },
  { id: 'HEAP', label: 'Heap / priority queue', group: 'DSA' },
  { id: 'GRAPHS', label: 'Graphs', group: 'DSA' },
  { id: 'DP', label: 'Dynamic programming', group: 'DSA' },
  { id: 'BACKTRACKING', label: 'Backtracking', group: 'DSA' },
  { id: 'GREEDY', label: 'Greedy', group: 'DSA' },
  { id: 'TRIE', label: 'Trie', group: 'DSA' },
  { id: 'INTERVALS', label: 'Intervals', group: 'DSA' },
  { id: 'BIT_MANIPULATION', label: 'Bit manipulation', group: 'DSA' },
  { id: 'SQL', label: 'SQL', group: 'Data' },
  { id: 'NOSQL', label: 'NoSQL', group: 'Data' },
  { id: 'REDIS', label: 'Redis / caching', group: 'Data' },
  { id: 'API_DESIGN', label: 'API design', group: 'System design' },
  { id: 'SCALABILITY', label: 'Scalability', group: 'System design' },
  { id: 'LOAD_BALANCING', label: 'Load balancing', group: 'System design' },
  { id: 'MESSAGE_QUEUES', label: 'Message queues', group: 'System design' },
  { id: 'MICROSERVICES', label: 'Microservices', group: 'System design' },
  { id: 'SECURITY', label: 'Security basics', group: 'System design' },
  { id: 'BEHAVIORAL', label: 'Behavioral', group: 'Interview' },
  { id: 'ML_BASICS', label: 'ML basics', group: 'Extra' },
]

export const CS_TOPIC_LABEL = Object.fromEntries(
  CS_TOPIC_OPTIONS.map((o) => [o.id, o.label])
)
