import VisualiserClient from './VisualiserClient'
import config from '@/vertical.config'

export const metadata = {
  title: `AI Room Visualiser — ${config.name}`,
  description: 'Upload your room photo and watch AI redesign it in your chosen style instantly.',
}

export default function VisualisePage() {
  return <VisualiserClient />
}
