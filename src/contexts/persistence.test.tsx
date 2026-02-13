import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";

function ThemeProbe() {
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <span data-testid="theme">{theme}</span>
      <button type="button" onClick={toggleTheme}>toggle-theme</button>
    </>
  );
}

function LanguageProbe() {
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <>
      <span data-testid="language">{language}</span>
      <span data-testid="translation">{t("nav.dashboard")}</span>
      <button type="button" onClick={toggleLanguage}>toggle-language</button>
    </>
  );
}

describe("persistent contexts", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  it("keeps theme persistence and recovers from invalid stored values", () => {
    localStorage.setItem("theme", "invalid-theme");

    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("theme")).toHaveTextContent("dark");
    expect(localStorage.getItem("theme")).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);

    fireEvent.click(screen.getByRole("button", { name: "toggle-theme" }));
    expect(screen.getByTestId("theme")).toHaveTextContent("light");
    expect(localStorage.getItem("theme")).toBe("light");
  });

  it("keeps language persistence and recovers from invalid stored values", () => {
    localStorage.setItem("language", "de");

    render(
      <LanguageProvider>
        <LanguageProbe />
      </LanguageProvider>,
    );

    expect(screen.getByTestId("language")).toHaveTextContent("en");
    expect(screen.getByTestId("translation")).toHaveTextContent("Dashboard");

    fireEvent.click(screen.getByRole("button", { name: "toggle-language" }));

    expect(screen.getByTestId("language")).toHaveTextContent("pt");
    expect(screen.getByTestId("translation")).toHaveTextContent("Painel");
    expect(localStorage.getItem("language")).toBe("pt");
  });
});
