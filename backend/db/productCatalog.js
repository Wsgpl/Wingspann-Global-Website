const db = require('./index');

const DEFAULT_PRODUCTS = Object.freeze([
  {
    category: 'uas',
    sort_order: 10,
    name: 'Aquila UAV',
    slug: 'aquila-uav',
    tagline: 'Compact VTOL Intelligence & Remote Sensing',
    description: 'The Aquila UAV is a man-portable, fixed-wing hybrid VTOL platform optimised for persistent intelligence, surveillance, and reconnaissance.',
    specs: [
      { label: 'Endurance', value: '45 Min' },
      { label: 'Range', value: '10 KM' },
      { label: 'Launch', value: 'VTOL' },
    ],
    features: [
      'Autonomous VTOL launch and recovery',
      'Encrypted real-time video and telemetry',
      'Modular payload bay for mission-specific sensors',
      'Backpack-portable field deployment',
    ],
    status: 'active',
    image_url: '/Aquila Alpha.jpeg',
    model_url: '',
    is_published: 1,
    detail_sections: {
      overview: {
        paragraphs: [
          'The Aquila UAV delivers best-in-class imagery and sensor intelligence in a field-portable package. The hybrid quad-rotor VTOL architecture eliminates the need for launch infrastructure while maintaining the endurance and efficiency of a fixed-wing design during cruise.',
          'Engineered for mission-first reliability, the platform incorporates dual-redundant IMU, triple-constellation GNSS, and onboard obstacle sensing. The encrypted datalink keeps video and telemetry secure in contested RF environments.',
          'With a 400 g modular payload bay, operators can hot-swap between electro-optical, thermal, multispectral, and LiDAR sensor heads, making the Aquila platform adaptable to a wide range of mission requirements without airframe changes.',
        ],
        stats: [
          { value: '45', unit: 'MIN', label: 'Endurance', icon: 'endurance' },
          { value: '10', unit: 'KM', label: 'Range', icon: 'range' },
          { value: '2cm', unit: '/px', label: 'Resolution', icon: 'resolution' },
          { value: '4500', unit: 'M', label: 'Launch Altitude', icon: 'altitude' },
        ],
        missions: [
          { title: 'Security & Recon', description: 'Persistent aerial surveillance with real-time encrypted video streaming for perimeter security and intelligence gathering.', icon: 'shield' },
          { title: 'Geospatial Mapping', description: 'High-resolution orthomosaic mapping and 3D terrain modelling for GIS, urban planning, and precision agriculture.', icon: 'map' },
          { title: 'Infrastructure Inspection', description: 'Autonomous inspection of pipelines, power lines, towers, and bridges with AI-powered defect detection.', icon: 'scan' },
          { title: 'Environmental Monitoring', description: 'Multispectral and thermal data collection for forest fire detection, flood mapping, and wildlife surveys.', icon: 'leaf' },
        ],
        advantages: [
          { title: 'Long Endurance', description: 'Industry-leading 45-minute flight time on a single charge, mission-ready in any terrain.', metric: '45 MIN FLIGHT', icon: 'battery' },
          { title: 'Backpack Portable', description: 'Complete system including GCS packs into a standard tactical backpack for rapid field deployment.', metric: 'SUB-5 KG SYSTEM', icon: 'backpack' },
          { title: 'Autonomous VTOL', description: 'Fully autonomous vertical take-off and landing with no runway required.', metric: '0 SQM FOOTPRINT', icon: 'vtol' },
          { title: 'Secure Comms', description: 'AES-256 encrypted video and telemetry links with frequency-hopping anti-jamming capability.', metric: 'AES-256', icon: 'lock' },
          { title: 'All-Weather Design', description: 'IP54-rated airframe engineered for operations in rain, dust, and gusting wind.', metric: 'IP54 RATED', icon: 'cloud' },
          { title: 'High-Altitude Ops', description: 'Optimised propulsion system certified for operational launch altitudes up to 4,500 m AMSL.', metric: '4500 M AMSL', icon: 'mountain' },
        ],
      },
      specifications: [
        {
          label: 'Platform',
          rows: [
            { label: 'Configuration', value: 'Quad-rotor VTOL Fixed-Wing Hybrid' },
            { label: 'Wingspan', value: '1,100 mm' },
            { label: 'MTOW', value: '5 kg' },
            { label: 'Airframe Material', value: 'Carbon Fibre Composite' },
            { label: 'IP Rating', value: 'IP54' },
            { label: 'Wind Resistance', value: '45 m/s' },
          ],
        },
        {
          label: 'Performance',
          rows: [
            { label: 'Endurance', value: '45 min' },
            { label: 'Max Speed', value: '72 km/h' },
            { label: 'Cruise Speed', value: '54 km/h' },
            { label: 'Range (datalink)', value: '10 km' },
            { label: 'Max Launch Altitude', value: '4,500 m AMSL' },
            { label: 'Hover Accuracy (GPS)', value: '+/-0.5 m' },
          ],
        },
        {
          label: 'Sensors & Navigation',
          rows: [
            { label: 'Imaging Resolution', value: '2 cm/px @ 120 m AGL' },
            { label: 'Camera', value: '48 MP + 8 MP IR Thermal' },
            { label: 'GNSS', value: 'GPS / GLONASS / BeiDou L1+L2' },
            { label: 'IMU', value: 'Redundant 6-axis IMU' },
            { label: 'Obstacle Avoidance', value: 'Forward + Backward LiDAR' },
            { label: 'GSD', value: '1.8 cm @ 100 m AGL' },
          ],
        },
        {
          label: 'Payload & Comms',
          rows: [
            { label: 'Payload Capacity', value: '400 g modular bay' },
            { label: 'Video Link', value: 'AES-256 encrypted 1080p @ 60fps' },
            { label: 'Telemetry Encryption', value: 'AES-256 / FHSS Anti-Jam' },
            { label: 'Frequency Bands', value: '2.4 GHz / 5.8 GHz dual-band' },
            { label: 'GCS Interface', value: 'Mission Planner + Wingspann GCS App' },
            { label: 'Data Storage', value: '256 GB onboard SSD' },
          ],
        },
      ],
      safety: {
        triggers: ['Low Battery (<10%)', 'Signal Loss >3s', 'Geofence Breach', 'IMU Fault Detected', 'Motor Overheat', 'Manual Override'],
        features: [
          { title: 'Redundant Systems', description: 'Dual IMU, dual GNSS receivers, and independent power rails ensure continued operation through single-point hardware failures.', badge: 'HARDWARE' },
          { title: 'Autonomous Failsafe', description: 'On-board decision engine activates RTH or controlled descent autonomously within 300 ms of any critical fault state.', badge: 'SOFTWARE' },
          { title: 'Environmental Guards', description: 'Real-time wind estimation and thermal monitoring prevent operations outside envelope, with dynamic altitude ceiling enforcement.', badge: 'ENVIRONMENTAL' },
          { title: 'Comms Integrity', description: 'FHSS frequency-hopping with 64 channels helps resist RF jamming. AES-256 prevents data interception.', badge: 'COMMS' },
        ],
      },
      payload: {
        intro: 'Aquila camera payloads are swappable at the field level. Four mission-optimized variants are available, each paired with a purpose-selected imaging system.',
        variants: [
          {
            id: 's',
            name: 'AQUILA S',
            subtitle: 'ENTRY SURVEILLANCE',
            cameraName: 'INTEGRATED 3-IN-1 OPTICAL PAYLOAD',
            imagePath: '/Aquila S.jpg',
            description: 'The entry-level Aquila variant configured for standard surveillance and area monitoring missions. The integrated 3-in-1 camera delivers combined RGB, thermal, and wide-angle sensing in a compact housing.',
            secondaryDescription: 'Ideal for rapid deployment scenarios where low payload weight and system simplicity are the primary mission drivers.',
            badges: ['3-IN-1 SENSOR', 'FIXED MOUNT', 'LIGHTWEIGHT'],
            specs: [
              { label: 'Camera', value: 'Integrated 3-in-1 Sensor', highlight: true },
              { label: 'Compatibility', value: 'Universal Telemetry' },
              { label: 'Dimensions', value: '105 x 43 x 35 mm', highlight: true },
              { label: 'Weight', value: '90 g', highlight: true },
              { label: 'Mount Type', value: 'Fixed / Integrated' },
              { label: 'Sensor Type', value: '3-in-1 Combined' },
            ],
            tags: ['AREA SURVEILLANCE', 'RAPID DEPLOY', 'BORDER MONITORING', 'LOW WEIGHT'],
          },
          {
            id: 'sp',
            name: 'AQUILA S+',
            subtitle: 'ENHANCED GIMBAL',
            cameraName: 'PRO 3-AXIS STABILIZED GIMBAL CAMERA',
            imagePath: '/Aquila S+.png',
            description: 'The S+ variant upgrades the imaging system with a professional three-axis stabilized gimbal, delivering smooth footage even in turbulent wind conditions.',
            secondaryDescription: 'The three-axis mechanical stabilization compensates for pitch, roll, and yaw independently, enabling high-grade aerial imaging from a compact platform.',
            badges: ['3-AXIS GIMBAL', 'STABILIZED', 'PRO IMAGING'],
            specs: [
              { label: 'Camera', value: 'Pro 3-Axis Gimbal', highlight: true },
              { label: 'Stabilization', value: '3-Axis Gimbal', highlight: true },
              { label: 'Dimensions', value: '12 x 10 x 10 cm', highlight: true },
              { label: 'Weight', value: '61 g', highlight: true },
              { label: 'Mount Type', value: 'Active 3-Axis Gimbal' },
              { label: 'Use Class', value: 'Surveillance / ISR' },
            ],
            tags: ['STABILIZED VIDEO', 'ISR MISSIONS', 'PERIMETER SECURITY', 'PERSISTENT WATCH'],
          },
          {
            id: 't',
            name: 'AQUILA T',
            subtitle: 'TACTICAL IMAGING',
            cameraName: 'TACTICAL 3-AXIS STABILIZED GIMBAL CAMERA',
            imagePath: '/Aquila M.png',
            description: 'The Aquila T is the tactical imaging variant, equipped with a tactical three-axis stabilized gimbal for target identification and detailed reconnaissance.',
            secondaryDescription: 'Designed for defense and law enforcement applications where high-fidelity imagery under dynamic flight conditions is required.',
            badges: ['3-AXIS GIMBAL', 'HIGH RESOLUTION', 'TACTICAL'],
            specs: [
              { label: 'Camera', value: 'Tactical 3-Axis Gimbal', highlight: true },
              { label: 'Stabilization', value: '3-Axis Gimbal', highlight: true },
              { label: 'Dimensions', value: '13 x 11 x 10 cm', highlight: true },
              { label: 'Weight', value: '204 g', highlight: true },
              { label: 'Mount Type', value: 'Active 3-Axis Gimbal' },
              { label: 'Use Class', value: 'Tactical / Defense' },
            ],
            tags: ['TARGET IDENTIFICATION', 'RECONNAISSANCE', 'LAW ENFORCEMENT', 'DEFENSE OPS'],
          },
          {
            id: 'm',
            name: 'AQUILA M',
            subtitle: 'MULTISPECTRAL',
            cameraName: 'ADVANCED MULTISPECTRAL IMAGING SENSOR',
            imagePath: '/Aquila T.jpg',
            description: 'The Aquila M is purpose-built for precision agriculture, environmental monitoring, and scientific remote sensing.',
            secondaryDescription: 'A sunshine sensor logs ambient light conditions in real time, enabling radiometric calibration for scientifically accurate datasets.',
            badges: ['MULTISPECTRAL', '4-BAND', 'PRECISION AG'],
            specs: [
              { label: 'Camera', value: 'Advanced Multispectral', highlight: true },
              { label: 'Sensor Type', value: 'Multispectral (4-band)', highlight: true },
              { label: 'Spectral Bands', value: 'Green / Red / Red-Edge / NIR' },
              { label: 'Dimensions', value: '59 x 41 x 28 mm', highlight: true },
              { label: 'Weight', value: '72 g', highlight: true },
              { label: 'Use Class', value: 'Agriculture / Science' },
            ],
            tags: ['NDVI MAPPING', 'CROP HEALTH', 'ENVIRONMENTAL SURVEY', 'SCIENTIFIC SENSING'],
          },
        ],
      },
    },
  },
  {
    category: 'uas',
    sort_order: 20,
    name: 'Skylark',
    slug: 'skylark',
    tagline: 'Small Tactical ISR Drone',
    description: 'A lightweight, man-portable drone designed for rapid deployment and close-range surveillance. Features high-performance gimbaled sensors for real-time tactical intelligence.',
    specs: [],
    features: ['Rapid deployment', 'Close-range surveillance', 'Gimbaled sensor payload', 'Portable tactical operations'],
    status: 'coming_soon',
    image_url: '/skylark.jpeg',
    model_url: '',
    is_published: 1,
    detail_sections: {
      overview: {
        paragraphs: ['Skylark is planned as a compact tactical ISR drone for fast deployment, short-range reconnaissance, and team-level situational awareness.'],
        stats: [],
        missions: [],
        advantages: [],
      },
      specifications: [],
      safety: { triggers: [], features: [] },
      payload: { intro: '', variants: [] },
    },
  },
  {
    category: 'uas',
    sort_order: 30,
    name: 'Hercules',
    slug: 'hercules',
    tagline: 'Heavy-Lift Multirotor UAS',
    description: 'A high-performance octocopter engineered for mission-critical heavy payload delivery and industrial-grade reliability. Optimized for stability and endurance in challenging flight environments.',
    specs: [],
    features: ['Heavy payload capacity', 'Industrial-grade stability', 'Octocopter architecture', 'Mission-critical lift operations'],
    status: 'coming_soon',
    image_url: '/hercules.jpeg',
    model_url: '',
    is_published: 1,
    detail_sections: {
      overview: {
        paragraphs: ['Hercules is planned as a heavy-lift multirotor platform for logistics, industrial missions, and high-stability payload operations.'],
        stats: [],
        missions: [],
        advantages: [],
      },
      specifications: [],
      safety: { triggers: [], features: [] },
      payload: { intro: '', variants: [] },
    },
  },
  {
    category: 'space',
    sort_order: 10,
    name: '3U CubeSat',
    slug: '3u-cubesat',
    tagline: 'Compact Modular Satellite Platform',
    description: 'A precision-machined structural platform for CubeSat and orbital payloads, optimised for minimum mass, maximum stiffness, and standard deployer compatibility.',
    specs: [],
    features: ['Aerospace-grade aluminium structure', 'Standard deployer compatibility', 'Modular payload integration', 'Optimised stiffness-to-mass ratio'],
    status: 'active',
    image_url: '',
    model_url: '/space-showcase.html',
    is_published: 1,
    detail_sections: {
      overview: { paragraphs: ['A compact modular satellite platform engineered for rapid payload integration and reliable orbital deployment.'], stats: [], missions: [], advantages: [] },
      specifications: [],
      safety: { triggers: [], features: [] },
      payload: { intro: '', variants: [] },
    },
  },
  {
    category: 'space',
    sort_order: 20,
    name: '6U CubeSat',
    slug: '6u-cubesat',
    tagline: 'Earth Observation & Scientific Experiments',
    description: 'A compact yet powerful orbital platform engineered for Earth observation, scientific payloads, and technology demonstration missions.',
    specs: [],
    features: ['Expanded payload volume', 'Earth observation mission fit', 'Scientific payload support', 'Harsh-environment structural design'],
    status: 'active',
    image_url: '',
    model_url: '/space-6u.html',
    is_published: 1,
    detail_sections: {
      overview: { paragraphs: ['The 6U CubeSat enables rapid integration of custom instruments while maintaining structural integrity in harsh space environments.'], stats: [], missions: [], advantages: [] },
      specifications: [],
      safety: { triggers: [], features: [] },
      payload: { intro: '', variants: [] },
    },
  },
  {
    category: 'space',
    sort_order: 30,
    name: '12U CubeSat',
    slug: '12u-cubesat',
    tagline: 'Extended Payload & Deep Space Platform',
    description: 'An expanded payload platform for demanding missions including high-resolution imaging, synthetic aperture radar, and inter-satellite link experiments.',
    specs: [],
    features: ['Expanded payload capacity', 'Higher power budgets', 'Redundant subsystem architecture', 'Multi-year mission design'],
    status: 'active',
    image_url: '',
    model_url: '/space-12u.html',
    is_published: 1,
    detail_sections: {
      overview: { paragraphs: ['The 12U CubeSat delivers expanded payload capacity and power budgets for demanding mission profiles.'], stats: [], missions: [], advantages: [] },
      specifications: [],
      safety: { triggers: [], features: [] },
      payload: { intro: '', variants: [] },
    },
  },
  {
    category: 'aerospace',
    sort_order: 10,
    name: 'Tactical Avionics Bay',
    slug: 'tactical-avionics-bay',
    tagline: 'Integrated Mission Systems',
    description: 'A consolidated, radiation-hardened environment for mission-critical flight computers, communication relay systems, and high-frequency sensor processing units.',
    specs: [
      { label: 'Architecture', value: 'Multi-Layer HDI Stackup' },
      { label: 'Rating', value: 'Radiation-Hardened' },
      { label: 'Processing', value: 'Real-time FPGA / SoC' },
      { label: 'Cooling', value: 'Active Phase-Change Thermal' },
    ],
    features: [
      'Modular line-replaceable unit design',
      'EMI/EMC shielded aerospace-grade housing',
      'Redundant power distribution bus',
      'High-bandwidth internal data link',
    ],
    status: 'active',
    image_url: '/avionics-bay.png',
    model_url: '',
    is_published: 1,
    detail_sections: {
      overview: { paragraphs: ['Tactical avionics bays consolidate mission electronics in a rugged, serviceable architecture for aerospace platforms.'], stats: [], missions: [], advantages: [] },
      specifications: [
        {
          label: 'Component',
          rows: [
            { label: 'Architecture', value: 'Multi-Layer HDI Stackup' },
            { label: 'Rating', value: 'Radiation-Hardened' },
            { label: 'Processing', value: 'Real-time FPGA / SoC' },
            { label: 'Cooling', value: 'Active Phase-Change Thermal' },
          ],
        },
      ],
      safety: { triggers: [], features: [] },
      payload: { intro: '', variants: [] },
    },
  },
  {
    category: 'optical',
    sort_order: 10,
    name: 'Advanced Electro-Optics',
    slug: 'advanced-electro-optics',
    tagline: 'Optical & Laser Systems',
    description: 'Cutting-edge optical and laser systems for sensing, targeting, and communication in critical applications.',
    specs: [
      { label: 'Targeting Range', value: 'Up to 50 km' },
      { label: 'Sensor Types', value: 'SWIR / MWIR / Thermal' },
      { label: 'Stabilization', value: '4-Axis Gyro' },
    ],
    features: ['Advanced sensors', 'Laser targeting', 'Electro-optical suites', 'Real-time processing'],
    status: 'coming_soon',
    image_url: '/optical&L.jpg',
    model_url: '',
    is_published: 1,
    detail_sections: {
      overview: { paragraphs: ['Advanced electro-optical systems are planned for sensing, targeting, communication, and situational awareness in demanding environments.'], stats: [], missions: [], advantages: [] },
      specifications: [
        {
          label: 'Optics',
          rows: [
            { label: 'Targeting Range', value: 'Up to 50 km' },
            { label: 'Sensor Types', value: 'SWIR / MWIR / Thermal' },
            { label: 'Stabilization', value: '4-Axis Gyro' },
          ],
        },
      ],
      safety: { triggers: [], features: [] },
      payload: { intro: '', variants: [] },
    },
  },
]);

let ensurePromise = null;

const REQUIRED_PRODUCT_COLUMNS = [
  'id',
  'name',
  'slug',
  'category',
  'tagline',
  'description',
  'specs',
  'features',
  'detail_sections',
  'status',
  'image_url',
  'model_url',
  'sort_order',
  'is_published',
  'created_at',
  'updated_at',
];

async function ensureProductsTable() {
  if (!ensurePromise) {
    ensurePromise = (async () => {
      const [tables] = await db.query("SHOW TABLES LIKE 'products'");
      if (!tables.length) {
        throw new Error('Missing required table "products". Run backend/db/migrate-products.sql.');
      }

      const [columns] = await db.query('SHOW COLUMNS FROM products');
      const availableColumns = new Set(columns.map((column) => column.Field));
      const missingColumns = REQUIRED_PRODUCT_COLUMNS.filter((column) => !availableColumns.has(column));

      if (missingColumns.length > 0) {
        throw new Error(`The products table is missing columns: ${missingColumns.join(', ')}. Run backend/db/migrate-products.sql.`);
      }
    })();
  }

  return ensurePromise;
}

function normalizeProductPayload(data = {}) {
  return {
    name: typeof data.name === 'string' ? data.name.trim() : '',
    slug: typeof data.slug === 'string' ? data.slug.trim().toLowerCase() : '',
    category: ['uas', 'space', 'aerospace', 'optical'].includes(data.category) ? data.category : 'uas',
    tagline: typeof data.tagline === 'string' ? data.tagline.trim() : '',
    description: typeof data.description === 'string' ? data.description.trim() : '',
    specs: Array.isArray(data.specs) ? data.specs : [],
    features: Array.isArray(data.features) ? data.features : [],
    detail_sections: data.detail_sections && typeof data.detail_sections === 'object' ? data.detail_sections : {},
    status: ['active', 'coming_soon', 'retired'].includes(data.status) ? data.status : 'active',
    image_url: typeof data.image_url === 'string' ? data.image_url.trim() : '',
    model_url: typeof data.model_url === 'string' ? data.model_url.trim() : '',
    sort_order: Number.isFinite(Number(data.sort_order)) ? Number(data.sort_order) : 0,
    is_published: data.is_published ? 1 : 0,
  };
}

module.exports = {
  DEFAULT_PRODUCTS,
  ensureProductsTable,
  normalizeProductPayload,
};
