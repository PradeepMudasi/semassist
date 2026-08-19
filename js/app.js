// SemAssist - Main Application Controller
class SemAssistApp {
  constructor() {
    this.currentView = 'landing';
    this.currentActiveSubjectId = null;
    this.notesActiveFilter = 'all';
    this.pomoState = {
      secondsLeft: 25 * 60,
      isRunning: false,
      intervalId: null,
      mode: 'study' // 'study' or 'break'
    };

    this.init();
  }

  init() {
    // Subscribe to store updates
    window.store.subscribe((state) => {
      this.renderCurrentView();
      this.updateGlobalCounters();
    });

    // Start Live Exam Countdown
    this.startExamCountdownTimer();

    // Setup Keyboard Shortcuts (Ctrl+K)
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.openSearchPalette();
      }
      if (e.key === 'Escape') {
        this.closeAllModals();
      }
    });

    // Close notifications popover when clicking outside
    document.addEventListener('click', (e) => {
      const popover = document.getElementById('notifications-popover');
      const bellBtn = document.getElementById('notif-bell-btn');
      if (popover && popover.classList.contains('show')) {
        if (!popover.contains(e.target) && !bellBtn.contains(e.target)) {
          popover.classList.remove('show');
        }
      }
    });

    // Initial render
    this.renderCurrentView();
    this.updateGlobalCounters();
    this.updateUserProfileInfo();
  }

  // =========================================================================
  // VIEW NAVIGATION & ROUTING
  // =========================================================================

  showLanding() {
    document.getElementById('landing-container').style.display = 'block';
    document.getElementById('app-container').style.display = 'none';
    this.currentView = 'landing';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = "SemAssist | AI Study Assistant for Semester Exams";
  }

  showApp(viewName = 'dashboard') {
    document.getElementById('landing-container').style.display = 'none';
    document.getElementById('app-container').style.display = 'flex';
    this.navigate(viewName);
  }

  navigate(viewName) {
    this.currentView = viewName;
    
    // Hide all view pages
    document.querySelectorAll('.page-view').forEach(p => p.classList.remove('active'));
    
    // Show targeted view
    const target = document.getElementById(`view-${viewName}`);
    if (target) {
      target.classList.add('active');
    }

    // Update Sidebar Active Class
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
      if (item.getAttribute('data-view') === viewName) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Update Topbar Title
    const titles = {
      'dashboard': 'Student Dashboard',
      'ai': 'AI Exam Assistant',
      'subjects': 'Subjects & Syllabus',
      'notes': 'Study Notes',
      'study-plan': 'Daily Study Plan'
    };
    const titleEl = document.getElementById('topbar-view-title');
    if (titleEl) {
      titleEl.textContent = titles[viewName] || 'Dashboard';
    }

    document.title = `SemAssist | ${titles[viewName] || 'App'}`;

    // Close mobile menu if open
    document.getElementById('sidebar').classList.remove('mobile-open');

    // Trigger View-Specific Render
    this.renderCurrentView();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('mobile-open');
  }

  renderCurrentView() {
    switch (this.currentView) {
      case 'dashboard':
        this.renderDashboard();
        break;
      case 'ai':
        this.renderAiChat();
        break;
      case 'subjects':
        this.renderSubjects();
        break;
      case 'notes':
        this.renderNotes();
        break;
      case 'study-plan':
        this.renderStudyPlan();
        break;
    }
  }

  // =========================================================================
  // LIVE EXAM COUNTDOWN TICKER
  // =========================================================================

  startExamCountdownTimer() {
    const updateCountdown = () => {
      const subjects = window.store.getSubjects();
      if (!subjects || !subjects.length) return;

      // Find closest upcoming exam date
      const now = new Date();
      let closestSub = subjects[0];
      let minDiff = Infinity;

      subjects.forEach(sub => {
        const examTime = new Date(sub.examDate).getTime();
        const diff = examTime - now.getTime();
        if (diff > 0 && diff < minDiff) {
          minDiff = diff;
          closestSub = sub;
        }
      });

      if (minDiff !== Infinity && minDiff > 0) {
        const days = Math.floor(minDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((minDiff / (1000 * 60 * 60)) % 24);
        const mins = Math.floor((minDiff / 1000 / 60) % 60);
        const secs = Math.floor((minDiff / 1000) % 60);

        const cdDays = document.getElementById('dash-cd-days');
        const cdHours = document.getElementById('dash-cd-hours');
        const cdMins = document.getElementById('dash-cd-mins');
        const cdSecs = document.getElementById('dash-cd-secs');

        if (cdDays) cdDays.textContent = String(days).padStart(2, '0');
        if (cdHours) cdHours.textContent = String(hours).padStart(2, '0');
        if (cdMins) cdMins.textContent = String(mins).padStart(2, '0');
        if (cdSecs) cdSecs.textContent = String(secs).padStart(2, '0');

        const heroSub = document.getElementById('dash-countdown-subject-label');
        if (heroSub) {
          heroSub.textContent = `🔥 Next Exam: ${closestSub.name} (${closestSub.code})`;
        }

        const heroDays = document.getElementById('dash-days-hero-text');
        if (heroDays) {
          heroDays.textContent = `${days} days`;
        }
      }
    };

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // =========================================================================
  // POMODORO FOCUS TIMER
  // =========================================================================

  togglePomodoro() {
    const startBtn = document.getElementById('pomo-start-btn');
    if (this.pomoState.isRunning) {
      clearInterval(this.pomoState.intervalId);
      this.pomoState.isRunning = false;
      startBtn.textContent = 'Start';
      startBtn.classList.remove('btn-primary');
    } else {
      this.pomoState.isRunning = true;
      startBtn.textContent = 'Pause';
      startBtn.classList.add('btn-primary');

      this.pomoState.intervalId = setInterval(() => {
        if (this.pomoState.secondsLeft > 0) {
          this.pomoState.secondsLeft--;
          this.updatePomodoroDisplay();
        } else {
          // Timer finished
          clearInterval(this.pomoState.intervalId);
          this.pomoState.isRunning = false;
          startBtn.textContent = 'Start';

          if (this.pomoState.mode === 'study') {
            this.showToast('🎉 Focus session completed! Take a 5-minute break.');
            this.pomoState.mode = 'break';
            this.pomoState.secondsLeft = 5 * 60;
            document.getElementById('pomo-mode-badge').textContent = 'Break 5m';
            document.getElementById('pomo-mode-badge').className = 'badge badge-emerald';
          } else {
            this.showToast('⚡ Break over! Ready for another 25m study sprint?');
            this.pomoState.mode = 'study';
            this.pomoState.secondsLeft = 25 * 60;
            document.getElementById('pomo-mode-badge').textContent = 'Study 25m';
            document.getElementById('pomo-mode-badge').className = 'badge badge-primary';
          }
          this.updatePomodoroDisplay();
        }
      }, 1000);
    }
  }

  resetPomodoro() {
    clearInterval(this.pomoState.intervalId);
    this.pomoState.isRunning = false;
    this.pomoState.mode = 'study';
    this.pomoState.secondsLeft = 25 * 60;
    const startBtn = document.getElementById('pomo-start-btn');
    if (startBtn) {
      startBtn.textContent = 'Start';
      startBtn.classList.remove('btn-primary');
    }
    const badge = document.getElementById('pomo-mode-badge');
    if (badge) {
      badge.textContent = 'Study 25m';
      badge.className = 'badge badge-primary';
    }
    this.updatePomodoroDisplay();
  }

  updatePomodoroDisplay() {
    const mins = Math.floor(this.pomoState.secondsLeft / 60);
    const secs = this.pomoState.secondsLeft % 60;
    const clockEl = document.getElementById('pomo-clock-display');
    if (clockEl) {
      clockEl.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
  }

  // =========================================================================
  // 1. DASHBOARD VIEW RENDERER
  // =========================================================================

  renderDashboard() {
    const subjects = window.store.getSubjects();
    const tasks = window.store.getTasks();
    const notes = window.store.getNotes();
    const student = window.store.getStudent();

    // Update Greeting
    const greetingEl = document.getElementById('dash-greeting-text');
    if (greetingEl && student) {
      greetingEl.textContent = `Welcome back, ${student.name.split(' ')[0]}! 👋`;
    }

    // Update Metrics
    document.getElementById('metric-subjects-count').textContent = subjects.length;
    document.getElementById('metric-notes-count').textContent = notes.length;
    document.getElementById('metric-streak-count').textContent = `${student.streakDays || 8} Days`;

    // Compute Average Progress
    let totalTopics = 0;
    let completedTopics = 0;
    subjects.forEach(s => {
      if (s.topics) {
        totalTopics += s.topics.length;
        completedTopics += s.topics.filter(t => t.completed).length;
      }
    });
    const avgPct = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
    document.getElementById('metric-progress-avg').textContent = `${avgPct}%`;

    // Render Tasks
    const taskContainer = document.getElementById('dash-tasks-container');
    if (taskContainer) {
      if (!tasks.length) {
        taskContainer.innerHTML = `<div style="text-align: center; padding: 2rem; color: var(--text-muted);">🎉 All tasks completed! Add a new study task above.</div>`;
      } else {
        taskContainer.innerHTML = tasks.map(task => `
          <div class="task-item ${task.completed ? 'completed' : ''}">
            <div class="task-checkbox ${task.completed ? 'checked' : ''}" onclick="app.toggleTask('${task.id}')">
              ${task.completed ? '✓' : ''}
            </div>
            <div class="task-content">
              <div class="task-title">${this.escapeHtml(task.title)}</div>
              <div class="task-meta">
                <span class="badge ${task.priority === 'high' ? 'badge-rose' : task.priority === 'medium' ? 'badge-amber' : 'badge-emerald'}">
                  ${task.priority.toUpperCase()}
                </span>
                <span>•</span>
                <span>${task.subjectCode}</span>
                <span>•</span>
                <span>Due ${task.due}</span>
              </div>
            </div>
            <button class="btn-icon btn-sm" onclick="app.deleteTask('${task.id}')" title="Delete task">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        `).join('');
      }
    }

    // Render Priority Subjects
    const subjectsContainer = document.getElementById('dash-subjects-container');
    if (subjectsContainer) {
      subjectsContainer.innerHTML = subjects.slice(0, 4).map(sub => {
        const tot = sub.topics ? sub.topics.length : 0;
        const comp = sub.topics ? sub.topics.filter(t => t.completed).length : 0;
        const pct = tot > 0 ? Math.round((comp / tot) * 100) : 0;
        
        // Days remaining
        const diffDays = Math.max(0, Math.ceil((new Date(sub.examDate) - new Date()) / (1000 * 60 * 60 * 24)));

        return `
          <div class="dash-subject-card" onclick="app.openSubjectDetails('${sub.id}')">
            <div class="subject-top-info">
              <span class="subject-code-tag">${sub.code}</span>
              <span style="font-weight: 700; font-size: 0.8rem; color: var(--accent-rose);">⏳ ${diffDays}d left</span>
            </div>
            <div class="subject-name-dash">${sub.name}</div>
            <div class="progress-container">
              <div class="progress-bar-fill" style="width: ${pct}%;"></div>
            </div>
            <div class="subject-bottom-info">
              <span>${comp} of ${tot} Topics Mastered</span>
              <strong style="color: var(--primary);">${pct}%</strong>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // =========================================================================
  // 2. AI ASSISTANT VIEW RENDERER
  // =========================================================================

  renderAiChat() {
    const history = window.store.getChatHistory();
    const container = document.getElementById('chat-messages-container');
    if (!container) return;

    container.innerHTML = history.map(msg => {
      if (msg.sender === 'user') {
        return `
          <div class="chat-message user-message">
            <div class="message-avatar">👤</div>
            <div class="message-body">
              <div class="message-bubble">${this.escapeHtml(msg.text)}</div>
            </div>
          </div>
        `;
      } else {
        // AI Message
        return `
          <div class="chat-message ai-message">
            <div class="message-avatar">✨</div>
            <div class="message-body" style="width: 100%;">
              <div class="message-bubble">
                ${this.formatMarkdown(msg.text)}
                
                ${msg.mcqs ? this.renderInteractiveMcqs(msg.mcqs, msg.id) : ''}
              </div>

              <div class="message-actions">
                <button class="msg-action-btn" onclick="app.copyToClipboard('${this.escapeQuotes(msg.text)}')">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                  <span>Copy</span>
                </button>
                <button class="msg-action-btn text-primary" onclick="app.saveAiResponseToNotes('${this.escapeQuotes(msg.text)}')">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  <span>Save to Notes</span>
                </button>
              </div>
            </div>
          </div>
        `;
      }
    }).join('');

    container.scrollTop = container.scrollHeight;
  }

  renderInteractiveMcqs(mcqs, msgId) {
    return `
      <div class="chat-mcq-container">
        ${mcqs.map((mcq, qIdx) => `
          <div class="mcq-question-card" id="mcq-q-${msgId}-${qIdx}">
            <div class="mcq-q-title">${this.escapeHtml(mcq.question)}</div>
            <div class="mcq-options-list">
              ${mcq.options.map((opt, oIdx) => `
                <button class="mcq-option-btn" onclick="app.handleMcqSelect('${msgId}', ${qIdx}, ${oIdx}, ${mcq.correctIndex}, '${this.escapeQuotes(mcq.explanation)}')">
                  ${String.fromCharCode(65 + oIdx)}. ${this.escapeHtml(opt)}
                </button>
              `).join('')}
            </div>
            <div class="mcq-explanation-box" id="mcq-exp-${msgId}-${qIdx}">
              <strong>💡 Explanation:</strong> <span class="exp-text"></span>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  handleMcqSelect(msgId, qIdx, selectedIdx, correctIdx, explanation) {
    const card = document.getElementById(`mcq-q-${msgId}-${qIdx}`);
    if (!card) return;

    const btns = card.querySelectorAll('.mcq-option-btn');
    btns.forEach((btn, idx) => {
      btn.classList.add('disabled');
      if (idx === correctIdx) {
        btn.classList.add('correct');
      } else if (idx === selectedIdx && selectedIdx !== correctIdx) {
        btn.classList.add('wrong');
      }
    });

    const expBox = document.getElementById(`mcq-exp-${msgId}-${qIdx}`);
    if (expBox) {
      expBox.querySelector('.exp-text').textContent = explanation;
      expBox.style.display = 'block';
    }

    if (selectedIdx === correctIdx) {
      this.showToast('🎯 Correct answer! Excellent work.');
    } else {
      this.showToast('⚠️ Incorrect. Review the explanation.');
    }
  }

  async handleChatSubmit(event) {
    if (event) event.preventDefault();
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    if (!text) return;

    input.value = '';

    // Add user message
    window.store.addChatMessage({ sender: 'user', text: text });
    this.renderAiChat();

    // Show Typing Indicator
    const container = document.getElementById('chat-messages-container');
    const typingId = 'typing-' + Date.now();
    container.insertAdjacentHTML('beforeend', `
      <div class="chat-message ai-message" id="${typingId}">
        <div class="message-avatar">✨</div>
        <div class="message-body">
          <div class="message-bubble" style="padding: 0.5rem 1rem;">
            <div class="typing-indicator">
              <div class="typing-dot"></div>
              <div class="typing-dot"></div>
              <div class="typing-dot"></div>
            </div>
          </div>
        </div>
      </div>
    `);
    container.scrollTop = container.scrollHeight;

    // Simulate AI generation delay
    setTimeout(async () => {
      const typingEl = document.getElementById(typingId);
      if (typingEl) typingEl.remove();

      const aiResponse = await window.semAssistAI.generateResponse(text, 'general');
      window.store.addChatMessage({
        sender: 'ai',
        text: aiResponse.text,
        mcqs: aiResponse.mcqs || null,
        subjectTag: aiResponse.subjectTag || null
      });
      this.renderAiChat();
    }, 600);
  }

  sendPresetPrompt(type) {
    const prompts = {
      explain: "Explain Paging and Virtual Memory mechanics in Operating Systems with key formula and comparison table.",
      summarize: "Summarize top revision points and memory mnemonics for semester exam.",
      questions: "Generate top 5 recurring university exam questions for Operating Systems and DBMS.",
      mcq: "Create a 4-question interactive MCQ practice quiz on core algorithms and OS principles.",
      plan: "Create an optimized 3-day rapid revision timetable before semester finals."
    };

    const text = prompts[type] || "Help me prepare for my semester exams.";
    document.getElementById('chat-input').value = text;
    this.handleChatSubmit(null);
  }

  clearChat() {
    if (confirm("Reset conversation history?")) {
      window.store.clearChatHistory();
      this.renderAiChat();
      this.showToast('Chat history cleared.');
    }
  }

  quickPromptHelp() {
    this.showToast('💡 Tip: Try asking "Explain Dijkstra with complexity" or "Generate MCQs on DBMS".');
  }

  quickLaunchPractice() {
    this.navigate('ai');
    this.sendPresetPrompt('mcq');
  }

  // =========================================================================
  // 3. SUBJECTS TRACKER VIEW RENDERER
  // =========================================================================

  renderSubjects() {
    const subjects = window.store.getSubjects();
    const container = document.getElementById('subjects-grid-container');
    if (!container) return;

    if (!subjects.length) {
      container.innerHTML = `<div style="text-align: center; grid-column: 1/-1; padding: 3rem; color: var(--text-muted);">No subjects found. Click "+ Add Subject" to begin!</div>`;
      return;
    }

    container.innerHTML = subjects.map(sub => {
      const tot = sub.topics ? sub.topics.length : 0;
      const comp = sub.topics ? sub.topics.filter(t => t.completed).length : 0;
      const pct = tot > 0 ? Math.round((comp / tot) * 100) : 0;

      // Calculate days remaining
      const examDate = new Date(sub.examDate);
      const diffDays = Math.max(0, Math.ceil((examDate - new Date()) / (1000 * 60 * 60 * 24)));
      const formattedDate = examDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

      // Topics preview
      const previewTopics = (sub.topics || []).slice(0, 3);

      return `
        <div class="subject-card">
          <div>
            <div class="subject-header-row">
              <div class="subject-meta-left">
                <span class="subject-code-badge">${sub.code}</span>
                <h3 class="subject-name-lg">${sub.name}</h3>
                <div class="subject-prof-text">${sub.professor || 'Faculty Instructor'} • ${sub.credits || 3} Credits</div>
              </div>
              <div class="exam-countdown-chip">
                <div class="days-left-num">${diffDays}</div>
                <div class="days-left-lbl">Days Left</div>
              </div>
            </div>

            <div class="subject-progress-section">
              <div class="progress-labels">
                <span class="text-muted">Syllabus Progress</span>
                <span class="text-primary">${pct}% (${comp}/${tot})</span>
              </div>
              <div class="progress-container">
                <div class="progress-bar-fill" style="width: ${pct}%;"></div>
              </div>
            </div>

            <div class="subject-topics-preview">
              <div style="font-size: 0.75rem; font-weight: 700; color: var(--text-subtle); margin-bottom: 0.2rem;">KEY SYLLABUS TOPICS</div>
              ${previewTopics.map(t => `
                <div class="topic-preview-item ${t.completed ? 'completed' : ''}">
                  <span>${t.completed ? '✓' : '○'}</span>
                  <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${this.escapeHtml(t.title)}</span>
                </div>
              `).join('')}
              ${tot > 3 ? `<div style="font-size: 0.75rem; color: var(--primary); font-weight: 600;">+ ${tot - 3} more topics in syllabus</div>` : ''}
            </div>
          </div>

          <div class="subject-actions-row">
            <button class="btn btn-primary btn-sm" style="flex: 1;" onclick="app.openSubjectDetails('${sub.id}')">
              <span>View Syllabus</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>
            <button class="btn btn-secondary btn-sm" onclick="app.askAiAboutSubject('${sub.name}')" title="Ask AI about ${sub.name}">
              <span>✨ Ask AI</span>
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  openSubjectDetails(subjectId) {
    this.currentActiveSubjectId = subjectId;
    const sub = window.store.getSubject(subjectId);
    if (!sub) return;

    document.getElementById('modal-sub-code').textContent = sub.code;
    document.getElementById('modal-sub-name').textContent = sub.name;
    
    const diffDays = Math.max(0, Math.ceil((new Date(sub.examDate) - new Date()) / (1000 * 60 * 60 * 24)));
    document.getElementById('modal-sub-meta').textContent = `${sub.professor || 'Instructor'} • ⏳ Exam in ${diffDays} days (${new Date(sub.examDate).toLocaleDateString()})`;

    const tot = sub.topics ? sub.topics.length : 0;
    const comp = sub.topics ? sub.topics.filter(t => t.completed).length : 0;
    const pct = tot > 0 ? Math.round((comp / tot) * 100) : 0;

    document.getElementById('modal-sub-progress-pct').textContent = `${pct}% (${comp}/${tot} Topics)`;
    document.getElementById('modal-sub-progress-bar').style.width = `${pct}%`;

    // Render topics checklist
    const listEl = document.getElementById('modal-sub-topics-list');
    listEl.innerHTML = (sub.topics || []).map(t => `
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.6rem 0.85rem; background: var(--bg-subtle); border-radius: var(--radius-sm); cursor: pointer;" onclick="app.toggleSubjectTopic('${sub.id}', '${t.id}')">
        <div style="display: flex; align-items: center; gap: 0.65rem;">
          <div class="task-checkbox ${t.completed ? 'checked' : ''}">
            ${t.completed ? '✓' : ''}
          </div>
          <span style="${t.completed ? 'text-decoration: line-through; color: var(--text-muted);' : 'font-weight: 600; color: var(--text-main);'} font-size: 0.85rem;">
            ${this.escapeHtml(t.title)}
          </span>
        </div>
        <span class="badge ${t.completed ? 'badge-emerald' : 'badge-gray'}">${t.completed ? 'Done' : 'Pending'}</span>
      </div>
    `).join('');

    this.openModal('modal-subject-details');
  }

  toggleSubjectTopic(subjectId, topicId) {
    window.store.toggleTopic(subjectId, topicId);
    this.openSubjectDetails(subjectId); // Re-render modal contents
  }

  addTopicToCurrentSubject() {
    const input = document.getElementById('modal-new-topic-input');
    const title = input.value.trim();
    if (!title || !this.currentActiveSubjectId) return;

    window.store.addTopic(this.currentActiveSubjectId, title);
    input.value = '';
    this.openSubjectDetails(this.currentActiveSubjectId);
    this.showToast('Topic added to syllabus!');
  }

  askAiAboutSubject(subName) {
    const name = subName || (this.currentActiveSubjectId ? window.store.getSubject(this.currentActiveSubjectId).name : 'Operating Systems');
    this.closeModal('modal-subject-details');
    this.navigate('ai');
    document.getElementById('chat-input').value = `Explain high-yield exam concepts and 10-mark questions for ${name}`;
    this.handleChatSubmit(null);
  }

  openAddSubjectModal() {
    this.openModal('modal-add-subject');
  }

  handleAddSubjectSubmit(event) {
    event.preventDefault();
    const name = document.getElementById('new-sub-name').value.trim();
    const code = document.getElementById('new-sub-code').value.trim();
    const credits = document.getElementById('new-sub-credits').value;
    const prof = document.getElementById('new-sub-prof').value.trim();
    const examDate = document.getElementById('new-sub-date').value;
    const topicsRaw = document.getElementById('new-sub-topics').value.trim();

    const topicsList = topicsRaw ? topicsRaw.split(',').map(t => t.trim()).filter(Boolean) : [
      'Fundamental Principles & Theory',
      'System Architecture & Design',
      'Algorithms & Computational Complexity',
      'Exam Derivations & Past Papers'
    ];

    window.store.addSubject({
      name,
      code,
      credits,
      professor: prof,
      examDate,
      topicsList
    });

    this.closeModal('modal-add-subject');
    this.showToast(`✅ Subject ${code}: ${name} added!`);
  }

  // =========================================================================
  // 4. NOTES MANAGER VIEW RENDERER
  // =========================================================================

  renderNotes() {
    const notes = window.store.getNotes();
    const subjects = window.store.getSubjects();

    // Render Filter Pills
    const pillsContainer = document.getElementById('notes-filter-pills');
    if (pillsContainer) {
      let html = `<button class="filter-pill ${this.notesActiveFilter === 'all' ? 'active' : ''}" onclick="app.setNotesFilter('all')">All Notes (${notes.length})</button>`;
      subjects.forEach(sub => {
        const count = notes.filter(n => n.subjectId === sub.id || n.subjectCode === sub.code).length;
        html += `<button class="filter-pill ${this.notesActiveFilter === sub.id ? 'active' : ''}" onclick="app.setNotesFilter('${sub.id}')">${sub.code} (${count})</button>`;
      });
      pillsContainer.innerHTML = html;
    }

    // Filter Notes
    const searchVal = (document.getElementById('notes-search-input')?.value || '').toLowerCase();
    const filteredNotes = notes.filter(n => {
      const matchFilter = this.notesActiveFilter === 'all' || n.subjectId === this.notesActiveFilter;
      const matchSearch = !searchVal || n.title.toLowerCase().includes(searchVal) || n.content.toLowerCase().includes(searchVal) || (n.tags && n.tags.some(t => t.toLowerCase().includes(searchVal)));
      return matchFilter && matchSearch;
    });

    const grid = document.getElementById('notes-grid-container');
    if (grid) {
      if (!filteredNotes.length) {
        grid.innerHTML = `<div style="text-align: center; grid-column: 1/-1; padding: 3rem; color: var(--text-muted);">No notes match your filter. Click "+ Add Note" to create one!</div>`;
        return;
      }

      grid.innerHTML = filteredNotes.map(n => {
        const dateStr = new Date(n.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        return `
          <div class="note-card" onclick="app.openEditNoteModal('${n.id}')">
            <div>
              <div class="note-card-top">
                <span class="note-subject-pill">${n.subjectCode || 'CS'}</span>
                <span class="note-date-text">${dateStr}</span>
              </div>
              <h3 class="note-card-title">${this.escapeHtml(n.title)}</h3>
              <p class="note-snippet-text">${this.escapeHtml(n.content.replace(/[#*`_]/g, ''))}</p>
            </div>

            <div>
              <div class="note-tag-badges">
                ${(n.tags || []).map(t => `<span class="badge badge-gray">${this.escapeHtml(t)}</span>`).join('')}
              </div>

              <div class="note-card-footer">
                <button class="btn btn-sm btn-outline-primary" onclick="event.stopPropagation(); app.summarizeNote('${n.id}')">
                  <span>✨ Summarize AI</span>
                </button>
                <div style="display: flex; gap: 0.25rem;">
                  <button class="btn-icon btn-sm" onclick="event.stopPropagation(); app.copyToClipboard('${this.escapeQuotes(n.content)}')" title="Copy content">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                  </button>
                  <button class="btn-icon btn-sm" onclick="event.stopPropagation(); app.deleteNote('${n.id}')" title="Delete note">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  setNotesFilter(filterId) {
    this.notesActiveFilter = filterId;
    this.renderNotes();
  }

  filterNotes() {
    this.renderNotes();
  }

  openAddNoteModal() {
    document.getElementById('note-modal-title').textContent = 'Create Study Note';
    document.getElementById('edit-note-id').value = '';
    document.getElementById('note-title-input').value = '';
    document.getElementById('note-tags-input').value = 'Exam Revision';
    document.getElementById('note-content-input').value = '';

    // Populate subject select
    this.populateSubjectSelect('note-subject-select');
    this.openModal('modal-note-editor');
  }

  openEditNoteModal(noteId) {
    const note = window.store.getNote(noteId);
    if (!note) return;

    document.getElementById('note-modal-title').textContent = 'Edit Study Note';
    document.getElementById('edit-note-id').value = note.id;
    document.getElementById('note-title-input').value = note.title;
    document.getElementById('note-tags-input').value = (note.tags || []).join(', ');
    document.getElementById('note-content-input').value = note.content;

    this.populateSubjectSelect('note-subject-select', note.subjectId);
    this.openModal('modal-note-editor');
  }

  handleNoteFormSubmit(event) {
    event.preventDefault();
    const editId = document.getElementById('edit-note-id').value;
    const title = document.getElementById('note-title-input').value.trim();
    const subjectId = document.getElementById('note-subject-select').value;
    const tagsRaw = document.getElementById('note-tags-input').value.trim();
    const content = document.getElementById('note-content-input').value.trim();

    const tags = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : ['Revision'];

    if (editId) {
      window.store.updateNote(editId, { title, subjectId, tags, content });
      this.showToast('Note updated successfully!');
    } else {
      window.store.addNote({ title, subjectId, tags, content });
      this.showToast('Note saved successfully!');
    }

    this.closeModal('modal-note-editor');
  }

  deleteNote(noteId) {
    if (confirm('Delete this study note?')) {
      window.store.deleteNote(noteId);
      this.showToast('Note deleted.');
    }
  }

  async summarizeNote(noteId) {
    const note = window.store.getNote(noteId);
    if (!note) return;

    this.showToast('✨ AI is analyzing your note...');
    const aiSummary = await window.semAssistAI.generateResponse(note.content, 'summarize', note.subjectName);

    document.getElementById('ai-summary-content').innerHTML = `
      <div style="margin-bottom: 1rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--border-subtle);">
        <div style="font-size: 0.8rem; font-weight: 700; color: var(--primary);">${note.subjectCode}: ${note.subjectName}</div>
        <h3 style="font-size: 1.2rem; font-weight: 800; margin-top: 0.2rem;">${this.escapeHtml(note.title)}</h3>
      </div>
      <div>${this.formatMarkdown(aiSummary.text)}</div>
    `;

    this.lastAiSummaryText = aiSummary.text;
    this.openModal('modal-ai-summary');
  }

  async summarizeCurrentNoteEditor() {
    const content = document.getElementById('note-content-input').value.trim();
    if (!content) {
      this.showToast('⚠️ Please write some note content first!');
      return;
    }

    this.showToast('✨ Generating AI summary...');
    const aiSummary = await window.semAssistAI.generateResponse(content, 'summarize');
    
    document.getElementById('ai-summary-content').innerHTML = `
      <div style="margin-bottom: 1rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--border-subtle);">
        <h3 style="font-size: 1.2rem; font-weight: 800;">Draft Note Summary</h3>
      </div>
      <div>${this.formatMarkdown(aiSummary.text)}</div>
    `;

    this.lastAiSummaryText = aiSummary.text;
    this.openModal('modal-ai-summary');
  }

  copyAiSummaryText() {
    if (this.lastAiSummaryText) {
      this.copyToClipboard(this.lastAiSummaryText);
    }
  }

  saveAiResponseToNotes(text) {
    const firstLine = text.split('\n')[0].replace(/[#*`_]/g, '').trim() || 'AI Generated Study Notes';
    window.store.addNote({
      title: firstLine,
      tags: ['AI Generated', 'Exam Prep'],
      content: text
    });
    this.showToast('✅ Saved AI response to My Notes!');
  }

  // =========================================================================
  // 5. STUDY PLAN VIEW RENDERER
  // =========================================================================

  renderStudyPlan() {
    const plan = window.store.getStudyPlan();
    const container = document.getElementById('schedule-timeline-container');
    if (!container) return;

    if (!plan.length) {
      container.innerHTML = `<div style="text-align: center; padding: 3rem; color: var(--text-muted);">No study sessions scheduled. Click "+ Add Session" or "Generate Smart Schedule"!</div>`;
      return;
    }

    // Group by Day
    const daysMap = {};
    plan.forEach(item => {
      const d = item.day || 'Today';
      if (!daysMap[d]) daysMap[d] = [];
      daysMap[d].push(item);
    });

    container.innerHTML = Object.keys(daysMap).map(day => `
      <div class="schedule-day-group">
        <div class="schedule-day-header">
          <span>📅 ${day}</span>
          <span class="badge badge-primary">${daysMap[day].length} Sessions</span>
        </div>

        <div class="schedule-slots-list">
          ${daysMap[day].map(slot => `
            <div class="schedule-slot-card">
              <div class="schedule-time-box">${slot.time}</div>
              <div class="schedule-content-box">
                <div class="schedule-slot-topic">${this.escapeHtml(slot.topic)}</div>
                <div class="schedule-slot-sub">
                  <span class="badge badge-primary">${slot.subjectCode}</span>
                  <span>${slot.subjectName}</span>
                </div>
              </div>
              
              <div class="schedule-status-toggle">
                <button class="status-btn ${slot.status === 'scheduled' ? 'active-scheduled' : ''}" onclick="app.updateSlotStatus('${slot.id}', 'scheduled')">Scheduled</button>
                <button class="status-btn ${slot.status === 'in-progress' ? 'active-inprogress' : ''}" onclick="app.updateSlotStatus('${slot.id}', 'in-progress')">In Progress</button>
                <button class="status-btn ${slot.status === 'completed' ? 'active-completed' : ''}" onclick="app.updateSlotStatus('${slot.id}', 'completed')">Done ✓</button>
                <button class="btn-icon btn-sm" onclick="app.deleteScheduleItem('${slot.id}')" title="Remove session">✕</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');
  }

  updateSlotStatus(id, status) {
    window.store.updateStudyPlanStatus(id, status);
  }

  deleteScheduleItem(id) {
    window.store.deleteStudyPlanItem(id);
    this.showToast('Study session removed.');
  }

  openAddScheduleModal() {
    this.populateSubjectSelect('sched-subject-select');
    this.openModal('modal-add-schedule');
  }

  handleAddScheduleSubmit(event) {
    event.preventDefault();
    const topic = document.getElementById('sched-topic-input').value.trim();
    const day = document.getElementById('sched-day-select').value;
    const subjectId = document.getElementById('sched-subject-select').value;
    const time = document.getElementById('sched-time-input').value.trim();

    window.store.addStudyPlanItem({
      topic,
      day,
      subjectId,
      time
    });

    this.closeModal('modal-add-schedule');
    this.showToast('✅ Study session added!');
  }

  generateNewStudyPlan() {
    const hours = Number(document.getElementById('ai-plan-hours')?.value || 4.5);
    window.store.generateAiStudyPlan(hours);
    this.showToast(`✨ Generated smart ${hours}h/day study roadmap!`);
  }

  // =========================================================================
  // 6. TASKS & GLOBAL COUNTERS
  // =========================================================================

  openAddTaskModal() {
    this.populateSubjectSelect('task-subject-select');
    this.openModal('modal-add-task');
  }

  handleAddTaskSubmit(event) {
    event.preventDefault();
    const title = document.getElementById('task-title-input').value.trim();
    const subjectId = document.getElementById('task-subject-select').value;
    const priority = document.getElementById('task-priority-select').value;
    const due = document.getElementById('task-due-input').value.trim();

    const sub = window.store.getSubject(subjectId);
    window.store.addTask({
      title,
      subjectId,
      subjectCode: sub ? sub.code : 'GEN',
      priority,
      due
    });

    this.closeModal('modal-add-task');
    this.showToast('Study task added!');
  }

  toggleTask(taskId) {
    window.store.toggleTask(taskId);
  }

  deleteTask(taskId) {
    window.store.deleteTask(taskId);
    this.showToast('Task removed.');
  }

  updateGlobalCounters() {
    const notifs = window.store.getNotifications();
    const unread = notifs.filter(n => !n.read).length;
    const badge = document.getElementById('notif-badge-count');
    if (badge) {
      badge.textContent = unread;
      badge.style.display = unread > 0 ? 'inline-block' : 'none';
    }

    // Render notif popover items
    const listEl = document.getElementById('notif-items-list');
    if (listEl) {
      if (!notifs.length) {
        listEl.innerHTML = `<div style="padding: 1.5rem; text-align: center; color: var(--text-muted); font-size: 0.85rem;">No notifications.</div>`;
      } else {
        listEl.innerHTML = notifs.map(n => `
          <div class="notif-item ${n.read ? '' : 'unread'}" onclick="app.markNotifRead('${n.id}')">
            <div class="notif-icon-box" style="background: var(--primary-light); color: var(--primary);">
              ${n.type === 'exam' ? '⏰' : n.type === 'streak' ? '🔥' : '✨'}
            </div>
            <div>
              <div style="font-weight: 700; font-size: 0.85rem;">${this.escapeHtml(n.title)}</div>
              <div style="font-size: 0.75rem; color: var(--text-muted); line-height: 1.4;">${this.escapeHtml(n.message)}</div>
              <div style="font-size: 0.65rem; color: var(--text-subtle); margin-top: 0.2rem;">${n.time}</div>
            </div>
          </div>
        `).join('');
      }
    }
  }

  toggleNotifications() {
    const pop = document.getElementById('notifications-popover');
    if (pop) pop.classList.toggle('show');
  }

  markNotifRead(id) {
    window.store.markNotificationRead(id);
    this.updateGlobalCounters();
  }

  markAllNotifsRead() {
    const notifs = window.store.getNotifications();
    notifs.forEach(n => window.store.markNotificationRead(n.id));
    this.updateGlobalCounters();
    this.showToast('All notifications marked as read.');
  }

  // =========================================================================
  // 7. GLOBAL SEARCH COMMAND PALETTE (Ctrl+K)
  // =========================================================================

  openSearchPalette() {
    this.openModal('modal-search-palette');
    const input = document.getElementById('palette-search-input');
    if (input) {
      input.value = '';
      input.focus();
      this.handlePaletteSearch('');
    }
  }

  handlePaletteSearch(query) {
    const q = query.toLowerCase().trim();
    const container = document.getElementById('palette-results-container');
    if (!container) return;

    const subjects = window.store.getSubjects();
    const notes = window.store.getNotes();

    const results = [];

    // Fast AI Prompts
    results.push({
      type: 'AI Command',
      icon: '✨',
      title: 'Ask AI: Explain a Concept',
      action: () => { this.closeModal('modal-search-palette'); this.navigate('ai'); this.sendPresetPrompt('explain'); }
    });
    results.push({
      type: 'AI Command',
      icon: '❓',
      title: 'Ask AI: Generate Exam MCQs',
      action: () => { this.closeModal('modal-search-palette'); this.navigate('ai'); this.sendPresetPrompt('mcq'); }
    });

    // Subjects
    subjects.forEach(sub => {
      if (!q || sub.name.toLowerCase().includes(q) || sub.code.toLowerCase().includes(q)) {
        results.push({
          type: 'Subject',
          icon: '📚',
          title: `${sub.code}: ${sub.name}`,
          action: () => { this.closeModal('modal-search-palette'); this.navigate('subjects'); this.openSubjectDetails(sub.id); }
        });
      }
    });

    // Notes
    notes.forEach(note => {
      if (!q || note.title.toLowerCase().includes(q) || note.content.toLowerCase().includes(q)) {
        results.push({
          type: 'Note',
          icon: '📝',
          title: `${note.subjectCode}: ${note.title}`,
          action: () => { this.closeModal('modal-search-palette'); this.navigate('notes'); this.openEditNoteModal(note.id); }
        });
      }
    });

    if (!results.length) {
      container.innerHTML = `<div style="padding: 1.5rem; text-align: center; color: var(--text-muted); font-size: 0.85rem;">No results found for "${this.escapeHtml(query)}"</div>`;
      return;
    }

    container.innerHTML = results.slice(0, 8).map((r, idx) => `
      <div class="palette-item" onclick="app.executePaletteAction(${idx})">
        <div class="palette-item-icon">${r.icon}</div>
        <div style="flex: 1;">
          <div style="font-weight: 700; font-size: 0.9rem;">${this.escapeHtml(r.title)}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">${r.type}</div>
        </div>
        <span style="font-size: 0.75rem; color: var(--text-subtle);">Jump ↵</span>
      </div>
    `).join('');

    this.paletteCurrentResults = results;
  }

  executePaletteAction(idx) {
    if (this.paletteCurrentResults && this.paletteCurrentResults[idx]) {
      this.paletteCurrentResults[idx].action();
    }
  }

  // =========================================================================
  // 8. PROFILE & SETTINGS
  // =========================================================================

  openProfileModal() {
    const student = window.store.getStudent();
    if (student) {
      document.getElementById('profile-target-hours').value = student.dailyGoalHours || 3.5;
      document.getElementById('profile-target-gpa').value = student.targetGpa || '3.85 / 4.0';
    }
    this.openModal('modal-profile');
  }

  saveProfileSettings() {
    const hours = Number(document.getElementById('profile-target-hours').value);
    const gpa = document.getElementById('profile-target-gpa').value.trim();

    window.store.updateStudent({ dailyGoalHours: hours, targetGpa: gpa });
    this.closeModal('modal-profile');
    this.showToast('Profile preferences saved!');
  }

  setTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    this.showToast(`Switched to ${theme} theme.`);
  }

  resetDataToDefault() {
    if (confirm("Reset all subjects, notes, and tasks back to demo initial state?")) {
      window.store.resetToDefaults();
      this.closeModal('modal-profile');
      this.renderCurrentView();
      this.showToast('Application reset to initial demo state.');
    }
  }

  updateUserProfileInfo() {
    const student = window.store.getStudent();
    if (student) {
      const initials = student.name.split(' ').map(n => n[0]).join('').toUpperCase();
      const sidebarName = document.getElementById('sidebar-user-name');
      const sidebarMajor = document.getElementById('sidebar-user-major');
      const topbarAvatar = document.getElementById('topbar-user-avatar');
      const sidebarAvatar = document.getElementById('sidebar-user-avatar');

      if (sidebarName) sidebarName.textContent = student.name;
      if (sidebarMajor) sidebarMajor.textContent = `${student.semester} • ${student.major}`;
      if (topbarAvatar) topbarAvatar.textContent = initials;
      if (sidebarAvatar) sidebarAvatar.textContent = initials;
    }
  }

  // =========================================================================
  // HELPERS & MODAL UTILITIES
  // =========================================================================

  populateSubjectSelect(selectId, selectedId = null) {
    const select = document.getElementById(selectId);
    if (!select) return;
    const subjects = window.store.getSubjects();
    select.innerHTML = subjects.map(s => `
      <option value="${s.id}" ${s.id === selectedId ? 'selected' : ''}>${s.code} - ${s.name}</option>
    `).join('');
  }

  openModal(modalId) {
    const el = document.getElementById(modalId);
    if (el) el.classList.add('show');
  }

  closeModal(modalId) {
    const el = document.getElementById(modalId);
    if (el) el.classList.remove('show');
  }

  closeAllModals() {
    document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('show'));
    const pop = document.getElementById('notifications-popover');
    if (pop) pop.classList.remove('show');
  }

  showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      this.showToast('📋 Copied to clipboard!');
    }).catch(() => {
      this.showToast('Failed to copy.');
    });
  }

  escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&#039;');
  }

  escapeQuotes(str) {
    if (!str) return '';
    return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/\n/g, '\\n');
  }

  formatMarkdown(text) {
    if (!text) return '';
    let out = this.escapeHtml(text);

    // Code blocks ``` ... ```
    out = out.replace(/```([a-z]*)\n([\s\S]*?)```/g, (match, lang, code) => {
      return `<pre><code>${code.trim()}</code></pre>`;
    });

    // Inline code `...`
    out = out.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Headers
    out = out.replace(/^### (.*$)/gim, '<h4 style="font-weight: 800; font-size: 1.05rem; margin: 0.75rem 0 0.4rem; color: var(--text-main);">$1</h4>');
    out = out.replace(/^#### (.*$)/gim, '<h5 style="font-weight: 700; font-size: 0.95rem; margin: 0.6rem 0 0.3rem; color: var(--primary);">$1</h5>');

    // Bold **...**
    out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

    // Blockquote / Tip > ...
    out = out.replace(/^> (.*$)/gim, '<div style="border-left: 3px solid var(--primary); padding: 0.4rem 0.8rem; background: var(--primary-light); border-radius: 4px; margin: 0.6rem 0; font-size: 0.85rem; color: var(--primary);">$1</div>');

    // Horizontal Rule ---
    out = out.replace(/^---$/gim, '<hr style="border: none; border-top: 1px solid var(--border-subtle); margin: 0.85rem 0;">');

    // Markdown Tables (| ... |)
    const tableRegex = /((?:\|.+?\|\r?\n)+)/g;
    out = out.replace(tableRegex, (tableText) => {
      const rows = tableText.trim().split('\n').map(r => r.trim());
      if (rows.length < 2) return tableText;

      let tableHtml = '<table>';
      rows.forEach((row, rIdx) => {
        if (row.includes('---')) return; // Separator row
        const cells = row.split('|').filter((c, idx, arr) => idx > 0 && idx < arr.length - 1);
        tableHtml += '<tr>';
        cells.forEach(cell => {
          if (rIdx === 0) {
            tableHtml += `<th>${cell.trim()}</th>`;
          } else {
            tableHtml += `<td>${cell.trim()}</td>`;
          }
        });
        tableHtml += '</tr>';
      });
      tableHtml += '</table>';
      return tableHtml;
    });

    // Unordered lists (- or *)
    out = out.replace(/^\s*[-*]\s+(.*$)/gim, '<div style="display: flex; gap: 0.5rem; margin: 0.2rem 0;"><span style="color: var(--primary);">•</span><span>$1</span></div>');

    // Numbered lists (1. ...)
    out = out.replace(/^\s*(\d+)\.\s+(.*$)/gim, '<div style="display: flex; gap: 0.5rem; margin: 0.2rem 0;"><strong style="color: var(--primary); min-width: 18px;">$1.</strong><span>$2</span></div>');

    // Line breaks
    out = out.replace(/\n\n/g, '<div style="height: 0.65rem;"></div>');

    return out;
  }
}

// Instantiate and bind global app
window.app = new SemAssistApp();
