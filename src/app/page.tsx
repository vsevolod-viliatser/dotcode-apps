"use client";

import Link from "next/link";

const HomePage: React.FC = () => {
  const sections = [
    {
      id: "workspace",
      title: "Interactive Workspace",
      description: "Interactive workspace with draggable blocks",
      icon: "🎯",
      path: "/workspace",
    },
    {
      id: "bitcoin",
      title: "Bitcoin Transactions",
      description: "Real-time Bitcoin transaction tracker",
      icon: "₿",
      path: "/bitcoin",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to DotCode Apps
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            A modern Single Page Application with lazy-loaded sections
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {sections.map((section) => (
            <Link key={section.id} href={section.path} className="block group">
              <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-all duration-200 group-hover:scale-105">
                <div className="text-center">
                  <div className="text-4xl mb-4">{section.icon}</div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {section.title}
                  </h2>
                  <p className="text-gray-600">{section.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-500">
            Each section is lazy-loaded and has its own unique URL for optimal
            performance.
          </p>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
