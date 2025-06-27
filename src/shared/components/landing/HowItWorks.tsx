export function HowItWorks() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-16">How It Works</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-tertiary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="font-bold text-gray-1 text-2xl">1</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Upload Your Resume</h3>
            <p className="text-gray-600">Start by uploading your resume in PDF or DOCX format.</p>
          </div>

          <div className="text-center">
            <div className="bg-tertiary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="font-bold text-gray-1 text-2xl">2</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Get AI-Powered Feedback</h3>
            <p className="text-gray-600">
              Receive instant insights and suggestions tailored to your experience.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-tertiary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="font-bold text-gray-1 text-2xl">3</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Download Your CV</h3>
            <p className="text-gray-600">Apply changes and download your improved CV with ease.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
