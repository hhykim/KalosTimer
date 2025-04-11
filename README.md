# 칼로스 왼비 타이머

![OpenCV](https://img.shields.io/badge/OpenCV-5C3EE8?style=for-the-badge&logo=opencv&logoColor=white)
![WebRTC](https://img.shields.io/badge/WebRTC-333333?style=for-the-badge&logo=webrtc&logoColor=white)

![](screenshot.png?raw=true)

메이플스토리 보스 칼로스의 공격 패턴에 미리 대응할 수 있도록 도와주는 웹 타이머입니다.

<br>

## 소개

[메이플 인벤 게시물](https://www.inven.co.kr/board/maple/2304/35436)

<br>

## 기능

> [!WARNING]
> 네이버 웨일에서는 정상적으로 작동되지 않습니다.

- 미니맵을 통해 왼비 활성화 여부를 자동 인식
  - 픽셀 색상 비교
  - 창모드 감지 (수동 보정 가능)
- 레이저 주기에 맞춰 알림음 출력 (성우: 김설아)
- OpenCV.js로 강화 간섭 주기 보정
  1. 프레임 캡처
  2. ROI 설정
  3. HSV 변환 후 빨간색 마스킹
  4. 가우시안 블러 (false positive 방지)
  5. 허프 변환(gradient)으로 원 검출

<br>

## 문의

[카카오톡 오픈채팅](https://open.kakao.com/me/csmin) by 민채솔@스카니아
