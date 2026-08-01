function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 text-center">
        <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1 text-sm text-blue-300">
          AI-Powered Study Platform
        </span>

        <h1 className="mt-8 text-5xl font-extrabold md:text-7xl">
          Never Lose Your
          <span className="block text-blue-400">Study Material Again</span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-slate-400">
          Upload your notes once. Ask questions in plain English. Get instant
          answers backed by your own documents.
        </p>

        <div className="mt-10 flex gap-4">
          <button className="rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-700">
            Get Started
          </button>

          <button className="rounded-xl border border-slate-700 px-6 py-3 hover:bg-slate-800">
            Learn More
          </button>
        </div>
      </section>
    </main>
  );
}

export default LandingPage;