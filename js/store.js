// SemAssist - Reactive State & LocalStorage Manager
const STORAGE_KEY = 'semassist_app_state_v1';

class AppStore {
  constructor() {
    this.listeners = [];
    this.state = this.loadState();
  }

  loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not load from localStorage, using initial data:', e);
    }
    // Deep clone initial data
    const initial = (typeof window !== 'undefined' && window.INITIAL_DATA) 
      ? window.INITIAL_DATA 
      : (typeof global !== 'undefined' && global.INITIAL_DATA ? global.INITIAL_DATA : INITIAL_DATA);
    return JSON.parse(JSON.stringify(initial));
  }

  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error('Error saving state to localStorage:', e);
    }
    this.notify();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(listener => {
      try {
        listener(this.state);
      } catch (err) {
        console.error('Listener notification error:', err);
      }
    });
  }

  // --- Student Profile ---
  getStudent() {
    return this.state.student;
  }

  updateStudent(newData) {
    this.state.student = { ...this.state.student, ...newData };
    this.saveState();
  }

  // --- Subjects ---
  getSubjects() {
    return this.state.subjects || [];
  }

  getSubject(id) {
    return this.state.subjects.find(s => s.id === id);
  }

  addSubject(subjectData) {
    const newSubject = {
      id: 'sub-' + Date.now(),
      code: subjectData.code || 'CS999',
      name: subjectData.name,
      professor: subjectData.professor || 'Faculty Instructor',
      credits: Number(subjectData.credits) || 3,
      examDate: subjectData.examDate,
      color: subjectData.color || 'indigo',
      gradient: subjectData.gradient || 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
      tag: subjectData.tag || 'Core Technical',
      topics: (subjectData.topicsList || []).map((t, idx) => ({
        id: `t-${Date.now()}-${idx}`,
        title: t,
        completed: false
      }))
    };
    this.state.subjects.push(newSubject);
    this.saveState();
    return newSubject;
  }

  toggleTopic(subjectId, topicId) {
    const subject = this.getSubject(subjectId);
    if (subject && subject.topics) {
      const topic = subject.topics.find(t => t.id === topicId);
      if (topic) {
        topic.completed = !topic.completed;
        this.saveState();
      }
    }
  }

  addTopic(subjectId, topicTitle) {
    const subject = this.getSubject(subjectId);
    if (subject && topicTitle) {
      if (!subject.topics) subject.topics = [];
      subject.topics.push({
        id: `t-${Date.now()}`,
        title: topicTitle.trim(),
        completed: false
      });
      this.saveState();
    }
  }

  deleteSubject(subjectId) {
    this.state.subjects = this.state.subjects.filter(s => s.id !== subjectId);
    this.saveState();
  }

  // --- Tasks ---
  getTasks() {
    return this.state.tasks || [];
  }

  addTask(taskData) {
    const newTask = {
      id: 'task-' + Date.now(),
      title: taskData.title,
      subjectId: taskData.subjectId || (this.state.subjects[0] ? this.state.subjects[0].id : ''),
      subjectCode: taskData.subjectCode || (this.state.subjects[0] ? this.state.subjects[0].code : 'GEN'),
      priority: taskData.priority || 'medium',
      due: taskData.due || 'Today, 8:00 PM',
      completed: false
    };
    this.state.tasks.unshift(newTask);
    this.saveState();
    return newTask;
  }

  toggleTask(taskId) {
    const task = this.state.tasks.find(t => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
      this.saveState();
    }
  }

  deleteTask(taskId) {
    this.state.tasks = this.state.tasks.filter(t => t.id !== taskId);
    this.saveState();
  }

  // --- Notes ---
  getNotes() {
    return this.state.notes || [];
  }

  getNote(id) {
    return this.state.notes.find(n => n.id === id);
  }

  addNote(noteData) {
    const subject = this.getSubject(noteData.subjectId);
    const newNote = {
      id: 'note-' + Date.now(),
      title: noteData.title || 'Untitled Study Note',
      subjectId: noteData.subjectId || (subject ? subject.id : ''),
      subjectCode: subject ? subject.code : (noteData.subjectCode || 'GEN'),
      subjectName: subject ? subject.name : (noteData.subjectName || 'General Notes'),
      createdAt: new Date().toISOString(),
      tags: noteData.tags && noteData.tags.length ? noteData.tags : ['Semester Prep'],
      content: noteData.content || ''
    };
    this.state.notes.unshift(newNote);
    this.saveState();
    return newNote;
  }

  updateNote(id, updatedFields) {
    const idx = this.state.notes.findIndex(n => n.id === id);
    if (idx !== -1) {
      const subject = updatedFields.subjectId ? this.getSubject(updatedFields.subjectId) : null;
      this.state.notes[idx] = {
        ...this.state.notes[idx],
        ...updatedFields,
        subjectCode: subject ? subject.code : this.state.notes[idx].subjectCode,
        subjectName: subject ? subject.name : this.state.notes[idx].subjectName,
        lastEdited: new Date().toISOString()
      };
      this.saveState();
    }
  }

  deleteNote(id) {
    this.state.notes = this.state.notes.filter(n => n.id !== id);
    this.saveState();
  }

  // --- Study Plan ---
  getStudyPlan() {
    return this.state.studyPlan || [];
  }

  addStudyPlanItem(itemData) {
    const subject = this.getSubject(itemData.subjectId);
    const newItem = {
      id: 'sp-' + Date.now(),
      day: itemData.day || 'Today',
      time: itemData.time || '04:00 PM - 05:30 PM',
      subjectCode: subject ? subject.code : (itemData.subjectCode || 'CS301'),
      subjectName: subject ? subject.name : (itemData.subjectName || 'General Prep'),
      topic: itemData.topic || 'Revision Session',
      status: itemData.status || 'scheduled',
      urgency: itemData.urgency || 'medium'
    };
    this.state.studyPlan.push(newItem);
    this.saveState();
    return newItem;
  }

  updateStudyPlanStatus(id, status) {
    const item = this.state.studyPlan.find(sp => sp.id === id);
    if (item) {
      item.status = status;
      this.saveState();
    }
  }

  deleteStudyPlanItem(id) {
    this.state.studyPlan = this.state.studyPlan.filter(sp => sp.id !== id);
    this.saveState();
  }

  generateAiStudyPlan(hoursPerDay = 4) {
    const subjects = this.getSubjects();
    if (!subjects.length) return;

    // Pick top unfinished topics from earliest exam subjects
    const newSchedule = [];
    const days = ['Today', 'Tomorrow', 'Day 3', 'Day 4'];
    const timeSlots = [
      '09:00 AM - 10:30 AM',
      '11:00 AM - 12:30 PM',
      '02:30 PM - 04:00 PM',
      '05:00 PM - 06:30 PM',
      '08:00 PM - 09:30 PM'
    ];

    let slotIdx = 0;
    days.forEach((day, dIdx) => {
      const slotsForDay = Math.min(Math.round(hoursPerDay / 1.5), timeSlots.length);
      for (let s = 0; s < slotsForDay; s++) {
        const sub = subjects[(dIdx * slotsForDay + s) % subjects.length];
        const pendingTopic = (sub.topics && sub.topics.find(t => !t.completed)) 
          || (sub.topics && sub.topics[s % sub.topics.length])
          || { title: 'High-Yield Exam Practice & Past Papers' };

        newSchedule.push({
          id: `sp-gen-${Date.now()}-${dIdx}-${s}`,
          day: day,
          time: timeSlots[s % timeSlots.length],
          subjectCode: sub.code,
          subjectName: sub.name,
          topic: pendingTopic.title,
          status: dIdx === 0 && s === 0 ? 'in-progress' : 'scheduled',
          urgency: s === 0 ? 'high' : 'medium'
        });
      }
    });

    this.state.studyPlan = newSchedule;
    this.saveState();
    return newSchedule;
  }

  // --- Notifications ---
  getNotifications() {
    return this.state.notifications || [];
  }

  markNotificationRead(id) {
    const notif = this.state.notifications.find(n => n.id === id);
    if (notif) {
      notif.read = true;
      this.saveState();
    }
  }

  clearNotifications() {
    this.state.notifications = [];
    this.saveState();
  }

  // --- Chat History ---
  getChatHistory() {
    return this.state.chatHistory || [];
  }

  addChatMessage(msg) {
    const message = {
      id: 'msg-' + Date.now(),
      sender: msg.sender || 'user',
      timestamp: 'Just now',
      text: msg.text,
      mcqs: msg.mcqs || null,
      type: msg.type || 'text',
      subjectTag: msg.subjectTag || null
    };
    this.state.chatHistory.push(message);
    this.saveState();
    return message;
  }

  clearChatHistory() {
    this.state.chatHistory = [
      {
        id: "msg-" + Date.now(),
        sender: "ai",
        timestamp: "Just now",
        text: "👋 Chat reset. What exam topic or question shall we master next?"
      }
    ];
    this.saveState();
  }

  // Reset entire application
  resetToDefaults() {
    this.state = JSON.parse(JSON.stringify(INITIAL_DATA));
    this.saveState();
  }
}

// Global Store Instance
window.store = new AppStore();
