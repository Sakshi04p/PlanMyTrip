const Footer = () => {
  return (
    <footer className="bg-sand border-t border-sand mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="font-display text-lg text-rust">PlanMyTrip</p>
        <p className="font-body text-sm text-taupe">
          &copy; {new Date().getFullYear()} PlanMyTrip. Plan smarter, travel better.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
