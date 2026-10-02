# TraceR76 | NAWI Test Report Platform (OIML R 76-1:2006 / R 76-2:2007)

Automated metrological evaluation platform and tamper-evident test report generator for non-automatic weighing instruments (NAWI). 
Compliant with **OIML R 76-1:2006**, **OIML R 76-2:2007**, **WELMEC 7.2**, and **ISO/IEC 17025:2017** record requirements.

---

## 🌟 Key Differentiators

* **D1 — Clause-Traced Verdicts:** Every observation row features an expandable "Why" inspector detailing the applicable standard clause (e.g. A.4.4.3), exact formula ($P = I + 0.5e - \Delta L$, $E = P - L$, $E_c = E - E_0$), parameter substitution, MPE band, and compliance margin.
* **D2 — Dual-Engine Calculation:** Verified independently by two decoupled computation engines (Engine A: TypeScript & Engine B: Scaled BigInt Rational Engine). Mismatch $> 10^{-6}e$ blocks report submission.
* **D3 — Tamper-Evident Reports:** Deterministic SHA-256 seal, digital signature, PDF/A printable layout, and public verification page (`/verify/{id}`) with live QR code and offline drag-and-drop hash checker.
* **D4 — Intelligent Test Planner:** Automatically computes $n = \text{Max}/e$, checks class limits, and generates load sequences covering every MPE band transition point (500e, 2000e, Max) with recommended standard weight pieces.
* **D5 — Data Import & Web Serial:** Spreadsheet paste & CSV upload across all browsers; direct **Web Serial API** RS-232 telemetry capture with motion stability filter.
* **D6 — ISO/IEC 17025 Validation Pack:** Downloadable suite of 300+ golden test vectors, Traceability Matrix, and in-browser automated verification runner.
* **D7 — Versioned Rulesets:** Locked to `OIML-R76-1:2006 (Ruleset v3.2.1-intl)` with SHA-256 hash stamped on every issued report.
* **D8 — Supabase PostgreSQL Cloud Sync:** Real-time cloud synchronization with Row Level Security (RLS) and offline local storage fallback.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
```

---

## 🗄️ Supabase PostgreSQL Integration

1. Create a project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in Supabase and run [`src/data/supabase_schema.sql`](src/data/supabase_schema.sql).
3. In the application header, click **"Connect DB"**, enter your Project URL and Anon Key, and click **"Save & Connect"**.
4. Click **"Seed Sample Reports into DB"** to populate benchmark reports and reference standard weights with 1 click!

---

## 🔬 Metrological Formulations

In accordance with **OIML R 76-1:2006 Clause A.4.4.3**:

$$\text{Calculated Load } P = I + 0.5e - \Delta L$$

$$\text{Uncorrected Error } E = P - L$$

$$\text{Corrected Error } E_c = E - E_0$$

$$\text{Compliance Condition: } |E_c| \le \text{MPE}$$

---

## 👥 Separation of Duties (ISO/IEC 17025)

* **Test Engineer (Dr. Marcus Vance):** Data entry & live instrument capture. Cannot review or approve own reports.
* **Technical Reviewer (Elena Rostova):** Independent cross-check against Engine A & Engine B. Can approve or return.
* **Approver / Signatory (Prof. Hans-Peter Weber):** Authorized signatory; applies SHA-256 digital seal and issues final locked report.
* **Public Verifier (No login):** Fast public authenticity check at `/verify`.

---

## 📜 License & Compliance

Designed in accordance with **OIML R 76-1:2006** and **ISO/IEC 17025:2017**. Formulas and MPE tables must be validated by a metrology expert against national statutory legal metrology regulations prior to official type-approval issuance.
