/* 
1.7 중간 점검: 두 파일(과 두 단계)로 분리됨
*/

const createStatementData = require("./statement_3_create");

function statement(invoice, plays) {
  return renderPlainText(createStatementData(invoice, plays)); // 중간 데이터 구조를 인수로 전달
}

// 본문 전체를 별도 함수로 추출
function renderPlainText(data, plays) {
  let result = `청구내역 (고객명: ${data.customer})\n`;
  for (let perf of data.performances) {
    // 청구 내역을 출력한다.
    result += `${perf.play.name}: ${usd(perf.amount / 100)} ${
      perf.audience
    }석\n`;
  }
  result += `총액 ${usd(data.totalAmount / 100)}\n`;
  result += `적립 포인트 ${data.totalVolumeCredits}점\n`;

  return result;
}

function htmlStatement(invoice, plays) {
  return renderHtml(createStatementData(invoice, plays)); // 중간 데이터 구조를 인수로 전달
}

function renderHtml(data) {
  let result = `<h1>청구 내역 (고객명: ${data.customer})</h1>\n`;
  result += "<table>\n";
  result += "<tr><th>연극</th><th>좌석 수</th><th>금액</th></tr>";
  for (let perf of data.performances) {
    result += ` <tr><td>${perf.play.name}</td><td>${perf.audience}석</td>`;
    result += `<td>${usd(perf.amount)}</td></tr>\n`;
  }
  result += "</table>\n";
  result += `<p>총액: <em>${usd(data.totalAmount)}</em></p>\n`;
  result += `<p>적립 포인트: <em>${data.totalVolumeCredits}</em>점</p>\n`;

  return result;
}

function usd(aNumber) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(aNumber);
}

const fs = require("fs");

// invoices.json 파일에서 데이터 읽어오기
const invoicesData = fs.readFileSync(
  "./Chapter01/실습/datasets/invoices.json",
  "utf8"
);
const invoices = JSON.parse(invoicesData);

// plays.json 파일에서 데이터 읽어오기
const playsData = fs.readFileSync(
  "./Chapter01/실습/datasets/plays.json",
  "utf8"
);
const plays = JSON.parse(playsData);

// statement 함수에 데이터 전달하여 실행
const result = statement(invoices[0], plays);

// 결과 출력
console.log(result);
