// A single editable activity row within a day's itinerary
const ActivityCard = ({ activity, onEdit, onDelete }) => {
  return (
    <div className="card flex items-start justify-between gap-4">
      <div>
        {activity.time && (
          <span className="inline-block text-xs font-body font-semibold text-clay bg-clay/10 px-2 py-0.5 rounded-full mb-1">
            {activity.time}
          </span>
        )}
        <h4 className="font-display text-lg text-ink">{activity.place}</h4>
        {activity.description && (
          <p className="font-body text-sm text-taupe mt-1">{activity.description}</p>
        )}
      </div>

      <div className="flex gap-2 shrink-0">
        <button
          onClick={onEdit}
          className="text-sm font-body text-clay hover:text-rust transition-colors"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="text-sm font-body text-rust/70 hover:text-rust transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ActivityCard;
