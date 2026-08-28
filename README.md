## InternationalPhone

Web widget that adds a country selector and international phone number formatting to a
standard Mendix text box, wrapping
[intl-tel-input](https://github.com/jackocnr/intl-tel-input).

The widget does not render its own input. You drop an ordinary Mendix **Text box** into it,
and the widget decorates that input with the country dropdown and formatting. The text box
keeps all of its own properties — label, editability, validation, accessibility, tab index
and events — so none of that has to be reimplemented here.

As the user types, the widget can write the number back into any number of attributes, each
in its own format (E.164, international, national, RFC3966), and run an action per attribute
afterwards.

## Features

- Country selector with flags
- Automatic country detection from a typed dial code
- Writes the formatted number to any number of attributes, each with its own format
- Per-attribute action, run after all attributes are written
- Two-way binding of the selected country to an attribute
- Placeholder generated from the selected country, with a configurable number type
- Preferred, allow-list, deny-list and translated country names

## Requirements

Studio Pro **11.12** or higher.

Version `2.0.0` is built against Mendix Pluggable Widgets Tools 11.12 (React 19) and is
**not backward compatible** — it replaces the drop-in text box model of the Dojo widget it
supersedes (see [Migrating](#migrating-from-mx-widget-intlphoneinput)). Stay on `0.x` for
Studio Pro 9 or 10.

## Usage

Download one of the
[releases](https://github.com/Entidad/mendix-react-web-internationalphone/releases) or build
from source as follows

```
git clone https://github.com/Entidad/mendix-react-web-internationalphone.git
cd ./mendix-react-web-internationalphone
npm install
npm run build
```

Deploy `entidad.io.InternationalPhone.mpk` to `$PROJ/widgets`, then run
`Synchronize App Directory` in Studio Pro (`F4`, or `Menu / App / Synchronize App Directory`).

The widget needs an entity context, so place it inside a **Data view** or a **List view** row.

1. Place the widget on the page.
2. Drop a standard Mendix **Text box** inside it and bind it to your phone number attribute.
   Configure its label, validation and events as you normally would.
3. Optionally add rows under **Phone number attributes** for each additional format you want
   stored.
4. Optionally bind **... attribute for initial country** to a string attribute to persist the
   selected country.

### Properties

#### Data

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `content` | Widgets | yes | Drop zone for the Mendix text box this widget decorates. |
| `phoneNumberAttributes` | List | no | Attributes to fill with the formatted number. See below. |

Each **Phone number attributes** row has:

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `phoneNumberAttribute` | String attribute | yes | Receives the formatted number on blur. |
| `phoneNumberAttributeFormat` | Enumeration | yes (default `E164`) | `E164`, `INTERNATIONAL`, `NATIONAL` or `RFC3966`. |
| `onChange` | Action | no | Runs after **all** rows have been written. |

#### Display

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `allowDropdown` | Boolean | yes (default `true`) | Allow the user to change country from the dropdown. |
| `autoHideDialCode` | Boolean | yes (default `true`) | Hide the dial code until the field has focus. |
| `autoPlaceholder` | Enumeration | yes (default `polite`) | `polite`, `aggressive` or `off`. |
| `placeholderNumberType` | Enumeration | yes (default `MOBILE`) | Number type the example placeholder is generated from. |
| `placeholderNumberTypeAttribute` | String attribute | no | Overrides `placeholderNumberType` when set. |
| `separateDialCode` | Boolean | yes (default `false`) | Show the dial code beside the flag, outside the input. |

#### Formatting

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `formatOnDisplay` | Boolean | yes (default `true`) | Format the value on initialisation and on set. |
| `nationalMode` | Boolean | yes (default `true`) | Let the user enter national numbers without a dial code. |

#### Countries

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `initialCountry` | Enumeration | yes (default `gb`) | Country selected on load. Used only when `initialCountryAttribute` is empty. |
| `initialCountryAttribute` | String attribute | no | Two-way binding for the selected country. Overrides `initialCountry` when it holds a value. |
| `preferredCountries` | List | no | Countries pinned to the top of the dropdown. |
| `onlyCountries` | List | no | Restrict the dropdown to these countries. |
| `excludeCountries` | List | no | Remove these countries from the dropdown. |
| `localizedCountries` | List | no | Country name translations, one `country` + `translation` per row. |

The standard **Visibility** property is supported.

### Behaviour

**The text box supplies everything about the input.** Label, editability, read-only style,
validation, accessibility and the on-change/on-enter/on-leave events all come from the text
box you drop in, and are configured on it rather than here. This widget only adds the country
selector and formatting. It binds no value of its own.

**Phone number attributes are written on blur, not on every keystroke.** All rows are written
first, and only then does each row's `onChange` run — so a microflow triggered from one row
sees every attribute already committed, not a half-updated set. Rows with a read-only
attribute are skipped.

**The country attribute is written on blur as well as on country change.** intl-tel-input's
`countrychange` event is driven by `keyup`, so a value set programmatically — Mendix
re-rendering the bound text box, or a paste — changes the number without firing it. Writing
on blur too keeps the attribute in step with the number attributes. Without this the country
can silently lag a step behind.

**The country is stored lowercase.** `initialCountryAttribute` receives the ISO 3166-1
alpha-2 code as intl-tel-input reports it — `us`, `mx` — not `US`. Compare
case-insensitively in your microflows, or normalise on write.

**`initialCountryAttribute` overrides `initialCountry`, but only when it has a value.** An
empty attribute falls back to the `initialCountry` setting rather than to the first country
in the list.

**The flag follows the attribute after load.** If a microflow writes
`initialCountryAttribute`, or the data view moves to another record, the selector updates to
match. The comparison is case-insensitive, so either casing works.

## Issues, suggestions and feature requests

[GitHub](https://github.com/Entidad/mendix-react-web-internationalphone/issues)

## Migrating from mx-widget-IntlPhoneInput

This widget replaces the Dojo widget
[mx-widget-IntlPhoneInput](https://github.com/ollyspooner/mx-widget-IntlPhoneInput), which
does not run on Mendix 11 — it calls `mx.ui.action`, removed in that release.

The widget id changed, so Studio Pro treats the two as unrelated and there is no in-place
upgrade. On each page:

| Old (Dojo) | New |
| --- | --- |
| `phoneNumberSelector` — CSS class naming a text box elsewhere on the page | Drop that same text box **inside** the widget. The class is no longer used for wiring. |
| `restrictToSiblings` | Not needed. The input is found within the widget's own subtree. |
| Per-row `onChange` microflow | Per-row `onChange` **action**. Re-point the same microflow. |

Everything under **Display**, **Formatting** and **Countries** carries over unchanged.

## Development and contribution

Requires Node **22.x** — Mendix Pluggable Widgets Tools 11.12 enforces `>=22.18.0 <23`, and
will refuse to build on Node 24 even though Studio Pro itself ships it.

1. `npm install`
2. `npm run build` to build once, or `npm start` to watch for changes. On every change:
    - the widget is bundled;
    - the bundle is written to `dist/` in the root of the project;
    - the bundle is copied into the `deployment` and `widgets` folders of the Mendix test
      project at `config.projectPath` in `package.json`. That path is currently `./test/`,
      which is **not** in this repository — point it at a local app, or copy the `.mpk` by
      hand.

`intl-tel-input` is pinned to an exact `17.x`. **Do not bump it to 18 or later without
reworking the widget**: ten of the sixteen options this widget passes were renamed or removed
after v17 — `autoHideDialCode` was dropped outright, `preferredCountries` became
`countryOrder`, and `nationalMode` and `formatOnDisplay` were merged into
`numberDisplayFormat`. Six of those are exposed as widget properties, so it is a breaking
change for existing pages, not just a code change.

Contributions welcome.

## References

* [intl-tel-input](https://github.com/jackocnr/intl-tel-input)
* [mx-widget-IntlPhoneInput](https://github.com/ollyspooner/mx-widget-IntlPhoneInput) — the Dojo widget this replaces
