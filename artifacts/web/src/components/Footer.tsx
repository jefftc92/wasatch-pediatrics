import { Fragment } from "react";
import { useLocation } from "wouter";
import { footerNav } from "@/data/nav";

export function Footer() {
  const [, navigate] = useLocation();

  return (
    <footer>
      <div id="footerouterwrap">
        <div className="footerwrap">
          <div className="container">
            <div className="row">
              <div className="col-12 col-sm-6 col-md-3">
                <div id="footerlogo">
                  <a
                    href="/"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/");
                    }}
                  >
                    <img
                      src="/wp-content/themes/wasatch/images/footerlogo.svg"
                      alt="Wasatch Pediatrics"
                    />
                  </a>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-md-9">
                <div id="footermenu">
                  <ul>
                    {/* The list items are inline-block, so the whitespace between them
                        in the original markup contributes to the spacing. */}
                    {footerNav.map((item, index) => (
                      <Fragment key={item.id}>
                        {index > 0 ? " " : null}
                        <li>
                          <a
                            href={item.href}
                            target={item.external ? "_blank" : undefined}
                            rel={item.external ? "noreferrer" : undefined}
                            onClick={(e) => {
                              if (item.external) return;
                              e.preventDefault();
                              navigate(item.href);
                            }}
                          >
                            {item.label}
                          </a>
                        </li>
                      </Fragment>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
