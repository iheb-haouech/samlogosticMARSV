import { useEffect, useState } from "react";

export default function CookieBanner(): JSX.Element | null {
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const acceptCookies = (): void => {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div style={styles.banner}>
      <p style={styles.text}>
        We use cookies to improve your experience on SAM LOGISTIC.
      </p>
      <button style={styles.button} onClick={acceptCookies} type="button">
        Accept
      </button>
    </div>
  );
}

const styles: {
  banner: React.CSSProperties;
  text: React.CSSProperties;
  button: React.CSSProperties;
} = {
  banner: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "12px",
    padding: "14px 20px",
    background: "#111827",
    color: "#fff",
    zIndex: 9999,
    flexWrap: "wrap",
    textAlign: "center",
  },
  text: {
    margin: 0,
    fontSize: "14px",
  },
  button: {
    border: "none",
    padding: "8px 14px",
    borderRadius: "8px",
    background: "#22c55e",
    color: "#fff",
    cursor: "pointer",
  },
};