// vite.config.ts
import tailwindcss from "file:///D:/Deadline%20Year%204/Th%E1%BB%B1c%20T%E1%BA%ADp%20MeU/todo-app/node_modules/@tailwindcss/vite/dist/index.mjs";
import react from "file:///D:/Deadline%20Year%204/Th%E1%BB%B1c%20T%E1%BA%ADp%20MeU/todo-app/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { defineConfig } from "file:///D:/Deadline%20Year%204/Th%E1%BB%B1c%20T%E1%BA%ADp%20MeU/todo-app/node_modules/vite/dist/node/index.js";
import viteTsconfigPaths from "file:///D:/Deadline%20Year%204/Th%E1%BB%B1c%20T%E1%BA%ADp%20MeU/todo-app/node_modules/vite-tsconfig-paths/dist/index.mjs";
var vite_config_default = defineConfig({
  base: "./",
  plugins: [react(), tailwindcss(), viteTsconfigPaths()],
  server: {
    port: 5173,
    host: "localhost"
  },
  preview: {
    port: 5173
  },
  optimizeDeps: { exclude: ["fsevents"] },
  build: {
    rollupOptions: {
      external: ["fs/promises"],
      output: {
        experimentalMinChunkSize: 3500
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxEZWFkbGluZSBZZWFyIDRcXFxcVGhcdTFFRjFjIFRcdTFFQURwIE1lVVxcXFx0b2RvLWFwcFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcRGVhZGxpbmUgWWVhciA0XFxcXFRoXHUxRUYxYyBUXHUxRUFEcCBNZVVcXFxcdG9kby1hcHBcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L0RlYWRsaW5lJTIwWWVhciUyMDQvVGglRTElQkIlQjFjJTIwVCVFMSVCQSVBRHAlMjBNZVUvdG9kby1hcHAvdml0ZS5jb25maWcudHNcIjsvLy8gPHJlZmVyZW5jZSB0eXBlcz1cInZpdGUvY2xpZW50XCIgLz5cclxuXHJcbmltcG9ydCB0YWlsd2luZGNzcyBmcm9tICdAdGFpbHdpbmRjc3Mvdml0ZSdcclxuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xyXG5pbXBvcnQgdml0ZVRzY29uZmlnUGF0aHMgZnJvbSAndml0ZS10c2NvbmZpZy1wYXRocydcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgYmFzZTogJy4vJyxcclxuICBwbHVnaW5zOiBbcmVhY3QoKSwgdGFpbHdpbmRjc3MoKSwgdml0ZVRzY29uZmlnUGF0aHMoKV0sXHJcbiAgc2VydmVyOiB7XHJcbiAgICBwb3J0OiA1MTczLFxyXG4gICAgaG9zdDogJ2xvY2FsaG9zdCcsXHJcbiAgfSxcclxuICBwcmV2aWV3OiB7XHJcbiAgICBwb3J0OiA1MTczLFxyXG4gIH0sXHJcbiAgb3B0aW1pemVEZXBzOiB7IGV4Y2x1ZGU6IFsnZnNldmVudHMnXSB9LFxyXG4gIGJ1aWxkOiB7XHJcbiAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgIGV4dGVybmFsOiBbJ2ZzL3Byb21pc2VzJ10sXHJcbiAgICAgIG91dHB1dDoge1xyXG4gICAgICAgIGV4cGVyaW1lbnRhbE1pbkNodW5rU2l6ZTogMzUwMCxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgfSxcclxufSlcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUVBLE9BQU8saUJBQWlCO0FBQ3hCLE9BQU8sV0FBVztBQUNsQixTQUFTLG9CQUFvQjtBQUM3QixPQUFPLHVCQUF1QjtBQUU5QixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixNQUFNO0FBQUEsRUFDTixTQUFTLENBQUMsTUFBTSxHQUFHLFlBQVksR0FBRyxrQkFBa0IsQ0FBQztBQUFBLEVBQ3JELFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsRUFDUjtBQUFBLEVBQ0EsY0FBYyxFQUFFLFNBQVMsQ0FBQyxVQUFVLEVBQUU7QUFBQSxFQUN0QyxPQUFPO0FBQUEsSUFDTCxlQUFlO0FBQUEsTUFDYixVQUFVLENBQUMsYUFBYTtBQUFBLE1BQ3hCLFFBQVE7QUFBQSxRQUNOLDBCQUEwQjtBQUFBLE1BQzVCO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
