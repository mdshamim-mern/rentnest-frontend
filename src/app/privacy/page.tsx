export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm p-8 border border-slate-100">
          <h1 className="text-3xl font-bold text-slate-900 mb-6">Privacy Policy</h1>
          <div className="prose prose-slate max-w-none text-slate-600 space-y-4">
            <p>
              At RentNest, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your information.
            </p>
            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">Information We Collect</h3>
            <p>
              We collect information that you provide directly to us, such as when you create an account, list a property, or contact support. This includes your name, email address, phone number, and any other details you choose to provide.
            </p>
            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">How We Use Your Information</h3>
            <p>
              We use the information we collect to operate, maintain, and improve our services. We may also use it to communicate with you about your account or our platform.
            </p>
            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">Data Security</h3>
            <p>
              We implement reasonable security measures to protect your personal information from unauthorized access or disclosure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}