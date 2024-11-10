import ReactGA from "react-ga4";

// Initialize GA with your measurement ID
export const initGA = () => {
  ReactGA.initialize("G-4JS04XN1KX"); 
};

// Page view tracking
export const logPageView = () => {
  ReactGA.send({ hitType: "pageview", page: window.location.pathname });
};

// Event tracking
export const logEvent = (category: string, action: string, label?: string) => {
  ReactGA.event({
    category,
    action,
    label
  });
}; 