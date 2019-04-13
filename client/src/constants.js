export const DISCOGS_KEY = 'cfOBbgcDnKsgBpZNTKcJ';
export const DISCOGS_SECRET = 'hGaihMdEjmpHyshTjxGssDtnwFiYCXEo';

export const DEBOUNCE_TIME = 1000;
export const DATA_TYPE_RELEASE = 'release';

export const COLLECTION_TYPE_COLLECTION = 'vinylCollection';
export const COLLECTION_TYPE_WISHLIST = 'wishlist';
export const COLLECTION_TYPE_FOR_SELL = 'forSale';
export const COLLECTION_TYPE_MARKET = 'market';
export const COLLECTION_TYPE_OTHER_USER = 'otherUser';

//ROUTES
export const ROUTE_HOME = '/';
export const ROUTE_SIGN_UP = '/register';
export const ROUTE_SIGN_IN = '/login';
export const ROUTE_SEARCH = '/search';
export const ROUTE_COLLECTION = '/collection';
export const ROUTE_WISHLIST = '/wishlist';
export const ROUTE_RELEASE = '/release';
export const ROUTE_ACCOUNT = '/account';
export const ROUTE_FOR_SELL = '/sell';
export const ROUTE_MARKET = '/market';
export const ROUTE_USERS = '/users';

//COMMON
export const PAGINATION_WIDTH = 215;
export const PAGINATION_PAGES_PER_SLIDE = 4;

//SNACKBAR TYPES
export const SNACKBAR_TYPE_SUCCESS = 'success';
export const SNACKBAR_TYPE_FAIL = 'fail';
export const SNACKBAR_CLOSE_TIMEOUT = 5000;
export const TOOLTIP_DELAY_SHOW = 700;

//URLS
export const DOGS_SEARCH_URL = 'https://api.discogs.com/database/search';
export const DOGS_SPACE_GIF = 'spacer.gif';
export const DOGS_BASE_URL = 'https://api.discogs.com/';
export const DOGS_GET_ITEM_URL = {
    release: `${DOGS_BASE_URL}releases/`,
    master: `${DOGS_BASE_URL}masters/`,
    label: `${DOGS_BASE_URL}labels/`,
    artist: `${DOGS_BASE_URL}artists/`
};

// RESPONSE CODES
export const RESPONSE_STATUS_SUCCESS = 200;

//VINYL CONDITION - MEDIA
export const CONDITION = {
    tooltips: {
        mint: `Absolutely perfect in every way. Certainly never been played, possibly even still sealed. 
                    Should be used sparingly as a grade, if at all.`,
        nearMint: `A nearly perfect record. A NM- record has more than likely never been played,
                 and the vinyl will play perfectly, with no imperfections during playback. 
                 Many dealers won't give a grade higher than this implying (perhaps correctly) that no record is ever truly perfect.
                  The record should show no obvious signs of wear. A 45 RPM or EP sleeve should have no more than the most minor defects,
                   such as any sign of slight handling. An LP cover should have no creases, folds, seam splits, cut-out holes,
                    or other noticeable similar defects. The same should be true of any other inserts, such as posters, 
                    lyric sleeves, etc.`,
        vgPlus: `Generally worth 50% of the Near Mint value. A Very Good Plus record will show some signs that it 
        was played and otherwise handled by a previous owner who took good care of it. Defects should be more of a 
        cosmetic nature, not affecting the actual playback as a whole. Record surfaces may show some signs of wear 
        and may have slight scuffs or very light scratches that don't affect one's listening experiences. Slight warps
         that do not affect the sound are "OK". The label may have some ring wear or discoloration, but it should be
          barely noticeable. Spindle marks may be present. Picture sleeves and inner sleeves will have some slight wear,
           slightly turned-up corners, or a slight seam split. An LP cover may have slight signs of wear, and may be marred 
           by a cut-out hole, indentation, or cut corner. In general, if not for a couple of minor things wrong with it, 
           this would be Near Mint.   `,
        vg: `Generally worth 25% of Near Mint value. Many of the defects found in a VG+ record will be 
    more pronounced in a VG disc. Surface noise will be evident upon playing, especially in soft passages and 
    during a song's intro and fade, but will not overpower the music otherwise. Groove wear will start to be 
    noticeable, as with light scratches (deep enough to feel with a fingernail) that will affect the sound. 
    Labels may be marred by writing, or have tape or stickers (or their residue) attached. The same will be true of picture sleeves or LP covers.
     However, it will not have all of these problems at the same time. Goldmine price guides with more than 
     one price will list Very Good as the lowest price.`,
        good_gplus: `Generally worth 10-15% of the Near Mint value. A record in Good or Good 
    Plus condition can be played through without skipping. But it will have significant surface noise, 
    scratches, and visible groove wear. A cover or sleeve will have seam splits, especially at the bottom or on the spine. 
    Tape, writing, ring wear, or other defects will be present.
    While the record will be playable without skipping, noticeable surface noise and 
    "ticks" will almost certainly accompany the playback.`,
        poor: `Generally worth 0-5% of the Near Mint price. The record is cracked, badly warped, and 
    won't play through without skipping or repeating. The picture sleeve is water damaged, split on all
     three seams and heavily marred by wear and writing. 
    The LP cover barely keeps the LP inside it. Inner sleeves are fully split, crinkled, and written upon.  `
    },
    mint: {full: 'Mint (M)' , abr: 'M', type: 'mint'},
    nearMint: {full: 'Near Mint (NM or M-)', abr: 'NM', type: 'nearMint'},
    vgPlus: {full :'Very Good Plus (VG+)', abr: 'VG+', type: 'vgPlus'},
    vg: {full: 'Very Good (VG)', abr: 'VG', type: 'vg'},
    good_gplus: {full: 'Good (G), Good Plus (G+)', abr: 'G/G+', type: 'good_gplus'},
    poor: {full: 'Poor (P), Fair (F)', abr: 'P/F', type: 'poor'}
};

//DROPDOWN TYPES
export const GENRE_DROPDOWN = 'genre';
export const STYLE_DROPDOWN = 'style';
export const STYLES_ALL = 'All Styles';
export const GENRES_ALL = 'All Genres';

//GENRES
export const GENRES = {
    all: {name: 'All Genres', styles: []},
    blues: {name: 'Blues', styles:
            ['Acid Rock', 'Boogie Woogie', 'Chicago Blues', 'Country Blues',
            'Delta Blues', 'East Coast Blues', 'Electric Blues', 'Harmonica Blues',
            'Jump Blues', 'Louisiana Blues', 'Modern Electric Blues', 'Piano Blues',
            'Piedmont Blues', 'Texas Blues']},
    brass_military: {name: 'Brass & Military', styles: ['Brass Band', 'Marches', 'Military', 'Pipe & Drum']},
    children: {name: "Children's", styles: ['Educational', 'Nursery Rhymes', 'Story']},
    classical: {name: 'Classical', styles:
            ['Baroque', 'Classical', 'Contemporary', 'Early',
            'Fusion', 'Gospel', 'Impressionists', 'Medieval',
            'Modern', 'Neo-Classical', 'Neo-Romantic', 'Opera', 'Operetta',
            'Post-Modern', 'Renaissance', 'Romantic', 'Serial', 'Twelve-tone']},
    electronic: {name: 'Electronic', styles:
            ['Abstract', 'Acid', 'Acid House', 'Acid Jazz', 'Ambient',
            'Baltimore Club', 'Bass Music', 'Beatdown', 'Berlin-School',
            'Big Beat', 'Breakbeat', 'Breakcore', 'Breaks', 'Broken Beat',
            'Chiptune', 'Dance-pop', 'Dark Ambient', 'Deep House', 'Deep Techno',
            'Donk', 'Doomcore', 'Downtepmo', 'Drone', 'Drum n Bass', 'Dub Techno',
            'Dubstep', 'EBM', 'Electro House', 'Euro House', 'Euro-Disco', 'Eurodance',
            'Freestyle', 'Future Jazz', 'Gabber', 'Garage House', 'Ghetto', 'Ghetto House',
            'Ghettotech', 'Glitch', 'Goa Trance', 'Happy Hardcore', 'Hard House',
            'Hard Techno', 'Hard Trance', 'Hardstyle', 'Hip Hop', 'Hip-House',
            'House', 'IDM', 'Industrial', 'Italo House', 'Italodance', 'Italo-Disco',
            'Jazzdance', 'Juke', 'Jumpstyle', 'Jungle', 'Latin', 'Leftfield', 'Makina',
            'Minimal', 'Minimal Techno', 'Nerdcore Techno', 'New Age', 'New Beat',
            'Noise', 'Power Electronics', 'Progressive House', 'Progressive Trance',
            'Psy-Trance', 'Schranz', 'Speedcore', 'Synth-pop', 'Tech House',
            'Techno', 'Trance', 'Tribal', 'Tribal House', 'Trip Hop', 'UK Garage', 'Witch House']},
    folk_country_world: {name:'Folk, World, & Country', styles: ["Aboriginal", "Acid Rock", "Acid Rock", "African", "Andalusian Classical", "Bangladeshi Classical",
            "Bhangra", "Bluegrass", "Cajun", "Cambodian Classical", "Canzone Napoletana", "Carnatic", "Celtic",
            "Chinese Classical", "Chinese Classical", "Country", "Ethno-pop", "Fado", "Folk", "Gagaku", "Gagaku",
            "Gamelan", "Gamelan", "Griot", "Highlife", "Hindustani", "Honky Tonk", "Indian Classical", "Kaseko",
            "Klasik", "Klezmer", "Korean Court Music", "Lao Music", "Laïkó", "Luk Thung", "Mizrahi", "Mouth Music",
            "Mugham", "Mugham", "Nordic", "Ottoman Classical", "Overtone Singing", "Pacific", "Pacific", "Persian Classical", "Philippine Classical","Piobaireachd",
            "Polka", "Polka", "Raï", "Rebetiko", "Romani", "Rune Singing", "Sephardic", "Soukous", "Sámi Music", "Thai Classical", "Zouk", "Zydeco", "Éntekhno"]},
    funk_soul: {name: 'Funk / Soul', styles:["Afrobeat", "Bayou Funk", "Boogie", "Contemporary R&B", "Disco", "Disco",
            "Free Funk", "Funk", "Fusion", "Gogo", "Gospel", "Minneapolis Sound", "Minneapolis Sound", "Neo Soul",
            "New Jack Swing", "P.Funk", "Psychedelic", "Rhythm & Blues", "RnB/Swing", "Soca", "Soul", "Swingbeat"],},
    hip_hop: {name: 'Hip-Hop', styles:["Baltimore Club", "Bass Music", "Beatbox", "Bongo Flava", "Boom Bap", "Bounce", "Britcore",
            "Conscious", "Crunk", "Cut-up/DJ", "DJ Battle Tool", "Electro", "Favela Funk", "G-Funk",
            "Gangsta", "Ghettotech", "Go-Go", "Gospel", "Grime", "Hardcore Hip-Hop", "Hiplife",
            "Horrorcore", "Hyphy", "Instrumental", "Jazzy Hip-Hop", "Kwaito", "Miami Bass", "Motswako",
            "Nu Metal", "Pop Rap", "Ragga HipHop", "RnB/Swing", "Screw", "Spaza", "Thug Rap", "Trap", "Trip Hop", "Turntablism"]},
    jazz: {name: 'Jazz', styles: ["Afro-Cuban Jazz", "Avant-garde Jazz", "Big Band", "Bop", "Bossa Nova", "Cape Jazz", "Contemporary Jazz",
            "Cool Jazz", "Dixieland", "Easy Listening", "Free Funk", "Free Improvisation",
            "Free Jazz", "Fusion", "Gypsy Jazz", "Hard Bop", "Jazz-Funk", "Jazz-Rock", "Latin Jazz",
            "Modal", "Post Bop", "Ragtime", "Smooth Jazz", "Soul-Jazz", "Space-Age", "Swing"]},
    latin: {name: 'Latin', styles: ["Afro-Cuban", "Axé", "Bachata", "Batucada", "Beguine", "Bolero", "Boogaloo", "Bossanova",
            "Cha-Cha", "Charanga", "Compas", "Conjunto", "Copla", "Corrido", "Cuatro", "Cubano",
            "Cumbia", "Danzon", "Descarga", "Flamenco", "Forró", "Guaguancó", "Guaracha",
            "Jibaro", "Lambada", "MPB", "Mambo", "Mariachi", "Marimba", "Merengue",
            "Norteño", "Nueva Cancion", "Nueva Trova", "Pachanga", "Plena", "Quechua",
            "Ranchera", "Reggaeton", "Rumba", "Samba", "StyleSoca", "Son", "Sonero",
            "Tango", "Tejano", "Timba", "Trova", "Vallenato"]},
    non_music: {name:'Non-Music', styles: ["Audiobook", "Comedy", "Dialogue", "Education", "Field Recording",
            "Interview", "Monolog", "Movie Effects", "Movie Effects",
            "Poetry", "Political", "Promotional", "Public Service Announcement",
            "Radioplay", "Religious", "Sermon", "Special Effects", "Speech",
            "Spoken Word", "Technical", "Therapy"]},
    pop: {name: 'Pop', styles: ["Ballad", "Bollywood", "Chanson", "Enka",
             "Europop", "Gospel", "Indie Pop", "J-pop", "Karaoke", "Music Hall", "Novelty", "Parody", "Schlager", "Vocal"]},
    reggae: {name: 'Reggae', styles: ["Calypso", "Dancehall", "Dub", "Dub Poetry", "Junkanoo", "Lovers Rock", "Mento",
            "Ragga", "Rapso", "Reggae", "Reggae Gospel",
            "Reggae-Pop", "Rocksteady", "Roots Reggae", "Ska", "Soca", "Steel Band"]},
    rock: {name: 'Rock', styles: ["Acid Rock", "Acoustic", "Alternative Metal", "Alternative Rock", "Arena Rock",
            "Art Rock", "Avantgarde", "Beat", "Black Metal", "Blues Rock", "Brit Pop", "Classic Rock",
            "Country Rock", "Crust", "Death Metal", "Deathrock", "Doo Wop", "Doom Metal", "Emo", "Ethereal",
            "Experimental", "Folk Metal", "Folk Rock", "Funk Metal", "Garage Rock", "Glam", "Glam",
            "Goth Rock", "Gothic Metal", "Grindcore", "Grunge", "Hard Rock", "Heavy Metal", "Indie Rock",
            "Krautrock", "Krautrock", "Lounge", "Lounge", "Math Rock", "Melodic Hardcore", "Metalcore",
            "Mod", "Neofolk", "StyleNoise", "Nu Metal", "Nu Metalcore", "Oi", "Pop Punk", "Pop Rock",
            "Pop Rock", "Post Rock", "Post-Punk", "Power Metal", "Power Pop", "Prog Rock",
            "Psychedelic Rock", "Psychobilly", "Pub Rock", "Punk", "Rock & Roll", "Rockabilly",
            "Shoegaze", "Skiffle", "Sludge Metal", "Soft Rock", "Southern Rock", "Space Rock",
            "Speed Metal", "Surf", "Swamp Pop", "Symphonic Rock", "Thrash", "Viking Metal"]},
    stage: {name: 'Stage & Screen', styles:['Bollywood','Musical','Score', 'Soundtrack', 'Theme']}
};

