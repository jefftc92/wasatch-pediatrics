import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { fadeIn, slideToggle } from "@/lib/animate";
import { mainNav, type NavItem } from "@/data/nav";

const MOBILE_MAX = 767;

const isMobile = () => window.innerWidth <= MOBILE_MAX;

export function Header() {
  const [, navigate] = useLocation();
  const grayNavRef = useRef<HTMLDivElement>(null);
  const [burgerOpen, setBurgerOpen] = useState(false);
  // Which top-level item is hovered (desktop) or expanded (mobile).
  const [activeId, setActiveId] = useState<number | null>(null);
  const [orangeId, setOrangeId] = useState<number | null>(null);
  const [openIds, setOpenIds] = useState<number[]>([]);

  // The mobile burger slides #graynav open; when the viewport grows back to
  // desktop the inline height/display left behind by the animation is cleared
  // so the always-visible desktop nav is not stuck hidden.
  useEffect(() => {
    const onResize = () => {
      if (!isMobile() && grayNavRef.current) {
        grayNavRef.current.style.display = "";
        setBurgerOpen(false);
        setOpenIds([]);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const toggleBurger = () => {
    setBurgerOpen((open) => !open);
    if (grayNavRef.current) slideToggle(grayNavRef.current, "fast");
  };

  const onTopLevelClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    item: NavItem,
  ) => {
    if (isMobile() && item.children) {
      // On mobile the parent link only expands its sub-menu.
      event.preventDefault();
      setOpenIds((ids) =>
        ids.includes(item.id)
          ? ids.filter((id) => id !== item.id)
          : [...ids, item.id],
      );
      const submenu =
        event.currentTarget.parentElement?.querySelector<HTMLElement>(
          ".sub-menu",
        );
      if (submenu) slideToggle(submenu, "fast");
      return;
    }
    handleNavigation(event, item.href, item.external);
  };

  const handleNavigation = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    external?: boolean,
  ) => {
    if (external || href === "#") {
      if (href === "#") event.preventDefault();
      return;
    }
    event.preventDefault();
    navigate(href);
    setActiveId(null);
    if (isMobile() && grayNavRef.current) {
      grayNavRef.current.style.display = "none";
      setBurgerOpen(false);
    }
  };

  return (
    <header id="header">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div id="logo">
              <a href="/" onClick={(e) => handleNavigation(e, "/")}>
                <img
                  src="/wp-content/themes/wasatch/images/wasatchlogo.svg"
                  alt="Wasatch Pediatrics"
                />
              </a>
            </div>
            <div id="topmenuwrap">
              <div id="topmenu">
                <ul className="desktop" id="navbuttons">
                  <li>
                    <a
                      href="/contact-us"
                      onClick={(e) => handleNavigation(e, "/contact-us/")}
                    >
                      <img
                        src="/wp-content/themes/wasatch/images/fb.svg"
                        alt="Facebook Icon"
                      />
                    </a>
                  </li>{" "}
                  <li>
                    <a
                      href="/contact-us"
                      onClick={(e) => handleNavigation(e, "/contact-us/")}
                    >
                      <img
                        src="/wp-content/themes/wasatch/images/ig.svg"
                        alt="Instagram Icon"
                      />
                    </a>
                  </li>
                  <div id="searchformwrap" title="Search">
                    <SearchForm className="mainsearch search-form" expanding />
                  </div>
                </ul>
                <div
                  id="mobileburger"
                  className={burgerOpen ? "open" : undefined}
                  onClick={toggleBurger}
                  role="button"
                  aria-label="Menu"
                  aria-expanded={burgerOpen}
                >
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="graynav" ref={grayNavRef}>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div id="mobilesearch" className="mobile">
                <SearchForm className="mainsearch search-form" />
              </div>
              <div id="navwrap">
                <div className="menu-main-nav-container">
                  <ul id="menu-main-nav" className="mainnav">
                    {mainNav.map((item) => {
                      const classes = [
                        "menu-item",
                        item.children ? "menu-item-has-children" : "",
                        `menu-item-${item.id}`,
                        activeId === item.id ? "active" : "",
                        openIds.includes(item.id) ? "open" : "",
                      ]
                        .filter(Boolean)
                        .join(" ");

                      return (
                        <li
                          key={item.id}
                          id={`menu-item-${item.id}`}
                          className={classes}
                          onMouseEnter={() =>
                            !isMobile() && setActiveId(item.id)
                          }
                          onMouseLeave={() => !isMobile() && setActiveId(null)}
                        >
                          <a
                            href={item.href}
                            target={item.external ? "_blank" : undefined}
                            rel={item.external ? "noreferrer" : undefined}
                            className={
                              orangeId === item.id ? "orange" : undefined
                            }
                            onMouseEnter={() =>
                              !isMobile() && setOrangeId(item.id)
                            }
                            onMouseLeave={() =>
                              !isMobile() && setOrangeId(null)
                            }
                            onClick={(e) => onTopLevelClick(e, item)}
                          >
                            {item.label}
                          </a>
                          {item.children && (
                            <ul
                              className="sub-menu"
                              onMouseEnter={() =>
                                !isMobile() && setOrangeId(item.id)
                              }
                              onMouseLeave={() =>
                                !isMobile() && setOrangeId(null)
                              }
                            >
                              {item.children.map((child) => (
                                <li
                                  key={child.id}
                                  id={`menu-item-${child.id}`}
                                  className={`menu-item menu-item-${child.id}`}
                                >
                                  <a
                                    href={child.href}
                                    onClick={(e) =>
                                      handleNavigation(
                                        e,
                                        child.href,
                                        child.external,
                                      )
                                    }
                                  >
                                    {child.label}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

/**
 * The site search input. On desktop the magnifier expands the field on first
 * click (and only submits once open); on mobile the field is always visible.
 */
function SearchForm({
  className,
  expanding = false,
}: {
  className: string;
  expanding?: boolean;
}) {
  const [, navigate] = useLocation();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const closeRef = useRef<HTMLDivElement>(null);

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (expanding && !open) {
      setOpen(true);
      if (closeRef.current)
        fadeIn(closeRef.current, "fast", () => inputRef.current?.focus());
      return;
    }
    if (value.trim()) navigate(`/?s=${encodeURIComponent(value.trim())}`);
  };

  const onClose = () => {
    setOpen(false);
    setValue("");
    if (closeRef.current) closeRef.current.style.display = "none";
  };

  return (
    <form
      className={className}
      role="search"
      method="get"
      action="/"
      onSubmit={onSubmit}
    >
      <div className="searchwrap">
        <div className="searchclose" ref={closeRef} onClick={onClose}>
          {"✕"}
        </div>
        <input
          ref={inputRef}
          type="search"
          className={`search-field navsearch${open ? " open" : ""}`}
          title="Search Site"
          placeholder={expanding && !open ? "" : "Search"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          name="s"
        />
        <button className="searchbutton" type="submit">
          <img
            src="/wp-content/themes/wasatch/images/icon_magnify.svg"
            alt="Search"
          />
        </button>
      </div>
    </form>
  );
}
