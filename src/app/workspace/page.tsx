"use client";

import { Suspense, lazy } from "react";

const InteractiveWorkspace = lazy(
  () => import("../../pages/InteractiveWorkspace")
);

export default function WorkspacePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          }
        >
          <InteractiveWorkspace />
        </Suspense>
      </div>
    </div>
  );
}
