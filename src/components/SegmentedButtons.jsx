export default function SegmentedButtons({ options, value, onChange, disabledOptions = [] }) {
  const disabledSet = new Set(disabledOptions);

  return (
    <div className="segmented">
      {options.map((option) => {
        const disabled = disabledSet.has(option);

        return (
          <button
            key={option}
            type="button"
            disabled={disabled}
            className={[
              value === option ? "active" : "",
              disabled ? "option-disabled" : "",
            ].filter(Boolean).join(" ")}
            onClick={() => {
              if (!disabled) onChange(option);
            }}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
