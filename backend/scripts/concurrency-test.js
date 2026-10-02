import fs from "fs";

const API = "http://localhost:5000";
const COMP_ID = process.argv[2];

if (!COMP_ID) {
  console.error("Usage: node scripts/concurrency-test.js <COMPETITION_ID>");
  process.exit(1);
}

const tokens = JSON.parse(fs.readFileSync("./scripts/tokens.json", "utf8"));

async function fireRequest(token) {
  const res = await fetch(`${API}/api/competitions/${COMP_ID}/register`, {
    method: "POST",
    headers: { Cookie: `token=${token}` },
  });

  let body;
  try {
    body = await res.json();
  } catch {
    body = await res.text();
  }
  return { status: res.status, body };
}

async function main() {
  console.log(
    `Firing ${tokens.length} parallel requests at competition ${COMP_ID}...`,
  );
  console.log(
    `Competition has 20 slots. Expect 20 successes, ${tokens.length - 20} rejections.\n`,
  );

  const start = Date.now();
  const results = await Promise.all(tokens.map(fireRequest));
  const elapsed = Date.now() - start;

  const counts = results.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {});

  console.log("Status counts:", counts);
  console.log(`Total time: ${elapsed}ms\n`);

  // Fetch competition to see final bookedSlots
  const compRes = await fetch(`${API}/api/competitions/${COMP_ID}`);
  const text = await compRes.text();

  if (!text.startsWith("{")) {
    console.error("❌ GET route returned non-JSON. Status:", compRes.status);
    console.error("Response starts with:", text.slice(0, 80));
    console.error(
      "→ Check that GET /api/competitions/:id is mounted in your routes",
    );
    return;
  }

  const comp = JSON.parse(text);
  const { bookedSlots, totalSlot } = comp.competition;

  console.log(`Final bookedSlots: ${bookedSlots} / ${totalSlot}\n`);

  if (bookedSlots === totalSlot && counts[200] === totalSlot) {
    console.log("✅ NO OVERSELING — atomic booking works.");
  } else {
    console.log("❌ UNEXPECTED STATE");
    console.log(`   Expected bookedSlots=${totalSlot}, got ${bookedSlots}`);
    console.log(`   Expected 200s=${totalSlot}, got ${counts[200] || 0}`);
    console.log(`   Full results:`, counts);
  }
}

main().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
