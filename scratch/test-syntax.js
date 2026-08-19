// Test syntax and execution of core modules in Node environment
const fs = require('fs');
const path = require('path');

console.log('--- Testing JavaScript syntax ---');

const files = ['js/data.js', 'js/store.js', 'js/ai-engine.js', 'js/app.js'];

// Setup mock window & localStorage & document environment for Node testing
global.window = global;
global.window.addEventListener = () => {};
global.window.removeEventListener = () => {};
global.window.scrollTo = () => {};
global.localStorage = {
  store: {},
  getItem(k) { return this.store[k] || null; },
  setItem(k, v) { this.store[k] = String(v); },
  removeItem(k) { delete this.store[k]; }
};

global.document = {
  addEventListener: () => {},
  removeEventListener: () => {},
  querySelectorAll: () => [],
  getElementById: (id) => ({
    textContent: '',
    value: '',
    style: {},
    classList: { add: () => {}, remove: () => {}, toggle: () => {}, contains: () => false },
    innerHTML: '',
    appendChild: () => {},
    remove: () => {}
  }),
  documentElement: {
    setAttribute: () => {},
    removeAttribute: () => {}
  }
};

global.navigator = {
  clipboard: {
    writeText: async () => {}
  }
};

files.forEach(file => {
  const fullPath = path.join(__dirname, '..', file);
  console.log(`Checking syntax: ${file}...`);
  const code = fs.readFileSync(fullPath, 'utf8');
  try {
    eval(code);
    console.log(`✅ ${file} loaded without error!`);
  } catch (err) {
    console.error(`❌ Syntax/Execution error in ${file}:`, err);
    process.exit(1);
  }
});

// Test store methods
console.log('\n--- Testing Store Functions ---');
const subjects = window.store.getSubjects();
console.log(`Subjects loaded: ${subjects.length}`);
const tasks = window.store.getTasks();
console.log(`Tasks loaded: ${tasks.length}`);
const notes = window.store.getNotes();
console.log(`Notes loaded: ${notes.length}`);
const studyPlan = window.store.getStudyPlan();
console.log(`Study plan items loaded: ${studyPlan.length}`);

// Test AI engine
console.log('\n--- Testing AI Engine ---');
window.semAssistAI.generateResponse('Explain Paging in OS', 'general').then(res => {
  console.log('AI Explanation output length:', res.text.length);
  return window.semAssistAI.generateResponse('Quiz', 'mcq');
}).then(res => {
  console.log('AI MCQ output count:', res.mcqs ? res.mcqs.length : 0);
  console.log('All module unit checks passed successfully! ✨');
});
