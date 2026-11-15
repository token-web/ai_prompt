import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// 이미지는 저장소 맨 위의 images 폴더에 있으므로 빌드에 복사하지 않습니다 (publicDir: false).
export default defineConfig({
  base: './',
  publicDir: false,
  plugins: [react(), tailwindcss()],
});
