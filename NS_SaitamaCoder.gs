/**
 * NETWORK SCHOOL CALENDAR SETUP
 * ==============================
 * April 3 – April 28, 2026 | GMT+8 (Asia/Kuala_Lumpur)
 * Pool hours: 7:00 AM – 9:00 PM
 *
 * HOW TO USE — run these 5 functions ONE BY ONE in order,
 * waiting for "Execution completed" before running the next:
 *
 *   Step 1: setup  → clears April + creates Apr 3–5
 *   Step 2: week2  → Apr 6–12
 *   Step 3: week3  → Apr 13–19
 *   Step 4: week4  → Apr 20–26
 *   Step 5: week5  → Apr 27–28
 *
 * Each step takes ~1–2 min. Safe to re-run — setup() clears April first.
 */

var DELAY_EVT  = 200;
var DELAY_DAY  = 500;
var DELAY_DEL  = 100;
var BATCH_N    = 25;
var BATCH_WAIT = 3000;

// ─────────────────────────────────────────────────────────────────────────────
// ENTRY POINTS
// ─────────────────────────────────────────────────────────────────────────────

function setup() {
  var cal = CalendarApp.getDefaultCalendar();
  var existing = cal.getEvents(new Date(2026,3,1), new Date(2026,3,30,23,59,59));
  Logger.log("Deleting " + existing.length + " April events...");
  for (var i = 0; i < existing.length; i++) {
    existing[i].deleteEvent();
    Utilities.sleep(DELAY_DEL);
    if ((i+1) % BATCH_N === 0) Utilities.sleep(BATCH_WAIT);
  }
  Logger.log("Cleared. Creating Apr 3–5...");
  Utilities.sleep(2000);
  buildDays(cal, 3, 5);
  Logger.log("✅ Step 1 done. Now run week2().");
}

function week2() {
  buildDays(CalendarApp.getDefaultCalendar(), 6, 12);
  Logger.log("✅ Step 2 done. Now run week3().");
}

function week3() {
  buildDays(CalendarApp.getDefaultCalendar(), 13, 19);
  Logger.log("✅ Step 3 done. Now run week4().");
}

function week4() {
  buildDays(CalendarApp.getDefaultCalendar(), 20, 26);
  Logger.log("✅ Step 4 done. Now run week5().");
}

function week5() {
  buildDays(CalendarApp.getDefaultCalendar(), 27, 28);
  Logger.log("✅ ALL DONE! Open Google Calendar to see your NS schedule.");
}

// ─────────────────────────────────────────────────────────────────────────────
// CORE BUILDER
// ─────────────────────────────────────────────────────────────────────────────

function buildDays(cal, startDay, endDay) {
  var totalCreated = 0;
  for (var d = startDay; d <= endDay; d++) {
    var date   = new Date(2026, 3, d);
    var dow    = date.getDay();
    var dayNum = d - 2;
    var week   = Math.ceil(dayNum / 7);

    Logger.log("Day " + dayNum + ": " + fmtDate(date));

    var events;
    if      (dow >= 1 && dow <= 4) events = weekdayEvents(date, week, dayNum);
    else if (dow === 5)            events = fridayEvents(date, week, dayNum);
    else if (dow === 6)            events = saturdayEvents();
    else                           events = sundayEvents(week);

    for (var i = 0; i < events.length; i++) {
      var e     = events[i];
      var start = parseTime(date, e[1]);
      var end   = parseTime(date, e[2]);
      if (end <= start) end.setDate(end.getDate() + 1);

      var desc = e[4] ? "[" + e[4] + "]\n\n" + e[3] : e[3];
      cal.createEvent(e[0], start, end, { description: desc });
      totalCreated++;
      Utilities.sleep(DELAY_EVT);
      if (totalCreated % BATCH_N === 0) {
        Logger.log("  " + totalCreated + " events — pausing...");
        Utilities.sleep(BATCH_WAIT);
      }
    }
    Utilities.sleep(DELAY_DAY);
  }
  Logger.log("Created " + totalCreated + " events for Apr " + startDay + "–" + endDay);
}

// ─────────────────────────────────────────────────────────────────────────────
// EVENT LISTS
// Pool open 7:00am–9:00pm — swim starts at 7:00am
//
// Revised morning order (weekday):
//   6:00  Wake up + journal
//   6:30  Shower + get ready
//   7:00  Morning swim (pool opens)
//   7:30  Steam room
//   7:45  X GM post
//   8:00  Breakfast
//   8:45  Library read
//   9:15  Deep work block 1 …
// ─────────────────────────────────────────────────────────────────────────────

function weekdayEvents(date, week, dayNum) {
  var s   = sprint(week);
  var dow = date.getDay();
  var evs = [
    ["🌅 Wake up + Journal",              "6:00",  "6:30",  "Write 3 intentions for today. No phone for first 10 min.\nLook at the view — let it anchor you.\nWeek " + week + " sprint: " + s,                                                               "🔵 Reflect"],
    ["🚿 Shower + Get Ready",             "6:30",  "7:00",  "Get ready before heading to the pool.",                                                                                                                                                            ""],
    ["🏊 Morning Swim",                   "7:00",  "7:30",  "30 min lap swimming. Moving meditation — no music, just breathe.\nPool opens at 7am — you're first in.",                                                                                          "🟣 Pool"],
    ["♨️ Steam Room Recovery",            "7:30",  "7:45",  "15 min post-swim recovery. Think through today's biggest technical problem. No phone.",                                                                                                            "🟣 Steam Room"],
    ["𝕏 GM Post on X",                   "7:45",  "8:00",  "Photo of the pool or morning view. Tag @NetworkSchool.\nTemplate: 'gm from NS 🌅 Today I'm working on: [task]. Day " + dayNum + " of building in public 🛠️'",                                    "🟡 X/Social"],
    ["🍳 Breakfast — Sit with Strangers", "8:00",  "8:45",  "New table every day. No phone at the table.\nAsk: 'What's the hardest part of what you're building right now?'",                                                                                   "⚫ Food"],
    ["📚 Library — Morning Read",         "8:45",  "9:15",  "30 min. Crypto UX, hardware product, or founder memoir. 3 handwritten notes max.",                                                                                                               "🟣 Library"],
    ["💻 Deep Work Block 1",              "9:15",  "11:45", "2.5 hrs — hardest task first. Phone on airplane mode.\nSprint: " + s,                                                                                                                             "🔴 Build"],
    ["𝕏 Mid-Day Build Update",            "11:45", "12:00", "Tweet a progress snippet: code, diagram, or problem solved.\nExample: 'Just got SNS domain resolution working on-watch 🧪'",                                                                      "🟡 X/Social"],
    ["☕ Coffee Chat #1",                 "12:00", "12:30", "Pre-booked 1:1. Lead with curiosity: 20 min them, 10 min you.\nEnd with: 'Who else here should I talk to?'",                                                                                       "🟠 Network"],
    ["🍜 Lunch",                          "12:30", "13:15", "Sit with at least one new person. No laptop.",                                                                                                                                                      "⚫ Food"],
    ["💻 Deep Work Block 2",              "13:15", "15:15", "2 hrs — testing, debugging, writing, designing.\nSprint: " + s,                                                                                                                                    "🔴 Build"],
    ["🏓 Ping Pong / Chess Break",        "15:15", "15:45", "Best informal networking tool at NS. Challenge someone new every single day.",                                                                                                                    "🟣 Ping Pong"],
    ["💻 Deep Work Block 3",              "15:45", "17:15", "1.5 hrs — wrap up today's task. Write commit notes.\nLeave next step written so tomorrow you know where to start.",                                                                                "🔴 Build"],
    ["🏋️ Gym",                            "17:15", "18:00", gymNote(dow),                                                                                                                                                                                       "🟣 Gym"],
    ["𝕏 Engage + Reply on X",             "18:00", "18:15", "15 min MAX — set a timer. Reply to 3 posts in Solana/SNS/Web3 with actual insight. No doom-scrolling.",                                                                                           "🟡 X/Social"],
    ["☕ Coffee Chat #2 / Bar Social",    "18:15", "19:00", "Informal — walk with someone or sit at the bar. No agenda.",                                                                                                                                       "🟠 Network"],
    ["🍽️ Dinner",                         "19:00", "20:00", dow === 4 ? "HOST group dinner tonight! Tell your project story.\nInvite 4–6 people from different backgrounds." : "Float — join whoever's around. Sit with someone new.",                         "⚫ Food"],
    ["🎹 Piano Practice",                 "20:00", "20:20", "Learn one song the whole month. 20 min/day. By Week 4 play it at the bar.",                                                                                                                        "🟣 Piano"],
    ["📓 Wind-Down Journal",              "21:00", "21:15", "3 wins today. 1 thing to improve. 1 person to follow up. Next day's #1 priority. Then close the laptop.",                                                                                         "🔵 Reflect"],
    ["📖 Read / Decompress",              "21:15", "22:00", "Library book, not screens. Or sit on the balcony. Let your brain consolidate the day.",                                                                                                           "⚫ Rest"],
    ["😴 Sleep",                          "22:00", "6:00",  "8 hours. Non-negotiable.",                                                                                                                                                                         "⚫ Rest"]
  ];

  // Insert evening thread on Mon (1) and Wed (3) after piano
  if (dow === 1 || dow === 3) {
    evs.splice(19, 0, ["𝕏 Evening Build Thread", "20:20", "20:45",
      "'Day " + dayNum + " of building a Solana smartwatch at Network School 🧵'\nWhat you learned, what broke, what surprised you.", "🟡 X/Social"]);
  }
  return evs;
}

function fridayEvents(date, week, dayNum) {
  var s = sprint(week);
  return [
    ["🌅 Wake up — What Ships Today?",   "6:00",  "6:30",  "Write exactly what you'll demo by end of day. This is your Friday commitment.",                                                                                                                    "🔵 Reflect"],
    ["🚿 Shower + Get Ready",            "6:30",  "7:00",  "Get ready before heading to the pool.",                                                                                                                                                             ""],
    ["🏊 Morning Swim — Longer",          "7:00",  "7:40",  "40 min — celebrate the week with your body. Pool opens at 7am, you're first in.",                                                                                                                  "🟣 Pool"],
    ["♨️ Steam Room",                     "7:40",  "8:00",  "20 min — think through what you're shipping today.",                                                                                                                                               "🟣 Steam Room"],
    ["𝕏 Ship It Friday Post",             "8:00",  "8:15",  "'It's Friday. Here's what I'm shipping today: [one thing]. Check back tonight.'",                                                                                                                 "🟡 X/Social"],
    ["🍳 Breakfast",                      "8:15",  "9:00",  "Fuel up for the sprint.",                                                                                                                                                                          "⚫ Food"],
    ["🚀 Sprint — Ship Block 1",          "9:00",  "11:30", "2.5 hrs — FINAL PUSH. No new scope. Fix, polish, demo-ready only.\nGoal: " + s,                                                                                                                   "🔴 Build"],
    ["🚀 Sprint — Ship Block 2",          "11:30", "13:15", "1.5 hrs — record Loom / screen capture. Push to GitHub. Done when shareable.",                                                                                                                    "🔴 Build"],
    ["𝕏 SHIP POST + Demo Video",          "13:15", "13:45", "Most important post of the week!\n'Shipped Week " + week + " at @NetworkSchool'\nAttach demo. Tag SNS + Solana ecosystem. Ask for feedback.",                                                      "🟡 X/Social"],
    ["🍜 Lunch — Celebrate, No Laptop",   "13:45", "14:30", "You shipped. Enjoy. No work talk.",                                                                                                                                                                "⚫ Food"],
    ["🤝 Free Afternoon — Networking",    "14:30", "16:00", "No agenda. Wander. Ping pong. Sit by the pool. Unexpected collaborations happen here.",                                                                                                            "🟠 Network"],
    ["🏋️ Gym — Mobility Session",         "16:00", "16:45", "Full body, mobility focused. Stretch. You've earned it.",                                                                                                                                         "🟣 Gym"],
    ["📓 Weekly Review",                  "17:00", "17:45", "In the library or with the view.\n✅ What did I ship? 👥 Who did I meet? 🎯 Next week sprint?\nWrite in your journal.",                                                                           "🔵 Reflect"],
    ["𝕏 Weekly Recap Thread",             "17:45", "18:15", "'Week " + week + " at Network School — a thread'\n1/ What I shipped\n2/ Most unexpected problem\n3/ Best resident conversation\n4/ One Web3 lesson\n5/ Next week goal",                            "🟡 X/Social"],
    ["🍽️ Pre-Social Dinner",              "18:30", "19:30", "Eat well. Get ready for the night.",                                                                                                                                                               "⚫ Food"],
    ["🎤 Bar / Karaoke Night",            "19:30", "22:00", "Fully present. No pitching unless asked.\nOpener: 'I'm building a Solana smartwatch — completely stupid idea, right?'\nSit at the bar counter so you can talk to anyone.",                         "🟣 Bar + Karaoke"],
    ["😴 Wind Down + Sleep",              "22:00", "7:00",  "Slow morning tomorrow. You've earned it.",                                                                                                                                                         "⚫ Rest"]
  ];
}

function saturdayEvents() {
  return [
    ["😴 Slow Wake — No Alarm",           "7:00",  "7:30",  "Let your body decide. Brain is still processing the week.",                                                    "⚫ Rest"],
    ["🏊 Leisure Swim",                   "7:30",  "8:15",  "45 min — leisure, not exercise. Float. Look at the sky. Pool just opened.",                                    "🟣 Pool"],
    ["♨️ Steam Room — Full Relax",        "8:15",  "8:40",  "25 min. Bring nothing. Think about everything or nothing.",                                                    "🟣 Steam Room"],
    ["🥞 Long Brunch",                    "9:00",  "10:30", "1.5 hrs. Real conversations — not about work.",                                                                "⚫ Food"],
    ["📚 Library Deep Read",              "10:30", "12:00", "1.5 hrs — pleasure or deep research. Write 1 insight that changed how you think.",                             "🟣 Library"],
    ["𝕏 What I'm Learning Post",          "12:00", "12:15", "One insight from your reading. Useful for other founders — no self-promotion.",                                "🟡 X/Social"],
    ["🍜 Lunch",                          "12:15", "13:00", "",                                                                                                              "⚫ Food"],
    ["💻 Exploratory Build",              "13:00", "15:00", "2 hrs — zero sprint pressure. Prototype a wild idea, read docs, sketch UI. Let your brain play.",              "🔴 Build"],
    ["🏋️ Gym — Fun Session",              "15:00", "15:45", "Play. Try exercises you don't normally do. Or just stretch.",                                                  "🟣 Gym"],
    ["🏓 Ping Pong Tournament",           "15:45", "16:30", "Organise a mini round-robin. Post bracket on your X story.",                                                   "🟣 Ping Pong"],
    ["🎹 Piano — Extended Session",       "16:30", "17:00", "30 min. Invite people to listen or join.",                                                                     "🟣 Piano"],
    ["🏊 Evening Swim (optional)",        "17:30", "18:00", "A second dip if you feel like it — pool open until 9pm. Great for unwinding.",                                "🟣 Pool"],
    ["🍽️ Group Dinner",                   "19:00", "20:30", "Sit with people you haven't had dinner with yet.",                                                             "⚫ Food"],
    ["😴 Wind Down + Sleep",              "22:00", "7:00",  "Good sleep sets up Sunday fully.",                                                                             "⚫ Rest"]
  ];
}

function sundayEvents(week) {
  var next = sprint(week + 1);
  return [
    ["😴 Slow Wake",                      "7:00",  "7:30",  "Full rest day. No alarm.",                                                                                                             "⚫ Rest"],
    ["🏊 Slow Swim",                      "7:30",  "8:15",  "45 min leisure swim. Weekly reset. Pool opens at 7am.",                                                                               "🟣 Pool"],
    ["♨️ Steam Room",                     "8:15",  "8:40",  "Full relaxation. No phone.",                                                                                                           "🟣 Steam Room"],
    ["🥞 Brunch",                         "9:00",  "10:30", "Long and slow. Ask people about their life outside work.",                                                                             "⚫ Food"],
    ["📚 Notes Synthesis",                "10:30", "12:00", "Re-read week's journal notes. Synthesize 3 key insights.",                                                                             "🟣 Library"],
    ["♟️ Chess + Free Time",              "14:00", "15:30", "Chess with residents. Explore view spots. Zero work. This rest fuels Mon–Fri.",                                                       "🟣 Chess"],
    ["🏋️ Stretch + Mobility",             "15:30", "16:00", "30 min gentle stretching. Prepare your body for the week ahead.",                                                                     "🟣 Gym"],
    ["🎹 Piano",                          "16:00", "16:30", "30 min. Relax into it.",                                                                                                              "🟣 Piano"],
    ["🏊 Evening Swim (optional)",        "17:00", "17:30", "Second swim of the day — pool open until 9pm. Great way to end a rest day.",                                                          "🟣 Pool"],
    ["🍽️ Communal Dinner",                "19:00", "20:30", "Organise a communal table. Shared meals = deepest connections.",                                                                      "🟠 Network"],
    ["📓 Sunday Planning Session",        "20:30", "21:00", "Next week sprint: " + next + "\n3 people to connect with. One post idea per day.\nLook at the view while you plan.",                  "🔵 Reflect"],
    ["😴 Early Sleep",                    "21:00", "6:00",  "Sunday night sleep is the MOST IMPORTANT of the week. Sets up Monday completely.",                                                    "⚫ Rest"]
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function parseTime(date, t) {
  var p = t.split(":");
  var d = new Date(date);
  d.setHours(parseInt(p[0]), parseInt(p[1]), 0, 0);
  return d;
}

function gymNote(dow) {
  var g = {
    1: "Monday: Upper body + Core\n• Push-ups, dumbbell press, rows, planks",
    2: "Tuesday: Lower body + Mobility\n• Squats, lunges, hip mobility, stretching",
    3: "Wednesday: Upper body + Core\n• Pull-ups, shoulder press, core circuit",
    4: "Thursday: Lower body + Mobility\n• Deadlifts, step-ups, hamstring stretch"
  };
  return g[dow] || "Full body — light and mobile";
}

function sprint(week) {
  var g = {
    1: "Foundation — Solana wallet SDK + SNS resolver research + architecture draft",
    2: "Momentum — Passkey auth integration + SNS domain tx flow + watchface UX wireframe",
    3: "Depth — UX polish + security review + integration tests + full passkey flow",
    4: "Launch — Pitch deck + demo video + final polish + Demo Day"
  };
  return g[week] || "Post-NS — follow-ups, fundraising, continued build";
}

function fmtDate(date) {
  var D = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  var M = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return D[date.getDay()] + " " + date.getDate() + " " + M[date.getMonth()];
}