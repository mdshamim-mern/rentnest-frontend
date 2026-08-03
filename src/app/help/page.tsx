export default function HelpPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm p-8 border border-slate-100">
          <h1 className="text-3xl font-bold text-slate-900 mb-6">Help Center</h1>
          <div className="prose prose-slate max-w-none">
            <p className="text-slate-600 mb-4">
              Welcome to the RentNest Help Center. We are here to assist you with any questions or issues you may have.
            </p>
            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">Frequently Asked Questions</h3>
            <ul className="list-disc pl-5 text-slate-600 space-y-2">
              <li>How do I list a property?</li>
              <li>How can I contact a landlord?</li>
              <li>Is my payment information secure?</li>
            </ul>
            <p className="text-slate-600 mt-6">
              If you need further assistance, please contact us at <strong>support@rentnest.com</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}