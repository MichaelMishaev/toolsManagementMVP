(() => {
const STORAGE_KEY = "liftpro26.demo.v1";

const SCENARIO_ROUTES = {
  1: "#/customer/new-call",
  2: "#/desk/queue",
  3: "#/technician/home",
  4: "#/technician/call/2458",
  5: "#/technician/close/2458",
  6: "#/manager/call/2458",
  7: "#/customer/calls/2458/report"
};

const ROLE_ROUTES = {
  customer: "#/customer/new-call",
  desk: "#/desk/queue",
  technician: "#/technician/home",
  manager: "#/manager/call/2458",
  parts: "#/parts/catalog"
};

const STATUS_LABELS = {
  open: "פתוחה",
  assigned: "שובצה לטכנאי",
  scheduled: "מתואמת",
  en_route: "טכנאי בדרך",
  in_treatment: "בטיפול",
  awaiting_parts: "ממתינה לחלפים",
  closed: "נסגרה",
  cancelled: "בוטלה"
};

const PARTS_CATALOG = [
  { id: "HY-4588", name: "צינור לחץ הידראולי", category: "הידראוליקה" },
  { id: "SE-2110", name: "ערכת אטמים למשאבה", category: "אטימה" },
  { id: "FL-0300", name: "מסנן שמן הידראולי", category: "מסננים" },
  { id: "CN-1042", name: "מחבר לחץ 3/8", category: "מחברים" }
];

const baseState = () => ({
  version: 1,
  currentRole: "customer",
  scenarioStep: 1,
  callId: 2458,
  callSubmitted: false,
  callStatus: null,
  call: {
    customerName: "מרכז לוגיסטי דרום",
    site: "אתר באר שבע, רחוב העבודה 12",
    city: "באר שבע",
    contactName: "יוסי כהן",
    contactPhone: "050-000-2458",
    equipment: "מלגזת Toyota, 3 טון",
    equipmentInternalId: "FLT-032",
    chassis: "TY-3485-22",
    workingHours: "4,820",
    faultDescription: "נזילה במערכת ההידראולית",
    urgency: "urgent",
    beforePhotos: []
  },
  assignment: {
    technicianId: null,
    technicianName: null,
    date: null,
    timeWindow: null,
    internalNote: ""
  },
  treatment: {
    findings: "",
    workPerformed: "",
    summary: "",
    followUpRequired: null,
    technicianNotes: "",
    parts: [],
    photos: [],
    signature: null
  },
  notifications: [],
  audit: [],
  report: {
    generated: false,
    generatedAt: null,
    viewed: false
  },
  ui: {
    lastAction: null,
    customerSubmitted: false,
    deskSaved: false,
    treatmentSaved: false,
    signatureSaved: false,
    closureComplete: false
  }
});

const event = (id, label, time, actor) => ({ id, label, time, actor });

function createScenarioState(step = 1) {
  const state = baseState();
  state.scenarioStep = step;

  if (step >= 2) {
    state.currentRole = "desk";
    state.callSubmitted = true;
    state.callStatus = "open";
    state.call.beforePhotos = ["customer-fault"];
    state.ui.customerSubmitted = true;
    state.audit.push(event("opened", "הקריאה נפתחה", "11.08.2026, 08:42", "לקוח"));
  }

  if (step >= 3) {
    state.currentRole = "technician";
    state.callStatus = "scheduled";
    state.assignment = {
      technicianId: "tech-david",
      technicianName: "דוד",
      date: "2026-08-11",
      timeWindow: "10:30-12:00",
      internalNote: "יש להפסיק את עבודת הכלי עד לסיום בדיקת הלחץ."
    };
    state.ui.deskSaved = true;
    state.audit.push(
      event("assigned", "הקריאה שובצה לטכנאי", "11.08.2026, 08:55", "מוקד השירות"),
      event("scheduled", "נקבע חלון שירות 10:30-12:00", "11.08.2026, 08:57", "מוקד השירות")
    );
  }

  if (step >= 4) {
    state.callStatus = "in_treatment";
    state.audit.push(
      event("en-route", "הטכנאי יצא ללקוח", "11.08.2026, 10:04", "טכנאי"),
      event("treatment-started", "הטיפול החל באתר", "11.08.2026, 10:36", "טכנאי")
    );
  }

  if (step >= 5) {
    state.treatment = {
      findings: "אותר צינור לחץ פגום באזור מערכת ההרמה.",
      workPerformed: "בוצעה החלפת הצינור ובדיקת לחץ מלאה.",
      summary: "אותר צינור לחץ פגום, בוצעה החלפה ובדיקת לחץ. המערכת נמצאה תקינה לאחר בדיקה.",
      followUpRequired: false,
      technicianNotes: "הכלי הוחזר לעבודה לאחר בדיקת בטיחות.",
      parts: [{ id: "HY-4588", name: "צינור לחץ הידראולי", quantity: 1, note: "הוחלף באתר" }],
      photos: ["completion-photo"],
      signature: {
        signerName: "יוסי כהן",
        confirmed: true,
        signedAt: "11.08.2026, 11:28"
      }
    };
    state.ui.treatmentSaved = true;
    state.ui.signatureSaved = true;
    state.audit.push(
      event("treatment-saved", "סיכום הטיפול נשמר", "11.08.2026, 11:18", "טכנאי"),
      event("part-added", "נוסף חלק HY-4588", "11.08.2026, 11:20", "טכנאי"),
      event("photo-added", "נוספה תמונת סיום", "11.08.2026, 11:23", "טכנאי"),
      event("signed", "אישור הלקוח נחתם", "11.08.2026, 11:28", "לקוח")
    );
  }

  if (step >= 6) {
    state.currentRole = "manager";
    state.callStatus = "closed";
    state.ui.closureComplete = true;
    state.notifications = [{ id: "closed-2458", text: "קריאה #2458 נסגרה ודוח הטיפול מוכן.", read: false }];
    state.report = { generated: true, generatedAt: "11.08.2026, 11:31", viewed: false };
    state.audit.push(event("closed", "הקריאה נסגרה ודוח הטיפול הופק", "11.08.2026, 11:31", "טכנאי"));
  }

  if (step >= 7) {
    state.currentRole = "customer";
    state.report.viewed = true;
    state.notifications = state.notifications.map((notification) => ({ ...notification, read: true }));
  }

  return state;
}

window.LIFT_PRO_DEMO = {
  PARTS_CATALOG,
  ROLE_ROUTES,
  SCENARIO_ROUTES,
  STATUS_LABELS,
  STORAGE_KEY,
  createScenarioState
};
})();
