import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import type { CVData } from '../types/cv.types';

// Register fonts that support Vietnamese characters
Font.register({
  family: 'Times-Roman',
  src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxK.ttf',
});

Font.register({
  family: 'Times-Bold',
  src: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlfBBc9.ttf',
});

Font.register({
  family: 'Times-Italic',
  src: 'https://fonts.gstatic.com/s/roboto/v30/KFOkCnqEu92Fr1Mu51xIIzI.ttf',
});

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Times-Roman',
    fontSize: 11,
    lineHeight: 1.4,
    padding: 40,
    backgroundColor: '#ffffff',
    color: '#334155', // slate-700
  },

  // Header Section
  header: {
    marginBottom: 24,
    textAlign: 'center',
    paddingBottom: 16,
    borderBottom: '2pt solid #334155', // slate-700
  },
  name: {
    fontSize: 24,
    fontFamily: 'Times-Bold',
    marginBottom: 8,
    color: '#334155', // slate-800
    letterSpacing: 0.5,
  },
  jobTitle: {
    fontSize: 14,
    marginBottom: 12,
    color: '#475569', // slate-600
    fontFamily: 'Times-Bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 3,
    flexWrap: 'wrap',
  },
  contactInfo: {
    fontSize: 10,
    color: '#475569', // slate-600
    marginHorizontal: 6,
  },
  contactDivider: {
    fontSize: 10,
    color: '#94a3b8', // slate-400
    marginHorizontal: 3,
  },

  // Section Styling
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Times-Bold',
    marginBottom: 12,
    color: '#334155', // slate-800
    textTransform: 'uppercase',
    letterSpacing: 1,
    borderBottom: '1pt solid #334155', // slate-700
    paddingBottom: 4,
  },

  // Summary Section
  summary: {
    fontSize: 10,
    lineHeight: 1.6,
    marginBottom: 4,
    textAlign: 'justify',
    color: '#475569', // slate-700
    paddingHorizontal: 12,
  },

  // Experience Section
  experienceItem: {
    marginBottom: 12,
    paddingBottom: 8,
    borderBottom: '0.5pt solid #cbd5e1', // slate-200
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 3,
  },
  jobTitleCompany: {
    fontSize: 10,
    fontFamily: 'Times-Bold',
    color: '#334155', // slate-800
    flex: 1,
  },
  dateLocation: {
    fontSize: 10,
    color: '#475569', // slate-600
    textAlign: 'right',
    minWidth: 80,
  },
  companyLocation: {
    fontSize: 10,
    color: '#64748b', // slate-500
    marginBottom: 4,
    fontFamily: 'Times-Italic',
  },
  description: {
    fontSize: 10,
    lineHeight: 1.5,
    textAlign: 'justify',
    color: '#475569', // slate-700
    paddingLeft: 12,
  },

  // Skills Section
  skillsContainer: {
    flexDirection: 'column',
    gap: 8,
  },
  skillCategory: {
    marginBottom: 6,
  },
  skillCategoryTitle: {
    fontSize: 10,
    fontFamily: 'Times-Bold',
    color: '#334155', // slate-800
    marginBottom: 4,
  },
  skillItems: {
    fontSize: 10,
    color: '#475569', // slate-700
    lineHeight: 1.4,
  },

  // Education Section
  educationItem: {
    marginBottom: 12,
    paddingBottom: 8,
    borderBottom: '0.5pt solid #cbd5e1', // slate-200
  },
  educationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 3,
  },
  degree: {
    fontSize: 10,
    fontFamily: 'Times-Bold',
    color: '#334155', // slate-800
    flex: 1,
  },
  institution: {
    fontSize: 10,
    color: '#64748b', // slate-500
    marginBottom: 3,
    fontFamily: 'Times-Italic',
  },
  gpa: {
    fontSize: 10,
    color: '#059669', // green-700
    fontFamily: 'Times-Bold',
  },
  educationDate: {
    fontSize: 10,
    color: '#475569', // slate-600
    textAlign: 'right',
    minWidth: 80,
  },

  // Projects Section
  projectItem: {
    marginBottom: 12,
    paddingBottom: 8,
    borderBottom: '0.5pt solid #cbd5e1', // slate-200
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 3,
  },
  projectTitle: {
    fontSize: 10,
    fontFamily: 'Times-Bold',
    color: '#334155', // slate-800
    flex: 1,
  },
  projectLink: {
    fontSize: 9,
    color: '#2563eb', // blue-600
    marginBottom: 4,
    fontFamily: 'Times-Italic',
  },

  // Certifications Section
  certificationItem: {
    marginBottom: 10,
    paddingBottom: 6,
    borderBottom: '0.5pt solid #cbd5e1', // slate-200
  },
  certificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 3,
  },
  certificationName: {
    fontSize: 10,
    fontFamily: 'Times-Bold',
    color: '#334155', // slate-800
    flex: 1,
  },
  certificationIssuer: {
    fontSize: 10,
    color: '#64748b', // slate-500
    marginBottom: 3,
    fontFamily: 'Times-Italic',
  },
  certificationDate: {
    fontSize: 10,
    color: '#475569', // slate-600
    textAlign: 'right',
    minWidth: 80,
  },
});

interface HarvardCVDocumentProps {
  cvData: CVData;
}

const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
  });
};

export const HarvardCVDocument: React.FC<HarvardCVDocumentProps> = ({ cvData }) => {
  const fullName = cvData.Title || 'Your Name';
  const jobTitle = cvData.JobDetail?.JobTitle || 'Professional Title';
  const contacts = cvData.Contacts;

  // Group skills by category
  const skillCategories =
    cvData.Skills?.reduce(
      (acc, skill) => {
        const category = skill.Name; // Use skill.Name as category (which contains the actual category from API)
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(skill);
        return acc;
      },
      {} as Record<string, typeof cvData.Skills>
    ) || {};

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.name}>{fullName}</Text>
          <Text style={styles.jobTitle}>{jobTitle}</Text>

          {contacts && (
            <View>
              <View style={styles.contactRow}>
                <Text style={styles.contactInfo}>{contacts.Email}</Text>
                <Text style={styles.contactDivider}>•</Text>
                <Text style={styles.contactInfo}>{contacts.PhoneNumber}</Text>
                <Text style={styles.contactDivider}>•</Text>
                <Text style={styles.contactInfo}>
                  {contacts.City}, {contacts.Country}
                </Text>
              </View>

              {(contacts.LinkedInUrl || contacts.GitHubUrl || contacts.PersonalWebsiteUrl) && (
                <View style={styles.contactRow}>
                  {contacts.LinkedInUrl && (
                    <>
                      <Text style={styles.contactInfo}>LinkedIn</Text>
                      {(contacts.GitHubUrl || contacts.PersonalWebsiteUrl) && (
                        <Text style={styles.contactDivider}>•</Text>
                      )}
                    </>
                  )}
                  {contacts.GitHubUrl && (
                    <>
                      <Text style={styles.contactInfo}>GitHub</Text>
                      {contacts.PersonalWebsiteUrl && <Text style={styles.contactDivider}>•</Text>}
                    </>
                  )}
                  {contacts.PersonalWebsiteUrl && <Text style={styles.contactInfo}>Portfolio</Text>}
                </View>
              )}
            </View>
          )}
        </View>

        {/* Summary Section */}
        {cvData.Summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.summary}>{cvData.Summary}</Text>
          </View>
        )}

        {/* Experience Section */}
        {cvData.Experiences && cvData.Experiences.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Experience</Text>
            {cvData.Experiences.map(experience => (
              <View key={experience.Id} style={styles.experienceItem}>
                <View style={styles.experienceHeader}>
                  <Text style={styles.jobTitleCompany}>
                    {experience.JobTitle} • {experience.Organization}
                  </Text>
                  <Text style={styles.dateLocation}>
                    {formatDate(experience.StartDate)} -{' '}
                    {experience.EndDate ? formatDate(experience.EndDate) : 'Present'}
                  </Text>
                </View>
                <Text style={styles.companyLocation}>
                  {experience.Location} • {experience.EmploymentTypeName}
                </Text>
                {experience.Description && (
                  <Text style={styles.description}>{experience.Description}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Education Section */}
        {cvData.Educations && cvData.Educations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {cvData.Educations.map((education, index) => (
              <View key={index} style={styles.educationItem}>
                <View style={styles.educationHeader}>
                  <Text style={styles.degree}>
                    {education.Degree} {education.FieldOfStudy && `in ${education.FieldOfStudy}`}
                  </Text>
                  <Text style={styles.educationDate}>
                    {education.StartDate && education.EndDate
                      ? `${formatDate(education.StartDate)} - ${formatDate(education.EndDate)}`
                      : education.StartDate
                        ? `${formatDate(education.StartDate)} - Present`
                        : education.EndDate
                          ? `Completed ${formatDate(education.EndDate)}`
                          : 'Date not specified'}
                  </Text>
                </View>
                <Text style={styles.institution}>{education.Organization}</Text>
                {education.Gpa && education.Gpa > 0 && (
                  <Text style={styles.gpa}>GPA: {education.Gpa.toFixed(2)}</Text>
                )}
                {education.Description && education.Description.trim() && (
                  <Text style={styles.description}>{education.Description}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Skills Section */}
        {cvData.Skills && cvData.Skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.skillsContainer}>
              {Object.entries(skillCategories).map(([category, skills]) => (
                <View key={category} style={styles.skillCategory}>
                  <Text style={styles.skillCategoryTitle}>{category}:</Text>
                  <Text style={styles.skillItems}>
                    {skills.map(skill => skill.Description || skill.Name).join(', ')}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Projects Section */}
        {cvData.Projects && cvData.Projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notable Projects</Text>
            {cvData.Projects.map(project => (
              <View key={project.Id} style={styles.projectItem}>
                <View style={styles.projectHeader}>
                  <Text style={styles.projectTitle}>{project.Title}</Text>
                  <Text style={styles.dateLocation}>
                    {formatDate(project.StartDate)} - {formatDate(project.EndDate)}
                  </Text>
                </View>
                {project.Link && <Text style={styles.projectLink}>{project.Link}</Text>}
                {project.Description && (
                  <Text style={styles.description}>{project.Description}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Certifications Section */}
        {cvData.Certifications && cvData.Certifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {cvData.Certifications.map(certification => (
              <View key={certification.Id} style={styles.certificationItem}>
                <View style={styles.certificationHeader}>
                  <Text style={styles.certificationName}>{certification.Name}</Text>
                  <Text style={styles.certificationDate}>
                    {formatDate(certification.IssuedDate)}
                  </Text>
                </View>
                <Text style={styles.certificationIssuer}>{certification.Organization}</Text>
                {certification.Description && (
                  <Text style={styles.description}>{certification.Description}</Text>
                )}
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
};
