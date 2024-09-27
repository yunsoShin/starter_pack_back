# 프로젝트 구조 및 코딩 가이드라인

이 문서는 우리의 NestJS 애플리케이션을 위한 표준화된 프로젝트 구조와 코딩 원칙을 설명합니다. 이러한 지침을 준수함으로써 우리는 일관성을 유지하고, 가독성을 높이며, 코드베이스의 유지보수성을 향상시키는 것을 목표로 합니다.

## 디렉터리 구조

우리의 프로젝트는 각 모듈이 자신의 도메인 로직을 캡슐화하는 모듈화된 구조를 따릅니다. 아래는 `user` 모듈의 디렉터리 구조입니다:

```
src/
├── user/
│   ├── dto/
│   ├── entities/
│   ├── domain/
│   │   ├── parser/
│   │   │   ├── persnal.parser.ts
│   │   │   └── resumeFile.parser.ts
│   │   ├── math/
│   │   │   └── complex_calculation.math.ts
│   │   └── utils/
│   │       └── helper.ts
│   ├── user.controller.ts
│   ├── user.service.ts
│   └── user.module.ts
```

### 디렉터리 설명

- **dto/**: 데이터 전송 객체를 포함하며, 데이터 형태를 정의하고 입력을 검증하는 데 사용됩니다.

- **domain/**: 모듈의 핵심 비즈니스 로직에 필요한코드를 작성하는 레이어입니다, 클래스별로 하위 폴더에 정리되어 있습니다

  - **parser/**: `persnal.parser.ts`와 `resumeFile.parser.ts`와 같은 파싱 작업을 담당하는 클래스를 포함합니다.

  - **math/**: `complex_calculation.math.ts`와 같은 복잡한 수학적 계산을 위한 클래스를 포함합니다.

  - **utils/**: `user` 모듈에 특화된 유틸리티 함수와 헬퍼 클래스를 포함합니다.

- **user.controller.ts**: 들어오는 HTTP 요청을 처리하고 응답을 전송하며, API 라우팅과 데이터 전송에만 집중합니다.

- **user.service.ts**: 비즈니스 로직 절차를 관리하며, `domain` 레이어의 클래스를 활용하여 작업을 조율합니다.

- **user.module.ts**: NestJS 모듈 시스템을 위해 컨트롤러, 서비스 및 기타 제공자들을 결합하는 모듈 파일입니다.

## 코딩 원칙

### 함수형 프로그래밍 패러다임

우리는 함수형 프로그래밍 원칙을 활용하여 깨끗하고 유지보수 가능하며 테스트 가능한 코드를 작성합니다. 여기에는 다음이 포함됩니다:

- **순수 함수**: 동일한 입력에 대해 항상 동일한 출력을 반환하며, 부작용이 없는 함수.

- **불변성**: 예기치 않은 부작용을 방지하기 위해 데이터 구조를 변경하지 않음.

- **함수 조합**: `pipe`와 같은 고차 함수를 사용하여 단순하고 재사용 가능한 함수들로 복잡한 작업을 구성.

### 복잡한 비즈니스 로직의 캡슐화

- **domain 레이어 조직**: 복잡한 비즈니스 로직은 `domain` 레이어 안에서 의미 있는 하위 디렉터리(`parser`, `math`, `utils` ,`각 도메인에 맞는 구성요소들` ...등등)로 나뉘어 캡슐화됩니다.

- **서비스 레이어 단순화**: 복잡한 로직을 `domain` 레이어로 오프로드하여 서비스 레이어는 비즈니스 프로세스에 집중하게 됩니다.

### 컨트롤러와 서비스의 역할 분리

- **컨트롤러**: API 요청과 응답을 처리하며, 비즈니스 로직을 포함하지 않습니다.

- **서비스**: 비즈니스 로직 절차에 집중하고, `domain` 레이어의 메서드를 활용하여 작업을 수행합니다.

## 개발 가이드라인

### 새로운 로직 추가

- **domain 레이어**: 새로운 복잡한 비즈니스 로직 클래스는 `domain/` 내의 적절한 하위 디렉터리에 추가하십시오. 예를 들어, 새로운 파싱 로직을 추가하려면 `domain/parser/`에 새 파일을 생성하십시오.

- **서비스 레이어**: `domain` 레이어의 클래스와 함수를 사용하여 비즈니스 절차를 구축하고, 다른 서비스들과의 의존성을 나타내는것에 집중합니다. 서비스 메서드는 최대한 간결하고 집중적이어야 합니다.

- **컨트롤러 레이어**: 컨트롤러는 요청 및 응답 처리에만 집중하고, 모든 처리는 서비스 레이어에 위임하십시오.

### 코딩 표준

- **명명 규칙**: 파일, 클래스, 함수에 대해 목적을 반영하는 명확하고 설명적인 이름을 사용하고 개발자들간에 공통적으로 지켜지는 코드 컨벤션을 따르도록 합니다 -파일명 케밥케이스로 구분 -클래스명 파스칼 케이스로 구분
  -DB테이블,컬럼명 스네이크케이스로 구분

- **함수의 순수성**: 특히 `domain` 레이어에서 순수 함수를 작성하려고 노력하세요.

- **불변성**: 입력 매개변수를 변경하지 않고, 대신 새로운 인스턴스나 데이터 구조를 반환하세요.

- **에러 처리**: 에러반환들은 domain에서의 순수함수들의 Either/Result 반환 패턴으로 통일합니다.

## 예시 구현

### 서비스 레이어 (`user.service.ts`)

```typescript
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { parsnalParser } from "./domain/user/parsnal.parser";

@Injectable()
export class UserService {
  constructor(private readonly parsnalParser: ParsnalParser) {}

  async create(file: Express.Multer.File) {
    try {
      const parsedText = await parsePdfToText(file.buffer);
      const userInfo = this.parsnalParser.extractUser(parsedText);
      //  모나드를 이용한 에러처리 로직
      // 추가적인 비즈니스 로직 (예: 데이터베이스에 데이터 저장)
      return userInfo;
    } catch (error) {
      throw new InternalServerErrorException(`PDF 파싱 실패: ${error.message}`);
    }
  }

  // 기타 비즈니스 절차에 집중한 서비스 메서드들...
}
```

### 서비스 레이어에서 활용될 도메인 레이어 (`/user/domain/parser/resume.parser.ts`)

```typescript
import { pipe } from "../../../utils/functionalUtil";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ResumeParser {
  extractResume = (text: string) => {
    const result = pipe(
      this.extractSelfIntroduction,
      this.extractAddress,
      this.extractPhoneNumber,
      this.extractAge,
      this.extractUniversity
    )(text);

    return {
      score: result.score,
      priority: result.priority,
      interviewDate: result.interviewDate,
    };
  };

  private extractSelfIntroduction = (text: string) => {
    // 순수 함수 구현...
  };

  private extractAddress = (text: string) => {
    // 순수 함수 구현...
  };

  // 기타 추출 함수들...
}
```
