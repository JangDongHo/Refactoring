function createStatementData(invoice, plays) {
  const statementData = {};
  statementData.customer = invoice.customer; // 고객 데이터를 중간 데이터로 옮김
  statementData.performances = invoice.performances.map(enrichPerformance); // 중간 데이터 구조에 공연 정보 추가
  statementData.totalAmount = totalAmount(statementData); // 중간 데이터 구조에 총 금액 추가
  statementData.totalVolumeCredits = totalVolumeCredits(statementData); // 중간 데이터 구조에 총 포인트 추가
  return statementData;

  function enrichPerformance(aPerformance) {
    const result = Object.assign({}, aPerformance); // 얕은 복사 수행
    result.play = playFor(result); // 중간 데이터 구조에 연극 정보를 추가
    result.amount = amountFor(result); // 중간 데이터 구조에 금액 정보를 추가
    result.volumeCredits = volumeCreditsFor(result); // 중간 데이터 구조에 포인트 정보를 추가
    return result;
  }

  function playFor(aPerformance) {
    return plays[aPerformance.playID];
  }

  // 값이 바뀌지 않는 값은 매개변수로 전달
  function amountFor(aPerformance) {
    let result = 0; // 변수를 초기화하는 코드, 명확한 이름으로 변경(화자는 함수의 반환 값에는 항상 result를 사용)
    switch (aPerformance.play.type) {
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
    if ("comedy" === aPerformance.play.type) {
      result += Math.floor(aPerformance.audience / 5);
    }
    return result;
  }

  function totalAmount(data) {
    return data.performances.reduce((total, p) => total + p.amount, 0); // for 반복문을 파이프라인으로 바꾸기
  }

  function totalVolumeCredits(data) {
    return data.performances.reduce((total, p) => total + p.volumeCredits, 0); // for 반복문을 파이프라인으로 바꾸기
  }
}

module.exports = createStatementData;
