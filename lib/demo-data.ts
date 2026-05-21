import type { Book, Question, User, VademecumEntry } from "./types";

export const INITIAL_USERS: User[] = [
  { id: "u1", name: "Astrid Dewaele",  email: "astrid@example.be", nativeLanguage: "NL", translates: ["FR"], verified: true, joined: "2024-09-12", bio: "Literair vertaler Frans–Nederlands.",        emailNotifications: true },
  { id: "u2", name: "Pierre Dubois",   email: "pierre@example.fr", nativeLanguage: "FR", translates: ["NL"], verified: true, joined: "2024-06-04", bio: "Traducteur littéraire. Néerlandais → français.", emailNotifications: true },
  { id: "u3", name: "Bram De Vos",     email: "bram@example.be",   nativeLanguage: "NL", translates: ["FR"], verified: true, joined: "2024-11-21", bio: "Vlaamse vertaler. Hertmans, Claus.",          emailNotifications: true },
  { id: "u4", name: "Anne Leclerc",    email: "anne@example.fr",   nativeLanguage: "FR", translates: ["NL"], verified: true, joined: "2025-01-09", bio: "Spécialiste Mulisch et Nooteboom.",           emailNotifications: true },
  { id: "u5", name: "Lotte Janssen",   email: "lotte@example.nl",  nativeLanguage: "NL", translates: ["FR"], verified: true, joined: "2024-12-02", bio: "Vertaalt hedendaagse Franse romans.",         emailNotifications: true },
  { id: "u6", name: "Sophie Moreau",   email: "sophie@example.fr", nativeLanguage: "FR", translates: ["NL"], verified: true, joined: "2025-03-15", bio: "Poésie et littérature flamande.",             emailNotifications: true },
];

export const INITIAL_BOOKS: Book[] = [
  { id: "b1",  code: "NL · 001", title: "De Avonden",                       author: "Gerard Reve",       year: 1947, sourceLanguage: "NL", targetLanguage: "FR", translator: "u1", coverStyle: { bg: "#3a2f1f", accent: "#c4a559", pattern: "horizontal" } },
  { id: "b2",  code: "FR · 014", title: "Madame Bovary",                    author: "Gustave Flaubert",  year: 1856, sourceLanguage: "FR", targetLanguage: "NL", translator: "u2", coverStyle: { bg: "#7a1f2b", accent: "#e8d5a8", pattern: "ornate" } },
  { id: "b3",  code: "NL · 023", title: "Het verdriet van België",          author: "Hugo Claus",        year: 1983, sourceLanguage: "NL", targetLanguage: "FR", translator: "u3", coverStyle: { bg: "#2a3a2a", accent: "#e8d5a8", pattern: "vertical" } },
  { id: "b4",  code: "FR · 045", title: "L'Étranger",                       author: "Albert Camus",      year: 1942, sourceLanguage: "FR", targetLanguage: "NL", translator: "u4", coverStyle: { bg: "#ede4d3", accent: "#1a1a1a", pattern: "minimal" } },
  { id: "b5",  code: "NL · 087", title: "Oorlog en terpentijn",             author: "Stefan Hertmans",   year: 2013, sourceLanguage: "NL", targetLanguage: "FR", translator: "u3", coverStyle: { bg: "#4a3a2a", accent: "#c4a559", pattern: "wavy" } },
  { id: "b6",  code: "FR · 067", title: "Du côté de chez Swann",            author: "Marcel Proust",     year: 1913, sourceLanguage: "FR", targetLanguage: "NL", translator: "u4", coverStyle: { bg: "#5a4a6a", accent: "#f0e8d5", pattern: "ornate" } },
  { id: "b7",  code: "NL · 102", title: "De ontdekking van de hemel",       author: "Harry Mulisch",     year: 1992, sourceLanguage: "NL", targetLanguage: "FR", translator: "u5", coverStyle: { bg: "#1f2a3a", accent: "#e8a59f", pattern: "modern" } },
  { id: "b8",  code: "FR · 089", title: "Bonjour Tristesse",                author: "Françoise Sagan",   year: 1954, sourceLanguage: "FR", targetLanguage: "NL", translator: "u6", coverStyle: { bg: "#d4823a", accent: "#3a1f1a", pattern: "tropical" } },
  { id: "b9",  code: "NL · 103", title: "Het lied van ooievaar en dromedaris", author: "Anjet Daanje",   year: 2022, sourceLanguage: "NL", targetLanguage: "FR", translator: "u3", coverStyle: { bg: "#1a2530", accent: "#e0d5b8", pattern: "wavy" } },
  { id: "b10", code: "FR · 091", title: "Les Forces",                       author: "Laura Vazquez",     year: 2025, sourceLanguage: "FR", targetLanguage: "NL", translator: "u4", coverStyle: { bg: "#c4452a", accent: "#fafaf8", pattern: "minimal" } },
];

export const INITIAL_VADEMECUM: VademecumEntry[] = [
  { id: "v1", category: "subsidies",   name: "Literatuur Vlaanderen — vertaalsubsidie",          forWhom: "vertalers van en naar het Nederlands",  deadline: "doorlopend",          link: "https://www.literatuurvlaanderen.be", addedBy: "u3", createdAt: "2025-02-10" },
  { id: "v2", category: "subsidies",   name: "Nederlands Letterenfonds — projectsubsidie",       forWhom: "literair vertalers in/uit het Nederlands", deadline: "twee sessies per jaar", link: "https://www.letterenfonds.nl",        addedBy: "u1", createdAt: "2025-03-02" },
  { id: "v3", category: "workshops",   name: "Vertalershuis Amsterdam — werkverblijf",           forWhom: "professionele literair vertalers",     deadline: "doorlopend",          link: "https://www.letterenfonds.nl",        addedBy: "u5", createdAt: "2025-01-20" },
  { id: "v4", category: "workshops",   name: "ATLAS — Collège international des traducteurs, Arles", forWhom: "traducteurs littéraires",             deadline: "zie website",          link: "https://www.atlas-citl.org",          addedBy: "u4", createdAt: "2025-02-28" },
  { id: "v5", category: "uitgeverijen", name: "Uitgeverij Vleugels",                              forWhom: "FR→NL poëzie en proza",                 deadline: "",                      link: "https://www.uitgeverijvleugels.nl",   addedBy: "u3", createdAt: "2025-04-05" },
  { id: "v6", category: "uitgeverijen", name: "Actes Sud",                                        forWhom: "NL→FR littérature",                     deadline: "",                      link: "https://www.actes-sud.fr",            addedBy: "u2", createdAt: "2025-04-08" },
];

export const INITIAL_QUESTIONS: Question[] = [
  {
    id: "q1", bookId: "b1", askerId: "u1",
    title: 'Hoe vertaal je "vunzig" in een Reve-context?',
    passage: '"Wat een vunzige rotzooi," zei Frits. Hij keek naar het tafelkleed.',
    page: "47", tags: ["lexicaal", "stilistisch"],
    text: 'Reve gebruikt "vunzig" hier op die typische manier — vies, vies-vrolijk, met een ondertoon van perverse fascinatie. "Sale" werkt niet, "dégoûtant" is te clean. Suggesties?',
    createdAt: "2025-04-12",
    answers: [
      { id: "a1", authorId: "u2", text: 'Ik zou voor "cradingue" gaan — het heeft die argotische, vies-vunzige bijklank die "crasseux" mist. Werkt vooral goed bij Reve omdat het ook iets ironisch heeft. "Sordide" zou ik vermijden, te zwaar.', createdAt: "2025-04-13" },
      { id: "a2", authorId: "u4", text: 'Eens met cradingue. Of "dégueulasse" voor iets meer kinderlijks-walgelijks — Reve heeft die toon ook regelmatig.', createdAt: "2025-04-14" },
    ],
  },
  {
    id: "q2", bookId: "b2", askerId: "u2",
    title: '"Bovarysme" — vertalen of laten staan?',
    passage: "Elle s'abandonnait à cette douceur, mêlée d'inquiétude, qui suit toute satisfaction obtenue.",
    page: "142", tags: ["cultureel"],
    text: 'In het kritisch apparaat bij mijn vertaling wil ik het concept "bovarysme" introduceren. Is deze term in het Nederlands voldoende ingeburgerd? Of moet ik het uitleggen?',
    createdAt: "2025-04-20",
    answers: [
      { id: "a3", authorId: "u1", text: 'Onder literaire lezers is "bovarisme" (zonder y) wel bekend, maar ik zou het toch kort introduceren in een voetnoot bij eerste gebruik. Beter te veel context geven dan te weinig.', createdAt: "2025-04-21" },
    ],
  },
  {
    id: "q3", bookId: "b3", askerId: "u3",
    title: "West-Vlaams dialect bij Claus naar het Frans",
    passage: '"Wuk zeg je nu?" vroeg Bomama. "Ge zijt toch nie gelijk uw vader, hé?"',
    page: "88", tags: ["stilistisch", "cultureel"],
    text: "Claus laat zijn West-Vlaamse personages echt West-Vlaams praten. Voor de Franse vertaling: ch'ti gebruiken? Of een meer neutrale geprononceerd-spreektalige variant? Ch'ti voelt te Frans-Vlaams maar wel met de juiste sociale lading.",
    createdAt: "2025-04-25",
    answers: [
      { id: "a4", authorId: "u2", text: "Ch'ti is een valstrik: het draagt een zeer specifieke Frans-Noord-context mee (mijnen, Bergues) die niets met Vlaanderen te maken heeft. Ik zou eerder gaan voor een \"français populaire\" met een paar gemarkeerde regionale wendingen.", createdAt: "2025-04-26" },
    ],
  },
  {
    id: "q4", bookId: "b4", askerId: "u4",
    title: 'Eerste zin: "Aujourd\'hui, maman est morte"',
    passage: "Aujourd'hui, maman est morte. Ou peut-être hier, je ne sais pas.",
    page: "1", tags: ["lexicaal", "stilistisch"],
    text: '"Maman" — moeder? mama? mams? De toon is kinderlijk en tegelijk zakelijk-vlak. "Vandaag is moeder gestorven" voelt te formeel; "vandaag is mama gestorven" misschien te zacht. Hoe lossen jullie dit op?',
    createdAt: "2025-05-02",
    answers: [
      { id: "a5", authorId: "u3", text: 'Adriaan Morriën koos voor "moeder". Maar de moderne vertaling van Peter Verstegen kiest voor "mama", en m.i. terecht — het kinderlijk-affectieve zit erin verwerkt en contrasteert juist sterk met Meursaults emotievlakheid.', createdAt: "2025-05-03" },
    ],
  },
  {
    id: "q5", bookId: "b5", askerId: "u3",
    title: "Hertmans' lange zinnen — ritme behouden?",
    passage: "Mijn grootvader, in zijn versleten uniform, met die starende ogen die alles en niets zagen, stond stil op de drempel, zoals hij wel vaker stilstond — een man die nooit meer helemaal terugkwam uit de loopgraven.",
    page: "15", tags: ["syntactisch"],
    text: "Hertmans heeft van die brede, peinzende zinnen met meerdere tussenzinnen. In het Frans zijn ze nog steeds te volgen maar het Nederlandse ritme — die rustige uitwaaiering — verlies ik. Tips?",
    createdAt: "2025-05-10",
    answers: [],
  },
  {
    id: "q6", bookId: "b6", askerId: "u4",
    title: "Madeleine-passage: 'petit morceau'",
    passage: "Et tout d'un coup le souvenir m'est apparu. Ce goût, c'était celui du petit morceau de madeleine.",
    page: "46", tags: ["cultureel", "pragmatisch"],
    text: 'Iedereen kent deze passage in vertaling. Maar "petit morceau" — "klein stukje" of "kruimel"? Thérèse Cornips schreef "stukje", maar ik twijfel of dat de kindertijd-tederheid wel meeneemt.',
    createdAt: "2025-05-11",
    answers: [],
  },
  {
    id: "q7", bookId: "b1", askerId: "u2",
    title: "Reve's \"Onze Lieve Heer\" — religieus register",
    passage: '"Onze Lieve Heer," zei Frits zachtjes, "geef dat het morgen niet zo koud is."',
    page: "112", tags: ["cultureel", "stilistisch"],
    text: 'Voor een Vlaamse katholieke achtergrond is "Onze Lieve Heer" direct herkenbaar. In het Frans: "Notre Seigneur" voelt liturgisch-stijf; "le bon Dieu" is dichterbij, maar mist iets van de calvinistische ondertoon die Reve juist parodieert.',
    createdAt: "2025-05-12",
    answers: [],
  },
  {
    id: "q8", bookId: "b9", askerId: "u3",
    title: 'De titel: "Het lied van ooievaar en dromedaris"',
    passage: "Het lied van ooievaar en dromedaris.",
    page: "—", tags: ["lexicaal", "cultureel"],
    text: 'Letterlijk: "Le chant de la cigogne et du dromadaire" — werkt, maar de vreemde combinatie van die twee dieren (waar de roman pas heel laat zijn naam aan blijkt te danken) krijgt in het Frans een andere klank. Bij Franse lezers komt er bij "dromadaire" een oosters-exotische associatie bovenop die in het Nederlands minder dominant is. Is dat juist gewenst, of moet ik zoeken naar een titel die die kleur verschuift?',
    createdAt: "2026-05-14",
    answers: [],
  },
  {
    id: "q9", bookId: "b9", askerId: "u3",
    title: "Stijlimitatie: 19e-eeuws Engels via het Nederlands",
    passage: "Mijn waarde Heer, het is in de overtuiging dat Gij U mijn lankmoedigheid zult kunnen herinneren, dat ik U thans wederom durf aanschrijven inzake de zaak van wijlen Mevrouw Drayden.",
    page: "143", tags: ["stilistisch", "syntactisch"],
    text: "Daanje imiteert in bepaalde hoofdstukken een hyperformeel 19e-eeuws Engels, maar via het Nederlands. Dat dubbele filter is bijzonder. Doe ik in het Frans nu mijn eigen 19e-eeuwse Frans (op basis van Balzac, Flaubert), of probeer ik de stijl van een tijdgenoot-vertaling Engels→Frans (Baudelaire vertaalt Poe, e.d.) te benaderen? Het maakt een groot verschil voor de toon.",
    createdAt: "2026-04-22",
    answers: [],
  },
  {
    id: "q10", bookId: "b10", askerId: "u4",
    title: '"Les Forces" — meervoud van wat?',
    passage: "Les personnes qui écrivent cherchent toutes la même histoire, la même force, la même phrase.",
    page: "—", tags: ["lexicaal", "cultureel"],
    text: 'Vazquez gebruikt "force" zowel in lucretiaans-fysieke zin (energie, mechaniek — vgl. De rerum natura) als in sociaal-politieke zin (machtsverhoudingen, conditionering). "Krachten" dekt het eerste maar mist het tweede; "machten" omgekeerd. Eén Nederlandse titel die beide bundelt? Of in een korte vertalersnoot deze gespletenheid uitleggen?',
    createdAt: "2026-05-10",
    answers: [],
  },
  {
    id: "q11", bookId: "b10", askerId: "u4",
    title: "Poëtisch proza: lange ademzinnen behouden",
    passage: "Et j'avais du calme en moi. Et les autres personnes présentes dans la pièce ne me regardaient pas, car elles étaient concentrées sur leur propre bille centrale et capitale. Et elles visaient, tandis que je visais.",
    page: "174", tags: ["syntactisch", "stilistisch"],
    text: 'Vazquez bouwt haar zinnen op met die anaforische "Et"-openingen, een soort homerische incantatie. In het Nederlands voelt herhaald "En" snel kinderlijk of houterig. Vervang ik door variërende conjuncties (en, en toen, en daarbij)? Of houd ik vast aan de strakke herhaling om die epische lading te behouden?',
    createdAt: "2026-05-15",
    answers: [],
  },
];
