/* Shared data for the Cyera AI Guardian clone (copy extracted from the original build) */
window.CLONE_DATA = {
    steps: [
        { title: 'Intro' },
        { title: 'Worlds' },
        { title: 'Discover' },
        { title: 'Find the AI' },
        { title: 'Govern' },
        { title: 'Shield' },
        { title: 'Protect' },
        { title: 'Decide' },
        { title: 'Reading' },
        { title: 'Finish' },
        { title: 'Contact' }
    ],

    watermarks: {
        discover: 'assets/images/titles/horizon.png',
        govern: 'assets/images/titles/dusk.png',
        protect: 'assets/images/titles/space.png'
    },

    decideRows: [
        {
            label: 'Support agent summarizes a ticket',
            sub: 'Contains customer emails · within approved scope',
            allow: true
        },
        {
            label: 'Agent exports the full customer database',
            sub: 'Bulk export · 2.4M records · flat permissions',
            allow: false
        },
        {
            label: 'Marketing AI reads campaign data',
            sub: 'Scoped to public assets · sanctioned tool',
            allow: true
        },
        {
            label: 'AI agent shares data with a third-party tool',
            sub: 'Unsanctioned app · untrusted identity',
            allow: false
        }
    ],

    constellationStars: [
        [160, 52], [262, 120], [226, 240], [94, 240], [58, 120]
    ],

    crystalShapes: ['gem-1', 'gem-2', 'gem-3', 'gem-4', 'gem-5', 'asteroid-1', 'asteroid-2'],

    crystals: [
        { shape: 'gem-1', x: 8, y: 18, size: 64, depth: 1.4 },
        { shape: 'gem-2', x: 88, y: 12, size: 46, depth: 1.0 },
        { shape: 'gem-3', x: 93, y: 62, size: 78, depth: 1.6 },
        { shape: 'gem-4', x: 14, y: 72, size: 40, depth: 0.8 },
        { shape: 'gem-5', x: 78, y: 82, size: 56, depth: 1.2 },
        { shape: 'asteroid-1', x: 30, y: 8, size: 88, depth: 1.9 },
        { shape: 'asteroid-2', x: 55, y: 90, size: 72, depth: 1.7 },
        { shape: 'gem-3', x: 4, y: 44, size: 34, depth: 0.6 },
        { shape: 'gem-2', x: 68, y: 4, size: 30, depth: 0.7 },
        { shape: 'asteroid-2', x: 44, y: 50, size: 120, depth: 2.2, opacity: 0.35 }
    ]
};
