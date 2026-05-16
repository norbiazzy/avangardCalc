export default function SegmentedButtons({ options, value, onChange }) {
  return (
    <div className="segmented">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          className={value === option ? "active" : ""}
          onClick={() => onChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
