import React from 'react';

const CVPreviewDashboard: React.FC = () => {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar Dashboard Navigation */}
      <aside
        style={{
          width: '250px',
          background: '#f5f5f5',
          padding: '20px',
          boxShadow: '2px 0px 5px rgba(0,0,0,0.1)'
        }}
      >
        <h2 style={{ marginTop: 0 }}>Dashboard</h2>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ margin: '10px 0' }}>Overview</li>
            <li style={{ margin: '10px 0' }}>Personal Info</li>
            <li style={{ margin: '10px 0' }}>Education</li>
            <li style={{ margin: '10px 0' }}>Experience</li>
            <li style={{ margin: '10px 0' }}>Skills</li>
          </ul>
        </nav>
      </aside>

      {/* Main Content for CV Preview */}
      <main style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
        <header style={{ marginBottom: '20px' }}>
          <h1>CV Preview</h1>
        </header>
        <section style={{ marginBottom: '20px' }}>
          <h2>Personal Information</h2>
          <p>
            <strong>Name:</strong> John Doe
          </p>
          <p>
            <strong>Email:</strong> john.doe@example.com
          </p>
        </section>
        <section style={{ marginBottom: '20px' }}>
          <h2>Education</h2>
          <ul>
            <li>
              <strong>BSc in Computer Science</strong> - ABC University (2015 - 2019)
            </li>
          </ul>
        </section>
        <section style={{ marginBottom: '20px' }}>
          <h2>Experience</h2>
          <ul>
            <li>
              <strong>Software Developer</strong> - XYZ Company (2019 - Present)
            </li>
          </ul>
        </section>
        <section style={{ marginBottom: '20px' }}>
          <h2>Skills</h2>
          <p>JavaScript, TypeScript, React, Redux, Node.js</p>
        </section>
      </main>
    </div>
  );
};

export default CVPreviewDashboard;