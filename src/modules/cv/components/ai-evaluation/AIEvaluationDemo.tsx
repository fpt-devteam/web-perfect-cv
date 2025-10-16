import { AIEvaluationCard } from './AIEvaluationCard';
import { SectionType, type SectionScore } from '@/modules/cv/types/ai-evaluation.types';

// Demo data based on the provided JSON
const demoSectionScore: SectionScore = {
    criteriaScores: [
        {
            id: 'exp.relevance',
            criterion: 'Technical Internship/Work Relevance',
            score0To5: 3,
            weight0To1: 0.5,
            justification: 'The experience is a backend engineer internship focused on C# and .NET, providing foundational knowledge and involvement in projects, indicating basic exposure to backend concepts.',
            evidenceFound: [
                'Backend engineer',
                'Internship',
                'Gained foundational knowledge of C# and .NET, covering core concepts and best practices.',
                'Collaborated on group exercises and projects, applying technical skills to solve real-world problems.'
            ],
            missingElements: [
                'Specific details on backend feature implementation',
                'Contributions to system improvements or active participation in the full SDLC beyond projects',
                'Mentions of well-tested, maintainable code or performance tuning.'
            ]
        },
        {
            id: 'exp.responsibilities_alignment',
            criterion: 'Alignment with Intern Responsibilities',
            score0To5: 3,
            weight0To1: 0.5,
            justification: 'The internship involved collaboration on group projects and developing teamwork skills, which aligns with basic collaboration responsibilities in a structured team, but lacks detail on active feature implementation or deeper SDLC involvement.',
            evidenceFound: [
                'Collaborated on group exercises and projects, applying technical skills to solve real-world problems.',
                'Developed problem-solving abilities and teamwork skills in a structured, professional environment.'
            ],
            missingElements: [
                'Evidence of implementing specific features',
                'Details on testing, debugging, or assisting with troubleshooting',
                'Active participation across the full backend SDLC.'
            ]
        }
    ],
    totalScore0To5: 3.0,
    weight0To1: 0.1
};

/**
 * Demo component to showcase the AI Evaluation functionality
 * This component can be used for testing and demonstration purposes
 */
export function AIEvaluationDemo() {
    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-gray-900">AI CV Evaluation Demo</h1>
                <p className="text-gray-600">
                    See how our AI provides detailed feedback on each section of your CV
                </p>
            </div>

            <div className="grid gap-6">
                <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Experience Section Evaluation</h2>
                    <AIEvaluationCard
                        sectionScore={demoSectionScore}
                        sectionType={SectionType.Experience}
                        isLoading={false}
                    />
                </div>

                <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Loading State</h2>
                    <AIEvaluationCard
                        sectionScore={undefined}
                        sectionType={SectionType.Skills}
                        isLoading={true}
                    />
                </div>

                <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">No Evaluation Available</h2>
                    <AIEvaluationCard
                        sectionScore={undefined}
                        sectionType={SectionType.Projects}
                        isLoading={false}
                    />
                </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">Features Showcase</h3>
                <ul className="space-y-2 text-blue-800">
                    <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        Real-time AI evaluation with detailed scoring
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        Expandable criteria analysis with justifications
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        Visual score bars and progress indicators
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        Evidence found vs. missing elements breakdown
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        Smooth animations and responsive design
                    </li>
                </ul>
            </div>
        </div>
    );
}
