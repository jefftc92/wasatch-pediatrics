import { useRef } from "react";
import { useLocation } from "wouter";
import { useThemeInteractions } from "@/lib/themeInteractions";
import { useDocumentMeta } from "@/lib/useDocumentMeta";
import { useBodyClass } from "@/lib/useBodyClass";
import {
  providerBySlug,
  type Provider,
  type ProviderSection,
} from "@/data/providers";
import { NotFound } from "./NotFound";

export function ProviderDetail({ slug }: { slug: string }) {
  const provider = providerBySlug.get(slug);
  if (!provider) return <NotFound />;
  return <ProviderProfile provider={provider} />;
}

function ProviderProfile({ provider }: { provider: Provider }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [, navigate] = useLocation();

  useDocumentMeta(provider.pageTitle, provider.description);
  useBodyClass(provider.bodyClass);
  useThemeInteractions(containerRef, [provider.slug]);

  return (
    <div ref={containerRef}>
      <div className="bluebg">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h1 className="interiorpagetitle">Providers</h1>
            </div>
          </div>
        </div>
      </div>
      <div className="single-provider whitebg padme90">
        <div className="container">
          <div className="row">
            <div className="col-lg-4">
              <div className="provider-image">
                <img src={provider.image} alt="" />
              </div>
              <div className="provider-title">
                <h3 className="centerme">{provider.name}</h3>
              </div>
              {provider.officeLocations.map((office, index) => (
                <div className="prov-loc-wrap" key={`${office.label}-${index}`}>
                  {/* The stray spaces around the inline elements match the original
                      markup — they affect the rendered line boxes. */}
                  <p className="centerme" style={{ fontWeight: "normal" }}>
                    {" "}
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={office.mapUrl}
                      className="prov-address"
                      dangerouslySetInnerHTML={{ __html: office.addressHtml }}
                    />
                    <br />
                    {office.phone && (
                      <>
                        Phone:{" "}
                        <a
                          href={`tel:${office.phoneHref}`}
                          className="prov-address"
                        >
                          {office.phone}
                        </a>
                      </>
                    )}{" "}
                  </p>
                  {office.href && (
                    <p className="loc-link centerme">
                      {" "}
                      <a
                        className="btn box green"
                        href={office.href}
                        onClick={(event) => {
                          event.preventDefault();
                          navigate(office.href);
                        }}
                      >
                        {office.label}
                      </a>{" "}
                    </p>
                  )}
                </div>
              ))}
              {provider.scheduleUrl && (
                <p className="loc-link centerme">
                  {" "}
                  <a
                    className="btn box green"
                    target={provider.scheduleNewTab ? "_blank" : undefined}
                    rel={provider.scheduleNewTab ? "noreferrer" : undefined}
                    href={provider.scheduleUrl}
                  >
                    {provider.scheduleLabel}
                  </a>{" "}
                </p>
              )}
              {provider.sidebar.map((section) => (
                <GrayBox key={section.title} section={section} />
              ))}
            </div>
            <div className="col-lg-7 offset-lg-1 bottomstack-lg">
              {provider.quote && (
                <div className="bigquote">
                  {/* Some pull quotes carry line breaks and attribution markup. */}
                  <h1
                    className="lys"
                    dangerouslySetInnerHTML={{ __html: provider.quote }}
                  />
                </div>
              )}
              {provider.sections.map((section) => (
                <GrayBox key={section.title} section={section} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GrayBox({ section }: { section: ProviderSection }) {
  // Rendered as one HTML block so the paragraphs stay direct children of
  // .graybox, exactly as the live markup has them.
  return (
    <div
      className="graybox"
      dangerouslySetInnerHTML={{
        __html: `<div class="grayboxtitle lys">${section.title}</div>${section.html}`,
      }}
    />
  );
}
