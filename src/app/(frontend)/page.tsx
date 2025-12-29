import { HomeContent } from '@/components/home-page/home-content'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Diego Cancino | Full Stack Developer & AI Engineer',
  description: 'Explora mi portafolio de desarrollo Full Stack, arquitecturas de software e ingeniería de Inteligencia Artificial.',
};

export default function HomePage() {
  return <HomeContent />
}