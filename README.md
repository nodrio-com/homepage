# nodrio · AEROPOD

사용자가 선택한 **Quiet Form** 방향의 한국어 제품 웹사이트 프로토타입. 회사명은 nodrio, 제품명은 가칭 AEROPOD다.

## 실행

이 `homepage` 폴더가 독립적인 홈페이지 프로젝트이자 Git 저장소 루트다. 설치·실행·빌드는 이 폴더에서 수행한다.

Node.js 24 LTS 권장. 최소 Node.js 22.12 이상.

```sh
npm ci
npm run dev
```

개발 미리보기: http://127.0.0.1:5173

```sh
npm run build
npm run preview
```

`npm run build`는 TypeScript 검사와 Vite 프로덕션 빌드를 수행하며 결과는 `dist/`다.

## 구성

- React · TypeScript · Vite, Pretendard 자체 제공, Lucide 아이콘.
- 데스크톱·태블릿·모바일 반응형. 모바일 전용 제품 히어로.
- 제품 소개, 핵심 장점, 부착→분리→비행, 활용 장면, FAQ, 출시 알림.
- 키보드로 조작할 수 있는 사용 단계 탭, 수동 장면 전환, FAQ 아코디언, 모바일 메뉴.
- 섹션 등장·이미지 전환·부드러운 앵커 이동. `prefers-reduced-motion` 지원.
- 비행시간·무게·가격·인증·출시일·호환 기종 수치를 만들어 넣지 않았다.

## 출시 알림 폼

기본값은 명시적인 **데모**다. 입력 검증·동의·완료 상태를 확인할 수 있지만 이메일은 저장·전송하지 않는다. 접수되지 않았다는 사실을 화면에도 표시한다.

실제 신청을 받으려면 이메일을 저장하고 알림을 제공하는 서비스가 필요하다. `.env.example`을 참고해 다음 두 공개 환경변수를 모두 설정한 뒤 다시 빌드한다.

- `VITE_WAITLIST_ENDPOINT`: 운영할 폼 API의 HTTPS URL 또는 같은 도메인의 `/api/...` 경로.
- `VITE_PRIVACY_NOTICE`: 실제 운영 방식에 맞춰 회사가 확정한 수집·이용 안내 문구.

둘 중 하나라도 없으면 데모로 유지한다. `VITE_` 값은 브라우저에 노출된다. API 비밀키를 넣지 않는다. 별도 도메인 API는 이 사이트에서의 CORS 요청을 허용해야 한다.

요청:

```json
{
  "email": "person@example.com",
  "consent": true,
  "source": "nodrio-launch",
  "consentVersion": "2026-10-08"
}
```

성공은 HTTP 2xx와 다음 JSON이 함께 있을 때만 표시한다.

```json
{ "success": true }
```

10초 이내 응답이 없거나 저장이 확인되지 않으면 오류를 표시한다. API에서 검증·중복 처리·남용 방지·실제 저장을 구현해야 한다. 현재 저장 API 및 메일 발송 서비스는 포함되지 않았으며 운영 데이터 전송은 검증하지 않았다.

## GitHub → Vercel → 도메인

1. 이 `homepage` 폴더의 내용을 GitHub 저장소 루트로 커밋·푸시한다. `node_modules`, `dist`, `.env`는 `.gitignore`에서 제외한다. `public/images`, `package-lock.json`은 포함한다. 상위 폴더의 디자인 시안·원본 이미지·검증 자료는 업로드할 필요가 없다.
2. Vercel의 새 프로젝트에서 해당 GitHub 저장소를 가져온다.
3. Root Directory는 저장소 루트(`.`), Framework Preset은 **Vite**, Build Command는 `npm run build`, Output Directory는 `dist`. 빌드 설정은 `vercel.json`에 포함되어 있다.
4. 필요하면 위 폼 환경변수를 Vercel에 설정한다. 설정하지 않으면 알림 폼은 데모로 배포된다.
5. 생성된 Vercel 주소를 확인한 뒤 프로젝트 Settings → Domains에서 소유한 도메인을 추가하고, Vercel이 안내하는 DNS 레코드를 도메인 제공업체에 적용한다.

이 작업에서는 GitHub 푸시나 Vercel·도메인 배포를 수행하지 않았다. 실제 도메인이 정해지면 canonical URL과 절대 URL의 소셜 공유 이미지를 추가한다.

참고: [Vercel의 Vite 배포 문서](https://vercel.com/docs/frameworks/frontend/vite), [Vite 정적 배포 문서](https://vite.dev/guide/static-deploy.html).

## 수정 위치

- `src/App.tsx`: 화면과 인터랙션, 알림 폼
- `src/content.ts`: 단계 설명·활용 장면·FAQ
- `src/styles.css`: 디자인 토큰·레이아웃·반응형·움직임
- `public/images/`: 최적화된 이미지

디자인 기준·시안·이미지 생성 프롬프트·검증 자료는 상위 작업 폴더에 남겨 두었으며 홈페이지 실행·배포에는 필요하지 않다.

제품 이미지는 형태 제안용 콘셉트다. 실제 하드웨어 자료가 준비되면 렌더를 교체하고 제품 문구를 갱신한다.
