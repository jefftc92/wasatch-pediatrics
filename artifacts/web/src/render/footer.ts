import { footerNav } from "../data/nav.ts";

/** The site footer, identical on every page. */
export function renderFooter(): string {
  const links = footerNav
    .map(
      (item) =>
        `										<li><a href="${item.href}"${item.external ? ' target="_blank"' : ""}>${item.label}</a></li>`,
    )
    .join("\n");

  return `		<footer>
			<div id="footerouterwrap">
				<div class="footerwrap">
					<div class="container">
						<div class="row">
							<div class="col-12 col-sm-6 col-md-3">
								<div id="footerlogo">
									<a href="/"><img src="/wp-content/themes/wasatch/images/footerlogo.svg" /></a>
								</div>
							</div>
							<div class="col-12 col-sm-6 col-md-9">
								<div id="footermenu">
									<ul>
${links}
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</footer>`;
}
