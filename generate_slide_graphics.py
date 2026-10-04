import os
from PIL import Image, ImageDraw, ImageFont

def get_font(name, size, bold=False):
    font_dir = "C:/Windows/Fonts"
    if bold:
        candidates = [os.path.join(font_dir, "segoeuib.ttf"), os.path.join(font_dir, "arialbd.ttf"), os.path.join(font_dir, "calibrib.ttf")]
    else:
        candidates = [os.path.join(font_dir, "segoeui.ttf"), os.path.join(font_dir, "arial.ttf"), os.path.join(font_dir, "calibri.ttf")]
    
    for c in candidates:
        if os.path.exists(c):
            try:
                return ImageFont.truetype(c, size)
            except:
                pass
    return ImageFont.load_default()

def draw_rounded_rect(draw, coords, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(coords, radius=radius, fill=fill, outline=outline, width=width)

# =========================================================================
# GRAPHIC 1: Slide 2 - Dual-Engine & Metrology Seal Card (1100 x 900)
# =========================================================================
def generate_s2_graphic():
    w, h = 1100, 900
    img = Image.new("RGBA", (w, h), (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)
    
    draw_rounded_rect(draw, (10, 10, w - 10, h - 10), 20, fill=(248, 250, 252, 255), outline=(203, 213, 225, 255), width=2)
    draw_rounded_rect(draw, (30, 30, w - 30, 110), 14, fill=(30, 58, 138, 255))
    f_hdr = get_font("segoe", 28, bold=True)
    draw.text((w // 2, 70), "DUAL-ENGINE ARCHITECTURE & DIGITAL SEAL", fill=(255, 255, 255, 255), font=f_hdr, anchor="mm")
    
    draw_rounded_rect(draw, (40, 135, w - 40, 355), 16, fill=(255, 255, 255, 255), outline=(226, 232, 240, 255), width=2)
    f_sub = get_font("segoe", 22, bold=True)
    draw.text((60, 155), "1. Parallel Fault-Isolated Verification", fill=(30, 41, 59, 255), font=f_sub)
    
    draw_rounded_rect(draw, (60, 200, 480, 290), 10, fill=(239, 246, 255, 255), outline=(191, 219, 254, 255), width=2)
    f_eng = get_font("segoe", 18, bold=True)
    f_txt = get_font("segoe", 15)
    draw.text((80, 215), "ENGINE A: TypeScript / Web Core", fill=(29, 78, 216, 255), font=f_eng)
    draw.text((80, 250), "Arbitrary-precision Decimal.js arithmetic", fill=(71, 85, 105, 255), font=f_txt)
    
    draw_rounded_rect(draw, (520, 200, 940, 290), 10, fill=(245, 243, 255, 255), outline=(221, 214, 254, 255), width=2)
    draw.text((540, 215), "ENGINE B: Python / WASM Library", fill=(109, 40, 217, 255), font=f_eng)
    draw.text((540, 250), "Independent cross-compiled OIML validator", fill=(71, 85, 105, 255), font=f_txt)
    
    draw_rounded_rect(draw, (60, 305, w - 60, 343), 8, fill=(236, 253, 245, 255), outline=(167, 243, 208, 255), width=1)
    f_badge = get_font("segoe", 15, bold=True)
    draw.text((w // 2, 324), "[PASS] Real-time Cross Check: 100% Deterministic Match Required to Submit", fill=(4, 120, 87, 255), font=f_badge, anchor="mm")
    
    draw_rounded_rect(draw, (40, 375, w - 40, 600), 16, fill=(255, 255, 255, 255), outline=(226, 232, 240, 255), width=2)
    draw.text((60, 395), "2. OIML R 76-1:2006 Changeover-Point Method", fill=(30, 41, 59, 255), font=f_sub)
    
    f_formula = get_font("segoe", 20, bold=True)
    draw_rounded_rect(draw, (60, 440, 480, 510), 10, fill=(241, 245, 249, 255), outline=(203, 213, 225, 255), width=1)
    draw.text((270, 475), "P = I + 0.5e - ΔL", fill=(15, 23, 42, 255), font=f_formula, anchor="mm")
    
    draw_rounded_rect(draw, (520, 440, 940, 510), 10, fill=(241, 245, 249, 255), outline=(203, 213, 225, 255), width=1)
    draw.text((730, 475), "E = P - L  |  Ec = E - E0", fill=(15, 23, 42, 255), font=f_formula, anchor="mm")
    
    f_clause = get_font("segoe", 15)
    draw.text((60, 535), "• Automatic MPE Band Determination: ±0.5e, ±1.0e, ±1.5e across Classes I, II, III, IIII", fill=(51, 65, 85, 255), font=f_clause)
    draw.text((60, 565), "• Expandable 'Why' Drawer traces every row to standard clauses (e.g. Clause A.4.4.1)", fill=(51, 65, 85, 255), font=f_clause)

    draw_rounded_rect(draw, (40, 620, w - 40, 855), 16, fill=(248, 250, 252, 255), outline=(226, 232, 240, 255), width=2)
    draw.text((60, 640), "3. Cryptographic Tamper-Evident Report Sealing", fill=(30, 41, 59, 255), font=f_sub)
    
    draw_rounded_rect(draw, (60, 690, 720, 825), 10, fill=(255, 255, 255, 255), outline=(226, 232, 240, 255), width=1)
    f_seal = get_font("segoe", 15, bold=True)
    draw.text((80, 710), "[SEAL] SHA-256 Digital Fingerprint Seal:", fill=(15, 23, 42, 255), font=f_seal)
    f_mono = get_font("consolas", 14)
    draw.text((80, 740), "9a8f4c1e8b23...d782b281 (Immutable Hash)", fill=(37, 99, 235, 255), font=f_mono)
    draw.text((80, 775), "• PDF/A-1b Archival Standard  • ISO/IEC 17025 §7.11 Compliant", fill=(71, 85, 105, 255), font=f_txt)
    
    draw_rounded_rect(draw, (750, 690, 940, 825), 10, fill=(238, 242, 255, 255), outline=(199, 210, 254, 255), width=1)
    draw.text((845, 730), "[ QR CODE ]", fill=(67, 56, 202, 255), font=f_eng, anchor="mm")
    draw.text((845, 775), "Public /verify/{id}\n<300ms Check", fill=(67, 56, 202, 255), font=f_txt, anchor="mm")

    img.save(r"C:\Users\utpal\.gemini\antigravity\scratch\tracer76-app\s2_solution_diagram.png")
    print("Generated s2_solution_diagram.png")

# =========================================================================
# GRAPHIC 2: Slide 3 - End-to-End Metrology Flowchart (2200 x 500)
# =========================================================================
def generate_s3_graphic():
    w, h = 2200, 480
    img = Image.new("RGBA", (w, h), (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)
    
    draw_rounded_rect(draw, (10, 10, w - 10, h - 10), 20, fill=(248, 250, 252, 255), outline=(203, 213, 225, 255), width=2)
    f_title = get_font("segoe", 24, bold=True)
    draw.text((40, 35), "END-TO-END AUTOMATED METROLOGY PIPELINE (FLOWCHART)", fill=(30, 58, 138, 255), font=f_title)
    
    stages = [
        ("STAGE 1: INGESTION", "Physical Balances\nWeb Serial RS-232 / USB\nor CSV / Excel Import", (239, 246, 255), (191, 219, 254), (29, 78, 216)),
        ("STAGE 2: DUAL ENGINE", "Parallel Math Verifiers\nTypeScript + Python WASM\nChangeover P = I + 0.5e - ΔL", (245, 243, 255), (221, 214, 254), (109, 40, 217)),
        ("STAGE 3: VERDICT MATRIX", "OIML R 76-1 Criteria\nMPE Band Verification\nExpandable 'Why' Drawer", (254, 243, 199), (252, 211, 77), (180, 83, 9)),
        ("STAGE 4: CLOUD PERSIST", "Supabase PostgreSQL 15\nRow-Level Security (RLS)\nAudit Log Hash Chaining", (236, 253, 245), (167, 243, 208), (4, 120, 87)),
        ("STAGE 5: SEAL & VERIFY", "Cryptographic SHA-256\nSealed PDF/A-1b Certificate\nPublic QR /verify/{id} Portal", (240, 253, 250), (153, 246, 228), (15, 118, 110)),
    ]
    
    card_w = 380
    card_h = 340
    start_x = 40
    y_pos = 95
    spacing = 425
    
    f_stg_hdr = get_font("segoe", 17, bold=True)
    f_stg_txt = get_font("segoe", 14)
    
    for idx, (title, desc, fill_bg, border_col, text_col) in enumerate(stages):
        x = start_x + idx * spacing
        draw_rounded_rect(draw, (x, y_pos, x + card_w, y_pos + card_h), 14, fill=fill_bg + (255,), outline=border_col + (255,), width=2)
        draw_rounded_rect(draw, (x + 15, y_pos + 15, x + card_w - 15, y_pos + 65), 8, fill=(255, 255, 255, 255), outline=border_col + (255,), width=1)
        draw.text((x + card_w // 2, y_pos + 40), title, fill=text_col + (255,), font=f_stg_hdr, anchor="mm")
        
        y_text = y_pos + 95
        for line in desc.split("\n"):
            draw.text((x + card_w // 2, y_text), line, fill=(51, 65, 85, 255), font=f_stg_txt, anchor="mm")
            y_text += 32
            
        if idx < len(stages) - 1:
            ax = x + card_w + 8
            ay = y_pos + card_h // 2
            draw.line([(ax, ay), (ax + 18, ay)], fill=(100, 116, 139, 255), width=4)
            draw.polygon([(ax + 18, ay - 9), (ax + 32, ay), (ax + 18, ay + 9)], fill=(100, 116, 139, 255))

    img.save(r"C:\Users\utpal\.gemini\antigravity\scratch\tracer76-app\s3_architecture_flowchart.png")
    print("Generated s3_architecture_flowchart.png")

# =========================================================================
# GRAPHIC 3: Slide 4 - Feasibility & Mitigation Matrix (1100 x 900)
# =========================================================================
def generate_s4_graphic():
    w, h = 1100, 900
    img = Image.new("RGBA", (w, h), (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)
    
    draw_rounded_rect(draw, (10, 10, w - 10, h - 10), 20, fill=(248, 250, 252, 255), outline=(203, 213, 225, 255), width=2)
    draw_rounded_rect(draw, (30, 30, w - 30, 110), 14, fill=(15, 118, 110, 255))
    f_hdr = get_font("segoe", 28, bold=True)
    draw.text((w // 2, 70), "FEASIBILITY & MITIGATION MATRIX", fill=(255, 255, 255, 255), font=f_hdr, anchor="mm")
    
    f_sub = get_font("segoe", 20, bold=True)
    f_txt = get_font("segoe", 15)
    f_val = get_font("segoe", 24, bold=True)
    
    pillars = [
        ("TECHNICAL", "100%", "Web Standard Stack\nChrome/Edge Web Serial\nZero desktop install", (239, 246, 255), (29, 78, 216)),
        ("REGULATORY", "OIML R 76", "OIML R 76-1:2006\nISO/IEC 17025 §7.11\nWELMEC 7.2 Guide", (245, 243, 255), (109, 40, 217)),
        ("ECONOMIC", "₹4.2 Lakh", "Annual Lab Savings\nZero license fees\n97% turnaround cut", (236, 253, 245), (4, 120, 87)),
    ]
    
    for i, (p_title, p_stat, p_desc, p_bg, p_col) in enumerate(pillars):
        px = 40 + i * 345
        draw_rounded_rect(draw, (px, 140, px + 330, 350), 14, fill=p_bg + (255,), outline=p_col + (255,), width=2)
        draw.text((px + 165, 175), p_title, fill=p_col + (255,), font=f_sub, anchor="mm")
        draw.text((px + 165, 225), p_stat, fill=p_col + (255,), font=f_val, anchor="mm")
        y_d = 270
        for l in p_desc.split("\n"):
            draw.text((px + 165, y_d), l, fill=(71, 85, 105, 255), font=f_txt, anchor="mm")
            y_d += 24

    draw_rounded_rect(draw, (40, 380, w - 40, 860), 16, fill=(255, 255, 255, 255), outline=(226, 232, 240, 255), width=2)
    draw.text((60, 405), "Identified Risks & Strategic Overcoming", fill=(30, 41, 59, 255), font=f_sub)
    
    rows = [
        ("Risk: Legacy Analog Scales", "Older balances lack digital ports", "Mitigation: Hybrid Manual Grid + Excel/CSV batch upload with auto column mapping."),
        ("Risk: Harsh Field Conditions", "Thermal drift, drafts, and vibration", "Mitigation: Real-time environmental logging (Temp/Humidity) + stability threshold filter."),
        ("Risk: Intermittent Internet", "Remote labs or field testing sites", "Mitigation: Offline-first IndexedDB buffer with auto-sync to Supabase upon reconnection."),
        ("Risk: Expired Standards", "Calibrated weights past expiry date", "Mitigation: Equipment Gate automatically locks test execution if weights/instruments expired."),
    ]
    
    y_row = 455
    for title, desc, mit in rows:
        draw_rounded_rect(draw, (60, y_row, w - 60, y_row + 88), 10, fill=(248, 250, 252, 255), outline=(226, 232, 240, 255), width=1)
        f_rtitle = get_font("segoe", 15, bold=True)
        draw.text((80, y_row + 20), title, fill=(220, 38, 38, 255), font=f_rtitle)
        draw.text((340, y_row + 20), desc, fill=(100, 116, 139, 255), font=f_txt)
        draw.text((80, y_row + 52), mit, fill=(5, 150, 105, 255), font=f_txt)
        y_row += 100

    img.save(r"C:\Users\utpal\.gemini\antigravity\scratch\tracer76-app\s4_feasibility_matrix.png")
    print("Generated s4_feasibility_matrix.png")

# =========================================================================
# GRAPHIC 4: Slide 5 - Impact & Metric Comparison Dashboard (1100 x 900)
# =========================================================================
def generate_s5_graphic():
    w, h = 1100, 900
    img = Image.new("RGBA", (w, h), (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)
    
    draw_rounded_rect(draw, (10, 10, w - 10, h - 10), 20, fill=(248, 250, 252, 255), outline=(203, 213, 225, 255), width=2)
    draw_rounded_rect(draw, (30, 30, w - 30, 110), 14, fill=(109, 40, 217, 255))
    f_hdr = get_font("segoe", 28, bold=True)
    draw.text((w // 2, 70), "QUANTIFIABLE METROLOGICAL IMPACT", fill=(255, 255, 255, 255), font=f_hdr, anchor="mm")
    
    metrics = [
        ("97% FASTER", "REPORT TURNAROUND", "From 4.5 Hours to < 8 Minutes", (239, 246, 255), (29, 78, 216)),
        ("0.0% ERROR", "CALCULATION ACCURACY", "18.4% Manual Error reduced to Zero", (236, 253, 245), (4, 120, 87)),
        ("100% PAPERLESS", "DIGITAL COMPLIANCE", "End-to-End Cryptographic Audit Trail", (254, 243, 199), (180, 83, 9)),
        ("< 300 ms", "PUBLIC VERIFICATION", "Instant QR Scan & SHA-256 Check", (245, 243, 255), (109, 40, 217)),
    ]
    
    f_m_num = get_font("segoe", 32, bold=True)
    f_m_lbl = get_font("segoe", 15, bold=True)
    f_m_sub = get_font("segoe", 14)
    
    positions = [(40, 135), (560, 135), (40, 355), (560, 355)]
    for (m_num, m_lbl, m_sub, m_bg, m_col), (mx, my) in zip(metrics, positions):
        draw_rounded_rect(draw, (mx, my, mx + 500, my + 195), 14, fill=m_bg + (255,), outline=m_col + (255,), width=2)
        draw.text((mx + 250, my + 50), m_num, fill=m_col + (255,), font=f_m_num, anchor="mm")
        draw.text((mx + 250, my + 105), m_lbl, fill=(15, 23, 42, 255), font=f_m_lbl, anchor="mm")
        draw.text((mx + 250, my + 145), m_sub, fill=(71, 85, 105, 255), font=f_m_sub, anchor="mm")
        
    draw_rounded_rect(draw, (40, 580, w - 40, 860), 16, fill=(255, 255, 255, 255), outline=(226, 232, 240, 255), width=2)
    f_sub = get_font("segoe", 20, bold=True)
    draw.text((60, 605), "Legacy System vs TraceR76 Comparison", fill=(30, 41, 59, 255), font=f_sub)
    
    f_tbl_hdr = get_font("segoe", 15, bold=True)
    f_tbl_txt = get_font("segoe", 14)
    
    draw_rounded_rect(draw, (60, 645, w - 60, 690), 8, fill=(241, 245, 249, 255))
    draw.text((80, 667), "PARAMETER", fill=(71, 85, 105, 255), font=f_tbl_hdr, anchor="lm")
    draw.text((420, 667), "TRADITIONAL SPREADSHEET / PAPER", fill=(220, 38, 38, 255), font=f_tbl_hdr, anchor="lm")
    draw.text((760, 667), "TRACER76 PLATFORM", fill=(4, 120, 87, 255), font=f_tbl_hdr, anchor="lm")
    
    comp_rows = [
        ("Data Capture", "Manual handwriting & re-typing", "Direct Web Serial RS-232 / CSV Stream"),
        ("Math Engine", "Single Excel formula (prone to edits)", "Dual-Engine Deterministic Verification"),
        ("Certificates", "Physical paper stamps / easy fraud", "SHA-256 Tamper-Proof + Public QR Verify"),
        ("Audit Defense", "Days retrieving physical archives", "Instant 1-Click ISO 17025 Pack"),
    ]
    
    y_cr = 705
    for p, leg, tra in comp_rows:
        draw.text((80, y_cr), p, fill=(15, 23, 42, 255), font=f_tbl_hdr, anchor="lm")
        draw.text((420, y_cr), "[Legacy] " + leg, fill=(100, 116, 139, 255), font=f_tbl_txt, anchor="lm")
        draw.text((760, y_cr), "[TraceR76] " + tra, fill=(4, 120, 87, 255), font=f_tbl_txt, anchor="lm")
        y_cr += 36

    img.save(r"C:\Users\utpal\.gemini\antigravity\scratch\tracer76-app\s5_impact_metrics.png")
    print("Generated s5_impact_metrics.png")

# =========================================================================
# GRAPHIC 5: Slide 6 - Regulatory Standards & Validation Pack (1100 x 900)
# =========================================================================
def generate_s6_graphic():
    w, h = 1100, 900
    img = Image.new("RGBA", (w, h), (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)
    
    draw_rounded_rect(draw, (10, 10, w - 10, h - 10), 20, fill=(248, 250, 252, 255), outline=(203, 213, 225, 255), width=2)
    draw_rounded_rect(draw, (30, 30, w - 30, 110), 14, fill=(30, 58, 138, 255))
    f_hdr = get_font("segoe", 28, bold=True)
    draw.text((w // 2, 70), "STANDARDS COMPLIANCE & VALIDATION", fill=(255, 255, 255, 255), font=f_hdr, anchor="mm")
    
    f_sub = get_font("segoe", 20, bold=True)
    f_txt = get_font("segoe", 15)
    f_std_hdr = get_font("segoe", 17, bold=True)
    
    # Standards Badges
    stds = [
        ("OIML R 76-1:2006", "Metrological & Technical Requirements", "Clauses 3.5, 3.6, A.4.4.1 (Changeover & MPE)", (239, 246, 255), (29, 78, 216)),
        ("OIML R 76-2:2007", "Pattern Evaluation Test Report Format", "Official international test sequence layout", (245, 243, 255), (109, 40, 217)),
        ("ISO/IEC 17025:2017", "Testing & Calibration Laboratories", "§7.11 Control of data & software validation", (236, 253, 245), (4, 120, 87)),
        ("WELMEC Guide 7.2", "Software Measurement Directives", "Risk Class D verification & separation of duties", (254, 243, 199), (180, 83, 9)),
    ]
    
    y_std = 135
    for s_code, s_desc, s_clause, s_bg, s_col in stds:
        draw_rounded_rect(draw, (40, y_std, w - 40, y_std + 105), 12, fill=s_bg + (255,), outline=s_col + (255,), width=2)
        draw.text((65, y_std + 28), s_code, fill=s_col + (255,), font=f_std_hdr)
        draw.text((320, y_std + 28), s_desc, fill=(15, 23, 42, 255), font=f_std_hdr)
        draw.text((65, y_std + 65), "• " + s_clause, fill=(71, 85, 105, 255), font=f_txt)
        y_std += 125

    # Verification Pack Summary Box
    draw_rounded_rect(draw, (40, 650, w - 40, 860), 16, fill=(255, 255, 255, 255), outline=(226, 232, 240, 255), width=2)
    draw.text((60, 675), "Pre-Validated Execution Suite Summary", fill=(30, 41, 59, 255), font=f_sub)
    
    draw_rounded_rect(draw, (60, 715, 480, 830), 10, fill=(236, 253, 245, 255), outline=(167, 243, 208, 255), width=1)
    f_stat_num = get_font("segoe", 26, bold=True)
    draw.text((270, 745), "312 / 312 VECTORS", fill=(4, 120, 87, 255), font=f_stat_num, anchor="mm")
    draw.text((270, 790), "100% Deterministic Math Passed", fill=(5, 150, 105, 255), font=f_txt, anchor="mm")
    
    draw_rounded_rect(draw, (510, 715, 930, 830), 10, fill=(239, 246, 255, 255), outline=(191, 219, 254, 255), width=1)
    draw.text((720, 745), "LIVE DEMO READY", fill=(29, 78, 216, 255), font=f_stat_num, anchor="mm")
    draw.text((720, 790), "http://localhost:3000 Active", fill=(37, 99, 235, 255), font=f_txt, anchor="mm")

    img.save(r"C:\Users\utpal\.gemini\antigravity\scratch\tracer76-app\s6_standards_badge.png")
    print("Generated s6_standards_badge.png")

if __name__ == "__main__":
    generate_s2_graphic()
    generate_s3_graphic()
    generate_s4_graphic()
    generate_s5_graphic()
    generate_s6_graphic()
