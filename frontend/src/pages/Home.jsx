import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <p className="font-body text-sm font-semibold text-clay uppercase tracking-wide mb-3">
          AI-Powered Trip Planning
        </p>
        <h1 className="font-display text-4xl md:text-5xl font-semibold text-ink leading-tight max-w-3xl mx-auto">
          Plan your next trip in minutes, not hours
        </h1>
        <p className="font-body text-taupe text-lg mt-5 max-w-xl mx-auto">
          Tell us where you're headed and we'll build a day-wise itinerary, track your
          budget, and keep an eye on the weather - all in one place.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link to="/register" className="btn-primary">
            Start Planning
          </Link>
          <Link to="/login" className="btn-secondary">
            Login
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="section-heading text-center mb-10">Everything you need for your trip</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card">
            <h3 className="font-display text-xl text-ink mb-2">AI Itineraries</h3>
            <p className="font-body text-sm text-taupe">
              Get a personalized day-by-day plan based on your budget, interests, and travel
              style.
            </p>
          </div>
          <div className="card">
            <h3 className="font-display text-xl text-ink mb-2">Interactive Maps</h3>
            <p className="font-body text-sm text-taupe">
              See every stop on your itinerary plotted on a map, with the route between them.
            </p>
          </div>
          <div className="card">
            <h3 className="font-display text-xl text-ink mb-2">Expense Tracking</h3>
            <p className="font-body text-sm text-taupe">
              Log expenses as you go and see exactly where your budget is going.
            </p>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-sand/50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="section-heading text-center mb-10">How it works</h2>
          <div className="grid md:grid-cols-4 gap-6 font-body">
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-clay text-cream flex items-center justify-center mx-auto mb-3 font-semibold">
                1
              </div>
              <p className="text-ink font-semibold">Enter trip details</p>
              <p className="text-taupe text-sm mt-1">Destination, dates, budget and interests</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-clay text-cream flex items-center justify-center mx-auto mb-3 font-semibold">
                2
              </div>
              <p className="text-ink font-semibold">Get your itinerary</p>
              <p className="text-taupe text-sm mt-1">AI generates a day-wise plan for you</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-clay text-cream flex items-center justify-center mx-auto mb-3 font-semibold">
                3
              </div>
              <p className="text-ink font-semibold">Customize freely</p>
              <p className="text-taupe text-sm mt-1">Edit, add or remove any activity</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-clay text-cream flex items-center justify-center mx-auto mb-3 font-semibold">
                4
              </div>
              <p className="text-ink font-semibold">Track as you travel</p>
              <p className="text-taupe text-sm mt-1">Log expenses and check the weather</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h2 className="section-heading mb-4">Ready to plan your trip?</h2>
        <p className="font-body text-taupe mb-6">
          It only takes a couple of minutes to get your first itinerary.
        </p>
        <Link to="/register" className="btn-primary">
          Create Your Free Account
        </Link>
      </section>
    </div>
  );
};

export default Home;
