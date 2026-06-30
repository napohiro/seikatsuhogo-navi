const RENT_VALUES = {
  under30: 28000, '30to40': 35000, '40to50': 45000,
  '50to60': 55000, '60to70': 65000, '70plus': 80000, unknown: null,
}

const RENT_DISPLAY = {
  under30: '3万円未満', '30to40': '3〜4万円', '40to50': '4〜5万円',
  '50to60': '5〜6万円', '60to70': '6〜7万円', '70plus': '7万円以上', unknown: '未確認',
}

const INITIAL_COST_DISPLAY = {
  none: '0円', under100k: '10万円未満', '100to200k': '10〜20万円',
  '200to300k': '20〜30万円', '300kplus': '30万円以上', unknown: '未確認',
}

const COMMON_FEE_DISPLAY = {
  low: '5,000円以内', mid: '5,000〜10,000円程度', high: '10,000円以上',
}

// Rough rent risk by occupant count (national average; actual limits vary widely by city)
function getRentRisk(targetRent, occupantCount) {
  const value = RENT_VALUES[targetRent]
  if (!value) return 'unknown'
  const n = occupantCount === '4plus' ? 4 : (parseInt(occupantCount) || 1)
  // Approximate safe / warning thresholds
  const safeLimit = 38000 + (n - 1) * 8000
  const warnLimit = 52000 + (n - 1) * 8000
  if (value > warnLimit) return 'high'
  if (value > safeLimit) return 'medium'
  return 'low'
}

export function diagnoseHousing(answers) {
  const issues = []
  const hasCandidate = answers.hasCandidateProperty === 'yes'
  const notMoving = answers.planningMove === 'no'

  // ── 1. 契約済みは最優先警告 ──
  if (answers.contractStatus === 'signed') {
    issues.push({
      level: 'critical', id: 'already_signed', icon: '🚨',
      title: '先に契約するのは危険 — 契約済みのため至急相談が必要',
      detail: '申請前に賃貸契約を済ませると、家賃が住宅扶助の上限を超えていた場合の超過分や礼金・仲介手数料などの初期費用が認められない可能性があります。すぐに福祉事務所に現状を伝えてください。',
    })
  } else if (answers.contractStatus === 'deposit_paid') {
    issues.push({
      level: 'critical', id: 'deposit_paid', icon: '⚠️',
      title: '先に契約するのは危険 — 申込金を払った段階で至急確認を',
      detail: '申込金・手付金を払った段階でも、正式契約前に福祉事務所に相談してください。家賃や初期費用が住宅扶助の対象か確認してからでないと、費用の自己負担が生じる恐れがあります。',
    })
  }

  // ── 2. 転居前に福祉事務所への確認が必要 ──
  if (!notMoving) {
    issues.push({
      level: 'warning', id: 'confirm_before_move', icon: '🏛️',
      title: '転居前に必ず福祉事務所へ確認が必要',
      detail: '生活保護の住宅扶助には地域ごとに上限額があります。また、転居費用（初期費用・引越し費用）は転居前に福祉事務所の承認を得ていない場合、認められません。必ず契約前に相談してください。',
    })
  }

  // ── 3. 家賃上限内か確認が必要 ──
  if (hasCandidate && answers.targetRent && answers.targetRent !== 'unknown') {
    const risk = getRentRisk(answers.targetRent, answers.occupantCount || '1')
    if (risk === 'high') {
      issues.push({
        level: 'warning', id: 'rent_high', icon: '💴',
        title: '家賃上限内か確認が必要 — 超過の可能性が高い',
        detail: `候補物件の家賃（${RENT_DISPLAY[answers.targetRent]}）は、多くの地域で住宅扶助の上限を超える可能性があります。福祉事務所でお住まいの地域の上限額を確認してから物件を選んでください。`,
      })
    } else if (risk === 'medium') {
      issues.push({
        level: 'warning', id: 'rent_medium', icon: '💴',
        title: '家賃上限内か確認が必要 — 地域によっては超過の可能性あり',
        detail: `候補物件の家賃（${RENT_DISPLAY[answers.targetRent]}）は、地域によっては住宅扶助の上限に近い場合があります。契約前に福祉事務所でお住まいの地域の上限額を必ず確認してください。`,
      })
    } else {
      issues.push({
        level: 'ok', id: 'rent_ok', icon: '✅',
        title: '家賃は多くの地域で住宅扶助の範囲内の可能性あり',
        detail: `${RENT_DISPLAY[answers.targetRent]}の家賃は、多くの地域で住宅扶助の対象範囲内の可能性があります。ただし地域により上限が異なるため、必ず福祉事務所で確認してください。`,
      })
    }
  }

  // ── 4. 共益費・管理費は住宅扶助対象外の可能性あり ──
  if (hasCandidate && answers.commonFee && answers.commonFee !== 'none' && answers.commonFee !== 'unknown') {
    issues.push({
      level: 'check', id: 'common_fee', icon: '📋',
      title: '共益費・管理費は住宅扶助対象外の可能性あり',
      detail: `共益費・管理費（${COMMON_FEE_DISPLAY[answers.commonFee] || ''}）は家賃とは別に請求されますが、住宅扶助の対象外になる場合があります。福祉事務所に「共益費は住宅扶助に含まれるか」を確認してください。`,
    })
  }

  // ── 5. 初期費用が認められるか事前確認が必要 ──
  if (hasCandidate && answers.totalInitialCost && answers.totalInitialCost !== 'none') {
    issues.push({
      level: 'warning', id: 'initial_cost', icon: '💰',
      title: '初期費用が認められるか事前確認が必要',
      detail: '生活保護では敷金・仲介手数料などの初期費用が認められる場合がありますが、事前に福祉事務所の承認が必要です。契約後に申請しても認められないことがあります。必ず契約前に確認してください。',
    })
    const items = answers.initialCostItems || []
    if (items.includes('key_money')) {
      issues.push({
        level: 'check', id: 'key_money', icon: 'ℹ️',
        title: '礼金は原則として生活保護の対象外',
        detail: '礼金（慣行礼金）は多くの場合、生活保護の初期費用として認められません。礼金なし・敷金のみの物件を優先して探してください。',
      })
    }
  }

  // ── 6. 高齢者入居可否を大家・不動産会社に確認 ──
  if (answers.isElderlyOnly === 'yes') {
    issues.push({
      level: 'check', id: 'elderly', icon: '👴',
      title: '高齢者入居可否を大家・不動産会社に確認',
      detail: '高齢者のみの世帯では入居を断る物件があります。「高齢者歓迎」「生活保護受給者歓迎」の物件を優先的に探しましょう。また、段差・浴室・廊下のバリアフリー状況も確認してください。',
    })
  }

  // ── 入居可否確認 ──
  if (hasCandidate && answers.welfareAcceptanceConfirmed === 'not_confirmed') {
    issues.push({
      level: 'check', id: 'welfare_acceptance', icon: '🔍',
      title: '生活保護受給者の入居可否を大家・不動産会社に確認',
      detail: '生活保護受給予定者として入居できるか、大家または不動産会社に事前確認してください。確認なしに契約するとトラブルになる可能性があります。',
    })
  } else if (hasCandidate && answers.welfareAcceptanceConfirmed === 'refused') {
    issues.push({
      level: 'warning', id: 'welfare_refused', icon: '❌',
      title: '生活保護受給者の入居を断られた物件は再検討を',
      detail: 'この物件への入居が難しい可能性があります。生活保護受給者でも入居できる物件を、不動産会社や福祉事務所のサポートを活用して探してください。',
    })
  }

  // ── 保証人なし ──
  if (answers.hasGuarantor === 'no') {
    issues.push({
      level: 'info', id: 'no_guarantor', icon: '🤝',
      title: '保証人がいない場合は保証会社か福祉事務所に相談',
      detail: '保証人がいなくても、保証会社を利用したり、福祉事務所が緊急連絡先になる場合があります。「保証人不要」「生活保護受給者歓迎」の物件も探してみましょう。',
    })
  }

  // ── 引越し費用 ──
  if (hasCandidate && answers.movingCost && answers.movingCost !== 'none' && answers.movingCost !== 'unknown') {
    issues.push({
      level: 'info', id: 'moving_cost', icon: '🚚',
      title: '引っ越し費用も転居前の事前承認が必要',
      detail: '生活保護では引っ越し費用が認められる場合がありますが、転居前に福祉事務所の承認が必要です。転居した後に申請しても認められないことがあります。',
    })
  }

  const urgency = issues.some((i) => i.level === 'critical') ? 'critical'
    : issues.some((i) => i.level === 'warning') ? 'warning'
    : 'ok'

  return { issues, urgency }
}

export function generateHousingPhrase(answers) {
  const parts = []

  parts.push('生活保護の申請を検討しています。転居前に確認したいことがあり、相談に来ました。')

  // Current situation
  const reasons = answers.moveReason || []
  if (answers.currentHousing === 'family') {
    if (reasons.includes('family_burden')) {
      parts.push('現在は家族と同居していますが、家族の扶養や介護負担が重く、夫婦のみ（または本人のみ）で近隣の賃貸住宅へ転居することを検討しています。')
    } else if (reasons.includes('care_need')) {
      parts.push('現在は家族と同居していますが、介護・病気のため適切な住環境への転居を検討しています。')
    } else {
      parts.push('現在は家族と同居していますが、別居・転居することを検討しています。')
    }
  } else if (answers.currentHousing === 'rental') {
    parts.push('現在の賃貸住宅から転居することを検討しています。')
  } else if (answers.currentHousing === 'own') {
    parts.push('現在は持ち家に住んでいますが、転居を検討しています。')
  }

  // Candidate property details
  if (answers.hasCandidateProperty === 'yes') {
    const rentText = RENT_DISPLAY[answers.targetRent] || '未確認'
    let costLine = `候補物件の家賃は月${rentText}`

    if (answers.commonFee && answers.commonFee !== 'none' && answers.commonFee !== 'unknown') {
      const cf = COMMON_FEE_DISPLAY[answers.commonFee]
      if (cf) costLine += `、共益費は月${cf}`
    }
    costLine += 'です。'
    parts.push(costLine)

    if (answers.totalInitialCost && answers.totalInitialCost !== 'none' && answers.totalInitialCost !== 'unknown') {
      const items = answers.initialCostItems || []
      const names = []
      if (items.includes('deposit')) names.push('敷金')
      if (items.includes('key_money')) names.push('礼金')
      if (items.includes('agency')) names.push('仲介手数料')
      if (items.includes('guarantee')) names.push('保証会社費用')
      if (items.includes('insurance')) names.push('火災保険料')
      const costLabel = INITIAL_COST_DISPLAY[answers.totalInitialCost]
      if (names.length > 0) {
        parts.push(`初期費用（${names.join('・')}）は合計で${costLabel}程度の見込みです。`)
      } else {
        parts.push(`初期費用の合計は${costLabel}程度の見込みです。`)
      }
    }

    if (answers.movingCost && answers.movingCost !== 'none' && answers.movingCost !== 'unknown') {
      parts.push('また、引っ越し費用もかかる予定です。')
    }
  } else if (answers.hasCandidateProperty === 'looking') {
    parts.push('現在、候補物件を探している段階です。')
  }

  // Questions to ask
  const questions = [
    '生活保護の住宅扶助の上限額はいくらですか？候補物件の家賃は範囲内に収まりますか？',
  ]
  if (answers.commonFee && answers.commonFee !== 'none') {
    questions.push('共益費・管理費は住宅扶助の対象に含まれますか？')
  }
  if (answers.totalInitialCost && answers.totalInitialCost !== 'none') {
    questions.push('敷金・仲介手数料などの初期費用は、生活保護として認められますか？（礼金はどうなりますか？）')
  }
  if (answers.movingCost && answers.movingCost !== 'none') {
    questions.push('引っ越し費用は認められますか？')
  }
  questions.push('契約前にこちら（福祉事務所）の承認・確認が必要かどうかを教えてください。')

  parts.push('以下の点について確認したいです。')
  questions.forEach((q, i) => parts.push(`${i + 1}. ${q}`))

  parts.push('\n先に自己判断で契約して生活保護が認められなかった場合、生活がさらに困窮するため、事前に相談したいです。')

  return parts.join('\n')
}
