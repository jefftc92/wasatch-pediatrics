import { useDocumentMeta } from "@/lib/useDocumentMeta";
import { useBodyClass } from "@/lib/useBodyClass";

export function NotFound() {
  useDocumentMeta("Page not found - Wasatch Pediatrics");
  useBodyClass("error404 wp-theme-wasatch");

  return (
    <div className="pagebody orangebg">
      <div className="usergenerated">
        <div className="container">
          <div className="row">
            <div className="col-12 centerme">
              <br className="notonmobile" />
              <br className="notonmobile" />
              <br className="notonmobile" />
              <h2 style={{ color: "white" }}>
                Sorry, the page you are looking for is not here.
              </h2>
              <br />
              <img
                src="/wp-content/themes/wasatch/images/symptom-checker.svg"
                alt=""
              />
              <h1
                className="interiorpagetitle"
                style={{
                  fontSize: "150px",
                  fontWeight: "bold",
                  color: "white",
                }}
              >
                404
              </h1>
              <br className="notonmobile" />
              <br className="notonmobile" />
              <br className="notonmobile" />
              <br className="notonmobile" />
              <br className="notonmobile" />
              <br className="notonmobile" />
              <br className="notonmobile" />
              <br />
              <br />
              <br />
              <br />
              <br />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
