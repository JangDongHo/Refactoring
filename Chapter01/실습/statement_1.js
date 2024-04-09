function statement(invoice, plays) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `청구내역 (고객명: ${invoice.customer})\n`;
  const format = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format;

  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    let thisAmount = 0;

    switch (play.type) {
      case "tragedy":
        thisAmount = 40_000;

        if (perf.audience > 30) {
          thisAmount += 1_000 * (perf.audience - 30);
        }
        break;
      case "comedy":
        thisAmount = 30_000;

        if (perf.audience > 20) {
          thisAmount += 10_000 + 500 * (perf.audience - 20);
        }
        thisAmount += 300 * perf.audience;
        break;

      default:
        throw new Error(`알 수 없는 장르: ${play.type}`);
    }

    // 포인트를 적립한다.
    volumeCredits += Math.max(perf.audience - 30, 0);

    // 희극 관객 5명마다 추가 포인트를 제공한다.
    if ("comedy" === play.type) {
      volumeCredits += Math.floor(perf.audience / 5);
    }

    // 청구 내역을 출력한다.
    result += `${play.name}: ${format(thisAmount / 100)} ${perf.audience}석\n`;
    totalAmount += thisAmount;
  }
  result += `총액 ${format(totalAmount / 100)}\n`;
  result += `적립 포인트 ${volumeCredits}점\n`;

  return result;
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
