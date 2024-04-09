/* 
1.5 중간 점검
- 리팩토링 결과 코드 구조가 한결 나아졌다.
- 최상위의 statement() 함수는 이제 단 일곱 줄뿐이며, 출력할 문장을 생성하는 일만 한다.
- 계산 로직은 모두 여러 개의 보조 함수로 빼냈다.
- 결과적으로 각 계산 과정은 물론 전체 흐름을 파악하기가 훨씬 쉬워졌다.
*/

function statement(invoice, plays) {
  let result = `청구내역 (고객명: ${invoice.customer})\n`;
  for (let perf of invoice.performances) {
    // 청구 내역을 출력한다.
    result += `${playFor(perf).name}: ${usd(amountFor(perf) / 100)} ${
      perf.audience
    }석\n`;
  }
  result += `총액 ${usd(totalAmount() / 100)}\n`;
  result += `적립 포인트 ${totalVolumeCredits()}점\n`;

  return result;

  // 로컬 변수를 질의 함수로 바꾸기
  function playFor(aPerformance) {
    return plays[aPerformance.playID];
  }

  // 값이 바뀌지 않는 값은 매개변수로 전달
  function amountFor(aPerformance) {
    let result = 0; // 변수를 초기화하는 코드, 명확한 이름으로 변경(화자는 함수의 반환 값에는 항상 result를 사용)
    switch (playFor(aPerformance).type) {
      case "tragedy":
        result = 40_000;

        if (aPerformance.audience > 30) {
          result += 1_000 * (aPerformance.audience - 30);
        }
        break;
      case "comedy":
        result = 30_000;

        if (aPerformance.audience > 20) {
          result += 10_000 + 500 * (aPerformance.audience - 20);
        }
        result += 300 * aPerformance.audience;
        break;

      default:
        throw new Error(`알 수 없는 장르: ${playFor(aPerformance).type}`);
    }
    return result; // 함수 안에서 값이 바뀌는 변수 반환
  }

  function volumeCreditsFor(aPerformance) {
    let result = 0;
    result += Math.max(aPerformance.audience - 30, 0);
    if ("comedy" === playFor(aPerformance).type) {
      result += Math.floor(aPerformance.audience / 5);
    }
    return result;
  }

  function totalVolumeCredits() {
    let result = 0; // 변수 선언(초기화)을 반복문 앞으로 이동
    for (let perf of invoice.performances) {
      result += volumeCreditsFor(perf);
    }
    return result;
  }

  function usd(aNumber) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(aNumber);
  }

  function totalAmount() {
    let result = 0;
    for (let perf of invoice.performances) {
      result += amountFor(perf);
    }
    return result;
  }
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
