import { MapPin, Mail, Phone, Globe, Github, Linkedin } from 'lucide-react';
import type { CVData } from '../types/cv.types';

interface CVHTMLPreviewProps {
  cvData: CVData;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
  });
};

export const CVHTMLPreview: React.FC<CVHTMLPreviewProps> = ({ cvData }) => {
  const fullName = cvData.Title || 'Your Name';
  const jobTitle = cvData.JobDetail?.JobTitle || 'Professional Title';
  const contacts = cvData.Contacts;

  return (
    <div className="bg-white shadow-2xl mx-auto" style={{ width: '210mm', minHeight: '297mm' }}>
      <div className="p-10 font-serif text-slate-800">
        {/* Header Section */}
        <div className="text-center mb-6 pb-4 border-b-2 border-slate-700">
          <h1 className="text-3xl font-bold text-slate-800 mb-1 tracking-wide">{fullName}</h1>
          <h2 className="text-lg text-slate-600 mb-3 font-bold uppercase tracking-wider">
            {jobTitle}
          </h2>

          {contacts && (
            <div className="space-y-1">
              <div className="flex justify-center items-center gap-4 text-xs text-slate-600">
                <div className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  <span>{contacts.Email}</span>
                </div>
                <span className="text-slate-400">•</span>
                <div className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  <span>{contacts.PhoneNumber}</span>
                </div>
                <span className="text-slate-400">•</span>
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>
                    {contacts.City}, {contacts.Country}
                  </span>
                </div>
              </div>

              {(contacts.LinkedInUrl || contacts.GitHubUrl || contacts.PersonalWebsiteUrl) && (
                <div className="flex justify-center items-center gap-4 text-xs text-slate-600">
                  {contacts.LinkedInUrl && (
                    <div className="flex items-center gap-1">
                      <Linkedin className="h-3 w-3" />
                      <span>LinkedIn</span>
                    </div>
                  )}
                  {contacts.GitHubUrl && (
                    <>
                      {contacts.LinkedInUrl && <span className="text-slate-400">•</span>}
                      <div className="flex items-center gap-1">
                        <Github className="h-3 w-3" />
                        <span>GitHub</span>
                      </div>
                    </>
                  )}
                  {contacts.PersonalWebsiteUrl && (
                    <>
                      {(contacts.LinkedInUrl || contacts.GitHubUrl) && (
                        <span className="text-slate-400">•</span>
                      )}
                      <div className="flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        <span>Portfolio</span>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Summary Section */}
        {cvData.Summary && (
          <div className="mb-6">
            <h3 className="text-sm font-bold text-slate-800 mb-3 pb-1 border-b border-slate-700 uppercase tracking-wider">
              Professional Summary
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed text-justify px-3">
              {cvData.Summary}
            </p>
          </div>
        )}

        {/* Experience Section */}
        {cvData.Experiences && cvData.Experiences.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-bold text-slate-800 mb-3 pb-1 border-b border-slate-700 uppercase tracking-wider">
              Professional Experience
            </h3>
            <div className="space-y-4">
              {cvData.Experiences.map((experience, index) => (
                <div
                  key={experience.Id}
                  className={`pb-3 ${index !== cvData.Experiences.length - 1 ? 'border-b border-slate-200' : ''}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-800 text-xs">
                        {experience.JobTitle} • {experience.Organization}
                      </h4>
                      <p className="text-xs text-slate-500 italic mt-1">
                        {experience.Location} • {experience.EmploymentTypeName}
                      </p>
                    </div>
                    <div className="text-xs text-slate-600 text-right ml-3">
                      {formatDate(experience.StartDate)} -{' '}
                      {experience.EndDate ? formatDate(experience.EndDate) : 'Present'}
                    </div>
                  </div>
                  {experience.Description && (
                    <p className="text-xs text-slate-700 leading-relaxed text-justify pl-3 mt-1">
                      {experience.Description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education Section */}
        {cvData.Educations && cvData.Educations.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-bold text-slate-800 mb-3 pb-1 border-b border-slate-700 uppercase tracking-wider">
              Education
            </h3>
            <div className="space-y-4">
              {cvData.Educations.map((education, index) => (
                <div
                  key={index}
                  className={`pb-2 ${index !== cvData.Educations.length - 1 ? 'border-b border-slate-200' : ''}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-800 text-xs">
                        {education.Degree}{' '}
                        {education.FieldOfStudy && `in ${education.FieldOfStudy}`}
                      </h4>
                      <p className="text-xs text-slate-500 italic mt-1">{education.Organization}</p>
                      {education.Gpa && education.Gpa > 0 && (
                        <p className="text-xs text-green-700 font-bold mt-1">
                          GPA: {education.Gpa.toFixed(2)}
                        </p>
                      )}
                    </div>
                    <div className="text-xs text-slate-600 text-right ml-3">
                      {education.StartDate && education.EndDate
                        ? `${formatDate(education.StartDate)} - ${formatDate(education.EndDate)}`
                        : education.StartDate
                          ? `${formatDate(education.StartDate)} - Present`
                          : education.EndDate
                            ? `Completed ${formatDate(education.EndDate)}`
                            : 'Date not specified'}
                    </div>
                  </div>
                  {education.Description && education.Description.trim() && (
                    <p className="text-xs text-slate-700 leading-relaxed text-justify mt-1">
                      {education.Description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills Section */}
        {cvData.Skills && cvData.Skills.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-bold text-slate-800 mb-3 pb-1 border-b border-slate-700 uppercase tracking-wider">
              Skills
            </h3>
            <div className="space-y-3">
              {/* Group skills by category */}
              {(() => {
                const skillCategories = cvData.Skills.reduce(
                  (acc, skill) => {
                    const category = skill.Name; // Use skill.Name as category (which contains the actual category from API)
                    if (!acc[category]) {
                      acc[category] = [];
                    }
                    acc[category].push(skill);
                    return acc;
                  },
                  {} as Record<string, typeof cvData.Skills>
                );

                return Object.entries(skillCategories).map(([category, skills]) => (
                  <div key={category}>
                    <h4 className="text-xs font-bold text-slate-800 mb-1">{category}:</h4>
                    <p className="text-xs text-slate-700">
                      {skills.map(skill => skill.Description || skill.Name).join(', ')}
                    </p>
                  </div>
                ));
              })()}
            </div>
          </div>
        )}

        {/* Projects Section */}
        {cvData.Projects && cvData.Projects.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-bold text-slate-800 mb-3 pb-1 border-b border-slate-700 uppercase tracking-wider">
              Notable Projects
            </h3>
            <div className="space-y-4">
              {cvData.Projects.map((project, index) => (
                <div
                  key={project.Id}
                  className={`pb-2 ${index !== cvData.Projects.length - 1 ? 'border-b border-slate-200' : ''}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-800 text-xs">{project.Title}</h4>
                      {project.Link && (
                        <p className="text-xs text-blue-600 hover:underline cursor-pointer mt-1">
                          {project.Link}
                        </p>
                      )}
                    </div>
                    <div className="text-xs text-slate-600 text-right ml-3">
                      {formatDate(project.StartDate)} - {formatDate(project.EndDate)}
                    </div>
                  </div>
                  {project.Description && (
                    <p className="text-xs text-slate-700 leading-relaxed text-justify mt-1">
                      {project.Description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications Section */}
        {cvData.Certifications && cvData.Certifications.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-bold text-slate-800 mb-3 pb-1 border-b border-slate-700 uppercase tracking-wider">
              Certifications
            </h3>
            <div className="space-y-3">
              {cvData.Certifications.map((certification, index) => (
                <div
                  key={certification.Id}
                  className={`pb-2 ${index !== cvData.Certifications.length - 1 ? 'border-b border-slate-200' : ''}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-800 text-xs">{certification.Name}</h4>
                      <p className="text-xs text-slate-500 italic mt-1">
                        {certification.Organization}
                      </p>
                    </div>
                    <div className="text-xs text-slate-600 text-right ml-3">
                      {formatDate(certification.IssuedDate)}
                    </div>
                  </div>
                  {certification.Description && (
                    <p className="text-xs text-slate-700 leading-relaxed text-justify mt-1">
                      {certification.Description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
