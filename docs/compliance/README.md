# Lift Pro 26 — Israel Compliance & Publication Baseline

**Status:** Internal draft — not legal advice and not ready for public publication
**Applies to:** the future Lift Pro 26 PWA, its public pages, customer area, technician area, and operational data handling
**Owner before launch:** `[[legal entity / product owner to be confirmed]]`

## Purpose and scope

This pack translates the MVP's known operational flows into a practical compliance and publication checklist. It includes publication templates for a privacy notice, terms of use, and an accessibility statement:

- [Privacy notice — Hebrew draft](privacy-notice.he.md)
- [Terms of use — Hebrew draft](terms-of-use.he.md)
- [Accessibility statement — Hebrew draft](accessibility-statement.he.md)

It is subordinate to the original Pages specification, `docs/PRDs/PRD.md`, and `docs/clientSystemAnaluse_1.html`. It does not expand the MVP or approve a legal position. A qualified Israeli lawyer must complete the placeholders and approve all public-facing documents before release.

## Legal and regulatory baseline to validate

The release owner and counsel must validate the application against the current law and the actual deployment facts. The minimum review set is:

| Area | Practical baseline for this MVP | Before publication |
|---|---|---|
| Privacy | The product will process personal data: account/contact details, customer work sites, service-call data, photos, signatures, technician identities, and audit events. | Identify the `בעל השליטה במאגר` (controller/database owner), permitted purposes, data subjects, recipients, retention, and any processors. |
| Information security | The Israeli privacy-security regulations apply to databases within their scope and require a risk-appropriate security regime. | Produce the required database-definition document, determine the applicable security level, configure role-based access, suppliers, logging, backup/recovery, and incident handling. |
| Data-subject requests | People may seek access to, and correction of, their personal data under applicable law. | Name the request channel and owner; establish identity verification, response, audit, and escalation procedures. |
| Large sensitive databases | Amendment 13 contains a notification route for a database containing specially sensitive personal data of more than 100,000 data subjects. | Counsel/privacy lead must assess the actual threshold and any registration/notification duty. Do not claim exemption without an assessment. |
| Internet accessibility | The service-accessibility rules and Israeli Standard 5568 govern online accessibility in relevant circumstances. | Confirm applicability/exemptions with counsel, then test the actual release against the approved standard and publish only verified statements. |
| Contracting | The product supports an operational service process; it is not itself the customer’s commercial service agreement. | Confirm the contracting entity, authorized users, commercial terms, limitations, service level, report status, governing law, and dispute terms. |

## Required implementation controls

These are product/release requirements, not text to copy into a policy.

### Privacy and data minimisation

- Collect only data necessary to operate the assigned service-call workflow.
- Treat signatures, contact details, addresses, service photos, and technician activity/audit events as personal data.
- Keep internal notes unavailable to customers, consistent with the MVP's controlled-transparency rule.
- Enforce the PRD's role scope: technicians see only assigned calls; customers see only their organization’s data.
- Do not enable analytics, cookies, pixels, direct marketing, external messaging, or cross-border transfers until they are identified in the privacy notice and reviewed.
- Define retention and deletion/archiving rules per data category before production. “Keep forever” is not an acceptable default.

### Security and operations

- Use individual accounts; never share technician, desk, or manager credentials.
- Apply least-privilege permissions and revoke access promptly when a role changes.
- Keep auditable logs for sensitive actions: login/access control changes, assignment, status change, photo/part/signature additions, report access/export, deletion, and administrator actions.
- Use secure transport, encrypted storage where appropriate, backups, vulnerability/patch management, and an incident-response owner.
- Review every hosting, storage, support, analytics, messaging, and authentication supplier. Put required data-processing/security commitments into the supplier agreement.
- Maintain a process for investigating and, where required, promptly reporting a serious security incident to the Privacy Protection Authority.

### Accessibility

- Implement semantic HTML, correct Hebrew `lang="he"` and RTL `dir="rtl"`, visible keyboard focus, logical keyboard order, accessible form errors, descriptive labels, and sufficient contrast.
- Make all workflows usable without a mouse, including authentication, service-call opening, call treatment, photo/part entry, signature flow, report access, and help/contact actions.
- Do not rely on color alone for urgent, selected, waiting, or closed states.
- Test responsive mobile PWA layouts with keyboard and assistive technology before claiming accessibility conformance.
- Publish an accessibility statement only after the actual tested scope, limitations, review date, contact method, and alternative-access process are known.

## Publication gate

Do not publish the template documents or label the product as “compliant” until all of the following are complete:

1. Legal entity, address, registration/contact details, and authorized representative are confirmed.
2. Counsel confirms the actual legal basis, controller/processor allocation, applicable privacy/security duties, and terms of service.
3. Engineering completes the data map, supplier list, retention schedule, access model, security-level assessment, and incident procedure.
4. Accessibility specialist or qualified reviewer tests the production-like experience and records verified results.
5. Product supplies a real accessibility-contact channel and a privacy-request channel.
6. The final Hebrew documents are versioned, approved, placed where users can access them before/while using the service, and linked from the relevant screens.
7. Acceptance/version records are retained when terms acceptance is required.

## Official reference sources

Use these primary/official sources for the launch review; they should be rechecked immediately before publishing because law and guidance can change.

- [Equal Rights for Persons with Disabilities (Service Accessibility Adjustments) Regulations, 2013 — official text (Hebrew PDF)](https://www.gov.il/BlobFolder/guide/accommodating_service_providing_rules/he/sitedocs_service_acessibility_regulations.pdf)
- [Israeli Standard 5568 Part 1: accessibility guidelines for web content (Hebrew PDF)](https://www.gov.il/BlobFolder/legalinfo/israeli_accessibility_standards_pdf/he/sitedocs_si-5568-1-september-2023.pdf)
- [Protection of Privacy Law, 1981 — Knesset legislation database](https://main.knesset.gov.il/Activity/Legislation/Laws/pages/lawprimary.aspx?lawitemid=2000234)
- [Privacy Protection Authority: FAQ on Amendment 13](https://www.gov.il/he/pages/tikun13_qa?chapterIndex=6)
- [Privacy Protection Regulations (Data Security), 2017 — official text (Hebrew PDF)](https://www.gov.il/BlobFolder/generalpage/1files/he/IT2017.pdf)
- [Privacy Protection Authority: Data Security Regulations FAQ](https://www.gov.il/he/pages/data_security_fqa?chapterIndex=1)
- [Privacy Protection Authority: notification duty for certain large sensitive databases](https://www.gov.il/he/service/notice-obligation)
- [Privacy Protection Authority: initial report of a serious security incident](https://mojforms.justice.gov.il/mojaemprivacyprotectionauthority/databreachupdate.html)

## Change control

Re-review this pack before any material change to:

- data categories, especially location, photos, signatures, or employee/technician monitoring;
- user roles or cross-customer data access;
- hosting location, third-party processors, analytics, cookies, marketing, external messaging, or data transfers outside Israel;
- retention/deletion, reports/export, or customer-visible audit history;
- accessibility-critical interaction or a published legal statement.
