import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  server:{
    proxy:{
      // on doit commercer par api car dans le frontend avec injection de l adresse du backend commerce par en api
      '/api':{
        target : "http://localhost:5000",
        secure:false
      },
    },
  },
  plugins: [react()],
});
