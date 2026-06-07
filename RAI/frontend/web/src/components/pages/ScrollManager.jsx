import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function ScrollManager() {
  const navigate = useNavigate();
  const location = useLocation();
  const isThrottled = useRef(false);
  const touchStartY = useRef(0);

  useEffect(() => {
    const getPageOrder = () => {
      return [
        "/",
        "/food",
        "/running",
        "/workout"
      ];
    };

    // Core navigation logic
    const handleNavigate = (direction) => {
      if (location.pathname.startsWith("/dashboard")) return;
      if (isThrottled.current) return;

      const currentPageOrder = getPageOrder(); // Vedno vzame svež vrstni red
      const currentIndex = currentPageOrder.indexOf(location.pathname);
      
      if (currentIndex === -1) return;

      if (direction === "down" && currentIndex < currentPageOrder.length - 1) {
        navigate(currentPageOrder[currentIndex + 1]);
        triggerCooldown();
      } else if (direction === "up" && currentIndex > 0) {
        navigate(currentPageOrder[currentIndex - 1]);
        triggerCooldown();
      }
    };

    // Prevents hyper-scrolling through multiple pages instantly
    const triggerCooldown = () => {
      isThrottled.current = true;
      setTimeout(() => {
        isThrottled.current = false;
      }, 1000); // 1 second delay between scroll jumps
    };

    // Desktop: Mouse Wheel
    const handleWheel = (e) => {
      // deltaY > 0 means scrolling down
      if (e.deltaY > 40) handleNavigate("down");
      else if (e.deltaY < -40) handleNavigate("up");
    };

    // Mobile: Touch/Swipe tracking
    const handleTouchStart = (e) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      if (isThrottled.current) return;
      
      const touchEndY = e.touches[0].clientY;
      const diff = touchStartY.current - touchEndY;

      // diff > 0 means finger swiped UP (page scrolled DOWN)
      if (diff > 50) handleNavigate("down"); 
      else if (diff < -50) handleNavigate("up");
    };

    // Attach event listeners
    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    // Cleanup listeners when component unmounts
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [location.pathname, navigate]);

  return null; 
}