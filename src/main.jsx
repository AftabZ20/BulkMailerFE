import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import EmailSender from './email-sender/EmailSender.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <EmailSender />
  </StrictMode>,
)
