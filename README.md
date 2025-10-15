# Pomodoro Timer - Ứng dụng React Native với Expo

## Giới thiệu

Ứng dụng Pomodoro Timer hỗ trợ người dùng quản lý thời gian làm việc theo phương pháp Pomodoro (25 phút làm việc, 5 phút nghỉ), phù hợp để thực hành môn Phát triển ứng dụng di động đa nền tảng.

## Tính năng đã triển khai

- Timer đếm ngược chế độ Work và Break.
- Nút Start, Pause, Reset.
- Tự động lưu phiên đã hoàn thành vào AsyncStorage với thời gian bắt đầu, kết thúc và loại phiên.
- Màn hình Lịch sử hiển thị các phiên đã lưu.
- Điều hướng giữa màn hình Timer và History thông qua React Navigation.

## Tính năng mở rộng

- Thông báo khi hết phiên.
- Rung thiết bị khi chuyển phiên.
- Giữ màn hình sáng khi timer chạy.

## Công nghệ sử dụng

- React Native với Expo.
- AsyncStorage để lưu dữ liệu cục bộ.
- React Navigation để điều hướng nhiều màn hình.
- expo-notifications để gửi thông báo.
- expo-haptics để rung thiết bị.
- expo-keep-awake để giữ màn hình sáng.

## Cấu trúc thư mục chính

- /screens — chứa các màn hình chính như TimerScreen và HistoryScreen.
- /components — chứa các thành phần giao diện tách riêng (Timer hiển thị đồng hồ, ControlButtons).
- /utils — chứa hàm xử lý AsyncStorage hoặc logic tái sử dụng.

## Cách cài đặt và chạy ứng dụng

1. Clone dự án.
2. Cài dependencies với `npm install`.
3. Chạy dự án bằng `npx expo start`.
4. Mở trên emulator Android hoặc ứng dụng Expo Go trên thiết bị thật.
