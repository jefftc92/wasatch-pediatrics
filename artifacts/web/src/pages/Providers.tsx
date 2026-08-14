import { useRef, useState } from "react";
import { useLocation } from "wouter";
import { useThemeInteractions } from "@/lib/themeInteractions";
import { useDocumentMeta } from "@/lib/useDocumentMeta";
import { useBodyClass } from "@/lib/useBodyClass";
import {
  providerCategoryOptions,
  providerLocationOptions,
  providers,
  providersArchiveBodyClass,
  type Provider,
} from "@/data/providers";

type Filters = {
  location: string;
  gender: string;
  category: string;
};

const EMPTY: Filters = { location: "", gender: "", category: "" };

function matches(provider: Provider, filters: Filters): boolean {
  if (filters.location && !provider.locationIds.includes(filters.location))
    return false;
  if (filters.gender && provider.gender !== filters.gender) return false;
  if (filters.category && !provider.categoryIds.includes(filters.category))
    return false;
  return true;
}

export function Providers() {
  const containerRef = useRef<HTMLDivElement>(null);
  // `draft` tracks the selects; `applied` only changes when the filter is
  // submitted, matching the live site's "Apply filter" behaviour.
  const [draft, setDraft] = useState<Filters>(EMPTY);
  const [applied, setApplied] = useState<Filters>(EMPTY);

  useDocumentMeta("Providers Archive - Wasatch Pediatrics");
  useBodyClass(providersArchiveBodyClass);

  const results = providers.filter((provider) => matches(provider, applied));
  useThemeInteractions(containerRef, [results.length]);

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
      <div className="whitebg padme90">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div
                className="pagebody"
                style={{ marginTop: "0px", marginBottom: "75px" }}
              >
                <p>
                  We are <span className="allbetter">ALL BETTER</span> when we
                  work together. Our team of experts works together to deliver
                  pediatric services that are greater than the sum of individual
                  providers, ensuring that your child receives the best care.
                </p>
              </div>
            </div>
          </div>
          <form
            id="filter"
            onSubmit={(event) => {
              event.preventDefault();
              setApplied(draft);
            }}
          >
            <div className="row">
              <div className="col-xl-3 col-lg-4 col-md-6">
                <label>Location</label>
                <br />
                <select
                  className="select-css"
                  name="locationfilter"
                  value={draft.location}
                  onChange={(e) =>
                    setDraft({ ...draft, location: e.target.value })
                  }
                >
                  <option value="">Select Location...</option>
                  {providerLocationOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-xl-3 col-lg-4 col-md-6">
                <label>Gender</label>
                <br />
                <select
                  className="select-css"
                  name="genderfilter"
                  value={draft.gender}
                  onChange={(e) =>
                    setDraft({ ...draft, gender: e.target.value })
                  }
                >
                  <option value="">Select Gender...</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div className="col-xl-3 col-lg-4 col-md-6">
                <label>Category</label>
                <br />
                <select
                  className="select-css"
                  name="credentialsfilter"
                  value={draft.category}
                  onChange={(e) =>
                    setDraft({ ...draft, category: e.target.value })
                  }
                >
                  <option value="">Select Category...</option>
                  {providerCategoryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-xl-3 col-lg-4 col-md-6">
                <button
                  style={{ marginTop: "23px" }}
                  className="btn box green"
                  type="submit"
                >
                  Apply filter
                </button>
              </div>
            </div>
          </form>
          <br />
          <br />
          <div className="row" id="response">
            {results.map((provider) => (
              <ProviderCard key={provider.slug} provider={provider} />
            ))}
            {/* Pagination slot; the archive shows every provider on one page. */}
            <div className="col-12 centerme" />
            <br />
            <br />
            <br />
            <br />
          </div>
        </div>
      </div>
    </div>
  );
}

function ProviderCard({ provider }: { provider: Provider }) {
  const [, navigate] = useLocation();

  return (
    <div className="col-xl-3 col-lg-4 col-md-6">
      <div className="providerblock">
        <a
          href={`/providers/${provider.slug}/`}
          onClick={(event) => {
            event.preventDefault();
            navigate(`/providers/${provider.slug}/`);
          }}
        >
          <div className="provider-image">
            <img src={provider.image} alt="" />
          </div>
          <div className="provider-title">
            <h3
              className="centerme"
              dangerouslySetInnerHTML={{ __html: provider.cardName }}
            />
          </div>
          <div className="provider-locations">
            {/* Multi-site providers list their locations in one paragraph
                separated by <br>, as the live markup does. */}
            {provider.cardLocations.map((location) => (
              <p
                className="centerme"
                key={location}
                dangerouslySetInnerHTML={{ __html: location }}
              />
            ))}
          </div>
        </a>
      </div>
    </div>
  );
}
