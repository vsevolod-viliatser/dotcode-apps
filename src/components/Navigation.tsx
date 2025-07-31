"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Navigation: React.FC = () => {
  const pathname = usePathname();

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
    <>
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link
                href="/"
                className="text-2xl font-bold text-gray-900 hover:text-gray-700 transition-colors"
              >
                DotCode Apps
              </Link>
            </div>
            <nav className="hidden md:flex space-x-8">
              {sections.map((section) => (
                <Link
                  key={section.id}
                  href={section.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === section.path
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{section.icon}</span>
                    <span>{section.title}</span>
                  </div>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-white border-b border-gray-200">
        <div className="px-4 py-2">
          <div className="flex space-x-4 overflow-x-auto">
            {sections.map((section) => (
              <Link
                key={section.id}
                href={section.path}
                className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                  pathname === section.path
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center space-x-1">
                  <span className="text-base">{section.icon}</span>
                  <span>{section.title}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;
