import {
  providerCategoryOptions,
  providerLocationOptions,
  providers,
  type Provider,
} from "../data/providers.ts";

export type ProviderFilters = {
  location?: string;
  gender?: string;
  category?: string;
};

export function filterProviders(filters: ProviderFilters): Provider[] {
  return providers.filter((provider) => {
    if (filters.location && !provider.locationIds.includes(filters.location))
      return false;
    if (filters.gender && provider.gender !== filters.gender) return false;
    if (filters.category && !provider.categoryIds.includes(filters.category))
      return false;
    return true;
  });
}

/**
 * A single card in the provider grid. The theme's AJAX filter replaces the grid
 * with exactly this markup, so it is shared between the archive and the
 * admin-ajax endpoint.
 */
export function renderProviderCard(provider: Provider): string {
  const locations = provider.cardLocations
    .map((location) => `<p class="centerme">${location}</p>`)
    .join("");

  return (
    `<div class="col-xl-3 col-lg-4 col-md-6"><div class="providerblock">` +
    `<a href="/providers/${provider.slug}/">` +
    `<div class="provider-image"><img src="${provider.image}" alt="" /></div>` +
    `<div class="provider-title"><h3 class="centerme">${provider.cardName}</h3></div>` +
    `<div class="provider-locations">${locations}</div>` +
    `</a></div></div>`
  );
}

/** The response body of the theme's `myfilter` AJAX action. */
export function renderProviderCards(matches: Provider[]): string {
  return matches.map(renderProviderCard).join("");
}

function options(list: Array<{ value: string; label: string }>): string {
  return list
    .map(
      (option) =>
        `<option value="${option.value}">${option.label.replace(/&/g, "&amp;")}</option>`,
    )
    .join("");
}

/** The /providers/ archive. */
export function renderProvidersArchive(): string {
  return `<div class="bluebg">
	<div class="container">
		<div class="row">
			<div class="col-12">
				<h1 class="interiorpagetitle">Providers</h1>
			</div>
		</div>
	</div>
</div>
<div class="whitebg padme90">
	<div class="container">
		<div class="row">
			<div class="col-12">
				<div class="pagebody" style="margin-top:0px; margin-bottom:75px;">
					<p>We are <span class="allbetter">ALL BETTER</span> when we work together. Our team of experts works together to deliver pediatric services that are greater than the sum of individual providers, ensuring that your child receives the best care.</p>
				</div>
			</div>
		</div>
		<form action="/wp-admin/admin-ajax.php" method="POST" id="filter">
			<div class="row">
				<div class="col-xl-3 col-lg-4 col-md-6">
					<label>Location</label><br><select class="select-css" name="locationfilter"><option value="">Select Location...</option>${options(providerLocationOptions)}</select>				</div>
				<div class="col-xl-3 col-lg-4 col-md-6">
					<label>Gender</label><br>
					<select class="select-css" name="genderfilter"><option value="">Select Gender...</option>
						<option value="male">Male</option>
						<option value="female">Female</option>
					</select>
				</div>
				<div class="col-xl-3 col-lg-4 col-md-6">
					<label>Category</label><br><select class="select-css" name="credentialsfilter"><option value="">Select Category...</option>${options(providerCategoryOptions)}</select>				</div>
				<div class="col-xl-3 col-lg-4 col-md-6">
					<button style="margin-top:23px;" class="btn box green">Apply filter</button>
					<input type="hidden" name="action" value="myfilter">
				</div>
			</div>
		</form>
		<br><br>
		<div class="row" id="response">
			${renderProviderCards(providers)}
			<div class="col-12 centerme">
			</div>
			<br><br><br><br>
		</div>
	</div>
</div>`;
}

function grayBox(section: { title: string; html: string }): string {
  return `				<div class="graybox">
					<div class="grayboxtitle lys">${section.title}</div>
					${section.html}
				</div>`;
}

/** A single provider profile. */
export function renderProviderProfile(provider: Provider): string {
  const offices = provider.officeLocations
    .map(
      (office) => `								<div class="prov-loc-wrap">
								<p class="centerme" style="font-weight:normal;">
									<a target="_blank" href="${office.mapUrl}" class="prov-address">
										${office.addressHtml}									</a><br>
																		${office.phone ? `Phone: <a href="tel:${office.phoneHref}" class="prov-address">${office.phone}</a>` : ""}
								</p>
								${
                  office.href
                    ? `<p class="loc-link centerme">
									<a class="btn box green" href="${office.href}">${office.label}</a>
								</p>`
                    : ""
                }
							</div>`,
    )
    .join("\n");

  const schedule = provider.scheduleUrl
    ? `					<p class="loc-link centerme">
						<a class="btn box green"${provider.scheduleNewTab ? ' target="_blank"' : ""} href="${provider.scheduleUrl}">${provider.scheduleLabel}</a>
					</p>`
    : "";

  return `<div class="bluebg">
	<div class="container">
		<div class="row">
			<div class="col-12">
				<h1 class="interiorpagetitle">Providers</h1>
			</div>
		</div>
	</div>
</div>
<div class="single-provider whitebg padme90">
	<div class="container">
		<div class="row">
			<div class="col-lg-4">
				<div class="provider-image">
											<img src="${provider.image}" alt="" />
									</div>
				<div class="provider-title">
					<h3 class="centerme">${provider.nameHtml}</h3>
				</div>
${offices}
${schedule}
${provider.sidebar.map(grayBox).join("\n")}
			</div>
			<div class="col-lg-7 offset-lg-1 bottomstack-lg">
				<div class="bigquote">
					<h1 class="lys">${provider.quote || " "}</h1>
				</div>
${provider.sections.map(grayBox).join("\n")}
			</div>
		</div>
	</div>
</div>`;
}
