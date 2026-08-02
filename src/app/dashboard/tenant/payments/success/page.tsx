export default function PaymentSuccessPage() {
  return (
    <div className="max-w-2xl mx-auto mt-20 p-8 text-center bg-white rounded-2xl shadow-sm border border-slate-100">
      <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="text-3xl font-bold text-slate-900">Payment Successful!</h1>
      <p className="mt-4 text-slate-600">Thank you for your payment. Your transaction has been completed successfully.</p>
    </div>
  );
}