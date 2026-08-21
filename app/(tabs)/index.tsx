import { Screen } from '@/components/Screen';
import { VerseCard } from '@/components/VerseCard';
import { SectionHeader } from '@/components/SectionHeader';
import { InfoCard } from '@/components/InfoCard';
import { AppHeader } from '@/components/AppHeader';
export default function Home() { return <Screen><AppHeader title="Bom dia" subtitle="Uma palavra para acompanhar o seu dia." /><VerseCard /><SectionHeader title="Continue lendo" /><InfoCard title="João 4" text="Continue de onde parou" /><SectionHeader title="Devocional" /><InfoCard title="Um tempo para a Palavra" text="Devocionais e planos de estudo estarão disponíveis em breve." /></Screen>; }
