export interface CriteriaScore {
    id: string;
    criterion: string;
    score0To5: number;
    weight0To1: number;
    justification: string;
    evidenceFound: string[];
    missingElements: string[];
}

export interface SectionScore {
    criteriaScores: CriteriaScore[];
    totalScore0To5: number;
    weight0To1: number;
}

export interface SectionScoreResultResponse {
    id: string;
    cvId: string;
    sectionType: SectionType;
    sectionScore: SectionScore;
}

export interface CVSectionScoresResponse {
    cvId: string;
    sectionScores: SectionScoreResultResponse[];
    totalScore: number;
    maxPossibleScore: number;
    scorePercentage: number;
}

export enum SectionType {
    Contact = 'Contact',
    Summary = 'Summary',
    Experience = 'Experience',
    Education = 'Education',
    Skills = 'Skills',
    Projects = 'Projects',
    Certifications = 'Certifications'
}

export interface AIEvaluationDisplayProps {
    sectionScore?: SectionScore;
    sectionType: SectionType;
    isLoading?: boolean;
}
