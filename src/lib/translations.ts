export type Language = "en" | "de";

export interface Translations {
  // Common
  artworks: string;
  artists: string;
  artwork: string;
  stories: string;
  search: string;
  searchPlaceholder: string;
  contact: string;
  born: string;
  viewAll: string;
  viewAllWorks: string;
  viewAllArtists: string;
  featured: string;
  available: string;
  sold: string;
  price: string;
  dimensions: string;
  medium: string;
  year: string;
  artist: string;
  nationality: string;
  bio: string;
  description: string;

  // Navigation
  home: string;
  aboutUs: string;
  ourStory: string;
  discover: string;
  howItWorks: string;
  help: string;

  // Headers & Titles
  artMoment: string;
  artistsCount: (count: number) => string;
  artworksCount: (count: number) => string;

  // Pagination
  previous: string;
  next: string;

  // Artwork Details
  artistNote: string;
  taxesShipping: string;
  otherArtworksByArtist: string;
  noArtworks: string;
  artworksByArtist: string;
  purchase: string;
  soldOut: string;

  // Checkout
  checkout: string;
  confirmation: string;
  emailAddress: string;
  firstName: string;
  lastName: string;
  country: string;
  phoneNumber: string;
  street: string;
  additionalStreet: string;
  city: string;
  zipCode: string;
  state: string;
  saveAndContinue: string;
  subtotal: string;
  shippingFee: string;
  vat: string;
  total: string;

  // Thank You Page
  thankYouOrder: string;
  orderPlaced: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  amount: string;
  paymentDeadline: string;
  contactHelp: {
    beforeContact: string;
    afterContact: string;
  };

  // Footer
  footerDisclaimer: string;
  allRightsReserved: string;

  // Countries
  countries: {
    germany: string;
    usa: string;
    uk: string;
    france: string;
    [key: string]: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    // Common
    artworks: "Artworks",
    artists: "Artists",
    artwork: "Artwork",
    stories: "Stories",
    search: "Search",
    searchPlaceholder: "Search",
    contact: "Contact",
    born: "b.",
    purchase: "Purchase",
    viewAll: "View All",
    viewAllWorks: "View All Works",
    viewAllArtists: "View All Artists",
    featured: "Featured",
    available: "Available",
    sold: "Sold",
    price: "Price",
    dimensions: "Dimensions",
    medium: "Medium",
    year: "Year",
    artist: "Artist",
    nationality: "Nationality",
    bio: "Biography",
    description: "Description",

    // Navigation
    home: "Home",
    aboutUs: "About Us",
    ourStory: "Our Story",
    discover: "Discover",
    howItWorks: "How It Works",
    help: "Help",

    // Headers & Titles
    artMoment: "ART OF THE MOMENT",
    artistsCount: (count) => `${count} artists`,
    artworksCount: (count) => `${count} artworks`,

    // Pagination
    previous: "Previous",
    next: "Next",

    // Artwork Details
    artistNote: "Artist's note",
    taxesShipping:
      "Taxes and shipping included for delivery to Germany. 14 working days of estimated delivery time",
    otherArtworksByArtist: `Other artworks by`,
    noArtworks: "No artworks available at the moment.",
    artworksByArtist: `Artworks by`,
    purchase: "Purchase",
    soldOut: "Sold Out",

    // Checkout
    checkout: "Checkout",
    confirmation: "Confirmation",
    emailAddress: "Email address",
    firstName: "First name",
    lastName: "Last name",
    country: "Country",
    phoneNumber: "Phone number",
    street: "Street",
    additionalStreet: "Additional street (optional)",
    city: "City",
    zipCode: "Zip code",
    state: "State",
    saveAndContinue: "Save and continue",
    subtotal: "Subtotal",
    shippingFee: "Shipping fee",
    vat: "VAT",
    total: "Total",

    // Thank You Page
    thankYouOrder: "Thank you for your order!",
    orderPlaced:
      "Your order has been successfully placed and is awaiting payment. Please use the details below to complete your bank transfer.",
    bankName: "Bank Name",
    accountName: "Account Name",
    accountNumber: "Account Number",
    amount: "Amount",
    paymentDeadline:
      "Please ensure payment is completed within 48 hours to avoid order cancellation.",
    contactHelp: {
      beforeContact: "Please,",
      afterContact: "us if you need help or have any questions",
    },

    // Footer
    footerDisclaimer:
      "This measure is co-financed by tax revenue based on the budget approved by the members of the Saxon State Parliament.",
    allRightsReserved: "© 2025 KUNSTiNO. All rights reserved.",

    // Countries
    countries: {
      germany: "Germany",
      usa: "United States",
      uk: "United Kingdom",
      france: "France",
    },
  },

  de: {
    // Common
    artworks: "Kunstwerke",
    artists: "Künstler",
    artwork: "Kunstwerk",
    stories: "Geschichten",
    search: "Suchen",
    searchPlaceholder: "Suchen",
    contact: "Kontakt",
    born: "geb.",
    purchase: "Kaufen",
    viewAll: "Alle anzeigen",
    viewAllWorks: "Alle Werke anzeigen",
    viewAllArtists: "Alle Künstler anzeigen",
    featured: "Ausgewählt",
    available: "Verfügbar",
    sold: "Verkauft",
    price: "Preis",
    dimensions: "Abmessungen",
    medium: "Medium",
    year: "Jahr",
    artist: "Künstler",
    nationality: "Nationalität",
    bio: "Biografie",
    description: "Beschreibung",

    // Navigation
    home: "Startseite",
    aboutUs: "Über uns",
    ourStory: "Unsere Geschichte",
    discover: "Entdecken",
    howItWorks: "So funktioniert es",
    help: "Hilfe",

    // Headers & Titles
    artMoment: "KUNST DES MOMENTS",
    artistsCount: (count) => `${count} Künstler`,
    artworksCount: (count) => `${count} Kunstwerke`,

    // Pagination
    previous: "Zurück",
    next: "Weiter",

    // Artwork Details
    artistNote: "Künstlernotiz",
    taxesShipping:
      "Steuern und Versand nach Deutschland inklusive. Geschätzte Lieferzeit: 14 Arbeitstage",
    otherArtworksByArtist: `Weitere Kunstwerke von`,
    noArtworks: "Derzeit sind keine Kunstwerke verfügbar.",
    artworksByArtist: `Kunstwerke von`,
    purchase: "Kaufen",
    soldOut: "Ausverkauft",

    // Checkout
    checkout: "Kasse",
    confirmation: "Bestätigung",
    emailAddress: "E-Mail-Adresse",
    firstName: "Vorname",
    lastName: "Nachname",
    country: "Land",
    phoneNumber: "Telefonnummer",
    street: "Straße",
    additionalStreet: "Zusätzliche Straße (optional)",
    city: "Stadt",
    zipCode: "Postleitzahl",
    state: "Bundesland",
    saveAndContinue: "Speichern und weiter",
    subtotal: "Zwischensumme",
    shippingFee: "Versandkosten",
    vat: "MwSt.",
    total: "Gesamtsumme",

    // Thank You Page
    thankYouOrder: "Vielen Dank für Ihre Bestellung!",
    orderPlaced:
      "Ihre Bestellung wurde erfolgreich aufgegeben und wartet auf Zahlung. Bitte verwenden Sie die folgenden Daten, um Ihre Banküberweisung abzuschließen.",
    bankName: "Bankname",
    accountName: "Kontoinhaber",
    accountNumber: "Kontonummer",
    amount: "Betrag",
    paymentDeadline:
      "Bitte stellen Sie sicher, dass die Zahlung innerhalb von 48 Stunden abgeschlossen wird, um eine Stornierung der Bestellung zu vermeiden.",
    contactHelp: {
      beforeContact: "Bitte",
      afterContact: "Sie uns, wenn Sie Hilfe benötigen oder Fragen haben",
    },

    // Footer
    footerDisclaimer:
      "Wir glauben an die Kraft der Kunst, Räume zu verwandeln und Leben zu inspirieren. Unsere Plattform verbindet Kunstliebhaber mit aufstrebenden Talenten aus aller Welt.",
    allRightsReserved: "© 2024 KUNSTiNO. Alle Rechte vorbehalten.",

    // Countries
    countries: {
      germany: "Deutschland",
      usa: "Vereinigte Staaten",
      uk: "Vereinigtes Königreich",
      france: "Frankreich",
    },
  },
};
