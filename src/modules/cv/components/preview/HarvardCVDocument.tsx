import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import type { CVResponse as CVData } from '@/modules/cv/types/cv.types';

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
  const fullName = cvData.title || 'Your Name';
  const jobTitle = cvData.jobDescription?.title || 'Professional Title';
  const contacts = cvData.content?.contact;

  // Group skills by category
  const skillCategories =
    cvData.content?.skills?.reduce(
      (acc, skill) => {
        const category = skill.category;
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(skill);
        return acc;
      },
      {} as Record<string, typeof cvData.content.skills>
    ) || {};

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.name}>{fullName}</Text>
          <View style={{ marginBottom: 8 }} />
          <Text style={styles.jobTitle}>{jobTitle}</Text>

          {contacts && (
            <View>
              <View style={styles.contactRow}>
                <Text style={styles.contactInfo}>{contacts.email}</Text>
                <Text style={styles.contactDivider}>•</Text>
                <Text style={styles.contactInfo}>{contacts.phoneNumber}</Text>
                <Text style={styles.contactDivider}>•</Text>
                <Text style={styles.contactInfo}>
                  {contacts.city}, {contacts.country}
                </Text>
              </View>

              {(contacts.linkedInUrl || contacts.gitHubUrl || contacts.personalWebsiteUrl) && (
                <View style={styles.contactRow}>
                  {contacts.linkedInUrl && (
                    <>
                      <Text style={styles.contactInfo}>LinkedIn</Text>
                      {(contacts.gitHubUrl || contacts.personalWebsiteUrl) && (
                        <Text style={styles.contactDivider}>•</Text>
                      )}
                    </>
                  )}
                  {contacts.gitHubUrl && (
                    <>
                      <Text style={styles.contactInfo}>GitHub</Text>
                      {contacts.personalWebsiteUrl && <Text style={styles.contactDivider}>•</Text>}
                    </>
                  )}
                  {contacts.personalWebsiteUrl && <Text style={styles.contactInfo}>Portfolio</Text>}
                </View>
              )}
            </View>
          )}
        </View>

        {/* Summary Section */}
        {cvData.content?.summary?.content && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.summary}>{cvData.content.summary.content}</Text>
          </View>
        )}

        {/* Experience Section */}
        {cvData.content?.experiences && cvData.content.experiences.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Experience</Text>
            {cvData.content.experiences.map((experience, index) => (
              <View key={index} style={styles.experienceItem}>
                <View style={styles.experienceHeader}>
                  <Text style={styles.jobTitleCompany}>
                    {experience.jobTitle} • {experience.organization}
                  </Text>
                  <Text style={styles.dateLocation}>
                    {formatDate(experience.startDate)} -{' '}
                    {experience.endDate ? formatDate(experience.endDate) : 'Present'}
                  </Text>
                </View>
                <Text style={styles.companyLocation}>
                  {experience.location}
                </Text>
                {experience.description && (
                  <Text style={styles.description}>{experience.description}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Education Section */}
        {cvData.content?.educations && cvData.content.educations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {cvData.content.educations.map((education, index) => (
              <View key={index} style={styles.educationItem}>
                <View style={styles.educationHeader}>
                  <Text style={styles.degree}>
                    {education.degree} {education.fieldOfStudy && `in ${education.fieldOfStudy}`}
                  </Text>
                  <Text style={styles.educationDate}>
                    {education.startDate && education.endDate
                      ? `${formatDate(education.startDate)} - ${formatDate(education.endDate)}`
                      : education.startDate
                        ? `${formatDate(education.startDate)} - Present`
                        : education.endDate
                          ? `Completed ${formatDate(education.endDate)}`
                          : 'Date not specified'}
                  </Text>
                </View>
                <Text style={styles.institution}>{education.organization}</Text>
                {education.gpa && education.gpa > 0 && (
                  <Text style={styles.gpa}>GPA: {education.gpa.toFixed(2)}</Text>
                )}
                {education.description && education.description.trim() && (
                  <Text style={styles.description}>{education.description}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Skills Section */}
        {cvData.content?.skills && cvData.content.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.skillsContainer}>
              {Object.entries(skillCategories).map(([category, skills]) => (
                <View key={category} style={styles.skillCategory}>
                  <Text style={styles.skillCategoryTitle}>{category}:</Text>
                  <Text style={styles.skillItems}>
                    {skills.map(skill => skill.content).join(', ')}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Projects Section */}
        {cvData.content?.projects && cvData.content.projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notable Projects</Text>
            {cvData.content.projects.map((project, index) => (
              <View key={index} style={styles.projectItem}>
                <View style={styles.projectHeader}>
                  <Text style={styles.projectTitle}>{project.title}</Text>
                  <Text style={styles.dateLocation}>
                    {formatDate(project.startDate)} - {formatDate(project.endDate)}
                  </Text>
                </View>
                {project.link && <Text style={styles.projectLink}>{project.link}</Text>}
                {project.description && (
                  <Text style={styles.description}>{project.description}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Certifications Section */}
        {cvData.content?.certifications && cvData.content.certifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {cvData.content.certifications.map((certification, index) => (
              <View key={index} style={styles.certificationItem}>
                <View style={styles.certificationHeader}>
                  <Text style={styles.certificationName}>{certification.name}</Text>
                  <Text style={styles.certificationDate}>
                    {formatDate(certification.issuedDate)}
                  </Text>
                </View>
                <Text style={styles.certificationIssuer}>{certification.organization}</Text>
                {certification.description && (
                  <Text style={styles.description}>{certification.description}</Text>
                )}
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
};
