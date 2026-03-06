# Janaa — Global Payroll Dashboard

> **Status:** Live MVP · India 🇮🇳 + Philippines 🇵🇭 · Three Role Dashboards

---

## 🎯 What This Is

A role-based global payroll dashboard for **Janaa** — built as a production-ready MVP with three separate portals sharing one unified payroll data model.

**Three user types → Three dashboards:**

| Role | URL | Purpose |
|------|-----|---------|
| Internal Ops (Janaa team) | `/ops.html` | Run payroll on time, manage exceptions, compliance |
| Client Admin (Employer)   | `/admin.html` | Review costs, approve payroll, export reports |
| Employee (Worker)         | `/me.html` | Self-serve: pay status, payslips, bank details |

---

## 🗺 Pages & Routes

| Page | Path | Roles |
|------|------|-------|
| Login / Role Selector | `/index.html` | All |
| Internal Ops Dashboard | `/ops.html` | ops |
| Client Admin Dashboard | `/admin.html` | admin |
| Employee Portal | `/me.html` | employee |
| Payroll Register | `/register.html?run=RUN001` | ops, admin |

---

## ✅ Completed Features

### Login & Authentication
- [x] Animated login page with role selector (3 roles)
- [x] Demo user quick-pick per role
- [x] localStorage session management
- [x] Role-based routing & redirect guards

### Internal Ops Dashboard (`/ops.html`)
- [x] **Overview** — stat cards, upcoming deadline table, open exceptions, compliance progress by country
- [x] **Payroll Runs** — full list with status, gross/net, approve/process/mark-paid actions
- [x] **Exceptions Inbox** — tabbed Open/Resolved with severity colors, inline resolve
- [x] **Compliance Checklist** — India (PF/ESI/PT/TDS) + Philippines (SSS/PhilHealth/Pag-IBIG/BIR/13th Month)
- [x] Create new payroll run modal
- [x] Blocker alert banners

### Client Admin Dashboard (`/admin.html`)
- [x] **Overview** — stat cards, current run summary, run history
- [x] **Approval** — pending runs with full cost breakdown, approve button, confirmation modal
- [x] **Cost Summary** — Chart.js bar chart + detailed breakdown table with CSV export
- [x] **Employees** — headcount table with bank status indicator, click-to-detail modal
- [x] **Blockers** — open exceptions for that client with action owner context

### Employee Portal (`/me.html`)
- [x] **Overview** — pay status tracker, latest payslip summary, quick actions, country-specific deduction card
- [x] **My Payslips** — full payslip history list
- [x] **Full Payslip Viewer** — India (PF/ESI/TDS) and Philippines (SSS/PhilHealth/BIR) formats, print/PDF button
- [x] **My Profile** — personal details + bank details panel
- [x] **Bank Update modal** — submit new bank details for ops review
- [x] **Documents tab** — country-specific document checklist (India: PAN/Aadhaar/Form 12B; PH: SSS/PhilHealth/Pag-IBIG IDs)
- [x] Missing bank alert banner

### Payroll Register (`/register.html`)
- [x] Run selector dropdown
- [x] Stat bar (headcount, gross, net, deductions, employer cost)
- [x] Full line-by-line employee register table
- [x] Totals footer row
- [x] Doughnut chart — pay component breakdown
- [x] Run summary panel
- [x] CSV export

---

## 🗃 Data Model

### Tables (backed by RESTful Table API)

#### `employees`
| Field | Type | Notes |
|-------|------|-------|
| id | text | EMP001, ADM001, OPS001 |
| name, email | text | |
| role | text | ops / admin / employee |
| country | text | India / Philippines |
| client_id, client_name | text | CLIENT01, CLIENT02 |
| base_salary, currency | number, text | INR / PHP |
| bank_name, bank_account | text | Masked |
| status | text | active / inactive / onboarding |

#### `payroll_runs`
| Field | Type | Notes |
|-------|------|-------|
| id, run_name | text | |
| country, client_id | text | |
| period | text | YYYY-MM |
| status | text | draft / processing / pending_approval / approved / paid / failed |
| total_gross, total_net, total_employer_cost | number | |
| due_date, approval_deadline, payment_date | text | |

#### `payslips`
| Field | Type | Notes |
|-------|------|-------|
| id, employee_id, run_id | text | |
| gross_salary, basic_pay, hra | number | |
| special_allowance, thirteenth_month | number | Philippines 13th month |
| pf_sss, esi_philhealth, tax_tds_wht | number | Country-specific deductions |
| net_pay | number | Take-home |
| status | text | draft / finalized / paid |

#### `compliance_tasks`
| Field | Type | Notes |
|-------|------|-------|
| id, run_id, country | text | |
| title, description | text | |
| regulatory_body | text | PF / ESI / PT / TDS / SSS / PhilHealth / PagIBIG / BIR |
| status | text | pending / in_progress / done / blocked |
| is_blocker | bool | Surfaces alert in ops dashboard |

#### `exceptions`
| Field | Type | Notes |
|-------|------|-------|
| id, run_id, employee_id | text | |
| type | text | missing_bank / salary_change / tax_mismatch / late_data / payment_failed |
| severity | text | high / medium / low |
| action_owner | text | ops / admin / employee |
| status | text | open / resolved / escalated |

---

## 🏗 Technical Stack

- **Frontend**: Vanilla HTML5 + CSS3 + JavaScript (ES6+)
- **Styling**: Custom design system in `css/main.css` (Inter font, CSS variables)
- **Charts**: Chart.js (via CDN)
- **Data**: RESTful Table API (relative `tables/{table}` endpoints)
- **Auth**: localStorage-based session (upgrade to Supabase Auth for production)
- **Fonts**: Google Fonts — Inter

---

## 🚀 Deployment on Janaa Domain

### Option A: app.getjanaa.com (Recommended)
1. Push this project to a GitHub repository
2. Connect to **Vercel** (or Netlify)
3. In Vercel → Project Settings → Domains → Add `app.getjanaa.com`
4. In your DNS provider (Cloudflare/GoDaddy):
   - Add `CNAME` record: `app` → `cname.vercel-dns.com`
5. Vercel auto-provisions SSL

### Option B: getjanaa.com/dashboard
1. If site is on Webflow: use **Webflow Hosting** + embed iframe or redirect
2. If site is on custom server: upload files to `/public/dashboard/`
3. Configure nginx/Apache to serve `dashboard/` from this build

### Option C: This hosted deployment
Use the **Publish tab** in this editor to get a live URL instantly.

---

## 🔐 Production Upgrade Checklist

| Item | Priority | Notes |
|------|----------|-------|
| Replace localStorage with Supabase Auth | High | Real login, JWT tokens |
| Add row-level security in database | High | Employees see only their own data |
| SSL / HTTPS | High | Automatic on Vercel |
| Real payroll calculation engine | High | Gross → deductions → net |
| Email notifications (approval deadlines) | Medium | Resend / SendGrid |
| Audit log for all payroll actions | Medium | Who approved, when |
| Payslip PDF generation server-side | Medium | Puppeteer or a PDF API |
| Multi-currency FX rates | Low | For cost reporting across countries |
| 13th month pay auto-calculation | Low | Philippines Dec payroll |
| Variance charts (MoM delta) | Low | Add to admin cost page |

---

## 🌏 Country Coverage

### 🇮🇳 India
- Compliance: **PF** (EPFO), **ESI** (ESIC), **PT** (Professional Tax), **TDS** (Income Tax)
- Payslip components: Basic, HRA, Special Allowance
- Deductions: PF 12%, ESI (salary ≤ ₹21K), TDS as computed

### 🇵🇭 Philippines
- Compliance: **SSS**, **PhilHealth**, **Pag-IBIG (HDMF)**, **BIR** (Withholding Tax 1601-C)
- Payslip components: Basic, Allowances, 13th Month (December accrual)
- 13th Month Pay tracker with Dec 24 deadline reminder

---

## 📂 File Structure

```
index.html          ← Login / role selector
ops.html            ← Internal Ops dashboard
admin.html          ← Client Admin dashboard
me.html             ← Employee portal
register.html       ← Payroll register drilldown
css/
  main.css          ← Shared design system
js/
  utils.js          ← API client, formatters, session, toasts
README.md
```

---

## 👥 Demo Users

| Name | Role | Company | Country |
|------|------|---------|---------|
| Neha Singh | Internal Ops | Janaa | India |
| Mark Aquino | Internal Ops | Janaa | Philippines |
| Ravi Kumar | Client Admin | TechCorp India | India |
| Jennifer Tan | Client Admin | GlobalOps PH | Philippines |
| Priya Sharma | Employee | TechCorp India | India |
| Rahul Mehta | Employee | TechCorp India | India |
| Maria Santos | Employee | GlobalOps PH | Philippines |
| Carlos Dela Rosa | Employee | GlobalOps PH | Philippines |

---

*Built for Janaa · Global Payroll Platform · India 🇮🇳 · Philippines 🇵🇭*
