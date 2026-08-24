// Simple loading spinner shown while waiting on API calls
const Loader = ({ label = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-10 gap-3 text-taupe">
      <div className="w-8 h-8 border-4 border-sand border-t-clay rounded-full animate-spin" />
      <p className="font-body text-sm">{label}</p>
    </div>
  );
};

export default Loader;
