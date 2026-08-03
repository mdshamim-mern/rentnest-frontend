export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm p-8 border border-slate-100">
          <h1 className="text-3xl font-bold text-slate-900 mb-6">Terms of Service</h1>
          <div className="prose prose-slate max-w-none text-slate-600 space-y-4">
            <p>
              Please read these Terms of Service carefully before using the RentNest platform.
            </p>
            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">1. Acceptance of Terms</h3>
            <p>
              By accessing and using RentNest, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">2. User Responsibilities</h3>
            <p>
              You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer.
            </p>
            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">3. Property Listings</h3>
            <p>
              All property listings must be accurate and truthful. RentNest reserves the right to remove any listing that violates our policies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}