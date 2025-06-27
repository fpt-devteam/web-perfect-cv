export function Features() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-16">Key Features</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-bold text-gray-1 mb-3">Smart Recommendations</h3>
            <p className="text-gray-600">
              AI-driven tips to highlight your strengths and achievements.
            </p>
          </div>

          <div className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-bold text-gray-1 mb-3">ATS Optimization</h3>
            <p className="text-gray-600">
              Ensure your resume is optimized for applicant tracking systems.
            </p>
          </div>

          <div className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-bold text-gray-1 mb-3">Editable Templates</h3>
            <p className="text-gray-600">
              Customizable templates tailored to your industry and style.
            </p>
          </div>

          <div className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-bold text-gray-1 mb-3">Detailed Analytics</h3>
            <p className="text-gray-600">
              Track your resume's performance with comprehensive analytics.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
