// Approximate monthly income midpoints (yen)
const INCOME_VALUES = {
  '0': 0,
  low1: 20000,
  low2: 40000,
  low3: 65000,
  mid1: 100000,
  mid2: 135000,
  mid3: 175000,
  high: 250000,
}

const PENSION_VALUES = {
  '0': 0,
  low1: 20000,
  low2: 40000,
  low3: 65000,
  mid1: 100000,
  mid2: 135000,
  high: 175000,
}

const HOUSEHOLD_SIZES = {
  '1': 1, '2': 2, '3': 3, '4': 4, '5plus': 5,
}

// Rough minimum living standards estimate (国の基準の目安)
function estimateMinLiving(size, hasRent) {
  const base = { 1: 80000, 2: 119000, 3: 153000, 4: 182000, 5: 205000 }
  const baseAmount = base[Math.min(size, 5)] || 205000
  const housingAllowance = hasRent ? 48000 : 0
  return baseAmount + housingAllowance
}

export function diagnose(answers) {
  let score = 0
  const reasons = []

  const income = INCOME_VALUES[answers.monthlyIncome] || 0
  const pension = PENSION_VALUES[answers.pensionIncome] || 0
  const total = income + pension

  const size = HOUSEHOLD_SIZES[answers.householdSize] || 1
  const hasRent = answers.rent && answers.rent !== '0'
  const minLiving = estimateMinLiving(size, hasRent)

  // ── 収入 ──
  if (total === 0) {
    score += 5
    reasons.push({ level: 'urgent', text: '収入がまったくない状態です' })
  } else if (total < minLiving * 0.55) {
    score += 4
    reasons.push({ level: 'urgent', text: `収入（月${Math.round(total / 1000)}千円）が最低生活費の目安を大きく下回っています` })
  } else if (total < minLiving) {
    score += 2
    reasons.push({ level: 'concern', text: `収入（月${Math.round(total / 1000)}千円）が最低生活費の目安を下回っています` })
  } else if (total < minLiving * 1.1) {
    score += 1
    reasons.push({ level: 'check', text: '収入が最低生活費の目安とほぼ同水準です' })
  }

  // ── 食事 ──
  if (answers.hasSufficientFood === 'no') {
    score += 4
    reasons.push({ level: 'urgent', text: '食事が十分にとれていない状態です（最優先で支援が必要）' })
  } else if (answers.hasSufficientFood === 'sometimes') {
    score += 2
    reasons.push({ level: 'concern', text: '食べられない日があります' })
  }

  // ── 家賃・公共料金滞納 ──
  if (answers.hasArrears === 'yes') {
    score += 3
    reasons.push({ level: 'urgent', text: '家賃・公共料金の滞納があります' })
  } else if (answers.hasArrears === 'risk') {
    score += 1
    reasons.push({ level: 'concern', text: '家賃・公共料金の支払いが危うい状態です' })
  }

  // ── 病気・障害 ──
  if (answers.hasIllness === 'yes') {
    score += 1
    reasons.push({ level: 'check', text: '病気や障害があります' })
    if (answers.hasWorkRestriction === 'yes') {
      score += 2
      reasons.push({ level: 'urgent', text: '医師から就労制限を受けています' })
    } else if (answers.hasWorkRestriction === 'partial') {
      score += 1
      reasons.push({ level: 'concern', text: '軽作業に限ると医師から言われています' })
    }
  }

  // ── 要介護認定 ──
  if (answers.hasCareLevel === 'yes') {
    score += 2
    reasons.push({ level: 'concern', text: '要介護・要支援認定を受けています' })
  }

  // ── 就労能力 ──
  if (answers.canWork === 'no') {
    score += 2
    reasons.push({ level: 'urgent', text: '就労が不可能な状態です' })
  } else if (answers.canWork === 'difficult') {
    score += 1
    reasons.push({ level: 'concern', text: '就労が困難な状態です' })
  }

  // ── 医療アクセス ──
  if (answers.isUnderMedicalCare === 'needed') {
    score += 2
    reasons.push({ level: 'urgent', text: '必要な受診ができていない状態です（費用が理由）' })
  }

  // ── 親族援助 ──
  if (answers.hasFamilySupport === 'no') {
    score += 1
    reasons.push({ level: 'check', text: '親族からの援助が受けられない状況です' })
  }

  // ── 過去の申請却下 ──
  if (answers.wasRefused === 'yes') {
    score += 1
    reasons.push({ level: 'check', text: '以前に申請を断られた経験があります（不服申立てが可能です）' })
  }

  // ── 判定 ──
  let grade
  if (score >= 6) grade = 'A'
  else if (score >= 2) grade = 'B'
  else grade = 'C'

  // 資産が多い場合の補足
  const hasMajorAssets = answers.savings === 'enough' || answers.hasOwnHome === 'yes'
  if (hasMajorAssets) {
    reasons.push({ level: 'check', text: '資産（預貯金・持ち家など）がある場合、審査で確認されます' })
  }

  return {
    grade,
    score,
    reasons,
    totalIncome: total,
    estimatedMinLiving: minLiving,
    householdSize: size,
    hasMajorAssets,
  }
}

// Generate the required documents list based on answers
export function getRequiredDocuments(answers) {
  const docs = [
    { category: '必須', label: '本人確認書類', note: 'マイナンバーカード・運転免許証・健康保険証など' },
    { category: '必須', label: '通帳（世帯全員分）', note: '直近2〜3か月分の入出金がわかるもの' },
    { category: '必須', label: '印鑑', note: '認印で可' },
  ]

  if (answers.monthlyIncome && answers.monthlyIncome !== '0') {
    docs.push({ category: '収入', label: '給与明細', note: '直近3か月分' })
  }

  if (answers.pensionIncome && answers.pensionIncome !== '0') {
    docs.push({ category: '収入', label: '年金振込通知書または年金決定通知書', note: '受け取っている年金がわかるもの' })
  }

  if (answers.rent && answers.rent !== '0') {
    docs.push({ category: '住居', label: '賃貸借契約書（賃貸の場合）', note: '家賃・住所が確認できるもの' })
  }

  if (answers.hasIllness === 'yes') {
    docs.push({ category: '健康', label: '医療機関の診察券', note: '' })
    docs.push({ category: '健康', label: '診断書または病名がわかる書類', note: 'お薬手帳でも可' })
    docs.push({ category: '健康', label: 'お薬手帳', note: '服薬中の薬がわかるもの' })
  }

  if (answers.hasCareLevel === 'yes') {
    docs.push({ category: '介護', label: '介護保険証', note: '' })
    docs.push({ category: '介護', label: '要介護認定通知書', note: '介護度がわかるもの' })
  }

  if (answers.hasDebt === 'yes') {
    docs.push({ category: '借金', label: '借入・滞納状況がわかる書類', note: 'クレジット明細・督促状など' })
  }

  if (answers.hasArrears === 'yes' || answers.hasArrears === 'risk') {
    docs.push({ category: '公共料金', label: '電気・ガス・水道の請求書', note: '滞納状況がわかるもの' })
  }

  docs.push({ category: 'その他', label: '窓口で伝える文章', note: 'このアプリで作成できます' })

  return docs
}

// Generate the phrase for the welfare office
export function generatePhrase(answers) {
  const parts = []

  parts.push('生活保護の申請を希望します。')

  // Health
  if (answers.hasIllness === 'yes') {
    const illnessMap = {
      stroke: '脳梗塞・脳出血の後遺症',
      heart: '心臓病・心筋梗塞',
      spine: '脊椎・骨・関節の病気',
      chronic: '慢性疾患',
      cancer: 'がん',
      mental: '精神疾患',
      disability: '身体障害',
      cognitive: '認知症・知的障害',
      other: '病気・障害',
    }
    const selected = answers.illnessDetail || []
    const names = selected.map((k) => illnessMap[k]).filter(Boolean)
    if (names.length > 0) {
      parts.push(`現在、${names.join('・')}があります。`)
    }

    if (answers.hasWorkRestriction === 'yes') {
      parts.push('医師から就労を制限するよう指示されており、働くことができない状態です。')
    } else if (answers.canWork === 'no') {
      parts.push('病気や障害のため、就労が不可能な状態です。')
    } else if (answers.canWork === 'difficult') {
      parts.push('病気や障害のため、就労が困難な状態です。')
    }
  }

  if (answers.hasCareLevel === 'yes') {
    parts.push('要介護・要支援の認定を受けており、日常生活に介護が必要な状態です。')
  }

  // Income
  const income = INCOME_VALUES[answers.monthlyIncome] || 0
  const pension = PENSION_VALUES[answers.pensionIncome] || 0
  const total = income + pension

  if (total === 0) {
    parts.push('現在、収入はまったくありません。')
  } else {
    const incomeParts = []
    if (income > 0) {
      incomeParts.push(`就労収入が月約${Math.round(income / 10000)}万円程度`)
    }
    if (pension > 0) {
      incomeParts.push(`年金が月約${Math.round(pension / 10000)}万円程度`)
    }
    parts.push(`現在の収入は${incomeParts.join('、')}で、生活費が不足している状態です。`)
  }

  if (answers.isUnderMedicalCare === 'needed') {
    parts.push('通院が必要な状態ですが、費用が払えず受診できていません。')
  }

  // Family/living situation
  if (answers.hasFamilySupport === 'no') {
    parts.push('親族からの援助は受けられない状況です。')
  } else if (answers.hasFamilySupport === 'partial') {
    parts.push('親族からの援助は限られており、継続的な支援を受けることは難しい状況です。')
  }

  // Living difficulties
  const difficulties = []
  if (answers.hasSufficientFood === 'no') difficulties.push('食費が不足し、食事がとれない')
  if (answers.hasSufficientFood === 'sometimes') difficulties.push('食べられない日がある')
  if (answers.hasArrears === 'yes') difficulties.push('家賃・公共料金の滞納がある')
  if (answers.hasArrears === 'risk') difficulties.push('家賃・公共料金の支払いが危うい')
  if (difficulties.length > 0) {
    parts.push(`${difficulties.join('、')}状況で、生活維持が困難です。`)
  }

  if (answers.municipality) {
    // Mention location (already implied by visiting local office)
  }

  parts.push('相談ではなく、生活保護の申請をしたいです。申請書の交付をお願いします。')

  return parts.join('\n')
}
