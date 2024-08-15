// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// // https://vitejs.dev/config/
// export default defineConfig({
//     plugins: [react()],
//     // build: {
//     //     outDir: "../backend/static",
//     //     emptyOutDir: true,
//     //     sourcemap: true
//     // },
//     build: {
//         chunkSizeWarningLimit: 100,
//         rollupOptions: {
//         onwarn(warning, warn) {
//           if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
//             return
//           }
//           warn(warning)
//         }}
//       },
//     server: {
//         // port: 3000,
//         // proxy: {
//         //     "/ask": "http://localhost:5000",
//         //     "/chat": "http://localhost:5000"
//         // }
//     }
// });

import { defineConfig,loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import env from 'dotenv'
env.config()
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    // logLevel: 'silent', // ปิดการแสดง log ทั้งหมด
    define: {
      'process.env': process.env
    },
    plugins: [react()],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test.config.ts',
    },
    // build: {
    //     outDir: "../backend/static",
    //     emptyOutDir: true,
    //     sourcemap: true
    // },
    build: {
        chunkSizeWarningLimit: 100,
        rollupOptions: {
        onwarn(warning, warn) {
          if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
            return
          }
          warn(warning)
        }},
      },
    server: {
        // port: 3000,
        // proxy: {
        //     "/ask": "http://localhost:5000",
        //     "/chat": "http://localhost:5000"
        // }
    }
  }
})
