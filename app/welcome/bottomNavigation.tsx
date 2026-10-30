export type NavigationScreen = "home" | "history" | "settings";

const NAVIGATION_ITEM_LIST: { screen: NavigationScreen; label: string }[] = [
  { screen: "home", label: "Aujourd'hui" },
  { screen: "history", label: "Historique" },
  { screen: "settings", label: "Réglages" },
];

type BottomNavigationProps = {
  screen: NavigationScreen;
  onScreenChange: (screen: NavigationScreen) => void;
};

export function BottomNavigation({
  screen,
  onScreenChange,
}: BottomNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-3">
      <div className="max-w-md mx-auto flex gap-2">
        {NAVIGATION_ITEM_LIST.map((navigationItem) => (
          <button
            key={navigationItem.screen}
            type="button"
            onClick={() => onScreenChange(navigationItem.screen)}
            className={
              navigationItem.screen === screen
                ? "flex-1 py-3 rounded-xl bg-slate-800 text-white"
                : "flex-1 py-3 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
            }
          >
            {navigationItem.label}
          </button>
        ))}
      </div>
    </div>
  );
}
