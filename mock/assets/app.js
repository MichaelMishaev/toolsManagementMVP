const {
  PARTS_CATALOG,
  ROLE_ROUTES,
  SCENARIO_ROUTES,
  STATUS_LABELS,
  STORAGE_KEY,
  createScenarioState
} = window.LIFT_PRO_DEMO;

const app = document.getElementById("app");
const toast = document.getElementById("toast");
const routeAnnouncer = document.getElementById("routeAnnouncer");
const ambient = document.getElementById("ambient");
const ambientVideo = document.getElementById("ambientVideo");
const demoMode = new URLSearchParams(window.location.search).get("demo") === "1";
const defaultRoute = "#/technician/home";
let toastTimer;
let storageAvailable = true;
let signatureDrawn = false;
let lastDialogOpener = null;
let videoPrepared = false;

const routeTable = {
  "#/customer/new-call": { role: "customer", title: "פתיחת קריאת שירות", step: 1 },
  "#/desk/queue": { role: "desk", title: "קריאות חדשות ופעילות", step: 2 },
  "#/technician/home": { role: "technician", title: "הקריאה הבאה", step: 3 },
  "#/technician/call/2458": { role: "technician", title: "טיפול בקריאה #2458", step: 4 },
  "#/technician/close/2458": { role: "technician", title: "סיום וסגירת הקריאה", step: 5 },
  "#/parts/catalog": { role: "parts", title: "קטלוג חלפים", step: 5 },
  "#/manager/call/2458": { role: "manager", title: "הקריאה נסגרה", step: 6 },
  "#/customer/calls/2458/report": { role: "customer", title: "דוח טיפול #2458", step: 7 },
  "#/legal/demo-terms": { role: "public", title: "תנאי שימוש בתצוגת ההדגמה", step: null },
  "#/legal/privacy": { role: "public", title: "פרטיות בתצוגת ההדגמה", step: null },
  "#/legal/accessibility": { role: "public", title: "נגישות בתצוגת ההדגמה", step: null }
};

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function readState() {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.version === 1) return parsed;
    }
  } catch {
    storageAvailable = false;
  }

  const route = window.location.hash || defaultRoute;
  const step = routeTable[route]?.step || 3;
  return createScenarioState(step);
}

let state = readState();

function persistState() {
  if (!storageAvailable) return;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    storageAvailable = false;
  }
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.dataset.visible = "true";
  toastTimer = window.setTimeout(() => {
    toast.dataset.visible = "false";
  }, 3600);
}

function icon(name, extraClass = "") {
  return `<span class="icon icon--${name} ${extraClass}" aria-hidden="true"></span>`;
}

function bdi(value) {
  return `<bdi dir="ltr">${escapeHtml(value)}</bdi>`;
}

function statusBadge(status = state.callStatus) {
  if (!status) return "";
  const label = STATUS_LABELS[status] || status;
  return `<span class="status-badge status-badge--${escapeHtml(status)}">${icon("check")}<span>${escapeHtml(label)}</span></span>`;
}

function currentRoute() {
  return window.location.hash || defaultRoute;
}

function roleLabel(role) {
  return {
    customer: "אזור לקוח",
    desk: "מוקד שירות",
    technician: "אזור טכנאי",
    manager: "ניהול שירות",
    parts: "חלפים",
    public: "מידע על ההדגמה"
  }[role] || "מערכת שירות";
}

function navigationForRole(role) {
  const sets = {
    customer: [
      { href: "#/customer/new-call", label: "פתיחת קריאה", icon: "plus" },
      { href: "#/customer/calls/2458/report", label: "דוח טיפול", icon: "report" },
      { href: "#/legal/privacy", label: "פרטיות", icon: "profile" }
    ],
    desk: [
      { href: "#/desk/queue", label: "קריאות", icon: "calls" },
      { href: "#/manager/call/2458", label: "קריאה סגורה", icon: "check" },
      { href: "#/legal/accessibility", label: "נגישות", icon: "profile" }
    ],
    technician: [
      { href: "#/technician/home", label: "קריאות", icon: "calls" },
      { href: "#/technician/call/2458", label: "טיפול", icon: "fault" },
      { href: "#/technician/close/2458", label: "סיום", icon: "check" },
      { href: "#/parts/catalog", label: "חלפים", icon: "parts" }
    ],
    manager: [
      { href: "#/manager/call/2458", label: "קריאה סגורה", icon: "check" },
      { href: "#/customer/calls/2458/report", label: "דוח טיפול", icon: "report" },
      { href: "#/desk/queue", label: "קריאות", icon: "calls" }
    ],
    parts: [
      { href: "#/parts/catalog", label: "קטלוג", icon: "parts" },
      { href: "#/technician/close/2458", label: "קריאה #2458", icon: "calls" }
    ],
    public: [
      { href: "#/legal/demo-terms", label: "תנאי שימוש", icon: "report" },
      { href: "#/legal/privacy", label: "פרטיות", icon: "profile" },
      { href: "#/legal/accessibility", label: "נגישות", icon: "check" }
    ]
  };
  return sets[role] || sets.public;
}

function brandLockup() {
  return `
    <a class="brand-lockup" href="#/technician/home" aria-label="LiftVoltraq, מערכת שירות שטח">
      <span class="brand-lockup__plate">
        <img src="assets/liftvoltraq-badge.webp" alt="LiftVoltraq" width="512" height="512">
      </span>
      <span class="brand-lockup__tenant">
        <strong>LiftVoltraq</strong>
        <span>עבור ליפט פרו 26</span>
      </span>
    </a>`;
}

function urgencyBadge() {
  return state.call.urgency === "urgent"
    ? `<span class="urgency">${icon("urgent")}דחוף</span>`
    : `<span class="status-badge">עדיפות רגילה</span>`;
}

function navigationMarkup(role, mobile = false) {
  const route = currentRoute();
  return navigationForRole(role).map((item) => {
    const active = route === item.href;
    return `
      <a class="${mobile ? "bottom-nav__item" : "nav-item"}" href="${item.href}" ${active ? 'aria-current="page"' : ""}>
        ${icon(item.icon)}
        <span>${escapeHtml(item.label)}</span>
      </a>`;
  }).join("");
}

function presenterControls() {
  if (!demoMode) return "";
  const role = routeTable[currentRoute()]?.role || state.currentRole;
  const roleOptions = [
    ["customer", "לקוח"],
    ["desk", "מוקד"],
    ["technician", "טכנאי"],
    ["manager", "מנהל שירות"],
    ["parts", "חלפים"]
  ].map(([value, label]) => `<option value="${value}" ${role === value ? "selected" : ""}>${label}</option>`).join("");
  const stepOptions = Array.from({ length: 7 }, (_, index) => {
    const step = index + 1;
    const labels = ["פתיחת קריאה", "קליטה במוקד", "שיבוץ לטכנאי", "טיפול", "סיום וחתימה", "סגירה", "דוח ללקוח"];
    return `<option value="${step}" ${state.scenarioStep === step ? "selected" : ""}>${step}. ${labels[index]}</option>`;
  }).join("");

  const controls = `
    <label>תפקיד
      <select data-presenter-role>${roleOptions}</select>
    </label>
    <label>שלב בתרחיש
      <select data-presenter-step>${stepOptions}</select>
    </label>
    <button class="presenter-reset" type="button" data-action="open-reset-dialog">${icon("reset")}איפוס</button>`;

  return `
    <div class="presenter-bar" aria-label="כלי הצגת ההדגמה">
      <strong>מצב הדגמה</strong>${controls}
    </div>
    <details class="presenter-drawer">
      <summary>כלי הדגמה · שלב ${state.scenarioStep}</summary>
      <div>${controls}</div>
    </details>`;
}

function storageNotice() {
  if (storageAvailable) return "";
  return `<p class="storage-notice" role="status">המצב נשמר בזיכרון בלבד ויתאפס ברענון הדף.</p>`;
}

function roleShell(content, role) {
  return `
    ${presenterControls()}
    <div class="app-shell ${demoMode ? "app-shell--demo" : ""}">
      <aside class="desktop-sidebar" aria-label="ניווט ראשי">
        ${brandLockup()}
        <button class="sidebar-notification" type="button" data-action="notifications">
          ${icon("bell")}<span>התראות במערכת</span>
          ${state.notifications.some((item) => !item.read) ? '<span class="notification-dot" aria-hidden="true"></span>' : ""}
        </button>
        <p class="role-label">${roleLabel(role)}</p>
        <nav class="desktop-nav" aria-label="${roleLabel(role)}">${navigationMarkup(role)}</nav>
        <div class="sidebar-note">
          <strong>תצוגת לקוח מקומית</strong>
          <span>נתונים בדויים · ללא שרת או שידור מידע</span>
        </div>
      </aside>
      <div class="mobile-page">
        <header class="mobile-header">
          ${brandLockup()}
          <button class="icon-button" type="button" data-action="notifications" aria-label="בדיקת התראות">
            ${icon("bell")}
            ${state.notifications.some((item) => !item.read) ? '<span class="notification-dot" aria-hidden="true"></span>' : ""}
          </button>
        </header>
        <main class="workspace" id="main-content" tabindex="-1">${storageNotice()}${content}</main>
        <nav class="bottom-nav" aria-label="${roleLabel(role)}">${navigationMarkup(role, true)}</nav>
      </div>
    </div>
    ${dialogMarkup()}`;
}

function dialogMarkup() {
  return `
    <dialog class="app-dialog" id="closeDialog" aria-labelledby="closeDialogTitle" aria-describedby="closeDialogDescription">
      <form method="dialog">
        <h2 id="closeDialogTitle">לסגור את הקריאה?</h2>
        <p id="closeDialogDescription">לאחר הסגירה יופק דוח טיפול והמוקד יקבל התראה בתוך המערכת.</p>
        <div class="dialog-actions">
          <button class="secondary-action" value="cancel" autofocus>חזרה לבדיקה</button>
          <button class="primary-action" value="confirm" data-action="confirm-close">סגור והפק דוח</button>
        </div>
      </form>
    </dialog>
    <dialog class="app-dialog" id="resetDialog" aria-labelledby="resetDialogTitle">
      <form method="dialog">
        <h2 id="resetDialogTitle">לאפס את תרחיש ההדגמה?</h2>
        <p>כל ההתקדמות המקומית בכרטיסייה הנוכחית תחזור לשלב פתיחת הקריאה.</p>
        <div class="dialog-actions">
          <button class="secondary-action" value="cancel" autofocus>ביטול</button>
          <button class="danger-action" value="confirm" data-action="confirm-reset">איפוס התרחיש</button>
        </div>
      </form>
    </dialog>`;
}

function pageHeader(title, summary, options = {}) {
  return `
    <header class="page-heading ${options.compact ? "page-heading--compact" : ""}">
      <div>
        ${options.date ? `<p class="page-heading__date">${escapeHtml(options.date)}</p>` : ""}
        <h1 tabindex="-1">${title}</h1>
        ${summary ? `<p class="page-heading__summary">${summary}</p>` : ""}
      </div>
      ${options.status ? statusBadge(options.status) : ""}
    </header>`;
}

function demoNextButton(nextStep, label) {
  if (!demoMode || nextStep > 7) return "";
  return `<button class="demo-next" type="button" data-action="demo-next" data-step="${nextStep}">${escapeHtml(label)}</button>`;
}

function photoPreview(kind, label) {
  const isCustomer = kind === "customer-fault";
  return `
    <figure class="photo-preview">
      <img src="assets/generated/equipment-forklift.webp" alt="${isCustomer ? "צילום הדגמה של המלגזה לפני הטיפול" : "צילום הדגמה של המלגזה לאחר הטיפול"}" width="1448" height="1086">
      <figcaption>${escapeHtml(label)}</figcaption>
    </figure>`;
}

function renderCustomerNewCall() {
  if (state.ui.customerSubmitted) {
    return `
      ${pageHeader("הקריאה נפתחה בהצלחה", "הפרטים נקלטו בתצוגת ההדגמה המקומית.", { compact: true })}
      <section class="success-receipt" aria-labelledby="receipt-title">
        ${icon("check", "success-receipt__icon")}
        <div>
          <p>מספר קריאה</p>
          <h2 id="receipt-title">${bdi("#2458")}</h2>
          ${statusBadge("open")}
        </div>
        <dl class="definition-grid">
          <div><dt>אתר</dt><dd>${escapeHtml(state.call.customerName)}, ${escapeHtml(state.call.city)}</dd></div>
          <div><dt>ציוד</dt><dd>${escapeHtml(state.call.equipment)}</dd></div>
          <div><dt>תקלה</dt><dd>${escapeHtml(state.call.faultDescription)}</dd></div>
        </dl>
        <p class="trust-note">לא נשלח מידע אמיתי. כל הנתונים בדויים ונשמרים רק בכרטיסייה הנוכחית.</p>
        ${demoNextButton(2, "המשך להדגמת המוקד")}
      </section>`;
  }

  return `
    ${pageHeader("פתיחת קריאת שירות", "מספר פרטים קצרים יעזרו למוקד להבין מה נדרש.")}
    <div class="form-layout">
      <form class="form-panel" id="customer-call-form" novalidate>
        <div class="form-section">
          <h2>אתר וציוד</h2>
          <label class="field-label" for="customerSite">אתר שירות</label>
          <select id="customerSite" name="site" required>
            <option value="${escapeHtml(state.call.site)}">${escapeHtml(state.call.site)}</option>
          </select>

          <label class="field-label" for="customerEquipment">ציוד</label>
          <select id="customerEquipment" name="equipment" required>
            <option value="${escapeHtml(state.call.equipment)}">${escapeHtml(state.call.equipment)} · ${escapeHtml(state.call.equipmentInternalId)}</option>
            <option value="none">ללא כלי מסוים ברשימה</option>
          </select>
          <p class="field-help">אם הכלי אינו מופיע, יש לתאר אותו בבירור יחד עם התקלה.</p>
        </div>

        <div class="form-section">
          <h2>מה קרה?</h2>
          <label class="field-label" for="faultDescription">תיאור התקלה</label>
          <textarea id="faultDescription" name="faultDescription" rows="5" required minlength="8">${escapeHtml(state.call.faultDescription)}</textarea>

          <label class="check-control">
            <input type="checkbox" name="urgent" checked>
            <span>${icon("urgent")}הקריאה דחופה</span>
          </label>
          <p class="field-help">המוקד יבדוק את רמת הדחיפות ויכול לעדכן אותה.</p>
        </div>

        <div class="form-section">
          <div class="section-inline-heading">
            <h2>תמונות</h2><span>אופציונלי</span>
          </div>
          ${state.call.beforePhotos.length ? photoPreview("customer-fault", "תמונת תקלה לדוגמה") : `
            <button class="upload-control" type="button" data-action="add-customer-photo">
              ${icon("camera")}<span><strong>הוסף תמונת הדגמה</strong><small>הקובץ אינו מועלה או נשמר בשרת</small></span>
            </button>`}
        </div>

        <button class="primary-action sticky-mobile-action" type="submit">שלח קריאה</button>
      </form>
      <aside class="review-panel" aria-label="סיכום הקריאה">
        <h2>סיכום לפני שליחה</h2>
        <p class="review-panel__site">${escapeHtml(state.call.customerName)}</p>
        <dl>
          <div><dt>עיר</dt><dd>${escapeHtml(state.call.city)}</dd></div>
          <div><dt>ציוד</dt><dd>${escapeHtml(state.call.equipment)}</dd></div>
          <div><dt>שמירת מידע</dt><dd>כרטיסייה נוכחית בלבד</dd></div>
        </dl>
      </aside>
    </div>`;
}

function queueRow(name, number, status, selected = false) {
  return `
    <button class="queue-row ${selected ? "queue-row--selected" : ""}" type="button" ${selected ? 'aria-current="true"' : ""}>
      <span><strong>${escapeHtml(name)}</strong><small>${bdi(number)} · ${escapeHtml(STATUS_LABELS[status])}</small></span>
      ${selected ? '<span class="queue-row__marker">נבחרה</span>' : ""}
    </button>`;
}

function renderDeskQueue() {
  const scheduled = ["scheduled", "in_treatment", "closed"].includes(state.callStatus);
  return `
    ${pageHeader("קריאות חדשות ופעילות", "בדיקה, תעדוף ושיבוץ במקום אחד.")}
    <div class="queue-workspace">
      <section class="queue-list-panel" aria-labelledby="queue-title">
        <div class="queue-toolbar">
          <h2 id="queue-title">תור הקריאות</h2>
          <div class="filter-row" aria-label="סינון קריאות">
            <button type="button" aria-pressed="true">הכול</button>
            <button type="button" aria-pressed="false">חדשות</button>
            <button type="button" aria-pressed="false">בטיפול</button>
          </div>
        </div>
        <div class="queue-list">
          ${queueRow(state.call.customerName, "#2458", state.callStatus || "open", true)}
          ${queueRow("מחסן ציוד הנדסי", "#2457", "scheduled")}
          ${queueRow("מפעל מתכת הדרום", "#2456", "in_treatment")}
        </div>
      </section>

      <section class="call-detail-panel" aria-labelledby="desk-call-title">
        <div class="call-identity">
          <div><span>${bdi("קריאה #2458")}</span><h2 id="desk-call-title">${scheduled ? "ביקור מתואם" : "קריאה חדשה"}</h2></div>
          <div>${statusBadge(state.callStatus || "open")}${urgencyBadge()}</div>
        </div>

        <div class="detail-strip">
          <div>${icon("site")}<span><small>לקוח ואתר</small><strong>${escapeHtml(state.call.customerName)}, ${escapeHtml(state.call.city)}</strong></span></div>
          <div>${icon("equipment")}<span><small>ציוד</small><strong>${escapeHtml(state.call.equipment)}</strong></span></div>
          <div>${icon("fault")}<span><small>תקלה</small><strong>${escapeHtml(state.call.faultDescription)}</strong></span></div>
        </div>

        ${state.call.beforePhotos.length ? `<div class="compact-photo">${photoPreview("customer-fault", "צילום שצורף לקריאה")}</div>` : ""}

        <form class="assignment-form" id="desk-assignment-form">
          <h3>שיבוץ ותיאום</h3>
          <div class="field-grid">
            <label>טכנאי
              <select name="technician" required><option value="tech-david">דוד</option></select>
            </label>
            <label>תאריך טיפול
              <input name="date" type="date" value="2026-08-11" required>
            </label>
            <label>חלון שעות
              <select name="timeWindow" required><option value="10:30-12:00">10:30-12:00</option></select>
            </label>
            <label>דחיפות
              <select name="urgency" required>
                <option value="urgent" ${state.call.urgency === "urgent" ? "selected" : ""}>דחוף</option>
                <option value="normal" ${state.call.urgency === "normal" ? "selected" : ""}>רגילה</option>
              </select>
            </label>
          </div>
          <label>הערה פנימית למוקד ולטכנאי
            <textarea name="internalNote" rows="3">${escapeHtml(state.assignment.internalNote || "יש להפסיק את עבודת הכלי עד לסיום בדיקת הלחץ.")}</textarea>
          </label>
          <p class="field-help">ההערה אינה מוצגת ללקוח.</p>
          <button class="primary-action" type="submit">${scheduled ? "השיבוץ נשמר" : "שבץ וקבע ביקור"}</button>
        </form>
        ${scheduled ? demoNextButton(3, "המשך למסך הטכנאי") : ""}
      </section>
    </div>`;
}

function renderTechnicianHome() {
  return `
    ${pageHeader("בוקר טוב, דוד", "הקריאה הבאה מסודרת ומוכנה לפתיחה.", { date: "יום שלישי, 11 באוגוסט" })}
    <section aria-labelledby="next-call-heading">
      <div class="section-heading"><h2 id="next-call-heading">הקריאה הבאה</h2><span>היום</span></div>
      <article class="next-call" aria-labelledby="call-2458-title">
        <figure class="next-call__media">
          <img src="assets/generated/equipment-forklift.webp" alt="מלגזה כתומה תלת טונית במוסך שירות" width="1448" height="1086">
        </figure>
        <div class="next-call__content">
          <div class="next-call__topline"><span class="call-number">${bdi("קריאה #2458")}</span>${urgencyBadge()}</div>
          <h3 id="call-2458-title">${escapeHtml(state.call.customerName)}</h3>
          <p class="equipment-name">${escapeHtml(state.call.equipment)}</p>
          <div class="call-facts" aria-label="פרטי הקריאה">
            <div class="call-fact">${icon("clock")}<strong>${bdi(state.assignment.timeWindow || "10:30-12:00")}</strong></div>
            <div class="call-fact">${icon("location")}<strong>${escapeHtml(state.call.city)}</strong></div>
          </div>
          <p class="fault-summary">${icon("fault")}<span>תיאור התקלה<strong>${escapeHtml(state.call.faultDescription)}</strong></span></p>
          <a class="primary-action" href="#/technician/call/2458">פתח קריאה</a>
        </div>
      </article>
    </section>
    <section class="later-section" aria-labelledby="later-calls-heading">
      <div class="section-heading"><h2 id="later-calls-heading">המשך היום</h2><span>עוד 2 קריאות</span></div>
      <div class="later-calls">
        <article class="later-call"><div><h3>מחסן ציוד הנדסי</h3><p>מלגזה 2.5 טון, אשקלון</p></div><div class="later-call__time"><strong>${bdi("13:30-15:00")}</strong><span>היום</span></div></article>
        <article class="later-call"><div><h3>מפעל מתכת הדרום</h3><p>Bobcat S770, דימונה</p></div><div class="later-call__time"><strong>${bdi("16:00-17:30")}</strong><span>היום</span></div></article>
      </div>
    </section>`;
}

function treatmentFields() {
  return `
    <form class="treatment-form" id="treatment-form">
      <div class="section-inline-heading"><h2>תיעוד הטיפול</h2><span>שדות חובה מסומנים</span></div>
      <label>ממצאים
        <textarea name="findings" rows="3" required>${escapeHtml(state.treatment.findings)}</textarea>
      </label>
      <label>עבודה שבוצעה
        <textarea name="workPerformed" rows="4" required>${escapeHtml(state.treatment.workPerformed)}</textarea>
      </label>
      <fieldset>
        <legend>האם נדרש המשך טיפול?</legend>
        <label class="radio-control"><input type="radio" name="followUp" value="no" ${state.treatment.followUpRequired === false ? "checked" : ""} required>לא</label>
        <label class="radio-control"><input type="radio" name="followUp" value="yes" ${state.treatment.followUpRequired === true ? "checked" : ""}>כן</label>
      </fieldset>
      <label>הערות טכנאי <span>אופציונלי</span>
        <textarea name="technicianNotes" rows="3">${escapeHtml(state.treatment.technicianNotes)}</textarea>
      </label>
      <button class="primary-action sticky-mobile-action" type="submit">שמור והמשך לסיום</button>
    </form>`;
}

function renderTechnicianCall() {
  return `
    ${pageHeader(`טיפול בקריאה ${bdi("#2458")}`, "כל פרטי האתר והטיפול מרוכזים כאן.", { status: state.callStatus || "scheduled" })}
    <div class="call-workspace">
      <div class="call-main-column">
        <section class="operational-section" aria-labelledby="status-title">
          <h2 id="status-title">עדכון סטטוס</h2>
          <div class="status-actions">
            <button type="button" data-action="set-status" data-status="en_route" aria-pressed="${state.callStatus === "en_route"}">טכנאי בדרך</button>
            <button type="button" data-action="set-status" data-status="in_treatment" aria-pressed="${state.callStatus === "in_treatment"}">בטיפול</button>
            <button type="button" data-action="set-status" data-status="awaiting_parts" aria-pressed="${state.callStatus === "awaiting_parts"}">ממתינה לחלפים</button>
          </div>
        </section>

        <section class="operational-section" aria-labelledby="fault-title">
          <h2 id="fault-title">פרטי התקלה</h2>
          <p class="large-copy">${escapeHtml(state.call.faultDescription)}</p>
          ${state.call.beforePhotos.length ? photoPreview("customer-fault", "צילום שהלקוח צירף") : '<p class="empty-inline">לא צורפה תמונה לקריאה.</p>'}
        </section>

        ${["in_treatment", "awaiting_parts"].includes(state.callStatus) ? treatmentFields() : `
          <div class="action-panel">
            <p>יש לעדכן ל״בטיפול״ לפני תיעוד העבודה.</p>
            <button class="primary-action" type="button" data-action="set-status" data-status="in_treatment">התחל טיפול</button>
          </div>`}
      </div>

      <aside class="context-column" aria-label="פרטי הקריאה">
        <section><h2>לקוח ואיש קשר</h2><dl class="definition-list"><div><dt>לקוח</dt><dd>${escapeHtml(state.call.customerName)}</dd></div><div><dt>אתר</dt><dd>${escapeHtml(state.call.site)}</dd></div><div><dt>איש קשר</dt><dd>${escapeHtml(state.call.contactName)}</dd></div><div><dt>טלפון</dt><dd>${bdi(state.call.contactPhone)}</dd></div></dl></section>
        <section><h2>ציוד</h2><dl class="definition-list"><div><dt>כלי</dt><dd>${escapeHtml(state.call.equipment)}</dd></div><div><dt>מספר פנימי</dt><dd>${bdi(state.call.equipmentInternalId)}</dd></div><div><dt>שלדה</dt><dd>${bdi(state.call.chassis)}</dd></div></dl></section>
        ${state.assignment.internalNote ? `<section class="internal-note"><h2>הערת מוקד</h2><p>${escapeHtml(state.assignment.internalNote)}</p></section>` : ""}
      </aside>
    </div>`;
}

function selectedPartsMarkup() {
  if (!state.treatment.parts.length) return `<p class="empty-inline">עדיין לא סומנו חלפים.</p>`;
  return `<div class="selected-parts">${state.treatment.parts.map((part) => `
    <div class="selected-part">
      <div class="selected-part__identity"><strong>${escapeHtml(part.name)}</strong><small>${bdi(part.id)}</small></div>
      <label>כמות
        <input type="number" min="1" max="99" inputmode="numeric" value="${Number(part.quantity) || 1}" data-part-quantity="${escapeHtml(part.id)}">
      </label>
      <label>הערה
        <input type="text" value="${escapeHtml(part.note || "")}" placeholder="אופציונלי" data-part-note="${escapeHtml(part.id)}">
      </label>
      <button type="button" data-action="remove-part" data-part-id="${escapeHtml(part.id)}" aria-label="הסר ${escapeHtml(part.name)}">${icon("x")}</button>
    </div>`).join("")}</div>`;
}

function renderTechnicianClose() {
  const canClose = Boolean(state.treatment.summary && state.treatment.signature?.confirmed);
  return `
    ${pageHeader("סיום וסגירת הקריאה", "בדיקה אחרונה של התיעוד, החלפים ואישור הלקוח.", { status: state.callStatus || "in_treatment" })}
    <div class="completion-layout">
      <section class="completion-section">
        <div class="completion-step"><span>1</span><div><h2>סיכום טיפול</h2><p>${escapeHtml(state.treatment.summary || "יש לשמור קודם את תיעוד הטיפול.")}</p></div></div>
        ${!state.treatment.summary ? '<a class="secondary-action" href="#/technician/call/2458">חזרה לתיעוד</a>' : ""}
      </section>

      <section class="completion-section">
        <div class="completion-step"><span>2</span><div><h2>חלפים ששימשו</h2><p>קטלוג בסיסי בלבד, ללא מלאי או הזמנה.</p></div></div>
        ${selectedPartsMarkup()}
        <a class="secondary-action" href="#/parts/catalog">${icon("parts")}בחירת חלף</a>
      </section>

      <section class="completion-section">
        <div class="completion-step"><span>3</span><div><h2>תמונות סיום</h2><p>אופציונלי בתצוגה זו.</p></div></div>
        ${state.treatment.photos.length ? photoPreview("completion-photo", "תמונת סיום לדוגמה") : `<button class="upload-control" type="button" data-action="add-completion-photo">${icon("camera")}<span><strong>הוסף תמונת הדגמה</strong><small>לא מתבצעת העלאה לשרת</small></span></button>`}
      </section>

      <section class="completion-section signature-section">
        <div class="completion-step"><span>4</span><div><h2>אישור וחתימת לקוח</h2><p>האישור מתייחס לביצוע השירות ואינו מוצג כחתימה אלקטרונית מאושרת.</p></div></div>
        <label>שם החותם
          <input id="signerName" type="text" value="${escapeHtml(state.treatment.signature?.signerName || state.call.contactName)}" autocomplete="off">
        </label>
        <canvas id="signaturePad" class="signature-pad" width="720" height="220" role="img" aria-label="משטח חתימה. ניתן לצייר באמצעות עכבר או מגע, או להשתמש בכפתור אישור החתימה לדוגמה."></canvas>
        <div class="signature-actions">
          <button class="secondary-action" type="button" data-action="clear-signature">נקה חתימה</button>
          <button class="secondary-action" type="button" data-action="use-demo-signature">אשר חתימה לדוגמה</button>
          <button class="secondary-action" type="button" data-action="save-signature">שמור חתימה</button>
        </div>
        ${state.treatment.signature?.confirmed ? `<p class="saved-feedback" role="status">${icon("check")}החתימה נשמרה לתרחיש המקומי.</p>` : ""}
      </section>

      <section class="closure-panel">
        <div><h2>מוכן לסגירה?</h2><p>${canClose ? "כל פרטי החובה הושלמו." : "נדרשים סיכום טיפול וחתימת לקוח."}</p></div>
        <button class="primary-action" type="button" data-action="open-close-dialog" ${canClose ? "" : "disabled"}>סגור קריאה</button>
      </section>
    </div>`;
}

function renderPartsCatalog() {
  return `
    ${pageHeader("קטלוג חלפים", "חיפוש לפי שם או מק״ט והוספה לקריאה #2458.")}
    <div class="parts-layout">
      <section class="parts-catalog" aria-labelledby="parts-title">
        <div class="search-field">${icon("search")}<label class="sr-only" for="partsSearch">חיפוש חלף</label><input id="partsSearch" type="search" placeholder="חיפוש לפי שם או מק״ט" autocomplete="off"></div>
        <h2 id="parts-title" class="sr-only">רשימת חלפים</h2>
        <div id="partsResults" class="parts-results">
          ${PARTS_CATALOG.map((part) => `
            <article class="part-row" data-part-search="${escapeHtml(`${part.id} ${part.name}`.toLowerCase())}">
              <div>${icon("parts")}<span><strong>${escapeHtml(part.name)}</strong><small>${bdi(part.id)} · ${escapeHtml(part.category)}</small></span></div>
              <button type="button" data-action="add-part" data-part-id="${escapeHtml(part.id)}">הוסף</button>
            </article>`).join("")}
        </div>
      </section>
      <aside class="parts-summary" aria-label="חלפים שנבחרו">
        <h2>נבחרו לקריאה</h2>
        ${selectedPartsMarkup()}
        <a class="primary-action" href="#/technician/close/2458">חזרה לסיום הקריאה</a>
      </aside>
    </div>`;
}

function auditTimeline() {
  return `<ol class="audit-timeline">${state.audit.map((item) => `
    <li><span aria-hidden="true"></span><div><strong>${escapeHtml(item.label)}</strong><small>${escapeHtml(item.actor)} · ${bdi(item.time)}</small></div></li>`).join("")}</ol>`;
}

function renderManagerCall() {
  return `
    ${pageHeader("הקריאה נסגרה", "המוקד ומנהל השירות רואים את התיעוד המלא ואת דוח הטיפול.", { status: "closed" })}
    ${state.notifications.length ? `<section class="notification-banner">${icon("bell")}<div><strong>התראה חדשה במערכת</strong><p>${escapeHtml(state.notifications[0].text)}</p></div></section>` : ""}
    <div class="manager-layout">
      <div class="manager-summary">
        <section class="operational-section"><h2>סיכום הטיפול</h2><p class="large-copy">${escapeHtml(state.treatment.summary)}</p><dl class="definition-grid"><div><dt>נדרש המשך טיפול</dt><dd>${state.treatment.followUpRequired ? "כן" : "לא"}</dd></div><div><dt>חלפים</dt><dd>${state.treatment.parts.length}</dd></div><div><dt>תמונות סיום</dt><dd>${state.treatment.photos.length}</dd></div><div><dt>חתימת לקוח</dt><dd>${state.treatment.signature?.confirmed ? "נשמרה" : "חסרה"}</dd></div></dl></section>
        <section class="operational-section"><h2>פרטי הקריאה</h2><dl class="definition-grid"><div><dt>לקוח</dt><dd>${escapeHtml(state.call.customerName)}</dd></div><div><dt>ציוד</dt><dd>${escapeHtml(state.call.equipment)}</dd></div><div><dt>תקלה</dt><dd>${escapeHtml(state.call.faultDescription)}</dd></div><div><dt>חלון שירות</dt><dd>${bdi(state.assignment.timeWindow)}</dd></div></dl></section>
        <a class="primary-action" href="#/customer/calls/2458/report">פתח דוח טיפול</a>
        ${demoNextButton(7, "המשך לדוח הלקוח")}
      </div>
      <aside class="history-panel"><h2>היסטוריית הקריאה</h2>${auditTimeline()}</aside>
    </div>`;
}

function reportSection(title, content) {
  return `<section class="report-section"><h2>${title}</h2>${content}</section>`;
}

function renderReport() {
  if (!state.report.generated || state.callStatus !== "closed") {
    return `
      ${pageHeader("דוח הטיפול עדיין לא מוכן", "הדוח יופק רק לאחר השלמת הטיפול, חתימת הלקוח וסגירת הקריאה.")}
      <section class="empty-state" aria-labelledby="report-pending-title">
        <h2 id="report-pending-title">אין דוח זמין להצגה</h2>
        <p>זוהי תצוגה מקומית. יש להשלים את תרחיש השירות כדי ליצור דוח המבוסס על הנתונים שתועדו.</p>
        <a class="primary-action" href="#/customer/new-call">חזרה לקריאות</a>
      </section>`;
  }

  const partRows = state.treatment.parts.map((part) => `<tr><td>${bdi(part.id)}</td><td>${escapeHtml(part.name)}</td><td>${part.quantity}</td><td>${escapeHtml(part.note || "—")}</td></tr>`).join("");
  const reportPhotos = [
    state.call.beforePhotos.length ? photoPreview("customer-fault", "לפני הטיפול") : "",
    state.treatment.photos.length ? photoPreview("completion-photo", "לאחר הטיפול") : ""
  ].filter(Boolean).join("");
  const signature = state.treatment.signature?.confirmed ? state.treatment.signature : null;
  return `
    ${pageHeader(`דוח טיפול ${bdi("#2458")}`, "הדוח זמין לצפייה ולהדפסה מתצוגת הלקוח.", { status: "closed" })}
    <div class="report-toolbar"><button class="primary-action" type="button" data-action="print-report">${icon("print")}הדפס דוח</button></div>
    <article class="report-paper" aria-label="דוח טיפול לקריאה 2458">
      <header class="report-header">
        <img src="assets/liftvoltraq-badge.webp" alt="LiftVoltraq" width="512" height="512">
        <div><p>דוח טיפול</p><strong class="report-number">${bdi("#2458")}</strong><span>הופק: ${bdi(state.report.generatedAt)}</span></div>
      </header>
      ${reportSection("פרטי הקריאה", `<dl class="report-grid"><div><dt>מספר קריאה</dt><dd>${bdi("#2458")}</dd></div><div><dt>תאריך פתיחה</dt><dd>${bdi("11.08.2026, 08:42")}</dd></div><div><dt>תאריך טיפול</dt><dd>${bdi(state.assignment.date)}</dd></div><div><dt>סטטוס סופי</dt><dd>${escapeHtml(STATUS_LABELS[state.callStatus])}</dd></div></dl>`)}
      ${reportSection("לקוח ואתר", `<dl class="report-grid"><div><dt>לקוח</dt><dd>${escapeHtml(state.call.customerName)}</dd></div><div><dt>אתר</dt><dd>${escapeHtml(state.call.site)}</dd></div><div><dt>איש קשר</dt><dd>${escapeHtml(state.call.contactName)}</dd></div><div><dt>טלפון</dt><dd>${bdi(state.call.contactPhone)}</dd></div></dl>`)}
      ${reportSection("ציוד", `<dl class="report-grid"><div><dt>סוג כלי</dt><dd>${escapeHtml(state.call.equipment)}</dd></div><div><dt>מספר פנימי</dt><dd>${bdi(state.call.equipmentInternalId)}</dd></div><div><dt>מספר שלדה</dt><dd>${bdi(state.call.chassis)}</dd></div><div><dt>שעות עבודה</dt><dd>${bdi(state.call.workingHours)}</dd></div></dl>`)}
      ${reportSection("תקלה וטיפול", `<div class="report-copy"><h3>תיאור התקלה</h3><p>${escapeHtml(state.call.faultDescription)}</p><h3>ממצאים</h3><p>${escapeHtml(state.treatment.findings)}</p><h3>עבודה שבוצעה</h3><p>${escapeHtml(state.treatment.workPerformed)}</p><h3>סיכום</h3><p>${escapeHtml(state.treatment.summary)}</p><h3>המשך טיפול</h3><p>${state.treatment.followUpRequired ? "נדרש" : "לא נדרש"}</p><h3>הערות טכנאי</h3><p>${escapeHtml(state.treatment.technicianNotes || "לא נוספו הערות.")}</p></div>`)}
      ${reportSection("חלפים", state.treatment.parts.length ? `<table><thead><tr><th>מק״ט</th><th>תיאור</th><th>כמות</th><th>הערה</th></tr></thead><tbody>${partRows}</tbody></table>` : "<p>לא סומנו חלפים.</p>")}
      ${reportSection("תמונות", reportPhotos ? `<div class="report-photos">${reportPhotos}</div>` : "<p>לא צורפו תמונות לקריאה.</p>")}
      ${reportSection("אישור לקוח", signature ? `<div class="report-signature"><div><span class="signature-script">${escapeHtml(signature.signerName)}</span><strong>${escapeHtml(signature.signerName)}</strong><small>${bdi(signature.signedAt)}</small></div><p>אישור קבלת השירות בתצוגת ההדגמה. אינו מוצג כחתימה אלקטרונית מאושרת.</p></div>` : "<p>לא נשמר אישור לקוח.</p>")}
    </article>`;
}

const legalContent = {
  "#/legal/demo-terms": {
    title: "תנאי שימוש בתצוגת ההדגמה",
    intro: "תצוגה זו נועדה להמחיש חוויית מוצר אפשרית בלבד ואינה מערכת שירות פעילה.",
    sections: [
      ["מטרת התצוגה", "המסכים, הקריאות, הלקוחות, הציוד והחתימות המוצגים כאן הם נתוני הדגמה בדויים. אין בתצוגה התחייבות לזמינות מערכת, לוחות זמנים או תכולת התקשרות מסחרית."],
      ["שימוש מותר", "אין להזין לתצוגה מידע אישי, מסחרי או תפעולי אמיתי. אין חשבונות משתמשים, אימות זהות או הרשאות אמיתיות."],
      ["מסמכים והדפסה", "דוח הטיפול הוא המחשה מקומית הניתנת להדפסה מהדפדפן. הוא אינו מסמך שירות שהופק ממערכת תפעולית."],
      ["בדיקה משפטית", "נוסח זה הוא נוסח הדגמה בלבד. מסמכי שימוש מחייבים ייקבעו בנפרד ויעברו בדיקה משפטית מתאימה לפני פרסום מערכת אמיתית."]
    ]
  },
  "#/legal/privacy": {
    title: "פרטיות בתצוגת ההדגמה",
    intro: "ההדגמה בנויה כאתר Frontend מקומי ואינה מעבירה נתונים לשרת.",
    sections: [
      ["איזה מידע נאסף", "לא נוצרים חשבונות ולא נאסף מידע אישי. אין חיבור למסד נתונים, שירות אנליטיקה, מערכת פרסום או שירות דיוור."],
      ["שמירה מקומית", "התקדמות בתרחיש נשמרת ב-sessionStorage של הכרטיסייה בלבד כדי לאפשר מעבר בין המסכים. איפוס התרחיש או סגירת הכרטיסייה מסירים את המצב המקומי בהתאם להתנהגות הדפדפן."],
      ["קבצים ותמונות", "כפתורי התמונות משתמשים בנכסי הדגמה מקומיים. לא מתבצעת העלאת קובץ, שמירה קבועה או שידור לצד שלישי."],
      ["עוגיות ושירותים חיצוניים", "התצוגה אינה משתמשת בעוגיות, שירותי צד שלישי או בקשות רשת חיצוניות בזמן השימוש."]
    ]
  },
  "#/legal/accessibility": {
    title: "נגישות בתצוגת ההדגמה",
    intro: "המסכים תוכננו לשימוש בעברית, מימין לשמאל, במקלדת ובמכשירי מגע.",
    sections: [
      ["אמצעים שיושמו", "מבנה כותרות וציוני דרך, קישור דילוג לתוכן, שמות נגישים לפקדים, מיקוד נראה, ניגודיות מתאימה ומטרות מגע גדולות."],
      ["תנועה ומדיה", "העדפת reduced motion מונעת את הפעלת סרטון הרקע. גם חיסכון בנתונים משאיר תמונת פוסטר מקומית במקום וידאו."],
      ["חתימה", "לצד משטח החתימה קיימת חלופה מלאה באמצעות מקלדת לאישור חתימת הדגמה ושדה נפרד לשם החותם."],
      ["גבולות ההצהרה", "זהו נוסח נגישות לתצוגת מוצר בלבד. הצהרת נגישות מלאה ופרטי רכז נגישות ייקבעו עבור המערכת והארגון המפעיל לפני פרסום."]
    ]
  }
};

function renderLegal(route) {
  const page = legalContent[route];
  return `
    ${pageHeader(page.title, page.intro)}
    <article class="legal-document">
      ${page.sections.map(([title, copy]) => `<section><h2>${title}</h2><p>${copy}</p></section>`).join("")}
      <nav class="legal-links" aria-label="מסמכי הדגמה">
        <a href="#/legal/demo-terms">תנאי שימוש</a>
        <a href="#/legal/privacy">פרטיות</a>
        <a href="#/legal/accessibility">נגישות</a>
      </nav>
    </article>`;
}

function renderNotFound() {
  return `${pageHeader("המסך לא נמצא", "הקישור אינו חלק מתצוגת הלקוח הנוכחית.")}<div class="empty-page"><a class="primary-action" href="#/technician/home">חזרה למסך הטכנאי</a></div>`;
}

function screenForRoute(route) {
  const screens = {
    "#/customer/new-call": renderCustomerNewCall,
    "#/desk/queue": renderDeskQueue,
    "#/technician/home": renderTechnicianHome,
    "#/technician/call/2458": renderTechnicianCall,
    "#/technician/close/2458": renderTechnicianClose,
    "#/parts/catalog": renderPartsCatalog,
    "#/manager/call/2458": renderManagerCall,
    "#/customer/calls/2458/report": renderReport
  };
  if (legalContent[route]) return renderLegal(route);
  return screens[route]?.() || renderNotFound();
}

function updateAmbient(route) {
  const active = route === "#/technician/home";
  document.body.dataset.ambient = active ? "visible" : "hidden";
  if (!ambientVideo || !ambient) return;
  if (!active) {
    ambientVideo.pause();
    return;
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const saveData = Boolean(navigator.connection?.saveData);
  if (reducedMotion || saveData) return;

  if (!videoPrepared) {
    const source = document.createElement("source");
    const useWebm = Boolean(ambientVideo.canPlayType("video/webm"));
    source.type = useWebm ? "video/webm" : "video/mp4";
    source.src = useWebm ? ambientVideo.dataset.webm : ambientVideo.dataset.mp4;
    ambientVideo.append(source);
    ambientVideo.load();
    videoPrepared = true;
  }

  ambientVideo.play().then(() => {
    ambient.dataset.videoReady = "true";
  }).catch(() => {
    ambient.dataset.videoReady = "false";
  });
}

function render({ focusHeading = false } = {}) {
  const route = currentRoute();
  const info = routeTable[route] || { role: "public", title: "המסך לא נמצא" };
  state.currentRole = info.role === "public" ? state.currentRole : info.role;
  persistState();
  app.innerHTML = roleShell(screenForRoute(route), info.role);
  document.title = `${info.title} | LiftVoltraq`;
  updateAmbient(route);
  setupSignaturePad();

  if (focusHeading) {
    window.scrollTo({ top: 0, behavior: "instant" });
    const heading = app.querySelector("main h1");
    heading?.focus({ preventScroll: true });
    routeAnnouncer.textContent = info.title;
  }
}

function navigate(route) {
  if (window.location.hash === route) {
    render({ focusHeading: true });
  } else {
    window.location.hash = route;
  }
}

function applyScenarioStep(step) {
  state = createScenarioState(step);
  persistState();
  navigate(SCENARIO_ROUTES[step]);
  showToast(`עברנו לשלב ${step} בתרחיש ההדגמה.`);
}

function appendAudit(id, label, time, actor) {
  if (state.audit.some((item) => item.id === id)) return;
  state.audit.push({ id, label, time, actor });
}

function openDialog(id, opener) {
  const dialog = document.getElementById(id);
  if (!dialog) return;
  lastDialogOpener = opener;
  dialog.showModal();
}

function closeDialogAndRestore(dialog) {
  dialog?.close();
  lastDialogOpener?.focus();
  lastDialogOpener = null;
}

function setupSignaturePad() {
  const canvas = document.getElementById("signaturePad");
  if (!canvas) return;
  const context = canvas.getContext("2d");
  context.lineCap = "round";
  context.lineJoin = "round";
  context.lineWidth = 4;
  context.strokeStyle = "#9BCB42";
  let drawing = false;

  const point = (event) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * (canvas.width / rect.width),
      y: (event.clientY - rect.top) * (canvas.height / rect.height)
    };
  };

  canvas.addEventListener("pointerdown", (event) => {
    drawing = true;
    signatureDrawn = true;
    canvas.setPointerCapture(event.pointerId);
    const start = point(event);
    context.beginPath();
    context.moveTo(start.x, start.y);
  });
  canvas.addEventListener("pointermove", (event) => {
    if (!drawing) return;
    const next = point(event);
    context.lineTo(next.x, next.y);
    context.stroke();
  });
  canvas.addEventListener("pointerup", () => { drawing = false; });
  canvas.addEventListener("pointercancel", () => { drawing = false; });

  if (state.treatment.signature?.confirmed) {
    context.font = "700 52px Heebo";
    context.fillStyle = "#9BCB42";
    context.textAlign = "center";
    context.fillText(state.treatment.signature.signerName, canvas.width / 2, canvas.height / 2 + 18);
  }
}

function saveSignature(useAlternative = false) {
  const nameInput = document.getElementById("signerName");
  const signerName = nameInput?.value.trim();
  if (!signerName) {
    nameInput?.setAttribute("aria-invalid", "true");
    nameInput?.focus();
    showToast("יש להזין את שם החותם.");
    return;
  }
  if (!signatureDrawn && !useAlternative) {
    showToast("יש לחתום במשטח או להשתמש באישור החתימה לדוגמה.");
    return;
  }
  state.treatment.signature = { signerName, confirmed: true, signedAt: "11.08.2026, 11:28" };
  state.ui.signatureSaved = true;
  appendAudit("signed", "אישור הלקוח נחתם", "11.08.2026, 11:28", "לקוח");
  persistState();
  render();
  showToast("החתימה נשמרה בתרחיש המקומי.");
}

function handleAction(button) {
  const action = button.dataset.action;
  if (!action) return;

  if (action === "notifications") {
    showToast(state.notifications[0]?.text || "אין התראות חדשות בתצוגה.");
  }
  if (action === "add-customer-photo") {
    state.call.beforePhotos = ["customer-fault"];
    persistState(); render(); showToast("נוספה תמונת הדגמה מקומית.");
  }
  if (action === "set-status") {
    const status = button.dataset.status;
    state.callStatus = status;
    state.scenarioStep = Math.max(state.scenarioStep, 4);
    if (status === "en_route") appendAudit("en-route", "הטכנאי יצא ללקוח", "11.08.2026, 10:04", "טכנאי");
    if (status === "in_treatment") appendAudit("treatment-started", "הטיפול החל באתר", "11.08.2026, 10:36", "טכנאי");
    if (status === "awaiting_parts") appendAudit("awaiting-parts", "הקריאה ממתינה לחלפים", "11.08.2026, 10:58", "טכנאי");
    persistState(); render(); showToast(`הסטטוס עודכן: ${STATUS_LABELS[status]}.`);
  }
  if (action === "add-completion-photo") {
    state.treatment.photos = ["completion-photo"];
    appendAudit("photo-added", "נוספה תמונת סיום", "11.08.2026, 11:23", "טכנאי");
    persistState(); render(); showToast("נוספה תמונת סיום לדוגמה.");
  }
  if (action === "add-part") {
    const part = PARTS_CATALOG.find((item) => item.id === button.dataset.partId);
    if (part && !state.treatment.parts.some((item) => item.id === part.id)) {
      state.treatment.parts.push({ ...part, quantity: 1, note: "הוחלף באתר" });
      appendAudit("part-added", `נוסף חלק ${part.id}`, "11.08.2026, 11:20", "טכנאי");
      persistState(); render(); showToast(`${part.name} נוסף לקריאה.`);
    } else {
      showToast("החלף כבר נמצא ברשימה.");
    }
  }
  if (action === "remove-part") {
    state.treatment.parts = state.treatment.parts.filter((item) => item.id !== button.dataset.partId);
    persistState(); render(); showToast("החלף הוסר מהקריאה.");
  }
  if (action === "clear-signature") {
    signatureDrawn = false;
    state.treatment.signature = null;
    state.ui.signatureSaved = false;
    persistState(); render(); showToast("משטח החתימה נוקה.");
  }
  if (action === "use-demo-signature") saveSignature(true);
  if (action === "save-signature") saveSignature(false);
  if (action === "open-close-dialog") openDialog("closeDialog", button);
  if (action === "confirm-close") {
    state.callStatus = "closed";
    state.scenarioStep = 6;
    state.currentRole = "manager";
    state.ui.closureComplete = true;
    state.notifications = [{ id: "closed-2458", text: "קריאה #2458 נסגרה ודוח הטיפול מוכן.", read: false }];
    state.report = { generated: true, generatedAt: "11.08.2026, 11:31", viewed: false };
    appendAudit("closed", "הקריאה נסגרה ודוח הטיפול הופק", "11.08.2026, 11:31", "טכנאי");
    persistState();
    closeDialogAndRestore(document.getElementById("closeDialog"));
    navigate("#/manager/call/2458");
    showToast("הקריאה נסגרה ודוח הטיפול הופק.");
  }
  if (action === "demo-next") applyScenarioStep(Number(button.dataset.step));
  if (action === "open-reset-dialog") openDialog("resetDialog", button);
  if (action === "confirm-reset") {
    state = createScenarioState(1);
    persistState();
    closeDialogAndRestore(document.getElementById("resetDialog"));
    navigate("#/customer/new-call");
    showToast("תרחיש ההדגמה אופס.");
  }
  if (action === "print-report") window.print();
}

function handleCustomerSubmit(form) {
  if (!form.checkValidity()) {
    form.querySelector(":invalid")?.focus();
    showToast("יש להשלים את שדות החובה.");
    return;
  }
  const data = new FormData(form);
  state.call.site = String(data.get("site"));
  state.call.equipment = data.get("equipment") === "none" ? "כלי לא מזוהה ברשימה" : String(data.get("equipment"));
  state.call.faultDescription = String(data.get("faultDescription")).trim();
  state.call.urgency = data.get("urgent") ? "urgent" : "normal";
  state.callSubmitted = true;
  state.callStatus = "open";
  state.scenarioStep = 2;
  state.currentRole = "customer";
  state.ui.customerSubmitted = true;
  appendAudit("opened", "הקריאה נפתחה", "11.08.2026, 08:42", "לקוח");
  persistState(); render({ focusHeading: true }); showToast("הקריאה נפתחה בהצלחה.");
}

function handleDeskSubmit(form) {
  const data = new FormData(form);
  state.assignment = {
    technicianId: String(data.get("technician")),
    technicianName: "דוד",
    date: String(data.get("date")),
    timeWindow: String(data.get("timeWindow")),
    internalNote: String(data.get("internalNote")).trim()
  };
  state.call.urgency = String(data.get("urgency")) === "urgent" ? "urgent" : "normal";
  state.callStatus = "scheduled";
  state.scenarioStep = 3;
  state.ui.deskSaved = true;
  appendAudit("assigned", "הקריאה שובצה לטכנאי", "11.08.2026, 08:55", "מוקד השירות");
  appendAudit("scheduled", "נקבע חלון שירות 10:30-12:00", "11.08.2026, 08:57", "מוקד השירות");
  persistState(); render(); showToast("הקריאה שובצה לדוד והביקור תואם.");
}

function handleTreatmentSubmit(form) {
  if (!form.checkValidity()) {
    form.querySelector(":invalid")?.focus();
    showToast("יש להשלים את תיעוד החובה.");
    return;
  }
  const data = new FormData(form);
  state.treatment.findings = String(data.get("findings")).trim();
  state.treatment.workPerformed = String(data.get("workPerformed")).trim();
  state.treatment.followUpRequired = data.get("followUp") === "yes";
  state.treatment.technicianNotes = String(data.get("technicianNotes")).trim();
  state.treatment.summary = `${state.treatment.findings} ${state.treatment.workPerformed}`.trim();
  state.scenarioStep = 5;
  state.ui.treatmentSaved = true;
  appendAudit("treatment-saved", "סיכום הטיפול נשמר", "11.08.2026, 11:18", "טכנאי");
  persistState(); navigate("#/technician/close/2458"); showToast("תיעוד הטיפול נשמר.");
}

app.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  if (button.dataset.action === "confirm-close" || button.dataset.action === "confirm-reset") event.preventDefault();
  handleAction(button);
});

app.addEventListener("submit", (event) => {
  event.preventDefault();
  if (event.target.id === "customer-call-form") handleCustomerSubmit(event.target);
  if (event.target.id === "desk-assignment-form") handleDeskSubmit(event.target);
  if (event.target.id === "treatment-form") handleTreatmentSubmit(event.target);
});

app.addEventListener("input", (event) => {
  if (event.target.id === "partsSearch") {
    const query = event.target.value.trim().toLowerCase();
    app.querySelectorAll("[data-part-search]").forEach((row) => {
      row.hidden = !row.dataset.partSearch.includes(query);
    });
  }
  if (event.target.matches("[data-part-quantity]")) {
    const part = state.treatment.parts.find((item) => item.id === event.target.dataset.partQuantity);
    if (part && event.target.value) {
      part.quantity = Math.max(1, Math.min(99, Number(event.target.value) || 1));
      persistState();
    }
  }
  if (event.target.matches("[data-part-note]")) {
    const part = state.treatment.parts.find((item) => item.id === event.target.dataset.partNote);
    if (part) {
      part.note = event.target.value;
      persistState();
    }
  }
});

app.addEventListener("change", (event) => {
  if (event.target.matches("[data-presenter-role]")) navigate(ROLE_ROUTES[event.target.value]);
  if (event.target.matches("[data-presenter-step]")) applyScenarioStep(Number(event.target.value));
  if (event.target.matches("[data-part-quantity]")) {
    const part = state.treatment.parts.find((item) => item.id === event.target.dataset.partQuantity);
    if (part) {
      part.quantity = Math.max(1, Math.min(99, Number(event.target.value) || 1));
      event.target.value = String(part.quantity);
      persistState();
      showToast("כמות החלף עודכנה.");
    }
  }
  if (event.target.matches("[data-part-note]")) {
    const part = state.treatment.parts.find((item) => item.id === event.target.dataset.partNote);
    if (part) {
      part.note = event.target.value.trim();
      persistState();
      showToast("הערת החלף עודכנה.");
    }
  }
});

window.addEventListener("hashchange", () => render({ focusHeading: true }));

if (!window.location.hash) {
  window.history.replaceState(null, "", defaultRoute);
}

const themeColor = getComputedStyle(document.documentElement).getPropertyValue("--color-background").trim();
if (themeColor) document.getElementById("themeColor")?.setAttribute("content", themeColor);

render();
