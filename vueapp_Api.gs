const Spreadsheet = SpreadsheetApp.getActive()

function test () {
  //insertTemplate('2021-01')//シートを追加する
  onPost({
    item: {
      date: '2021-02-01',
      title: '支出テスト',
      category: '食費',
      tags: 'タグ1,タグ2',
      income: null,
      outgo: 3000,
      memo: 'テスト'
    }
  })　
}

function onPost ({ item }) {
  if(!isValid(item)) {
    return {
      error: '正しい形式で入力してください'
    }
  }
}

function insertTemplate(yaerMonth) {
  const { SOLID_MEDIUM, DOUBLE } = SpreadsheetApp.BorderStyle

  const sheet = Spreadsheet.insertSheet(yaerMonth, 0) 
  const [year, month] = yaerMonth.split('-')

  sheet.getRange('A1:B1')
   .merge()
   .setValue(`${year}年 ${parseInt(month)}月`)
   .setHorizontalAlignment('center')
  .setBorder(null, null, true, null, null, null, 'black', SOLID_MEDIUM)

  sheet.getRange('A2:A4')
   .setValues([['収入：'], ['支出：'], ['収支差：']])
   .setFontWeight('bold')
   .setHorizontalAlignment('right')

  sheet.getRange('B2:B4')
    .setFormulas([['=SUM(F7:F)'], ['=SUM(G7:G)'], ['=B2-B3']])
    .setNumberFormat('#,##0')

  sheet.getRange('A4:B4')
    .setBorder(true, null, null, null, null, null, 'black', DOUBLE)

  //ヘッダー部分
  sheet.getRange('A6:H6')
    .setValues([['id', '日付', 'タイトル', 'カテゴリ', 'タグ', '収入', '支出', 'メモ']])
    .setFontWeight('bold')
    .setBorder(null, null, true, null, null, null, 'black', SOLID_MEDIUM)

  sheet.getRange('F7:G')
    .setNumberFormat('#,##0')

  // カテゴリ別支出
  sheet.getRange('J1')
    .setFormula('=QUERY(B7:H, "select D, sum(G), sum(G) / "&B3&"  where G > 0 group by D order by sum(G) desc label D \'カテゴリ\', sum(G) \'支出\'")')

  sheet.getRange('J1:L1')
    .setFontWeight('bold')
    .setBorder(null, null, true, null, null, null, 'black', SOLID_MEDIUM)

  sheet.getRange('L1')
    .setFontColor('white')

  sheet.getRange('k2:K')
    .setNumberFormat('#,##0')

  sheet.getRange('L2:L')
   .setNumberFormat('0.0%')

  sheet.setColumnWidth(9,21)

  return sheet
}

