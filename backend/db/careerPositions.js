const db = require('./index');

const DEFAULT_CAREER_POSITIONS = Object.freeze([
  {
    title: 'Aerospace Engineer',
    department: 'Engineering',
    description: 'Design and develop next-generation aerospace systems and components.',
    category: 'technical',
    sort_order: 10,
  },
  {
    title: 'AIT Engineer',
    department: 'Assembly & Integration',
    description: 'Manage the assembly, integration, and testing of complex aerospace systems and platforms.',
    category: 'technical',
    sort_order: 20,
  },
  {
    title: 'Software Engineer',
    department: 'Software Development',
    description: 'Build autonomous systems and AI-powered software solutions.',
    category: 'technical',
    sort_order: 30,
  },
  {
    title: 'Software Testing Engineer',
    department: 'Quality Assurance',
    description: 'Ensure the reliability and safety of flight-critical software systems through rigorous testing.',
    category: 'technical',
    sort_order: 40,
  },
  {
    title: 'Robotics Specialist',
    department: 'Robotics',
    description: 'Develop and integrate robotics systems for autonomous platforms.',
    category: 'technical',
    sort_order: 50,
  },
  {
    title: 'Systems Architect',
    department: 'Systems',
    description: 'Design complex systems integrating hardware and software components.',
    category: 'technical',
    sort_order: 60,
  },
  {
    title: 'Materials Scientist',
    department: 'Research & Development',
    description: 'Research and develop advanced materials for aerospace applications.',
    category: 'technical',
    sort_order: 70,
  },
  {
    title: 'Supply Chain',
    department: 'Operations',
    description: 'Optimize global sourcing, procurement, and logistics for advanced manufacturing.',
    category: 'business',
    sort_order: 10,
  },
  {
    title: 'Sales & Marketing',
    department: 'Business Development',
    description: 'Drive product growth and build global partnerships across defense and commercial sectors.',
    category: 'business',
    sort_order: 20,
  },
  {
    title: 'Service Engineer & Customer Support',
    department: 'Client Services',
    description: 'Provide technical support and maintain operational readiness for our enterprise clients.',
    category: 'business',
    sort_order: 30,
  },
  {
    title: 'Business Head',
    department: 'Executive Leadership',
    description: 'Lead strategic initiatives, oversee business operations, and drive corporate growth in aerospace systems.',
    category: 'business',
    sort_order: 40,
  },
]);

let ensurePromise = null;

const REQUIRED_CAREER_POSITION_COLUMNS = [
  'id',
  'title',
  'department',
  'description',
  'category',
  'sort_order',
  'is_published',
  'apply_enabled',
  'created_at',
  'updated_at',
];

async function ensureCareerPositionsTable() {
  if (!ensurePromise) {
    ensurePromise = (async () => {
      const [tables] = await db.query("SHOW TABLES LIKE 'career_positions'");
      if (!tables.length) {
        throw new Error('Missing required table "career_positions". Run backend/db/migrate-career-positions.sql.');
      }

      const [columns] = await db.query('SHOW COLUMNS FROM career_positions');
      const availableColumns = new Set(columns.map((column) => column.Field));
      const missingColumns = REQUIRED_CAREER_POSITION_COLUMNS.filter((column) => !availableColumns.has(column));

      if (missingColumns.length > 0) {
        throw new Error(
          `The career_positions table is missing columns: ${missingColumns.join(', ')}. Run backend/db/migrate-career-positions.sql.`
        );
      }
    })();
  }

  return ensurePromise;
}

function normalizeCareerPosition(data = {}) {
  return {
    title: typeof data.title === 'string' ? data.title.trim() : '',
    department: typeof data.department === 'string' ? data.department.trim() : '',
    description: typeof data.description === 'string' ? data.description.trim() : '',
    category: data.category === 'business' ? 'business' : 'technical',
    sort_order: Number.isFinite(Number(data.sort_order)) ? Number(data.sort_order) : 0,
    is_published: data.is_published ? 1 : 0,
    apply_enabled: data.apply_enabled ? 1 : 0,
  };
}

async function getPublishedCareerPositions() {
  await ensureCareerPositionsTable();
  const [rows] = await db.execute(
    `SELECT * FROM career_positions
     WHERE is_published = 1
     ORDER BY FIELD(category, 'technical', 'business'), sort_order ASC, id ASC`
  );
  return rows;
}

async function getAllCareerPositions() {
  await ensureCareerPositionsTable();
  const [rows] = await db.execute(
    `SELECT * FROM career_positions
     ORDER BY FIELD(category, 'technical', 'business'), sort_order ASC, id ASC`
  );
  return rows;
}

async function createCareerPosition(data) {
  await ensureCareerPositionsTable();
  const position = normalizeCareerPosition(data);
  const [result] = await db.execute(
    `INSERT INTO career_positions
      (title, department, description, category, sort_order, is_published, apply_enabled)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      position.title,
      position.department || null,
      position.description || null,
      position.category,
      position.sort_order,
      position.is_published,
      position.apply_enabled,
    ]
  );
  return { ...position, id: result.insertId };
}

async function updateCareerPosition(id, data) {
  await ensureCareerPositionsTable();
  const position = normalizeCareerPosition(data);
  await db.execute(
    `UPDATE career_positions SET
      title = ?,
      department = ?,
      description = ?,
      category = ?,
      sort_order = ?,
      is_published = ?,
      apply_enabled = ?
     WHERE id = ?`,
    [
      position.title,
      position.department || null,
      position.description || null,
      position.category,
      position.sort_order,
      position.is_published,
      position.apply_enabled,
      id,
    ]
  );
  return { ...position, id: Number(id) };
}

async function deleteCareerPosition(id) {
  await ensureCareerPositionsTable();
  await db.execute('DELETE FROM career_positions WHERE id = ?', [id]);
}

module.exports = {
  getPublishedCareerPositions,
  getAllCareerPositions,
  createCareerPosition,
  updateCareerPosition,
  deleteCareerPosition,
};
