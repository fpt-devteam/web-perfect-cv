// Re-export section components from new modules for easy access
export { CVContactSection } from '@/modules/contact';
export { CVExperienceSection } from '@/modules/experience';
export { CVSummarySection } from '@/modules/summary';
export { CertificationSection } from '@/modules/certification';
export { ProjectSection } from '@/modules/project';
export { EducationSection } from '@/modules/education';
export { SkillSection } from '@/modules/skill';

// Backwards compatibility aliases
export { CVContactSection as ContactSection } from '@/modules/contact';
export { CVExperienceSection as ExperienceSection } from '@/modules/experience';
export { CVSummarySection as SummarySection } from '@/modules/summary';

// Core CV components that remain in this module
export { CVList } from './CVList';
export { CVCard } from './CVCard';
export { CreateCVForm } from './CreateCVForm';
export { CVActionsModal } from './CVActionsModal';
export { CVPreview } from '@/modules/cv/components/preview/CVPreview';
export { CvSectionTab } from './CvSectionTab';
export { CVSectionNavbar } from './CVSectionNavbar';
export { AnalysisSidebar } from './AnalysisSidebar';
export { AnalyticsModal } from './AnalyticsModal';
export { AIScoreCard } from './AIScoreCard';
export { EnhancedAIScoreCard } from './EnhancedAIScoreCard';
export { HarvardCVDocument } from '@/modules/cv/components/preview/HarvardCVDocument';
