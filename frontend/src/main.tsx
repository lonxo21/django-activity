import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Provider } from "@/components/ui/provider"
import { BrowserRouter, Routes, Route } from "react-router";
import { HomePage } from './components/HomePage.tsx'
import { ChartPage } from './components/ChartPage.tsx';
import '@ant-design/v5-patch-for-react-19';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage/>}/>
          <Route path="/graficos" element={<ChartPage/>}/>
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
