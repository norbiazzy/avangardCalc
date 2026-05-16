
const THEMES = [
  { key: "classic", label: "Classic" },
  { key: "dark", label: "Dark" },
  { key: "luxury", label: "Luxury" },
  { key: "blueprint", label: "Blueprint" },
];

export default function ThemeSwitcher({ theme, setTheme }) {
  return (
    <section className="theme-switcher">
      {THEMES.map((item) => (
        <button
          key={item.key}
          className={theme === item.key ? "theme-btn active" : "theme-btn"}
          onClick={() => setTheme(item.key)}
        >
          {item.label}
        </button>
      ))}
    </section>
  );
}
