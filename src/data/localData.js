// 地域別福祉事務所データ
// 今後、市区町村ごとに追加予定
export const welfareOffices = [
  {
    id: 'nakama-city',
    municipality: '中間市',
    prefecture: '福岡県',
    officeName: '中間市生活支援課（福祉事務所）',
    phone: '093-246-6040',
    address: '福岡県中間市中間一丁目1番1号',
    housingAllowanceNote: '2人世帯の住宅扶助上限目安：約42,000円（地域差あり・必ず事前確認）',
    officeHours: '平日 8:30〜17:15（土日祝・年末年始を除く）',
    note: '生活保護の相談・申請は生活支援課まで。緊急の場合は電話相談も可。',
    website: 'https://www.city.nakama.lg.jp/',
  },
]

// ─────────────────────────────────────────────
// データ構造の定義（追加時の参考）
// {
//   id: string,                   // 一意のID（例: 'fukuoka-city'）
//   municipality: string,         // 市区町村名（例: '福岡市'）
//   prefecture: string,           // 都道府県（例: '福岡県'）
//   officeName: string,           // 福祉事務所名
//   phone: string,                // 電話番号
//   address: string,              // 住所
//   housingAllowanceNote: string, // 住宅扶助上限の目安（テキスト）
//   officeHours: string,          // 窓口時間
//   note: string,                 // 備考・注意事項
//   website: string,              // 公式サイトURL
// }
// ─────────────────────────────────────────────
