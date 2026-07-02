const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");

// ── Word Counter ──────────────────────────────────────────────────────────────
exports.wordCounter = (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ success: false, message: "No text provided" });
  const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  const chars = text.length;
  const charsNoSpace = text.replace(/\s/g, "").length;
  const sentences = (text.match(/[^.!?]*[.!?]+/g) || []).length || (text.trim() ? 1 : 0);
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim()).length;
  const readingTime = Math.max(1, Math.ceil(words / 200));
  res.json({ success: true, data: { words, chars, charsNoSpace, sentences, paragraphs, readingTime } });
};

// ── Case Converter ────────────────────────────────────────────────────────────
exports.caseConverter = (req, res) => {
  const { text, mode } = req.body;
  if (!text) return res.status(400).json({ success: false, message: "No text provided" });
  const modes = {
    uppercase: text.toUpperCase(),
    lowercase: text.toLowerCase(),
    titlecase: text.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()),
    sentencecase: text.replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase()),
    camelcase: text.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()),
    snakecase: text.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, ""),
    kebabcase: text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
    alternating: text.split("").map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join(""),
  };
  const result = modes[mode] ?? text;
  res.json({ success: true, data: { result } });
};

// ── Password Generator ────────────────────────────────────────────────────────
exports.passwordGenerator = (req, res) => {
  const { length = 16, uppercase = true, lowercase = true, numbers = true, symbols = true, count = 1 } = req.body;
  const sets = [];
  if (uppercase) sets.push("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
  if (lowercase) sets.push("abcdefghijklmnopqrstuvwxyz");
  if (numbers) sets.push("0123456789");
  if (symbols) sets.push("!@#$%^&*()_+-=[]{}|;:,.<>?");
  if (!sets.length) return res.status(400).json({ success: false, message: "Select at least one character set" });

  const charset = sets.join("");
  const passwords = [];
  const safeCount = Math.min(Math.max(1, count), 20);
  const safeLen = Math.min(Math.max(4, length), 128);

  for (let i = 0; i < safeCount; i++) {
    let pwd = "";
    // Guarantee at least one char from each selected set
    for (const set of sets) pwd += set[crypto.randomInt(set.length)];
    // Fill the rest randomly
    while (pwd.length < safeLen) pwd += charset[crypto.randomInt(charset.length)];
    // Shuffle
    pwd = pwd.split("").sort(() => crypto.randomInt(3) - 1).join("");
    passwords.push(pwd);
  }

  // Strength score
  let strength = 0;
  if (safeLen >= 8) strength++;
  if (safeLen >= 12) strength++;
  if (safeLen >= 16) strength++;
  if (uppercase && lowercase) strength++;
  if (numbers) strength++;
  if (symbols) strength++;
  const strengthLabel = strength <= 2 ? "Weak" : strength <= 4 ? "Fair" : strength <= 5 ? "Strong" : "Very Strong";

  res.json({ success: true, data: { passwords, strength: strengthLabel, strengthScore: strength } });
};

// ── Hash Generator ────────────────────────────────────────────────────────────
exports.hashGenerator = (req, res) => {
  const { text, algorithm = "sha256" } = req.body;
  if (!text) return res.status(400).json({ success: false, message: "No text provided" });
  const supported = ["md5", "sha1", "sha256", "sha512", "sha3-256", "sha3-512"];
  if (!supported.includes(algorithm.toLowerCase()))
    return res.status(400).json({ success: false, message: `Unsupported algorithm. Use: ${supported.join(", ")}` });
  try {
    const hash = crypto.createHash(algorithm.toLowerCase()).update(text).digest("hex");
    res.json({ success: true, data: { hash, algorithm: algorithm.toLowerCase(), inputLength: text.length } });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

// ── UUID Generator ─────────────────────────────────────────────────────────────
exports.uuidGenerator = (req, res) => {
  const { count = 5, version = "v4" } = req.body;
  const safeCount = Math.min(Math.max(1, count), 50);
  const uuids = Array.from({ length: safeCount }, () => uuidv4());
  res.json({ success: true, data: { uuids, version, count: safeCount } });
};

// ── Base64 Encode/Decode ──────────────────────────────────────────────────────
exports.base64 = (req, res) => {
  const { text, mode = "encode" } = req.body;
  if (!text) return res.status(400).json({ success: false, message: "No text provided" });
  try {
    const result = mode === "encode"
      ? Buffer.from(text, "utf8").toString("base64")
      : Buffer.from(text, "base64").toString("utf8");
    res.json({ success: true, data: { result, mode } });
  } catch (e) {
    res.status(400).json({ success: false, message: "Invalid base64 input" });
  }
};

// ── JSON Formatter ────────────────────────────────────────────────────────────
exports.jsonFormatter = (req, res) => {
  const { text, indent = 2, mode = "format" } = req.body;
  if (!text) return res.status(400).json({ success: false, message: "No JSON provided" });
  try {
    const parsed = JSON.parse(text);
    const result = mode === "minify"
      ? JSON.stringify(parsed)
      : JSON.stringify(parsed, null, indent);
    const keys = JSON.stringify(parsed).match(/"[^"]+"\s*:/g)?.length || 0;
    res.json({ success: true, data: { result, valid: true, keys, mode } });
  } catch (e) {
    res.status(400).json({ success: false, message: "Invalid JSON: " + e.message });
  }
};

// ── JWT Decoder ───────────────────────────────────────────────────────────────
exports.jwtDecoder = (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ success: false, message: "No token provided" });
  try {
    const parts = token.trim().split(".");
    if (parts.length !== 3) return res.status(400).json({ success: false, message: "Not a valid JWT (must have 3 parts)" });
    const header = JSON.parse(Buffer.from(parts[0], "base64url").toString());
    const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString());
    const now = Math.floor(Date.now() / 1000);
    const expired = payload.exp ? payload.exp < now : null;
    const expiresIn = payload.exp ? payload.exp - now : null;
    res.json({ success: true, data: { header, payload, expired, expiresIn, signature: parts[2] } });
  } catch (e) {
    res.status(400).json({ success: false, message: "Could not decode JWT: " + e.message });
  }
};

// ── Text Compare (Diff) ────────────────────────────────────────────────────────
exports.textCompare = (req, res) => {
  const { text1, text2 } = req.body;
  if (!text1 || !text2) return res.status(400).json({ success: false, message: "Both texts required" });
  const lines1 = text1.split("\n");
  const lines2 = text2.split("\n");
  const diff = [];
  const maxLen = Math.max(lines1.length, lines2.length);
  let added = 0, removed = 0, unchanged = 0;
  for (let i = 0; i < maxLen; i++) {
    const l1 = lines1[i];
    const l2 = lines2[i];
    if (l1 === undefined) { diff.push({ type: "added", text: l2, line: i + 1 }); added++; }
    else if (l2 === undefined) { diff.push({ type: "removed", text: l1, line: i + 1 }); removed++; }
    else if (l1 === l2) { diff.push({ type: "unchanged", text: l1, line: i + 1 }); unchanged++; }
    else { diff.push({ type: "removed", text: l1, line: i + 1 }, { type: "added", text: l2, line: i + 1 }); removed++; added++; }
  }
  res.json({ success: true, data: { diff, stats: { added, removed, unchanged, identical: added === 0 && removed === 0 } } });
};

// ── EMI Calculator ────────────────────────────────────────────────────────────
exports.emiCalculator = (req, res) => {
  const { principal, rate, tenure } = req.body;
  if (!principal || !rate || !tenure) return res.status(400).json({ success: false, message: "principal, rate and tenure are required" });
  const P = parseFloat(principal);
  const R = parseFloat(rate) / 12 / 100;
  const N = parseInt(tenure);
  if (isNaN(P) || isNaN(R) || isNaN(N) || P <= 0 || R <= 0 || N <= 0)
    return res.status(400).json({ success: false, message: "Invalid values" });
  const emi = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
  const totalPayment = emi * N;
  const totalInterest = totalPayment - P;
  // Build amortization schedule (first 12 months)
  const schedule = [];
  let balance = P;
  for (let i = 1; i <= Math.min(N, 12); i++) {
    const interest = balance * R;
    const principal_ = emi - interest;
    balance -= principal_;
    schedule.push({ month: i, emi: +emi.toFixed(2), principal: +principal_.toFixed(2), interest: +interest.toFixed(2), balance: +Math.max(0, balance).toFixed(2) });
  }
  res.json({ success: true, data: { emi: +emi.toFixed(2), totalPayment: +totalPayment.toFixed(2), totalInterest: +totalInterest.toFixed(2), schedule } });
};

// ── Currency Converter ────────────────────────────────────────────────────────
exports.currencyConverter = async (req, res) => {
  const { amount, from, to } = req.body;
  if (!amount || !from || !to) return res.status(400).json({ success: false, message: "amount, from, and to are required" });
  // Static rates (USD base) — updated periodically
  const RATES = {
    USD:1, EUR:0.92, GBP:0.79, JPY:157.2, INR:83.4, NPR:133.4, AUD:1.53,
    CAD:1.36, CHF:0.90, CNY:7.24, KRW:1345, SGD:1.35, MYR:4.71, THB:36.1,
    AED:3.67, SAR:3.75, BRL:5.05, MXN:17.2, ZAR:18.5, SEK:10.6, NOK:10.7,
    DKK:6.88, NZD:1.62, HKD:7.82, PLN:3.96, CZK:22.9, HUF:362, PHP:58.2,
    IDR:15900, PKR:278, BDT:110, LKR:300, EGP:30.9, NGN:1450, KES:130,
    GHS:15.6, TZS:2530, UGX:3750, ETB:56.8, MAD:10.0, TND:3.12,
  };
  const fromUpper = from.toUpperCase();
  const toUpper = to.toUpperCase();
  if (!RATES[fromUpper]) return res.status(400).json({ success: false, message: `Unsupported currency: ${from}` });
  if (!RATES[toUpper]) return res.status(400).json({ success: false, message: `Unsupported currency: ${to}` });
  const inUSD = parseFloat(amount) / RATES[fromUpper];
  const result = inUSD * RATES[toUpper];
  const rate = RATES[toUpper] / RATES[fromUpper];
  res.json({ success: true, data: { from: fromUpper, to: toUpper, amount: parseFloat(amount), result: +result.toFixed(4), rate: +rate.toFixed(6), note: "Rates are indicative. For live rates use a forex API." } });
};

// ── QR Code Generator ─────────────────────────────────────────────────────────
exports.qrGenerator = (req, res) => {
  const { text, size = 200 } = req.body;
  if (!text) return res.status(400).json({ success: false, message: "No text provided" });
  const safeSize = Math.min(Math.max(100, size), 1000);
  const encoded = encodeURIComponent(text);
  // Use Google Charts API (free, no key needed)
  const url = `https://chart.googleapis.com/chart?chs=${safeSize}x${safeSize}&cht=qr&chl=${encoded}&choe=UTF-8`;
  res.json({ success: true, data: { url, text, size: safeSize } });
};

// ── Slug Generator ────────────────────────────────────────────────────────────
exports.slugGenerator = (req, res) => {
  const { text, separator = "-" } = req.body;
  if (!text) return res.status(400).json({ success: false, message: "No text provided" });
  const sep = separator === "_" ? "_" : "-";
  const slug = text
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, sep)
    .replace(new RegExp(`${sep}+`, "g"), sep);
  res.json({ success: true, data: { slug, original: text } });
};

// ── URL Encoder/Decoder ───────────────────────────────────────────────────────
exports.urlEncoderDecoder = (req, res) => {
  const { text, mode = "encode" } = req.body;
  if (!text) return res.status(400).json({ success: false, message: "No text provided" });
  try {
    const result = mode === "encode" ? encodeURIComponent(text) : decodeURIComponent(text);
    res.json({ success: true, data: { result, mode } });
  } catch (e) {
    res.status(400).json({ success: false, message: "Invalid input for decoding" });
  }
};

// ── Lorem Ipsum Generator ─────────────────────────────────────────────────────
exports.loremIpsum = (req, res) => {
  const { paragraphs = 3, type = "paragraphs" } = req.body;
  const words = ["lorem","ipsum","dolor","sit","amet","consectetur","adipiscing","elit","sed","do","eiusmod","tempor","incididunt","ut","labore","et","dolore","magna","aliqua","enim","ad","minim","veniam","quis","nostrud","exercitation","ullamco","laboris","nisi","aliquip","ex","ea","commodo","consequat","duis","aute","irure","in","reprehenderit","voluptate","velit","esse","cillum","fugiat","nulla","pariatur","excepteur","sint","occaecat","cupidatat","non","proident","sunt","culpa","qui","officia","deserunt","mollit","anim","est","laborum"];
  const sentence = () => {
    const len = 8 + Math.floor(Math.random() * 10);
    const s = Array.from({ length: len }, () => words[Math.floor(Math.random() * words.length)]).join(" ");
    return s.charAt(0).toUpperCase() + s.slice(1) + ".";
  };
  const paragraph = () => Array.from({ length: 4 + Math.floor(Math.random() * 4) }, sentence).join(" ");
  const safe = Math.min(Math.max(1, paragraphs), 20);
  const result = Array.from({ length: safe }, paragraph).join("\n\n");
  res.json({ success: true, data: { result, paragraphs: safe } });
};

// ── GPA Calculator ─────────────────────────────────────────────────────────────
exports.gpaCalculator = (req, res) => {
  const { courses } = req.body; // [{name, credits, grade}]
  if (!courses || !Array.isArray(courses) || courses.length === 0)
    return res.status(400).json({ success: false, message: "Provide courses array with name, credits, grade" });
  const GRADE_POINTS = { "A+":4.0,"A":4.0,"A-":3.7,"B+":3.3,"B":3.0,"B-":2.7,"C+":2.3,"C":2.0,"C-":1.7,"D+":1.3,"D":1.0,"D-":0.7,"F":0.0 };
  let totalPoints = 0, totalCredits = 0;
  const processed = courses.map((c) => {
    const grade = (c.grade || "").toUpperCase();
    const points = GRADE_POINTS[grade] ?? null;
    const credits = parseFloat(c.credits) || 0;
    if (points !== null) { totalPoints += points * credits; totalCredits += credits; }
    return { name: c.name, credits, grade, points };
  });
  const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
  res.json({ success: true, data: { gpa: +gpa.toFixed(2), totalCredits, courses: processed } });
};
