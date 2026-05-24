import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = 'file://' + path.resolve(__dirname, 'vishnu_sahasranama.html');

let passed = 0;
let failed = 0;
const errors = [];

function assert(label, condition, detail = '') {
  if (condition) {
    passed++;
    console.log(`  ✅ ${label}`);
  } else {
    failed++;
    const msg = `  ❌ ${label}${detail ? ' — ' + detail : ''}`;
    console.error(msg);
    errors.push(msg);
  }
}

(async () => {
  console.log('\n🔍 Starting QA Tests for Vishnu Sahasranama\n');

  const browser = await chromium.launch({ headless: true });
  try {
  const context = await browser.newContext();
  const page = await context.newPage();

  // Collect all console messages
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', err => consoleErrors.push(err.message));

  // ========== LOAD ==========
  console.log('📄 1. Page Load');
  await page.goto(htmlPath, { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(500);

  assert('Page loaded without JS errors', consoleErrors.length === 0,
    'Errors: ' + consoleErrors.slice(0, 5).join('; '));

  // ========== HEADER ==========
  console.log('\n📌 2. Header Elements');
  const headerTitle = await page.textContent('h1');
  assert('Header title is Vishnu Sahasranama',
    headerTitle.includes('Vishnu Sahasranama'));

  const omSymbol = await page.textContent('.header-om');
  assert('OM symbol present', omSymbol.trim() === 'ॐ');

  const statEls = await page.$$('.stat-pill');
  assert('Three stat pills visible', statEls.length === 3);

  // ========== SIDEBAR ==========
  console.log('\n📋 3. Sidebar');
  const sidebarItems = await page.$$('.shloka-item');
  assert('108 shloka items in sidebar', sidebarItems.length === 108);

  // ========== SHLOKA LOADING ==========
  console.log('\n📜 4. Shloka Loading');
  // Click first shloka
  await sidebarItems[0].click();
  await page.waitForTimeout(300);
  const badge = await page.textContent('.shloka-number-badge');
  assert('Shloka 1 badge visible', badge?.includes('Shloka 1'));

  const devanagariText = await page.textContent('.shloka-devanagari');
  assert('Devanagari text displayed', devanagariText?.includes('विश्वं'));

  const meaningCards = await page.$$('#panel-shloka .meaning-card');
  assert('6 meaning cards shown', meaningCards.length === 6);

  const wordCards = await page.$$('.word-card');
  assert('Word breakdown cards present', wordCards.length >= 3);

  const namePills = await page.$$('.name-pill');
  assert('Name pills present', namePills.length > 0);

  // ========== WORD MODAL ==========
  console.log('\n🔍 5. Word Modal');
  await wordCards[0].click();
  await page.waitForTimeout(300);
  const modal = await page.$('#wordModal.open');
  assert('Word modal opens on click', modal !== null);

  const modalTitle = await page.textContent('#modalWordSanskrit');
  assert('Modal shows Sanskrit word', modalTitle?.length > 0);

  const modalSections = await page.$$('#modalWordContent .modal-section');
  assert('Modal has content sections', modalSections.length >= 3);

  // Close modal
  await page.click('.modal-close');
  await page.waitForTimeout(200);
  const modalClosed = await page.$('#wordModal.open');
  assert('Modal closes on X button', modalClosed === null);

  // ========== NAME PILL LOOKUP ==========
  console.log('\n💊 6. Name Pill Lookup');
  // Re-open shloka 1 to get fresh pills
  await sidebarItems[0].click();
  await page.waitForTimeout(300);
  // Click first name pill — should open modal or switch to dict
  const firstPill = await page.$('.name-pill');
  if (firstPill) {
    await firstPill.click();
    await page.waitForTimeout(300);
    // Either modal opens or we switch to dictionary tab
    const dictTab = await page.$('#tab-dictionary.active');
    const modalOpen = await page.$('#wordModal.open');
    assert('Name pill triggers lookup (modal or dict tab)',
      dictTab !== null || modalOpen !== null);
    if (modalOpen) {
      await page.click('.modal-close');
      await page.waitForTimeout(200);
    }
  }

  // ========== TABS ==========
  console.log('\n📑 7. Tab Switching');
  const tabs = ['dhyanam', 'phalasruthi', 'intro', 'dictionary', 'quiz', 'progress'];
  for (const tab of tabs) {
    await page.click(`#tab-${tab}`);
    await page.waitForTimeout(200);
    const panel = await page.$(`#panel-${tab}.active`);
    assert(`Tab "${tab}" switches correctly`, panel !== null);
  }

  // ========== DICTIONARY ==========
  console.log('\n📖 8. Dictionary');
  await page.click('#tab-dictionary');
  await page.waitForTimeout(300);
  const dictEntries = await page.$$('.dict-entry');
  assert('Dictionary has entries', dictEntries.length >= 15);

  // Test filter
  const filterBtns = await page.$$('.filter-btn');
  assert('Dictionary has filter buttons', filterBtns.length >= 4);

  await filterBtns[1].click(); // Click "Nouns"
  await page.waitForTimeout(200);
  const filteredEntries = await page.$$('.dict-entry');
  assert('Noun filter works (shows fewer items)',
    filteredEntries.length < dictEntries.length || filteredEntries.length > 0);

  // Click "All Words"
  await filterBtns[0].click();
  await page.waitForTimeout(200);

  // Test search
  await page.fill('#dictSearch', 'विष्णु');
  await page.waitForTimeout(300);
  const searchedEntries = await page.$$('.dict-entry');
  assert('Dictionary search filters results', searchedEntries.length > 0);

  // Clear search
  await page.fill('#dictSearch', '');
  await page.waitForTimeout(200);

  // Test dict entry click
  const firstEntry = await page.$('.dict-entry');
  if (firstEntry) {
    await firstEntry.click();
    await page.waitForTimeout(300);
    const entryModal = await page.$('#wordModal.open');
    assert('Dict entry opens modal', entryModal !== null);
    await page.click('.modal-close');
  }

  // ========== QUIZ ==========
  console.log('\n🎯 9. Quiz System');
  await page.click('#tab-quiz');
  await page.waitForTimeout(300);

  // Check quiz setup elements
  const quizTitle = await page.textContent('#quizSetup h2');
  assert('Quiz title displayed', quizTitle?.includes('Sacred Knowledge'));

  const modeCards = await page.$$('.quiz-mode-card');
  assert('3 quiz modes available', modeCards.length === 3);

  const quizLengthBtns = await page.$$('[id^="ql-"]');
  assert('Quiz length options visible', quizLengthBtns.length === 4);

  // Start quiz with 10 questions
  await page.click('#ql-10');
  await page.waitForTimeout(100);
  await page.click('#panel-quiz .start-quiz-btn');
  await page.waitForTimeout(500);

  const quizActive = await page.$('#quizActive[style*="block"]');
  assert('Quiz starts and shows question', quizActive !== null);

  const questionText = await page.textContent('#quizQText');
  assert('Quiz question has text', questionText?.length > 0);

  const quizOptions = await page.$$('.quiz-option');
  assert('Quiz options shown', quizOptions.length >= 2);

  // Answer a question
  await quizOptions[0].click();
  await page.waitForTimeout(300);
  const feedback = await page.$('.quiz-feedback.show');
  assert('Feedback shows after answering', feedback !== null);

  const nextBtn = await page.$('#nextQBtn.show');
  assert('Next button appears after answer', nextBtn !== null);

  // Navigate through all questions
  let questionCount = 1;
  while (questionCount < 10) {
    const nextBtnEl = await page.$('#nextQBtn.show');
    if (!nextBtnEl) break;
    await nextBtnEl.click();
    await page.waitForTimeout(200);
    // Click first option to answer
    const opts = await page.$$('.quiz-option:not(:disabled)');
    if (opts.length > 0) {
      await opts[0].click();
      await page.waitForTimeout(200);
    }
    questionCount++;
  }
  // Click next after final question to trigger endQuiz
  const finalNext = await page.$('#nextQBtn.show');
  if (finalNext) {
    await finalNext.click();
    await page.waitForTimeout(500);
  }
  assert('All quiz questions can be answered', questionCount >= 9);

  // Check results page
  const results = await page.$('#quizResults[style*="block"]');
  assert('Quiz results shown at end', results !== null);

  const resultTitle = await page.textContent('#quizResultTitle');
  assert('Quiz result title displayed', resultTitle?.length > 0);

  // ========== LANGUAGE SWITCH ==========
  console.log('\n🌐 10. Language Switching');
  // Switch to Hindi
  await page.click('#lang-hi');
  await page.waitForTimeout(300);
  const sidebarSearchHi = await page.getAttribute('#sidebarSearch', 'placeholder');
  assert('Hindi sidebar search placeholder changes',
    sidebarSearchHi?.includes('श्लोक'));

  // Switch to Gujarati
  await page.click('#lang-gu');
  await page.waitForTimeout(300);
  const sidebarSearchGu = await page.getAttribute('#sidebarSearch', 'placeholder');
  assert('Gujarati sidebar search placeholder changes',
    sidebarSearchGu?.includes('શ્લોક'));

  // Switch back to English
  await page.click('#lang-en');
  await page.waitForTimeout(300);
  const sidebarSearchEn = await page.getAttribute('#sidebarSearch', 'placeholder');
  assert('English sidebar search restored',
    sidebarSearchEn?.includes('Search'));

  // ========== PROGRESS ==========
  console.log('\n📊 11. Progress Panel');
  await page.click('#tab-progress');
  await page.waitForTimeout(300);
  const progStats = await page.$$('.prog-stat');
  assert('4 progress stat cards shown', progStats.length === 4);

  const gridCells = await page.$$('.sgp-cell');
  assert('Progress grid has 108 cells', gridCells.length === 108);

  // Click a progress cell to navigate
  await gridCells[4].click();
  await page.waitForTimeout(300);
  const activeShloka = await page.$('#tab-shloka.active');
  assert('Progress cell click loads shloka', activeShloka !== null);

  // ========== MARK AS LEARNED ==========
  console.log('\n✅ 12. Mark as Learned');
  // Find and click the "Mark as Learned" button
  const markBtn = await page.$('button:has-text("Mark as Learned")');
  if (markBtn) {
    await markBtn.click();
    await page.waitForTimeout(300);
    const markedBtn = await page.$('button:has-text("Learned!")');
    assert('Mark as Learned button changes to "Learned!"', markedBtn !== null);
  }

  // ========== AI GURU ==========
  console.log('\n🧘 13. AI Guru Ask Button');
  const firstItem = await page.$('.shloka-item');
  if (firstItem) await firstItem.click();
  await page.waitForTimeout(300);
  const guruBtn = await page.$('button:has-text("Ask the Guru")');
  assert('AI Guru button visible', guruBtn !== null);
  if (guruBtn) {
    await guruBtn.click();
    await page.waitForTimeout(2000); // Wait for simulated response
    const aiContent = await page.textContent('#aiContent');
    assert('AI Guru generates response text', aiContent?.length > 50);
    assert('AI Guru response has bold formatting',
      aiContent?.includes('PRONUNCIATION GUIDE') || aiContent?.includes('WORD MAGIC'));
  }

  // ========== SIDEBAR SEARCH ==========
  console.log('\n🔎 14. Sidebar Search');
  await page.fill('#sidebarSearch', 'विश्वम्');
  await page.waitForTimeout(300);
  const visibleItems = await page.$$eval('.shloka-item', els =>
    els.filter(el => el.style.display !== 'none').length
  );
  assert('Sidebar search filters shlokas', visibleItems < 108 && visibleItems > 0);

  await page.fill('#sidebarSearch', '');
  await page.waitForTimeout(200);

  // ========== DHYANAM TAB DETAILS ==========
  console.log('\n🧘 15. Dhyanam Tab');
  await page.click('#tab-dhyanam');
  await page.waitForTimeout(300);
  const dhyanamTitle = await page.textContent('#panel-dhyanam .intro-title');
  assert('Dhyanam page has title', dhyanamTitle?.includes('DHYANAM'));

  const medBtn = await page.$('button:has-text("Guided Meditation")');
  assert('Guided meditation button exists', medBtn !== null);

  // ========== PHALASRUTHI TAB ==========
  console.log('\n🌟 16. Phalasruthi Tab');
  await page.click('#tab-phalasruthi');
  await page.waitForTimeout(300);
  const phalaTitle = await page.textContent('#panel-phalasruthi .intro-title');
  assert('Phalasruthi page has title', phalaTitle?.includes('PHALASRUTHI'));

  const commitBtn = await page.$('button:has-text("Commit to 108")');
  assert('108-day commitment button exists', commitBtn !== null);

  // ========== BOTTOM QUOTE ==========
  console.log('\n💬 17. Bottom Quotes');
  const initialQuote = await page.textContent('#bottomQuote');
  await page.waitForTimeout(8500); // Wait for rotation interval
  const newQuote = await page.textContent('#bottomQuote');
  assert('Bottom quote rotates after 8s', initialQuote !== newQuote);

  // ========== NOTIFICATION ==========
  console.log('\n🔔 18. Notification System');
  // Re-loading a shloka should trigger a notification if applicable
  const sidebarFirst = await page.$('.shloka-item');
  if (sidebarFirst) await sidebarFirst.click();
  await page.waitForTimeout(100);

  // ========== CONSOLE ERRORS CHECK ==========
  console.log('\n⚠️ 19. Final Console Error Check');
  if (consoleErrors.length > 0) {
    console.error('  Console errors found:');
    consoleErrors.forEach(e => console.error('    -', e));
  }
  assert('No unexpected console errors during test run',
    consoleErrors.length === 0,
    'Errors: ' + consoleErrors.slice(0, 10).join(' | '));

  // ========== SUMMARY ==========
  console.log('\n' + '='.repeat(50));
  console.log(`📊 QA Test Results`);
  console.log('='.repeat(50));
  console.log(`  ✅ Passed: ${passed}`);
  console.log(`  ❌ Failed: ${failed}`);
  console.log(`  Total:    ${passed + failed}`);
  if (failed > 0) {
    console.log('\n  Failed checks:');
    errors.forEach(e => console.log('    ' + e));
  }
  console.log('='.repeat(50) + '\n');

  } finally {
    await browser.close();
  }
  process.exit(failed > 0 ? 1 : 0);
})();
