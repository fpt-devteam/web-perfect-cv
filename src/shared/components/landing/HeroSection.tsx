import { Button } from '@/shared/components/ui/button';

export function HeroSection() {
  return (
    <section className="bg-secondary">
      <div className="py-12 px-4 md:px-8 md:py-20 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Create your <span className="text-primary">perfect CV</span> in minutes
          </h1>
          <p className="text-gray-800 text-lg mb-8">
            Get your CV ready for success with our AI-powered tool. Tailored for your industry,
            style, and experience.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button
              size="lg"
              className="bg-primary cursor-pointer text-white py-3 px-6 rounded-md transition-colors font-medium text-lg"
            >
              Create perfect CV
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary cursor-pointer text-primary hover:bg-gray-50 py-3 px-6 rounded-md transition-colors font-medium text-lg"
            >
              Perfect my CV
            </Button>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-8">
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-primary mb-2">48%</div>
              <p className="text-gray-600 text-center">more likely to get hired</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-gray-600 mb-2">12%</div>
              <p className="text-gray-600 text-center">better pay with your next job</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="relative w-full max-w-md">
            <div className="border-2 border-gray-200 rounded-lg p-6 bg-white shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-full bg-gray-6 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div className="text-2xl font-bold text-gray-1">CV</div>
              </div>
              <div className="space-y-3">
                <div className="h-3 bg-gray-200 rounded-full w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded-full"></div>
                <div className="h-3 bg-gray-200 rounded-full w-5/6"></div>
                <div className="h-3 bg-gray-200 rounded-full w-4/5"></div>
                <div className="h-3 bg-gray-200 rounded-full"></div>
                <div className="h-3 bg-gray-200 rounded-full w-3/4"></div>
              </div>
              <div className="absolute bottom-4 right-4">
                <div className="w-10 h-10 rounded-full bg-gray-6 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pb-8 md:pb-12 max-w-7xl mx-auto text-center">
        <p className="text-gray-600 mb-8">Our customers have been hired at:</p>
        <div className="flex flex-wrap justify-center gap-8 items-center opacity-70">
          <div className="w-24">Google</div>
          <div className="w-24">DHL</div>
          <div className="w-24">Booking.com</div>
          <div className="w-24">Spotify</div>
          <div className="w-24">Facebook</div>
          <div className="w-24">Amazon</div>
        </div>
      </div>
    </section>
  );
}
