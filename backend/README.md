# 프로젝트 구조 및 코딩 가이드라인

이 문서는 우리의 NestJS 애플리케이션을 위한 표준화된 프로젝트 구조와 코딩 원칙을 설명합니다. 이러한 지침을 준수함으로써 우리는 일관성을 유지하고, 가독성을 높이며, 코드베이스의 유지보수성을 향상시키는 것을 목표로 합니다.

## 디렉터리 구조

우리의 프로젝트는 각 모듈이 자신의 도메인 로직을 캡슐화하는 모듈화된 구조를 따릅니다. 아래는 `registration` 모듈의 디렉터리 구조입니다:

```
src/
├── registration/
│   ├── dto/
│   ├── core/
│   │   ├── parser/
│   │   │   ├── registration.parser.ts
│   │   │   └── ownership.parser.ts
│   │   ├── math/
│   │   │   └── complex_calculation.math.ts
│   │   └── utils/
│   │       └── helper.ts
│   ├── registration.controller.ts
│   ├── registration.service.ts
│   └── registration.module.ts
```

### 디렉터리 설명

- **dto/**: 데이터 전송 객체를 포함하며, 데이터 형태를 정의하고 입력을 검증하는 데 사용됩니다.

- **core/**: 모듈의 핵심 비즈니스 로직을 포함하고, 클래스별로 하위 폴더에 정리되어 있습니다:

  - **parser/**: `registration.parser.ts`와 `ownership.parser.ts`와 같은 파싱 작업을 담당하는 클래스를 포함합니다.

  - **math/**: `complex_calculation.math.ts`와 같은 복잡한 수학적 계산을 위한 클래스를 포함합니다.

  - **utils/**: `registration` 모듈에 특화된 유틸리티 함수와 헬퍼 클래스를 포함합니다.

- **registration.controller.ts**: 들어오는 HTTP 요청을 처리하고 응답을 전송하며, API 라우팅과 데이터 전송에만 집중합니다.

- **registration.service.ts**: 비즈니스 로직 절차를 관리하며, `core` 레이어의 클래스를 활용하여 작업을 조율합니다.

- **registration.module.ts**: NestJS 모듈 시스템을 위해 컨트롤러, 서비스 및 기타 제공자들을 결합하는 모듈 파일입니다.

## 코딩 원칙

### 함수형 프로그래밍 패러다임

우리는 함수형 프로그래밍 원칙을 활용하여 깨끗하고 유지보수 가능하며 테스트 가능한 코드를 작성합니다. 여기에는 다음이 포함됩니다:

- **순수 함수**: 동일한 입력에 대해 항상 동일한 출력을 반환하며, 부작용이 없는 함수.

- **불변성**: 예기치 않은 부작용을 방지하기 위해 데이터 구조를 변경하지 않음.

- **함수 조합**: `pipe`와 같은 고차 함수를 사용하여 단순하고 재사용 가능한 함수들로 복잡한 작업을 구성.

### 복잡한 비즈니스 로직의 캡슐화

- **Core 레이어 조직**: 복잡한 비즈니스 로직은 `core` 레이어 안에서 의미 있는 하위 디렉터리(`parser`, `math`, `utils`)로 나뉘어 캡슐화됩니다.

- **클래스 기반 구조**: 복잡한 로직은 클래스로 구성되어 모듈화와 재사용성을 촉진합니다.

- **서비스 레이어 단순화**: 복잡한 로직을 `core` 레이어로 오프로드하여 서비스 레이어는 비즈니스 프로세스를 조율하는 데 집중하게 됩니다.

### 컨트롤러와 서비스의 역할 분리

- **컨트롤러**: API 요청과 응답을 처리하며, 비즈니스 로직을 포함하지 않습니다.

- **서비스**: 비즈니스 로직 절차에 집중하고, `core` 레이어의 메서드를 활용하여 작업을 수행합니다.

## 이 구조의 장점

- **일관성**: 모듈 전반에 걸친 표준화된 구조는 팀 협업과 코드베이스 탐색을 용이하게 합니다.

- **유지보수성**: 관심사의 분리는 업데이트 및 디버깅을 더 쉽게 하며, 한 영역의 변경이 다른 곳에 미치는 영향을 최소화합니다.

- **가독성**: 명확한 조직과 함수형 프로그래밍 관행 준수는 코드를 더 쉽게 이해할 수 있게 만듭니다.

- **확장성**: 이 구조는 성장에 적합하며, 새로운 기능과 로직을 최소한의 혼란으로 추가할 수 있습니다.




## 개발 가이드라인


### 새로운 로직 추가

- **Core 레이어**: 새로운 복잡한 비즈니스 로직 클래스는 `core/` 내의 적절한 하위 디렉터리에 추가하십시오. 예를 들어, 새로운 파싱 로직을 추가하려면 `core/parser/`에 새 파일을 생성하십시오. 


- **서비스 레이어**: `core` 레이어의 클래스와 함수를 사용하여 비즈니스 절차를 구축하고, 서비스 메서드는 간결하고 집중적이어야 합니다.


- **컨트롤러 레이어**: 컨트롤러는 요청 및 응답 처리에만 집중하고, 모든 처리는 서비스 레이어에 위임하십시오.






### 코딩 표준

- **명명 규칙**: 파일, 클래스, 함수에 대해 목적을 반영하는 명확하고 설명적인 이름을 사용하고 최지민 PO님 께서 정의한 ADDD에서 공통적으로 지켜지는 코드 컨벤션을 따르도록 합니다

- **함수의 순수성**: 특히 `core` 레이어에서 순수 함수를 작성하려고 노력하십시오. 

- **불변성**: 입력 매개변수를 변경하지 않고, 대신 새로운 인스턴스나 데이터 구조를 반환하십시오.

- **에러 처리**: 에러반환들은 Core에서의 순수함수들의 Either/Result 반환 패턴으로 통일합니다.


## 예시 구현

### 서비스 레이어 (`registration.service.ts`)

```typescript
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { RegistrationParser } from './core/parser/registration.parser';

@Injectable()
export class RegistrationService {
  constructor(private readonly registrationParser: RegistrationParser) {}

  async create(file: Express.Multer.File) {
    try {
      const parsedText = await parsePdfToText(file.buffer);
      const registrationInfo = this.registrationParser.extractRegistration(parsedText);

      // 추가적인 비즈니스 로직 (예: 데이터베이스에 데이터 저장)

      return registrationInfo;
    } catch (error) {
      throw new InternalServerErrorException(`PDF 파싱 실패: ${error.message}`);
    }
  }

  // 기타 비즈니스 절차에 집중한 서비스 메서드들...
}
```

### 코어 레이어 (`core/parser/registration.parser.ts`)

```typescript
import { Injectable } from '@nestjs/common';
import { pipe } from '../../../utils/functionalUtil';
import { RegistrationInfo } from '../../dto/registration-info.dto';

@Injectable()
export class RegistrationParser {
  extractRegistration = (text: string): RegistrationInfo => {
    const result = pipe(
      this.extractUniqueNumber,
      this.extractOwnershipSection,
      this.splitLines,
      this.findHeaderLineIndex,
      this.getDataLines,
      this.parseDataLines
    )(text);

    return {
      uniqueNumber: result.uniqueNumber,
      ownership: result.ownershipList,
    };
  };

  private extractUniqueNumber = (text: string) => {
    // 순수 함수 구현...
  };

  // 파싱 로직을 구성하는 기타 순수 함수들...
}
```

