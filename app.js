(() => {
  "use strict";

  const STORAGE_KEY = "sissySkillTracker.v1";
  const HISTORY_LIMIT = 10000;
  const MAX_LEVEL_XP = 10000;
  const XP_PER_LEVEL = 100;



  const UI_STYLES = [
    { id: "royal-pink", name: "Royal Pink", subtitle: "Crown, gold, pink, and gemstone progression", icon: "👑" },
    { id: "neon-club", name: "Neon Club", subtitle: "Glowing nightclub pinks, purples, and cyan", icon: "💗" },
    { id: "glitter-xp", name: "Glitter XP", subtitle: "Sparkly reward-screen energy", icon: "✨" },
    { id: "dark-dungeon", name: "Dark Dungeon", subtitle: "Fantasy quest board with burgundy metal trim", icon: "🛡️" },
    { id: "cute-pastel", name: "Cute Pastel", subtitle: "Soft pink, lavender, bows, and gentle cards", icon: "🎀" },
    { id: "arcade-pixel", name: "Arcade Pixel", subtitle: "Retro game buttons, chunky XP, and pixel vibes", icon: "🕹️" },
    { id: "luxury-black-gold", name: "Luxury Black & Gold", subtitle: "Premium black, plum, gold, and restrained shine", icon: "◆" },
    { id: "cyber-sissy", name: "Cyber Sissy", subtitle: "Magenta/cyan futuristic tracker dashboard", icon: "▣" },
    { id: "princess-academy", name: "Princess Academy", subtitle: "Ribbon badges, assignments, and certificate energy", icon: "🏵️" },
    { id: "minimal-tracker", name: "Minimal Tracker", subtitle: "Clean, readable, and low-distraction", icon: "□" }
  ];

  const UI_STYLE_IDS = UI_STYLES.map(style => style.id);

  const CATEGORY_DEFINITIONS = [
    { id: "dress-up", name: "Dress Up", icon: "👗", accent: "#ff66b8" },
    { id: "makeup", name: "Makeup", icon: "💄", accent: "#ec4cff" },
    { id: "high-heels", name: "High Heels", icon: "👠", accent: "#a96cff" },
    { id: "hygiene", name: "Hygiene", icon: "✨", accent: "#3fd7d0" },
    { id: "servitude", name: "Servitude", icon: "🛎️", accent: "#6699ff" },
    { id: "anal", name: "Anal", icon: "♦", accent: "#db4f9c" },
    { id: "oral", name: "Oral", icon: "💋", accent: "#ff5f7f" },
    { id: "exposure", name: "Exposure", icon: "👁️", accent: "#ff9f43" },
    { id: "sexual-prowess", name: "Sexual Prowess", icon: "🔥", accent: "#f5c451" }
  ];

  const RANKS = {
    "dress-up": [
      "Plain Beginner", "Curious Dresser", "Frilly Amateur", "Feminized Wardrobe Pet",
      "Sissy Fashion Student", "Properly Dressed Sissy", "Frilly Little Showpiece",
      "Wardrobe-Obedient Doll", "Shameless Sissy Mannequin", "Permanently Feminized Doll",
      "Perfectly Presented Sissy Princess"
    ],
    "makeup": [
      "Bare-Faced Beginner", "Lipstick Learner", "Blushing Amateur", "Painted Little Sissy",
      "Feminized Face in Training", "Proper Makeup Doll", "Glossy Sissy Showpiece",
      "Painted and Prettified Pet", "Shamelessly Artificial Doll", "Heavily Painted Sissy Face",
      "Perfectly Painted Princess"
    ],
    "high-heels": [
      "Unsteady Beginner", "Wobbly Heel Walker", "Tiptoeing Amateur", "Clicking Little Sissy",
      "Heel-Trained Pet", "Proper High-Heeled Sissy", "Graceful Feminized Walker",
      "Heel-Dependent Doll", "Permanently Elevated Sissy", "Shameless Stiletto Slave",
      "Perfect High-Heeled Princess"
    ],
    "hygiene": [
      "Untidy Beginner", "Basic Grooming Student", "Clean Little Amateur", "Freshly Scrubbed Sissy",
      "Groomed Feminine Pet", "Properly Pampered Sissy", "Perfumed Little Doll",
      "Meticulously Maintained Pet", "Obsessively Groomed Sissy", "Pristine Feminine Showpiece",
      "Immaculate Sissy Princess"
    ],
    "servitude": [
      "Reluctant Helper", "Obedience Beginner", "Useful Little Assistant", "Trainable Sissy Servant",
      "Dutiful Feminized Helper", "Proper Sissy Maid", "Eager Household Pet",
      "Obedient Domestic Doll", "Tireless Sissy Servant", "Completely Devoted Maid",
      "Perfectly Obedient Sissy Slave"
    ],
    "anal": [
      "Nervous Beginner", "Curious Trainee", "Timid Practice Pet", "Trainable Little Sissy",
      "Dedicated Training Doll", "Properly Prepared Sissy", "Eagerly Trained Pet",
      "Shameless Practice Doll", "Thoroughly Conditioned Sissy", "Completely Devoted Training Pet",
      "Perfectly Trained Sissy Toy"
    ],
    "oral": [
      "Shy Beginner", "Curious Learner", "Timid Practice Pet", "Eager Little Student",
      "Trainable Sissy Mouth", "Proper Oral Service Sissy", "Eagerly Practised Pet",
      "Shameless Service Doll", "Thoroughly Trained Sissy", "Devoted Oral Service Pet",
      "Perfect Sissy Service Toy"
    ],
    "exposure": [
      "Hidden Beginner", "Nervous Attention Seeker", "Blushing Little Show-Off", "Timid Exhibition Sissy",
      "Attention-Hungry Doll", "Proper Sissy Exhibitionist", "Eager Feminized Showpiece",
      "Shameless Display Doll", "Publicly Embarrassed Sissy", "Completely Exposed Attention Pet",
      "Utterly Shameless Sissy Exhibitionist"
    ],
    "sexual-prowess": [
      "Inexperienced Beginner", "Awkward Amateur", "Curious Little Learner", "Trainable Sissy Plaything",
      "Developing Pleasure Pet", "Properly Practised Sissy", "Eager and Versatile Doll",
      "Experienced Sissy Plaything", "Shameless Pleasure Pet", "Thoroughly Experienced Sissy Toy",
      "Ultimate Sissy Pleasure Doll"
    ]
  };

  const state = {
    data: loadData(),
    view: "dashboard",
    selectedCategoryId: null,
    objectiveTab: "active",
    historyFilter: "all",
    activeUiStyle: null,
    installPrompt: null
  };

  const content = document.getElementById("app-content");
  const titleEl = document.getElementById("page-title");
  const eyebrowEl = document.getElementById("page-eyebrow");
  const actionsEl = document.getElementById("topbar-actions");
  const modalRoot = document.getElementById("modal-root");
  const toastRoot = document.getElementById("toast-root");
  const celebrationRoot = document.getElementById("celebration-root");
  const importInput = document.getElementById("import-file");

  init();

  function init() {
    state.activeUiStyle = resolveUiStyle(true);
    applySettings();
    refreshObjectiveStatuses(true);
    bindGlobalEvents();
    render();

    if ("serviceWorker" in navigator && location.protocol !== "file:") {
      window.addEventListener("load", () => navigator.serviceWorker.register("service-worker.js").catch(() => {}));
    }

    window.addEventListener("beforeinstallprompt", event => {
      event.preventDefault();
      state.installPrompt = event;
      if (state.view === "settings") render();
    });

    setInterval(() => {
      const changed = refreshObjectiveStatuses(true);
      if (changed && ["dashboard", "objectives"].includes(state.view)) render();
      else if (state.view === "objectives") updateVisibleCountdowns();
    }, 30000);
  }

  function defaultData() {
    return {
      version: 1,
      profile: {
        createdAt: new Date().toISOString()
      },
      categories: CATEGORY_DEFINITIONS.map(def => ({
        ...def,
        xp: 0,
        tasks: []
      })),
      objectives: [],
      history: [],
      settings: {
        theme: "dark",
        uiStyle: "royal-pink",
        reduceAnimations: false,
        soundEffects: false,
        floatingXp: true,
        confirmDelete: true
      }
    };
  }

  function loadData() {
    const fallback = defaultData();
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") return fallback;

      const existingCategories = Array.isArray(parsed.categories) ? parsed.categories : [];
      const categories = CATEGORY_DEFINITIONS.map(def => {
        const saved = existingCategories.find(item => item.id === def.id) || {};
        return {
          ...def,
          xp: safeNonNegativeNumber(saved.xp),
          tasks: Array.isArray(saved.tasks) ? saved.tasks.map(normalizeTask) : []
        };
      });

      return {
        version: 1,
        profile: { ...fallback.profile, ...(parsed.profile || {}) },
        categories,
        objectives: Array.isArray(parsed.objectives) ? parsed.objectives.map(normalizeObjective) : [],
        history: Array.isArray(parsed.history) ? parsed.history.slice(0, HISTORY_LIMIT) : [],
        settings: { ...fallback.settings, ...(parsed.settings || {}) }
      };
    } catch (error) {
      console.warn("Unable to load save data:", error);
      return fallback;
    }
  }

  function normalizeTask(task) {
    return {
      id: String(task.id || uid()),
      name: String(task.name || "Untitled task"),
      description: String(task.description || ""),
      difficulty: clampNumber(task.difficulty, 1, 10, 1),
      completions: Math.floor(safeNonNegativeNumber(task.completions)),
      xpGenerated: safeNonNegativeNumber(task.xpGenerated ?? (safeNonNegativeNumber(task.completions) * clampNumber(task.difficulty, 1, 10, 1))),
      createdAt: task.createdAt || new Date().toISOString(),
      lastCompletedAt: task.lastCompletedAt || null,
      archived: Boolean(task.archived)
    };
  }

  function normalizeObjective(objective) {
    return {
      id: String(objective.id || uid()),
      type: objective.type === "task" ? "task" : "manual",
      title: String(objective.title || "Untitled objective"),
      description: String(objective.description || ""),
      categoryId: objective.categoryId || null,
      taskId: objective.taskId || null,
      targetCount: Math.max(1, Math.floor(safeNonNegativeNumber(objective.targetCount) || 1)),
      startCount: Math.floor(safeNonNegativeNumber(objective.startCount)),
      createdAt: objective.createdAt || new Date().toISOString(),
      startedAt: objective.startedAt || objective.createdAt || new Date().toISOString(),
      endsAt: objective.endsAt || null,
      completedAt: objective.completedAt || null,
      failedAt: objective.failedAt || null,
      status: ["active", "completed", "failed"].includes(objective.status) ? objective.status : "active",
      failureLogged: Boolean(objective.failureLogged),
      duration: safeNonNegativeNumber(objective.duration) || null,
      durationUnit: ["hours", "days", "weeks", "months"].includes(objective.durationUnit) ? objective.durationUnit : null
    };
  }

  function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data));
    const dot = document.querySelector(".save-dot");
    if (dot) {
      dot.animate?.([{ transform: "scale(1)" }, { transform: "scale(1.6)" }, { transform: "scale(1)" }], { duration: 280 });
    }
  }

  function applySettings() {
    const theme = state.data.settings.theme === "light" ? "light" : "dark";
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.style = resolveUiStyle(false);
    document.body.classList.toggle("reduce-motion", Boolean(state.data.settings.reduceAnimations));
    const themeColor = getComputedStyle(document.documentElement).getPropertyValue("--bg-elevated").trim() || (theme === "light" ? "#f5effa" : "#171022");
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", themeColor);
  }

  function resolveUiStyle(forceNewRandom = false) {
    const selected = state.data.settings.uiStyle || "royal-pink";
    if (selected === "random") {
      if (forceNewRandom || !UI_STYLE_IDS.includes(state.activeUiStyle)) {
        state.activeUiStyle = UI_STYLE_IDS[Math.floor(Math.random() * UI_STYLE_IDS.length)];
      }
      return state.activeUiStyle;
    }
    state.activeUiStyle = UI_STYLE_IDS.includes(selected) ? selected : "royal-pink";
    return state.activeUiStyle;
  }

  function bindGlobalEvents() {
    document.addEventListener("click", handleClick);
    document.addEventListener("change", handleChange);
    document.addEventListener("input", handleInput);

    importInput.addEventListener("change", importBackup);

    window.addEventListener("keydown", event => {
      if (event.key === "Escape" && modalRoot.innerHTML) closeModal();
      if ((event.key === "Enter" || event.key === " ") && event.target.matches?.(".category-card")) {
        event.preventDefault();
        openCategory(event.target.dataset.categoryId);
      }
    });
  }

  function handleClick(event) {
    const viewButton = event.target.closest("[data-view]");
    if (viewButton) {
      navigate(viewButton.dataset.view);
      return;
    }

    const actionButton = event.target.closest("[data-action]");
    if (!actionButton) return;

    const action = actionButton.dataset.action;
    const id = actionButton.dataset.id;
    const categoryId = actionButton.dataset.categoryId;

    const actions = {
      "open-category": () => openCategory(categoryId || id),
      "back-categories": () => navigate("categories"),
      "add-task": () => openTaskModal(categoryId || state.selectedCategoryId),
      "edit-task": () => openTaskModal(categoryId, id),
      "complete-task": () => completeTask(categoryId, id),
      "delete-task": () => deleteTask(categoryId, id),
      "archive-task": () => toggleTaskArchive(categoryId, id),
      "new-objective": () => openObjectiveModal(),
      "complete-manual-objective": () => completeManualObjective(id),
      "delete-objective": () => deleteObjective(id),
      "restart-objective": () => restartObjective(id),
      "objective-tab": () => { state.objectiveTab = actionButton.dataset.tab; render(); },
      "history-filter": () => { state.historyFilter = actionButton.dataset.filter; render(); },
      "undo-history": () => undoHistory(id),
      "close-modal": closeModal,
      "export-backup": exportBackup,
      "import-backup": () => importInput.click(),
      "reset-app": resetApp,
      "install-app": installApp,
      "select-theme": () => setTheme(actionButton.dataset.theme),
      "select-ui-style": () => setUiStyle(actionButton.dataset.styleId),
      "select-objective-type": () => selectObjectiveType(actionButton.dataset.type),
      "dismiss-celebration": () => { celebrationRoot.innerHTML = ""; }
    };

    actions[action]?.();
  }

  function handleChange(event) {
    const target = event.target;
    if (target.matches("[data-setting]")) {
      const key = target.dataset.setting;
      state.data.settings[key] = target.type === "checkbox" ? target.checked : target.value;
      saveData();
      applySettings();
      if (key === "reduceAnimations") showToast("Setting saved", target.checked ? "Animations reduced" : "Animations restored");
      return;
    }

    if (target.id === "objective-category") populateObjectiveTaskOptions();
  }

  function handleInput(event) {
    const target = event.target;
    if (target.id === "task-difficulty") {
      const value = clampNumber(target.value, 1, 10, 1);
      const number = document.getElementById("difficulty-number");
      const reward = document.getElementById("difficulty-reward");
      const label = document.getElementById("difficulty-label");
      if (number) number.textContent = value;
      if (reward) reward.textContent = `${value} XP per completion`;
      if (label) label.textContent = difficultyLabel(value);
    }
  }

  function navigate(view) {
    if (!view) return;
    state.view = view;
    if (view !== "category") state.selectedCategoryId = null;
    window.scrollTo({ top: 0, behavior: state.data.settings.reduceAnimations ? "auto" : "smooth" });
    render();
  }

  function openCategory(categoryId) {
    if (!getCategory(categoryId)) return;
    state.selectedCategoryId = categoryId;
    state.view = "category";
    window.scrollTo({ top: 0, behavior: "auto" });
    render();
  }

  function render() {
    refreshObjectiveStatuses(false);
    updateNavigation();
    actionsEl.innerHTML = "";

    const renderers = {
      dashboard: renderDashboard,
      categories: renderCategories,
      category: renderCategory,
      objectives: renderObjectives,
      history: renderHistory,
      settings: renderSettings
    };

    (renderers[state.view] || renderDashboard)();
  }

  function updateNavigation() {
    const navView = state.view === "category" ? "categories" : state.view;
    document.querySelectorAll("[data-view]").forEach(button => {
      button.classList.toggle("active", button.dataset.view === navView);
    });
  }

  function setHeader(title, eyebrow) {
    titleEl.textContent = title;
    eyebrowEl.textContent = eyebrow;
    document.title = `${title} · Sissy Skill Tracker`;
  }

  function renderDashboard() {
    setHeader("Dashboard", "PROGRESSION HUB");
    const totals = calculateTotals();
    const activeObjectives = state.data.objectives.filter(item => item.status === "active");
    const mastered = state.data.categories.filter(category => category.xp >= MAX_LEVEL_XP).length;
    const recentTasks = getRecentTasks(5);
    const recentHistory = state.data.history.filter(item => !item.undone).slice(0, 6);

    actionsEl.innerHTML = `<button class="btn btn-primary" data-action="new-objective">✦ <span class="long-label">New Objective</span></button>`;

    content.innerHTML = `
      <section class="hero-card branded-hero">
        <div class="hero-copy">
          <p class="eyebrow">YOUR PERSONAL PROGRESSION</p>
          <h2>Build every skill, one task at a time.</h2>
          <p>Every completion awards XP based on difficulty. Reach Level 100, then keep growing through unlimited Mastery Points.</p>
        </div>
        <img class="hero-logo" src="icons/logo.png" alt="Sissy Skill Tracker logo" />
        <div class="stat-grid">
          ${statTile(formatNumber(totals.xp), "Total XP")}
          ${statTile(formatNumber(totals.completions), "Task Completions")}
          ${statTile(activeObjectives.length, "Active Objectives")}
          ${statTile(`${mastered} / ${state.data.categories.length}`, "Mastered Skills")}
        </div>
      </section>

      <section class="section-block">
        <div class="section-heading">
          <div><h2>Skill Categories</h2><p>Your nine independent progression paths.</p></div>
          <button class="btn btn-small btn-ghost" data-view="categories">View all</button>
        </div>
        <div class="category-grid">${state.data.categories.map(categoryCard).join("")}</div>
      </section>

      <section class="section-block split-grid">
        <div class="panel-card panel-padding">
          <div class="section-heading">
            <div><h2>Quick Complete</h2><p>Your most recently used tasks.</p></div>
          </div>
          ${recentTasks.length ? `<div class="quick-list">${recentTasks.map(quickTaskItem).join("")}</div>` : emptyState("✦", "No tasks yet", "Create your first task inside any category to begin earning XP.", `<button class="btn btn-primary" data-view="categories">Open Categories</button>`) }
        </div>
        <div class="panel-card panel-padding">
          <div class="section-heading">
            <div><h2>Recent Activity</h2><p>Your latest progression events.</p></div>
          </div>
          ${recentHistory.length ? `<div class="activity-list">${recentHistory.map(activityItem).join("")}</div>` : emptyState("◷", "No history yet", "Completed tasks and objectives will appear here.", "")}
        </div>
      </section>
    `;
  }

  function renderCategories() {
    setHeader("Categories", "SKILL TREE");
    const totals = calculateTotals();
    actionsEl.innerHTML = `<span class="tag tag-xp">${formatNumber(totals.xp)} TOTAL XP</span>`;

    content.innerHTML = `
      <section class="hero-card">
        <div class="hero-copy">
          <p class="eyebrow">NINE PROGRESSION PATHS</p>
          <h2>Choose a skill to train.</h2>
          <p>Each category has its own tasks, XP, Level 0–100 progression, degrading rank titles, and unlimited mastery beyond 10,000 XP.</p>
        </div>
      </section>
      <section class="section-block">
        <div class="category-grid">${state.data.categories.map(categoryCard).join("")}</div>
      </section>
    `;
  }

  function renderCategory() {
    const category = getCategory(state.selectedCategoryId);
    if (!category) return navigate("categories");

    const level = getLevel(category.xp);
    const rank = getRank(category);
    const mastery = getMastery(category.xp);
    const tasks = category.tasks.filter(task => !task.archived);
    const archived = category.tasks.filter(task => task.archived);
    const completions = category.tasks.reduce((sum, task) => sum + task.completions, 0);
    const progress = getProgress(category.xp);

    setHeader(category.name, "CATEGORY PROGRESSION");
    actionsEl.innerHTML = `
      <button class="btn btn-ghost" data-action="back-categories">← <span class="long-label">Categories</span></button>
      <button class="btn btn-primary" data-action="add-task" data-category-id="${category.id}">＋ <span class="long-label">Add Task</span></button>
    `;

    content.innerHTML = `
      <section class="category-hero" style="--accent:${category.accent}">
        <div class="category-hero-icon">${category.icon}</div>
        <div>
          <h2>${esc(category.name)}</h2>
          <p class="rank-name">${esc(rank)}</p>
        </div>
        <div class="hero-level"><strong>${level}</strong><span>Level</span></div>
        <div class="category-hero-progress">
          <div class="progress-shell"><div class="progress-fill ${level === 100 ? "mastery" : ""}" style="width:${progress.percent}%"></div></div>
          <div class="progress-meta">
            <span>${level === 100 ? `${formatNumber(mastery)} Mastery Points` : `${formatNumber(category.xp)} / ${formatNumber(MAX_LEVEL_XP)} XP`}</span>
            <span>${progress.label}</span>
          </div>
        </div>
        <div class="category-hero-stats">
          <span class="mini-stat"><strong>${formatNumber(category.xp)}</strong> Total XP</span>
          <span class="mini-stat"><strong>${formatNumber(completions)}</strong> Completions</span>
          <span class="mini-stat"><strong>${tasks.length}</strong> Active Tasks</span>
          ${level === 100 ? `<span class="mini-stat mastery-label"><strong>${getMasteryTier(mastery)}</strong> Mastery Tier</span>` : ""}
        </div>
      </section>

      <section class="section-block">
        <div class="section-heading">
          <div><h2>Available Tasks</h2><p>Complete any task at any time. Difficulty determines XP earned.</p></div>
          <button class="btn btn-primary" data-action="add-task" data-category-id="${category.id}">＋ Add Task</button>
        </div>
        ${tasks.length ? `<div class="task-list">${tasks.map(task => taskCard(category, task)).join("")}</div>` : emptyState(category.icon, "No tasks in this category", "Create a custom task, choose its difficulty from 1 to 10, and start progressing.", `<button class="btn btn-primary" data-action="add-task" data-category-id="${category.id}">Create First Task</button>`) }
      </section>

      ${archived.length ? `
        <section class="section-block">
          <div class="section-heading"><div><h2>Archived Tasks</h2><p>Archived tasks retain their history and XP contribution.</p></div></div>
          <div class="task-list">${archived.map(task => taskCard(category, task, true)).join("")}</div>
        </section>` : ""}
    `;
  }

  function renderObjectives() {
    setHeader("Objectives", "QUEST LOG");
    actionsEl.innerHTML = `<button class="btn btn-primary" data-action="new-objective">＋ <span class="long-label">New Objective</span></button>`;

    const filtered = state.data.objectives
      .filter(item => item.status === state.objectiveTab)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    content.innerHTML = `
      <section class="hero-card">
        <div class="hero-copy">
          <p class="eyebrow">PERSONAL QUESTS</p>
          <h2>Set a goal and prove your progress.</h2>
          <p>Create a simple manual objective, or challenge yourself to complete a chosen task a specific number of times before time runs out.</p>
        </div>
      </section>

      <section class="section-block">
        <div class="section-heading">
          <div class="tabs">
            ${objectiveTabButton("active", "Active", state.data.objectives.filter(o => o.status === "active").length)}
            ${objectiveTabButton("completed", "Completed", state.data.objectives.filter(o => o.status === "completed").length)}
            ${objectiveTabButton("failed", "Failed", state.data.objectives.filter(o => o.status === "failed").length)}
          </div>
          <button class="btn btn-primary" data-action="new-objective">＋ New Objective</button>
        </div>
        ${filtered.length ? `<div class="objective-list">${filtered.map(objectiveCard).join("")}</div>` : emptyState("✦", `No ${state.objectiveTab} objectives`, state.objectiveTab === "active" ? "Create a personal quest or a timed task challenge." : `Your ${state.objectiveTab} objectives will be stored here.`, state.objectiveTab === "active" ? `<button class="btn btn-primary" data-action="new-objective">Create Objective</button>` : "")}
      </section>
    `;
  }

  function renderHistory() {
    setHeader("History", "ACTIVITY LOG");
    const filters = [
      ["all", "All"], ["task", "Tasks"], ["objective", "Objectives"], ["level", "Levels & Ranks"]
    ];
    const history = state.data.history.filter(item => {
      if (state.historyFilter === "all") return true;
      if (state.historyFilter === "task") return item.type === "task";
      if (state.historyFilter === "objective") return item.type?.startsWith("objective");
      if (state.historyFilter === "level") return ["level_up", "rank_up", "mastery_unlocked"].includes(item.type);
      return true;
    });

    actionsEl.innerHTML = `<span class="tag">Latest ${formatNumber(Math.min(state.data.history.length, HISTORY_LIMIT))} events stored</span>`;

    content.innerHTML = `
      <section class="section-block" style="margin-top:0">
        <div class="filters">
          ${filters.map(([key, label]) => `<button class="btn btn-small ${state.historyFilter === key ? "btn-primary" : "btn-ghost"}" data-action="history-filter" data-filter="${key}">${label}</button>`).join("")}
        </div>
        <div class="panel-card">
          ${history.length ? history.map(historyRow).join("") : emptyState("◷", "No matching activity", "Try another filter or complete a task.", "")}
        </div>
      </section>
    `;
  }

  function renderSettings() {
    setHeader("Settings", "SYSTEM CONFIGURATION");
    const bytes = new Blob([JSON.stringify(state.data)]).size;
    const approxPercent = Math.min(100, (bytes / (5 * 1024 * 1024)) * 100);

    content.innerHTML = `
      <section class="settings-grid">
        <article class="settings-card">
          <h2>Appearance</h2>
          <p>Choose light or dark mode, then pick a visual skin independently.</p>
          <div class="theme-choice">
            ${themeOption("dark", "Dark Mode", "Deep, glowing game interface")}
            ${themeOption("light", "Light Mode", "Bright, clean progression interface")}
          </div>
          <h3 class="settings-subtitle">UI Style</h3>
          <div class="style-choice">
            ${UI_STYLES.map(styleOption).join("")}
            ${randomStyleOption()}
          </div>
          ${state.data.settings.uiStyle === "random" ? `<div class="setting-row compact"><div class="setting-copy"><strong>Current random style</strong><small>${esc(getUiStyleName(state.activeUiStyle))} — changes on full reload/open</small></div><span class="tag">Random</span></div>` : ""}
          ${toggleSetting("reduceAnimations", "Reduce animations", "Minimizes XP, modal, and level-up motion")}
          ${toggleSetting("floatingXp", "Floating XP notifications", "Shows the XP awarded after each completion")}
          ${toggleSetting("soundEffects", "Sound effects", "Plays a subtle tone for XP and level-ups")}
        </article>

        <article class="settings-card">
          <h2>Safety & Controls</h2>
          <p>Configure confirmations for destructive actions.</p>
          ${toggleSetting("confirmDelete", "Confirm deletions", "Ask before deleting tasks and objectives")}
          <div class="setting-row">
            <div class="setting-copy"><strong>Storage usage</strong><small>${formatBytes(bytes)} used in this browser</small></div>
            <span class="tag">${approxPercent.toFixed(1)}%</span>
          </div>
          <div class="storage-meter"><div class="progress-shell"><div class="progress-fill" style="width:${approxPercent}%"></div></div></div>
        </article>

        <article class="settings-card">
          <h2>Backup & Restore</h2>
          <p>Export a complete JSON backup before clearing browser data or moving devices.</p>
          <div class="data-buttons">
            <button class="btn btn-primary" data-action="export-backup">↓ Export Backup</button>
            <button class="btn" data-action="import-backup">↑ Import Backup</button>
          </div>
        </article>

        <article class="settings-card">
          <h2>Application</h2>
          <p>The app works offline after its first successful load from GitHub Pages.</p>
          <div class="data-buttons">
            ${state.installPrompt ? `<button class="btn btn-primary" data-action="install-app">＋ Install App</button>` : `<span class="tag">PWA install appears when supported</span>`}
            <button class="btn btn-danger" data-action="reset-app">Reset All Data</button>
          </div>
        </article>
      </section>
    `;
  }

  function categoryCard(category) {
    const level = getLevel(category.xp);
    const progress = getProgress(category.xp);
    const mastery = getMastery(category.xp);
    const completions = category.tasks.reduce((sum, task) => sum + task.completions, 0);
    const activeTasks = category.tasks.filter(task => !task.archived).length;

    return `
      <article class="category-card" style="--accent:${category.accent}" data-action="open-category" data-category-id="${category.id}" role="button" tabindex="0">
        <div class="category-top">
          <div class="category-icon">${category.icon}</div>
          <span class="level-badge">Level ${level}</span>
        </div>
        <h3>${esc(category.name)}</h3>
        <p class="rank-name">${esc(getRank(category))}</p>
        <div class="category-progress">
          <div class="progress-shell"><div class="progress-fill ${level === 100 ? "mastery" : ""}" style="width:${progress.percent}%"></div></div>
          <div class="progress-meta">
            <span>${level === 100 ? `<span class="mastery-label">${formatNumber(mastery)} Mastery</span>` : `${formatNumber(category.xp)} XP`}</span>
            <span>${progress.label}</span>
          </div>
        </div>
        <div class="category-footer"><span>${activeTasks} tasks</span><span>${formatNumber(completions)} completions</span></div>
      </article>
    `;
  }

  function taskCard(category, task, archived = false) {
    return `
      <article class="task-card">
        <div>
          <h3>${esc(task.name)}</h3>
          ${task.description ? `<p>${esc(task.description)}</p>` : ""}
          <div class="task-meta">
            <span class="tag">Difficulty ${task.difficulty} · ${difficultyLabel(task.difficulty)}</span>
            <span class="tag tag-xp">+${task.difficulty} XP</span>
            <span class="tag">${formatNumber(task.completions)} completions</span>
            <span class="tag">${formatNumber(task.xpGenerated)} XP generated</span>
            <span class="tag"><span class="difficulty-pips">${Array.from({ length: 10 }, (_, i) => `<i class="${i < task.difficulty ? "on" : ""}"></i>`).join("")}</span></span>
          </div>
        </div>
        <div class="task-actions">
          ${!archived ? `<button class="btn btn-primary complete-button" data-action="complete-task" data-category-id="${category.id}" data-id="${task.id}">✓ Complete</button>` : ""}
          <button class="btn icon-btn" title="Edit task" data-action="edit-task" data-category-id="${category.id}" data-id="${task.id}">✎</button>
          <button class="btn icon-btn" title="${archived ? "Restore" : "Archive"} task" data-action="archive-task" data-category-id="${category.id}" data-id="${task.id}">${archived ? "↥" : "□"}</button>
          <button class="btn btn-danger icon-btn" title="Delete task" data-action="delete-task" data-category-id="${category.id}" data-id="${task.id}">×</button>
        </div>
      </article>
    `;
  }

  function objectiveCard(objective) {
    const category = getCategory(objective.categoryId);
    const task = getTask(objective.categoryId, objective.taskId);
    const statusClass = `status-${objective.status}`;
    const progress = getObjectiveProgress(objective);
    const isTask = objective.type === "task";

    return `
      <article class="objective-card">
        <div class="objective-top">
          <div>
            <p class="objective-type">${isTask ? "TRAINING QUEST" : "PERSONAL QUEST"}</p>
            <h3>${esc(objective.title)}</h3>
            ${objective.description ? `<p class="description">${esc(objective.description)}</p>` : ""}
          </div>
          <span class="objective-status ${statusClass}">${objective.status}</span>
        </div>

        ${isTask ? `
          <div class="objective-progress">
            <div class="progress-shell"><div class="progress-fill" style="width:${progress.percent}%"></div></div>
            <div class="progress-meta"><span>${progress.current} / ${objective.targetCount} completions</span><span data-countdown="${objective.id}">${objective.status === "active" ? formatRemaining(objective.endsAt) : objective.status}</span></div>
          </div>
          <div class="objective-details">
            <span class="tag">${category ? `${category.icon} ${esc(category.name)}` : "Missing category"}</span>
            <span class="tag">Task: ${task ? esc(task.name) : "Deleted task"}</span>
          </div>
        ` : `
          <div class="objective-details">
            ${category ? `<span class="tag">${category.icon} ${esc(category.name)}</span>` : ""}
            <span class="tag">Created ${formatDate(objective.createdAt)}</span>
          </div>
        `}

        <div class="objective-actions">
          ${objective.status === "active" && objective.type === "manual" ? `<button class="btn btn-success" data-action="complete-manual-objective" data-id="${objective.id}">✓ Mark Complete</button>` : ""}
          ${objective.status === "active" && objective.type === "task" && task && !task.archived ? `<button class="btn btn-primary" data-action="complete-task" data-category-id="${objective.categoryId}" data-id="${objective.taskId}">✓ Complete Task (+${task.difficulty} XP)</button>` : ""}
          ${objective.status === "failed" && objective.type === "task" && task ? `<button class="btn" data-action="restart-objective" data-id="${objective.id}">↻ Restart</button>` : ""}
          <button class="btn btn-danger" data-action="delete-objective" data-id="${objective.id}">Delete</button>
        </div>
      </article>
    `;
  }

  function historyRow(item) {
    const info = historyInfo(item);
    return `
      <div class="history-row ${item.undone ? "undone" : ""}">
        <div class="activity-icon">${info.icon}</div>
        <div class="history-main"><strong>${esc(info.title)}</strong><span>${esc(info.detail)}</span></div>
        <div>
          <div class="history-time">${formatDateTime(item.timestamp)}</div>
          ${item.type === "task" && !item.undone ? `<button class="btn btn-small btn-ghost" data-action="undo-history" data-id="${item.id}">Undo</button>` : ""}
        </div>
      </div>
    `;
  }

  function activityItem(item) {
    const info = historyInfo(item);
    return `<div class="activity-item"><div class="activity-icon">${info.icon}</div><div class="activity-copy"><strong>${esc(info.title)}</strong><p>${esc(info.detail)} · ${relativeTime(item.timestamp)}</p></div></div>`;
  }

  function quickTaskItem(entry) {
    return `
      <div class="quick-item">
        <div><strong>${esc(entry.task.name)}</strong><small>${entry.category.icon} ${esc(entry.category.name)} · Difficulty ${entry.task.difficulty}</small></div>
        <button class="btn btn-primary btn-small" data-action="complete-task" data-category-id="${entry.category.id}" data-id="${entry.task.id}">+${entry.task.difficulty} XP</button>
      </div>
    `;
  }

  function openTaskModal(categoryId, taskId = null) {
    const category = getCategory(categoryId);
    const task = taskId ? getTask(categoryId, taskId) : null;
    if (!category) return;

    modalRoot.innerHTML = `
      <div class="modal-backdrop">
        <form class="modal" id="task-form">
          <div class="modal-header">
            <div><h2>${task ? "Edit Task" : "Create Task"}</h2><p>${category.icon} ${esc(category.name)}</p></div>
            <button type="button" class="btn icon-btn" data-action="close-modal">×</button>
          </div>
          <div class="modal-body">
            <div class="form-grid">
              <div class="form-group full">
                <label for="task-name">Task name</label>
                <input class="input" id="task-name" maxlength="120" required value="${task ? escAttr(task.name) : ""}" placeholder="e.g. Wear heels for 30 minutes" autofocus />
              </div>
              <div class="form-group full">
                <label for="task-description">Description <span class="form-help">(optional)</span></label>
                <textarea class="textarea" id="task-description" maxlength="600" placeholder="Add any details or rules for this task">${task ? esc(task.description) : ""}</textarea>
              </div>
              <div class="form-group full">
                <label for="task-difficulty">Difficulty: <span id="difficulty-label">${difficultyLabel(task?.difficulty || 5)}</span></label>
                <div class="slider-wrap">
                  <input class="range" id="task-difficulty" type="range" min="1" max="10" step="1" value="${task?.difficulty || 5}" />
                  <div class="difficulty-number" id="difficulty-number">${task?.difficulty || 5}</div>
                </div>
                <span class="form-help" id="difficulty-reward">${task?.difficulty || 5} XP per completion</span>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn" data-action="close-modal">Cancel</button>
            <button type="submit" class="btn btn-primary">${task ? "Save Changes" : "Create Task"}</button>
          </div>
        </form>
      </div>
    `;

    const backdrop = modalRoot.querySelector(".modal-backdrop");
    backdrop.addEventListener("click", event => { if (event.target === backdrop) closeModal(); });
    document.getElementById("task-form").addEventListener("submit", event => {
      event.preventDefault();
      const name = document.getElementById("task-name").value.trim();
      const description = document.getElementById("task-description").value.trim();
      const difficulty = clampNumber(document.getElementById("task-difficulty").value, 1, 10, 1);
      if (!name) return;

      if (task) {
        task.name = name;
        task.description = description;
        task.difficulty = difficulty;
        showToast("Task updated", name);
      } else {
        category.tasks.push({
          id: uid(), name, description, difficulty, completions: 0,
          xpGenerated: 0, createdAt: new Date().toISOString(), lastCompletedAt: null, archived: false
        });
        addHistory({ type: "task_created", categoryId, taskName: name });
        showToast("Task created", `Difficulty ${difficulty} · +${difficulty} XP`);
      }
      saveData();
      closeModal();
      render();
    });

    setTimeout(() => document.getElementById("task-name")?.focus(), 30);
  }

  function openObjectiveModal() {
    const availableCategories = state.data.categories.filter(category => category.tasks.some(task => !task.archived));
    modalRoot.innerHTML = `
      <div class="modal-backdrop">
        <form class="modal" id="objective-form">
          <div class="modal-header">
            <div><h2>Create Objective</h2><p>Choose a personal quest or a timed training challenge.</p></div>
            <button type="button" class="btn icon-btn" data-action="close-modal">×</button>
          </div>
          <div class="modal-body">
            <div class="form-grid">
              <div class="form-group full">
                <label>Objective type</label>
                <div class="quest-type-grid">
                  <button type="button" class="quest-type active" data-action="select-objective-type" data-type="manual"><strong>✦ Personal Quest</strong><small>A simple text objective completed manually.</small></button>
                  <button type="button" class="quest-type" data-action="select-objective-type" data-type="task"><strong>◆ Training Quest</strong><small>Complete one task X times within a time limit.</small></button>
                </div>
                <input type="hidden" id="objective-type" value="manual" />
              </div>
              <div class="form-group full">
                <label for="objective-title">Objective title</label>
                <input class="input" id="objective-title" maxlength="140" required placeholder="What do you want to achieve?" />
              </div>
              <div class="form-group full">
                <label for="objective-description">Description <span class="form-help">(optional)</span></label>
                <textarea class="textarea" id="objective-description" maxlength="700" placeholder="Add details, conditions, or motivation"></textarea>
              </div>
              <div class="form-group full" id="manual-category-group">
                <label for="manual-category">Linked category <span class="form-help">(optional)</span></label>
                <select class="select" id="manual-category"><option value="">No category</option>${state.data.categories.map(c => `<option value="${c.id}">${c.icon} ${esc(c.name)}</option>`).join("")}</select>
              </div>
              <div class="form-group full" id="task-objective-fields" hidden>
                ${availableCategories.length ? `
                  <div class="form-grid">
                    <div class="form-group">
                      <label for="objective-category">Category</label>
                      <select class="select" id="objective-category">${availableCategories.map(c => `<option value="${c.id}">${c.icon} ${esc(c.name)}</option>`).join("")}</select>
                    </div>
                    <div class="form-group">
                      <label for="objective-task">Task</label>
                      <select class="select" id="objective-task"></select>
                    </div>
                    <div class="form-group">
                      <label for="objective-count">Required completions</label>
                      <input class="input" id="objective-count" type="number" min="1" max="100000" value="10" />
                    </div>
                    <div class="form-group">
                      <label for="objective-duration">Time limit</label>
                      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
                        <input class="input" id="objective-duration" type="number" min="1" max="10000" value="7" />
                        <select class="select" id="objective-unit"><option value="hours">Hours</option><option value="days" selected>Days</option><option value="weeks">Weeks</option><option value="months">Months</option></select>
                      </div>
                    </div>
                  </div>
                ` : `<div class="empty-state"><span class="empty-icon">◆</span><h3>No tasks available</h3><p>Create at least one task before making a training quest.</p></div>`}
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn" data-action="close-modal">Cancel</button>
            <button type="submit" class="btn btn-primary">Create Objective</button>
          </div>
        </form>
      </div>
    `;

    const backdrop = modalRoot.querySelector(".modal-backdrop");
    backdrop.addEventListener("click", event => { if (event.target === backdrop) closeModal(); });
    populateObjectiveTaskOptions();

    document.getElementById("objective-form").addEventListener("submit", event => {
      event.preventDefault();
      const type = document.getElementById("objective-type").value;
      const title = document.getElementById("objective-title").value.trim();
      const description = document.getElementById("objective-description").value.trim();
      if (!title) return;

      const now = new Date();
      if (type === "manual") {
        state.data.objectives.push({
          id: uid(), type: "manual", title, description,
          categoryId: document.getElementById("manual-category").value || null,
          taskId: null, targetCount: 1, startCount: 0,
          createdAt: now.toISOString(), startedAt: now.toISOString(), endsAt: null,
          completedAt: null, failedAt: null, status: "active", failureLogged: false
        });
      } else {
        const categoryId = document.getElementById("objective-category")?.value;
        const taskId = document.getElementById("objective-task")?.value;
        const task = getTask(categoryId, taskId);
        if (!task) {
          showToast("Cannot create objective", "Choose an available task.");
          return;
        }
        const targetCount = Math.max(1, Math.floor(Number(document.getElementById("objective-count").value) || 1));
        const duration = Math.max(1, Number(document.getElementById("objective-duration").value) || 1);
        const unit = document.getElementById("objective-unit").value;
        const endsAt = new Date(now.getTime() + durationToMs(duration, unit));
        state.data.objectives.push({
          id: uid(), type: "task", title, description, categoryId, taskId,
          targetCount, startCount: task.completions,
          createdAt: now.toISOString(), startedAt: now.toISOString(), endsAt: endsAt.toISOString(),
          completedAt: null, failedAt: null, status: "active", failureLogged: false,
          duration, durationUnit: unit
        });
      }

      addHistory({ type: "objective_created", objectiveTitle: title });
      saveData();
      closeModal();
      state.objectiveTab = "active";
      state.view = "objectives";
      render();
      showToast("Objective created", title);
    });

    setTimeout(() => document.getElementById("objective-title")?.focus(), 30);
  }

  function selectObjectiveType(type) {
    const selected = type === "task" ? "task" : "manual";
    document.getElementById("objective-type").value = selected;
    document.querySelectorAll(".quest-type").forEach(button => button.classList.toggle("active", button.dataset.type === selected));
    document.getElementById("manual-category-group").hidden = selected !== "manual";
    document.getElementById("task-objective-fields").hidden = selected !== "task";
  }

  function populateObjectiveTaskOptions() {
    const categorySelect = document.getElementById("objective-category");
    const taskSelect = document.getElementById("objective-task");
    if (!categorySelect || !taskSelect) return;
    const category = getCategory(categorySelect.value);
    const tasks = category ? category.tasks.filter(task => !task.archived) : [];
    taskSelect.innerHTML = tasks.map(task => `<option value="${task.id}">${esc(task.name)} · Difficulty ${task.difficulty}</option>`).join("");
  }

  function completeTask(categoryId, taskId) {
    const category = getCategory(categoryId);
    const task = getTask(categoryId, taskId);
    if (!category || !task || task.archived) return;

    const oldLevel = getLevel(category.xp);
    const oldRankIndex = getRankIndex(oldLevel);
    const oldMastery = getMastery(category.xp);
    const now = new Date().toISOString();

    task.completions += 1;
    task.xpGenerated = safeNonNegativeNumber(task.xpGenerated) + task.difficulty;
    task.lastCompletedAt = now;
    category.xp += task.difficulty;

    const historyId = uid();
    addHistory({
      id: historyId,
      type: "task",
      categoryId,
      categoryName: category.name,
      taskId,
      taskName: task.name,
      difficulty: task.difficulty,
      xp: task.difficulty,
      timestamp: now,
      undone: false
    });

    const newlyCompletedObjectives = updateObjectivesForTask(categoryId, taskId);
    const newLevel = getLevel(category.xp);
    const newRankIndex = getRankIndex(newLevel);
    const newMastery = getMastery(category.xp);

    if (newLevel > oldLevel) {
      addHistory({ type: "level_up", categoryId, categoryName: category.name, level: newLevel });
    }
    if (newRankIndex > oldRankIndex) {
      addHistory({ type: "rank_up", categoryId, categoryName: category.name, rank: getRank(category) });
    }
    if (oldMastery === 0 && newMastery > 0) {
      addHistory({ type: "mastery_unlocked", categoryId, categoryName: category.name });
    }

    saveData();
    playSound(newLevel > oldLevel || newRankIndex > oldRankIndex ? "level" : "xp");

    if (state.data.settings.floatingXp) showToast(`+${task.difficulty} XP`, `${category.icon} ${category.name} · ${task.name}`, "xp");

    if (newRankIndex > oldRankIndex) {
      showCelebration("NEW RANK UNLOCKED", getRank(category), `${category.name} reached Level ${newLevel}.`);
    } else if (newLevel > oldLevel) {
      showCelebration("LEVEL UP", `${category.name} · Level ${newLevel}`, `${getRank(category)}`);
    } else if (oldMastery === 0 && newMastery > 0) {
      showCelebration("MASTERY UNLOCKED", category.name, "Level 100 reached. Future XP now becomes unlimited Mastery Points.");
    } else if (newlyCompletedObjectives.length) {
      showCelebration("OBJECTIVE COMPLETE", newlyCompletedObjectives[0].title, "Training quest successfully completed.");
    }

    render();
  }

  function updateObjectivesForTask(categoryId, taskId) {
    const completed = [];
    const now = Date.now();
    state.data.objectives.forEach(objective => {
      if (objective.type !== "task" || objective.status !== "active" || objective.categoryId !== categoryId || objective.taskId !== taskId) return;
      if (objective.endsAt && now > new Date(objective.endsAt).getTime()) {
        failObjective(objective, true);
        return;
      }
      const progress = getObjectiveProgress(objective);
      if (progress.current >= objective.targetCount) {
        objective.status = "completed";
        objective.completedAt = new Date().toISOString();
        objective.failedAt = null;
        addHistory({ type: "objective_completed", objectiveId: objective.id, objectiveTitle: objective.title });
        completed.push(objective);
      }
    });
    return completed;
  }

  function completeManualObjective(id) {
    const objective = state.data.objectives.find(item => item.id === id);
    if (!objective || objective.type !== "manual" || objective.status !== "active") return;
    objective.status = "completed";
    objective.completedAt = new Date().toISOString();
    addHistory({ type: "objective_completed", objectiveId: objective.id, objectiveTitle: objective.title });
    saveData();
    showCelebration("OBJECTIVE COMPLETE", objective.title, "Personal quest successfully completed.");
    render();
  }

  function restartObjective(id) {
    const objective = state.data.objectives.find(item => item.id === id);
    if (!objective || objective.type !== "task") return;
    const task = getTask(objective.categoryId, objective.taskId);
    if (!task) return;
    const now = new Date();
    const duration = objective.duration || 7;
    const unit = objective.durationUnit || "days";
    objective.startCount = task.completions;
    objective.startedAt = now.toISOString();
    objective.endsAt = new Date(now.getTime() + durationToMs(duration, unit)).toISOString();
    objective.status = "active";
    objective.completedAt = null;
    objective.failedAt = null;
    objective.failureLogged = false;
    addHistory({ type: "objective_restarted", objectiveId: objective.id, objectiveTitle: objective.title });
    saveData();
    state.objectiveTab = "active";
    render();
    showToast("Objective restarted", objective.title);
  }

  function deleteTask(categoryId, taskId) {
    const category = getCategory(categoryId);
    const task = getTask(categoryId, taskId);
    if (!category || !task) return;
    const linkedObjectives = state.data.objectives.filter(objective => objective.taskId === taskId && objective.status === "active").length;
    const warning = linkedObjectives ? ` This will also leave ${linkedObjectives} active objective(s) without a task.` : "";
    if (state.data.settings.confirmDelete && !confirm(`Delete “${task.name}”? Its completion count will be removed, but category XP already earned will remain.${warning}`)) return;
    category.tasks = category.tasks.filter(item => item.id !== taskId);
    addHistory({ type: "task_deleted", categoryId, taskName: task.name });
    saveData();
    render();
    showToast("Task deleted", task.name);
  }

  function toggleTaskArchive(categoryId, taskId) {
    const task = getTask(categoryId, taskId);
    if (!task) return;
    task.archived = !task.archived;
    saveData();
    render();
    showToast(task.archived ? "Task archived" : "Task restored", task.name);
  }

  function deleteObjective(id) {
    const objective = state.data.objectives.find(item => item.id === id);
    if (!objective) return;
    if (state.data.settings.confirmDelete && !confirm(`Delete objective “${objective.title}”?`)) return;
    state.data.objectives = state.data.objectives.filter(item => item.id !== id);
    addHistory({ type: "objective_deleted", objectiveTitle: objective.title });
    saveData();
    render();
  }

  function undoHistory(historyId) {
    const entry = state.data.history.find(item => item.id === historyId);
    if (!entry || entry.type !== "task" || entry.undone) return;
    const category = getCategory(entry.categoryId);
    const task = getTask(entry.categoryId, entry.taskId);
    if (!category || !task || task.completions <= 0) {
      showToast("Unable to undo", "The original task no longer exists.");
      return;
    }

    task.completions -= 1;
    task.xpGenerated = Math.max(0, safeNonNegativeNumber(task.xpGenerated) - safeNonNegativeNumber(entry.xp));
    category.xp = Math.max(0, category.xp - safeNonNegativeNumber(entry.xp));
    entry.undone = true;
    entry.undoneAt = new Date().toISOString();
    recomputeObjectiveStatusesAfterUndo(entry.categoryId, entry.taskId);
    saveData();
    render();
    showToast("Completion undone", `-${entry.xp} XP from ${category.name}`);
  }

  function recomputeObjectiveStatusesAfterUndo(categoryId, taskId) {
    const now = Date.now();
    state.data.objectives.forEach(objective => {
      if (objective.type !== "task" || objective.categoryId !== categoryId || objective.taskId !== taskId) return;
      const progress = getObjectiveProgress(objective);
      if (objective.status === "completed" && progress.current < objective.targetCount) {
        objective.completedAt = null;
        if (objective.endsAt && now > new Date(objective.endsAt).getTime()) {
          objective.status = "failed";
          objective.failedAt = new Date().toISOString();
        } else {
          objective.status = "active";
          objective.failedAt = null;
        }
        state.data.history = state.data.history.filter(item => !(item.type === "objective_completed" && item.objectiveId === objective.id));
      }
    });
  }

  function refreshObjectiveStatuses(logFailures) {
    let changed = false;
    const now = Date.now();
    state.data.objectives.forEach(objective => {
      if (objective.type !== "task" || objective.status !== "active" || !objective.endsAt) return;
      if (now > new Date(objective.endsAt).getTime()) {
        failObjective(objective, logFailures);
        changed = true;
      }
    });
    if (changed) saveData();
    return changed;
  }

  function failObjective(objective, logFailure) {
    objective.status = "failed";
    objective.failedAt = new Date().toISOString();
    if (logFailure && !objective.failureLogged) {
      addHistory({ type: "objective_failed", objectiveId: objective.id, objectiveTitle: objective.title });
      objective.failureLogged = true;
    }
  }

  function updateVisibleCountdowns() {
    document.querySelectorAll("[data-countdown]").forEach(element => {
      const objective = state.data.objectives.find(item => item.id === element.dataset.countdown);
      if (objective?.status === "active") element.textContent = formatRemaining(objective.endsAt);
    });
  }

  function exportBackup() {
    const payload = {
      app: "Sissy Skill Tracker",
      exportedAt: new Date().toISOString(),
      data: state.data
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `sissy-tracker-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showToast("Backup exported", "Keep the JSON file somewhere safe.");
  }

  async function importBackup(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const imported = parsed.data || parsed;
      if (!imported || !Array.isArray(imported.categories)) throw new Error("Invalid backup structure");
      if (!confirm("Import this backup? Your current local data will be replaced.")) return;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(imported));
      state.data = loadData();
      applySettings();
      state.view = "dashboard";
      render();
      showToast("Backup imported", "Your saved progression has been restored.");
    } catch (error) {
      showToast("Import failed", "This file is not a valid tracker backup.");
    }
  }

  function resetApp() {
    if (!confirm("Reset the entire app? All tasks, XP, mastery, objectives, history, and settings will be permanently erased from this browser.")) return;
    if (!confirm("This cannot be undone unless you exported a backup. Reset everything now?")) return;
    state.data = defaultData();
    saveData();
    applySettings();
    state.view = "dashboard";
    state.selectedCategoryId = null;
    render();
    showToast("App reset", "A new empty tracker has been created.");
  }

  async function installApp() {
    if (!state.installPrompt) return;
    await state.installPrompt.prompt();
    await state.installPrompt.userChoice;
    state.installPrompt = null;
    render();
  }

  function setTheme(theme) {
    state.data.settings.theme = theme === "light" ? "light" : "dark";
    saveData();
    applySettings();
    render();
  }

  function setUiStyle(styleId) {
    state.data.settings.uiStyle = styleId === "random" || UI_STYLE_IDS.includes(styleId) ? styleId : "royal-pink";
    state.activeUiStyle = resolveUiStyle(styleId === "random");
    saveData();
    applySettings();
    render();
    showToast("UI style saved", state.data.settings.uiStyle === "random" ? `Random on reload · now showing ${getUiStyleName(state.activeUiStyle)}` : getUiStyleName(state.activeUiStyle));
  }

  function closeModal() {
    modalRoot.innerHTML = "";
  }

  function showToast(title, detail = "", type = "") {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerHTML = `<strong>${esc(title)}</strong>${detail ? `<small>${esc(detail)}</small>` : ""}`;
    toastRoot.appendChild(toast);
    setTimeout(() => toast.remove(), 3300);
  }

  function showCelebration(overline, title, detail) {
    if (state.data.settings.reduceAnimations) {
      showToast(title, detail);
      return;
    }
    celebrationRoot.innerHTML = `
      <div class="celebration-backdrop" data-action="dismiss-celebration">
        <div class="celebration-card">
          <div class="spark">✦</div>
          <p class="overline">${esc(overline)}</p>
          <h2>${esc(title)}</h2>
          <p>${esc(detail)}</p>
          <button class="btn btn-primary" data-action="dismiss-celebration">Continue</button>
        </div>
      </div>
    `;
  }

  function playSound(type) {
    if (!state.data.settings.soundEffects) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = type === "level" ? 660 : 440;
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.09, ctx.currentTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + (type === "level" ? 0.42 : 0.18));
      oscillator.connect(gain).connect(ctx.destination);
      oscillator.start();
      oscillator.stop(ctx.currentTime + (type === "level" ? 0.44 : 0.2));
    } catch (_) {}
  }

  function addHistory(entry) {
    state.data.history.unshift({ id: entry.id || uid(), timestamp: entry.timestamp || new Date().toISOString(), ...entry });
    if (state.data.history.length > HISTORY_LIMIT) state.data.history.length = HISTORY_LIMIT;
  }

  function getCategory(id) {
    return state.data.categories.find(category => category.id === id);
  }

  function getTask(categoryId, taskId) {
    return getCategory(categoryId)?.tasks.find(task => task.id === taskId);
  }

  function getLevel(xp) {
    return Math.min(100, Math.floor(safeNonNegativeNumber(xp) / XP_PER_LEVEL));
  }

  function getMastery(xp) {
    return Math.max(0, safeNonNegativeNumber(xp) - MAX_LEVEL_XP);
  }

  function getRankIndex(level) {
    return level >= 100 ? 10 : Math.floor(Math.max(0, level) / 10);
  }

  function getRank(category) {
    return RANKS[category.id]?.[getRankIndex(getLevel(category.xp))] || "Unranked";
  }

  function getProgress(xp) {
    const level = getLevel(xp);
    if (level >= 100) {
      const mastery = getMastery(xp);
      const withinTier = mastery % 1000;
      const tier = Math.floor(mastery / 1000);
      return {
        percent: (withinTier / 1000) * 100,
        label: `${formatNumber(withinTier)} / 1,000 to Mastery ${tier + 1}`
      };
    }
    const withinLevel = xp - level * XP_PER_LEVEL;
    return {
      percent: (withinLevel / XP_PER_LEVEL) * 100,
      label: `${XP_PER_LEVEL - withinLevel} XP to Level ${level + 1}`
    };
  }

  function getMasteryTier(mastery) {
    return Math.floor(mastery / 1000);
  }

  function getObjectiveProgress(objective) {
    if (objective.type !== "task") return { current: objective.status === "completed" ? 1 : 0, percent: objective.status === "completed" ? 100 : 0 };
    const task = getTask(objective.categoryId, objective.taskId);
    const current = Math.max(0, (task?.completions ?? objective.startCount) - objective.startCount);
    return { current, percent: Math.min(100, (current / objective.targetCount) * 100) };
  }

  function calculateTotals() {
    return state.data.categories.reduce((totals, category) => {
      totals.xp += category.xp;
      totals.completions += category.tasks.reduce((sum, task) => sum + task.completions, 0);
      return totals;
    }, { xp: 0, completions: 0 });
  }

  function getRecentTasks(limit) {
    const list = [];
    state.data.categories.forEach(category => {
      category.tasks.filter(task => !task.archived).forEach(task => list.push({ category, task }));
    });
    return list
      .sort((a, b) => {
        const timeA = a.task.lastCompletedAt ? new Date(a.task.lastCompletedAt).getTime() : 0;
        const timeB = b.task.lastCompletedAt ? new Date(b.task.lastCompletedAt).getTime() : 0;
        if (timeB !== timeA) return timeB - timeA;
        return new Date(b.task.createdAt).getTime() - new Date(a.task.createdAt).getTime();
      })
      .slice(0, limit);
  }

  function historyInfo(item) {
    const map = {
      task: { icon: "+", title: `+${item.xp || 0} XP · ${item.taskName || "Task completed"}`, detail: item.categoryName || getCategory(item.categoryId)?.name || "Category" },
      task_created: { icon: "＋", title: "Task created", detail: item.taskName || "New task" },
      task_deleted: { icon: "×", title: "Task deleted", detail: item.taskName || "Task" },
      objective_created: { icon: "✦", title: "Objective created", detail: item.objectiveTitle || "Objective" },
      objective_completed: { icon: "✓", title: "Objective completed", detail: item.objectiveTitle || "Objective" },
      objective_failed: { icon: "!", title: "Objective failed", detail: item.objectiveTitle || "Objective" },
      objective_restarted: { icon: "↻", title: "Objective restarted", detail: item.objectiveTitle || "Objective" },
      objective_deleted: { icon: "×", title: "Objective deleted", detail: item.objectiveTitle || "Objective" },
      level_up: { icon: "↑", title: `${item.categoryName || "Category"} reached Level ${item.level}`, detail: "Level gained" },
      rank_up: { icon: "◆", title: "New rank unlocked", detail: `${item.categoryName || "Category"} · ${item.rank || "New rank"}` },
      mastery_unlocked: { icon: "★", title: "Mastery unlocked", detail: `${item.categoryName || "Category"} reached Level 100` }
    };
    return map[item.type] || { icon: "◈", title: "Progression event", detail: "Activity recorded" };
  }

  function statTile(value, label) {
    return `<div class="stat-tile"><strong>${value}</strong><span>${label}</span></div>`;
  }

  function emptyState(icon, title, text, actionHtml) {
    return `<div class="empty-state"><span class="empty-icon">${icon}</span><h3>${esc(title)}</h3><p>${esc(text)}</p>${actionHtml}</div>`;
  }

  function objectiveTabButton(key, label, count) {
    return `<button class="tab-button ${state.objectiveTab === key ? "active" : ""}" data-action="objective-tab" data-tab="${key}">${label} · ${count}</button>`;
  }

  function themeOption(theme, title, subtitle) {
    return `
      <button class="theme-option ${state.data.settings.theme === theme ? "active" : ""}" data-action="select-theme" data-theme="${theme}">
        <div class="theme-preview preview-${theme}"><div class="preview-side"></div><div class="preview-main"><div class="preview-line"></div><div class="preview-line short"></div><div class="preview-line"></div></div></div>
        <strong>${title}</strong><small>${subtitle}</small>
      </button>
    `;
  }

  function styleOption(style) {
    return `
      <button class="style-option ${state.data.settings.uiStyle === style.id ? "active" : ""}" data-action="select-ui-style" data-style-id="${style.id}">
        <div class="style-swatch swatch-${style.id}"><span>${style.icon}</span></div>
        <strong>${esc(style.name)}</strong>
        <small>${esc(style.subtitle)}</small>
      </button>
    `;
  }

  function randomStyleOption() {
    return `
      <button class="style-option ${state.data.settings.uiStyle === "random" ? "active" : ""}" data-action="select-ui-style" data-style-id="random">
        <div class="style-swatch swatch-random"><span>🎲</span></div>
        <strong>Random on Reload</strong>
        <small>Picks one of the ten styles every time the app opens.</small>
      </button>
    `;
  }

  function getUiStyleName(styleId) {
    return UI_STYLES.find(style => style.id === styleId)?.name || "Royal Pink";
  }

  function toggleSetting(key, title, subtitle) {
    return `
      <div class="setting-row">
        <div class="setting-copy"><strong>${title}</strong><small>${subtitle}</small></div>
        <label class="toggle"><input type="checkbox" data-setting="${key}" ${state.data.settings[key] ? "checked" : ""} /><span class="toggle-track"></span></label>
      </div>
    `;
  }

  function difficultyLabel(value) {
    if (value <= 2) return "Very Easy";
    if (value <= 4) return "Easy";
    if (value <= 6) return "Moderate";
    if (value <= 8) return "Hard";
    return "Extreme";
  }

  function durationToMs(amount, unit) {
    const hour = 60 * 60 * 1000;
    const multipliers = { hours: hour, days: hour * 24, weeks: hour * 24 * 7, months: hour * 24 * 30 };
    return amount * (multipliers[unit] || multipliers.days);
  }

  function formatRemaining(endsAt) {
    if (!endsAt) return "No time limit";
    let ms = new Date(endsAt).getTime() - Date.now();
    if (ms <= 0) return "Time expired";
    const days = Math.floor(ms / 86400000); ms %= 86400000;
    const hours = Math.floor(ms / 3600000); ms %= 3600000;
    const minutes = Math.floor(ms / 60000);
    if (days > 0) return `${days}d ${hours}h remaining`;
    if (hours > 0) return `${hours}h ${minutes}m remaining`;
    return `${Math.max(1, minutes)}m remaining`;
  }

  function formatNumber(value) {
    return new Intl.NumberFormat().format(Math.floor(safeNonNegativeNumber(value)));
  }

  function formatDate(value) {
    try { return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(value)); }
    catch (_) { return "Unknown date"; }
  }

  function formatDateTime(value) {
    try { return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)); }
    catch (_) { return "Unknown time"; }
  }

  function relativeTime(value) {
    const diff = Date.now() - new Date(value).getTime();
    if (diff < 60000) return "just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
    return formatDate(value);
  }

  function formatBytes(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  }

  function clampNumber(value, min, max, fallback) {
    const number = Number(value);
    return Number.isFinite(number) ? Math.min(max, Math.max(min, number)) : fallback;
  }

  function safeNonNegativeNumber(value) {
    const number = Number(value);
    return Number.isFinite(number) ? Math.max(0, number) : 0;
  }

  function uid() {
    if (crypto?.randomUUID) return crypto.randomUUID();
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  }

  function esc(value) {
    return String(value ?? "").replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
  }

  function escAttr(value) {
    return esc(value).replace(/`/g, "&#96;");
  }
})();
