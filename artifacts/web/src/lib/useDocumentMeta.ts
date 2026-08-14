import { useEffect } from "react";

/** Keeps <title> and the meta description in sync with the active route. */
export function useDocumentMeta(title: string, description?: string) {
  useEffect(() => {
    if (title) document.title = title;

    if (description === undefined) return;
    let tag = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    );
    if (!tag) {
      tag = document.createElement("meta");
      tag.name = "description";
      document.head.appendChild(tag);
    }
    tag.content = description;
  }, [title, description]);
}
