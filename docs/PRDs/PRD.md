# Product Requirements Document — Lift Pro 26 Field Service Management MVP

**Original title:** אפיון MVP למערכת ניהול קריאות שירות, ציוד, מוקד וטכנאי שטח
**Product name:** Lift Pro 26
**Brand note:** The field-service application uses the client’s Lift Pro 26 identity. The legal company name is Lift Pro 26 Israel Ltd. (`ליפט פרו 26 ישראל בע״מ`).
**Brand decision:** Updated 12 August 2026 from client-supplied name and logo artwork; this supersedes the former LiftVoltraq identity in derived product artifacts.
**Brand assets:** `assets/brand/lift-pro-26-logo-transparent.png` is the approved canonical artwork. The former client screenshot and historical LiftVoltraq assets were removed after migration; see `assets/brand/README.md`.
**Source document:** `docs/אפיון_MVP_מערכת_שירות_שטח_ללקוח.pages`
**Intended for:** the client (equipment service company)
**Version:** Initial MVP specification
**Date:** June 2026
**Status:** Draft — client-facing specification, translated and restructured as a PRD

> This document defines the scope of Phase 1 (MVP) of the system, its core workflow, its user roles, and its boundaries. It does not include technical/architecture detail and does not replace a price quote or a service agreement.

---

## 1. Overview

The company provides field service for **forklifts, aerial/scissor lift platforms, and other mechanical equipment**. Today this service process is handled manually; the system's purpose is to digitize and centralize it end-to-end.

The system lets the company's customers open service calls in a simple way, lets the service desk receive and prioritize those calls, assign a technician, and lets the technician perform the field work, document it, capture a customer signature, and close the call.

### 1.1 Goals

- Improve control and visibility over the service process.
- Reduce manual work for the service desk and technicians.
- Centralize treatment history per customer and per piece of equipment.
- Produce a structured, consistent service report after every closed call.

---

## 2. Target Users & Roles

| Role | Primary use of the system |
|---|---|
| **Customer** | Open service calls, track call status, view their equipment and past service reports. |
| **Service Desk** | Receive calls, verify details, assign a technician, set a treatment date and time window. |
| **Technician** | View calls assigned to them, navigate to the customer, update status, document the treatment, and close the call. |
| **Service Manager** | Oversight across calls, customers, technicians, equipment, and service reports. |
| **Warehouse / Parts** | Manage a basic parts catalog and help identify parts used during service. |

---

## 3. Core Workflow

The primary end-to-end flow a service call moves through:

1. The customer opens a service call, adding a description, location, urgency, and photos as needed.
2. The call enters the service desk queue with status **Open**.
3. The desk reviews the call details, assigns a technician, and sets a treatment date and time window.
4. The technician sees the call with customer details, equipment, fault description, and photos.
5. The technician arrives on-site, updates the status, documents the treatment, and adds completion photos.
6. The technician obtains the customer's signature and closes the call.
7. The desk is notified that the call was closed, and a service report is generated for the customer.

---

## 4. Functional Requirements (MVP Scope)

### 4.1 Customer Area

| ID | Requirement |
|---|---|
| FR-1.1 | Customer can log in and view their personal area. |
| FR-1.2 | Customer can view the list of equipment associated with their account. |
| FR-1.3 | Customer can open a new service call. |
| FR-1.4 | Customer can select equipment from their own equipment list when opening a call. |
| FR-1.5 | Customer can open a call without selecting a specific piece of equipment, provided a clear free-text description is given. |
| FR-1.6 | Customer can attach photos to a call. |
| FR-1.7 | Customer can view their active calls and current status. |
| FR-1.8 | Customer can view their call history and past service reports. |

### 4.2 Service Desk

| ID | Requirement |
|---|---|
| FR-2.1 | Desk can view all new and active calls. |
| FR-2.2 | Desk can review call, customer, work-site, and equipment details. |
| FR-2.3 | Desk can change a call's urgency level at their discretion. |
| FR-2.4 | Desk can assign a technician to a call. |
| FR-2.5 | Desk can set a treatment date and time window. |
| FR-2.6 | Desk can add internal notes visible to the desk and/or the technician. |
| FR-2.7 | Desk receives a notification when a technician closes a call. |

### 4.3 Technician

| ID | Requirement |
|---|---|
| FR-3.1 | Technician can view only the calls assigned to them. |
| FR-3.2 | Technician can view customer details, work site, contact person, and phone number. |
| FR-3.3 | Technician can view equipment details and the fault description. |
| FR-3.4 | Technician can view photos uploaded by the customer. |
| FR-3.5 | Technician can update the call status during treatment. |
| FR-3.6 | Technician can write a treatment summary. |
| FR-3.7 | Technician can attach photos after treatment. |
| FR-3.8 | Technician can mark parts used, selected from a basic parts catalog. |
| FR-3.9 | Technician can capture the customer's signature. |
| FR-3.10 | Technician can close the call. |

### 4.4 Customer & Equipment Management

| ID | Requirement |
|---|---|
| FR-4.1 | Manage the company's customer records. |
| FR-4.2 | Manage contacts per customer. |
| FR-4.3 | Manage work sites and addresses. |
| FR-4.4 | Manage an equipment list per customer. |
| FR-4.5 | Store equipment details: equipment type, internal number, chassis/serial number, working hours, active status, and notes. |
| FR-4.6 | View service history filtered by customer and by individual piece of equipment. |

### 4.5 Basic Parts Catalog

| ID | Requirement |
|---|---|
| FR-5.1 | Manage a basic parts list. |
| FR-5.2 | Search parts by name or SKU. |
| FR-5.3 | Associate parts used with a specific service call. |
| FR-5.4 | Store quantity and a note for each part used on a call. |

---

## 5. Service Call Status Lifecycle

| Status | Meaning |
|---|---|
| **Open** | New call has arrived at the desk and is not yet assigned. |
| **Assigned to Technician** | The desk has selected the technician responsible for the call. |
| **Scheduled** | A treatment date and time window have been set. |
| **Technician En Route** | The technician has departed toward the customer. |
| **In Treatment** | The technician is on-site handling the fault. |
| **Awaiting Parts** | Treatment cannot be completed until a part is received or a further decision is made. |
| **Closed** | Treatment has been documented, signed, and closed by the technician. |
| **Cancelled** | The call was cancelled by the desk or the service manager. |

---

## 6. Service Report

At the close of a service call, a structured treatment report is generated for both the customer and the company.

| Report Component | Detail |
|---|---|
| Call details | Call number, opening date, treatment date, final status. |
| Customer details | Customer name, work site, contact person, contact information. |
| Equipment details | Equipment type, internal number, chassis number, working hours (if available). |
| Fault description | The information the customer entered when opening the call. |
| Treatment summary | Findings, work performed, whether follow-up treatment is required, technician notes. |
| Parts | Parts used and quantity per part. |
| Photos | Before/after photos, as attached to the call. |
| Signature | Signer's name, customer signature, date and time. |

---

## 7. Service History & Audit Trail

The system will maintain an organized history of key actions on each call, including: opening, status changes, technician assignment, scheduling, photo additions, parts additions, signature, and closing.

This history lets the desk and service manager understand what happened on a given call, who handled it, when each action occurred, and what the treatment summary was.

---

## 8. Notifications & Updates

The MVP will include the business/data groundwork for alert events, so that automatic sending to the customer or desk can be enabled in the future via channels such as push notifications, email, or WhatsApp.

In this first stage, notifications can be shown **inside the system** and important events will be saved. Actual delivery of external messages is deferred to a follow-up phase, unless explicitly decided otherwise.

---

## 9. Initial Setup & Data Import

To enable a fast start, it's recommended that existing data files be gathered in advance for: customers, contacts, work sites, equipment, and the parts catalog. This data will be used for the initial system setup (see also [Section 12](#12-client-responsibilities-before-work-begins)).

---

## 10. Out of Scope for MVP

| Topic | Note |
|---|---|
| Store-published app | In the first stage the system will operate as a **PWA**, not as an app published to the App Store or Google Play. |
| External integrations | No connections to systems such as Ituran, ERP, accounting, or invoicing. |
| Full parts inventory | Only a basic catalog is included — no warehouse management, purchase orders, or inventory counts. |
| Automatic WhatsApp/SMS sending | Groundwork is kept for the future, but actual sending is not part of the MVP unless explicitly added. |
| Full offline support | Not included in the first stage. |
| Full preventive maintenance | Basic fields can be prepared for the future, but a periodic-treatment mechanism is not part of the first stage. |
| Video | Attaching video to a call is not a core part of the MVP; recommended to define as a separate, later option. |

---

## 11. Possible Future Phases

After the MVP launches, the system could be expanded to include:

- Automatic status updates sent to the customer.
- Preventive maintenance scheduled by date or working hours.
- Advanced parts inventory management.
- Connections to external systems.
- Advanced management reporting.
- QR code scanning on equipment for quick call opening.
- A full store-published app, if needed.

---

## 12. Client Responsibilities Before Work Begins

| Required from client | Detail |
|---|---|
| Customer list | Customer name, contacts, phone numbers, addresses, and work sites. |
| Equipment list | Equipment type, internal number, chassis number, working hours, and assigned customer. |
| Fault types | List of the fault categories accepted/used in the business. |
| Technician list | Name, phone number, activity regions (if applicable). |
| Initial parts catalog | SKUs and basic part names. |
| Desired report template | Logo, company details, and preferred summary wording for the treatment report. |

---

## 13. Summary

The proposed MVP fully addresses the core service process: call opening by the customer, desk handling, technician assignment, field work documentation, customer signature, call closing, and treatment report generation.

The first stage is focused on a fast, useful solution that generates real operational value, while preserving the ability to extend the system in line with the company's future needs (see [Section 11](#11-possible-future-phases)).

---

## 14. Discovery Notes Traceability

Cross-referenced against an early client discovery conversation (WhatsApp, Dima Shkola, 24 June 2026) that preceded this formal specification. Kept here so decisions to include, defer, or reject specific client asks are traceable back to their origin, rather than silently dropped between the initial discussion and the `.pages` source.

### 14.1 Candidate requirements — raised early, not yet formalized in this MVP scope

These were mentioned in initial discovery but never resolved into a functional requirement in the `.pages` spec. They are **not** committed MVP scope — listed here so include/defer/reject can be a deliberate decision rather than an omission.

| ID | Candidate requirement | Notes |
|---|---|---|
| CR-1 | Fault **type** and **category** as structured, selectable fields (not just free text) | Would require an agreed taxonomy of fault types/categories before implementation |
| CR-2 | Equipment category taxonomy: forklifts, **Bobcats/skid-steers**, **excavators**, lift platforms, other | Current spec only stores a generic "equipment type" free-text field ([FR-4.5](#44-customer--equipment-management)) |
| CR-3 | Technician name shown as a report/list field, not just an internal assignment action | Assignment exists ([FR-2.4](#42-service-desk)); not currently listed as a [service report component](#6-service-report) or call-list column |
| CR-4 | In-app "navigate to customer" action (map/GPS deep link) for technicians | [Core workflow](#3-core-workflow) step 5 assumes the technician reaches the customer, but no navigation aid is specified |
| CR-5 | "Documents" area within the customer personal area | Personal area currently covers login, equipment, calls, and reports only ([FR-1.1–FR-1.8](#41-customer-area)) |
| CR-6 | "Settings" within the customer personal area | Not mentioned in either source document |

### 14.2 Explicitly deferred — raised in discovery, descoped by the formal spec

These were part of the client's initial wishlist but were explicitly excluded once the formal spec was written ([Section 10](#10-out-of-scope-for-mvp)). Listed here so the exclusion reads as a deliberate decision, not an oversight.

| Discovery ask | Formal MVP decision |
|---|---|
| Live stock quantity ("מלאי קיים") | Basic parts catalog only — no stock/warehouse management |
| Ordering parts ("הזמנת חלפים") | No purchase orders in MVP |
| Invoices in customer personal area | No accounting/invoicing integration in MVP |
| Video attachments on a call | Excluded from MVP; recommended as a separate future option |
| Integration with Ituran (fleet/telematics) or ERP | Explicitly excluded from MVP; candidate for a later phase ([Section 11](#11-possible-future-phases)) |

---

## Open Questions

These are not resolved in the source specification and should be clarified before or during implementation (see also the candidate requirements in [Section 14.1](#141-candidate-requirements--raised-early-not-yet-formalized-in-this-mvp-scope)):

- Who defines the initial list of fault/issue categories referenced in Section 12 — the client or the implementation team?
- What is the expected urgency scale (e.g., number of levels, labels) the desk uses when triaging calls?
- Is there a maximum photo count/size per call, or per technician upload?
- Should "Awaiting Parts" pause any SLA/response-time expectations, if such expectations exist?
- Who can trigger a "Cancelled" status besides the desk and service manager — can a customer request cancellation?
- What determines report branding/template variability if the company serves multiple sub-brands or divisions?
