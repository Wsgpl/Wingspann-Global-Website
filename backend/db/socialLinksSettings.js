const db = require('./index');

const DEFAULT_SOCIAL_LINKS_SETTINGS = Object.freeze({
  instagram: { enabled: false, url: '' },
  youtube: { enabled: false, url: '' },
  linkedin: { enabled: false, url: '' },
  twitter: { enabled: false, url: '' },
});

let ensurePromise = null;

const REQUIRED_SOCIAL_LINKS_COLUMNS = [
  'id',
  'instagram_enabled',
  'instagram_url',
  'youtube_enabled',
  'youtube_url',
  'linkedin_enabled',
  'linkedin_url',
  'twitter_enabled',
  'twitter_url',
  'updated_at',
];

function normalizePlatform(platform = {}) {
  return {
    enabled: !!platform.enabled,
    url: typeof platform.url === 'string' ? platform.url.trim() : '',
  };
}

function normalizeSettings(settings = {}) {
  return {
    instagram: normalizePlatform(settings.instagram),
    youtube: normalizePlatform(settings.youtube),
    linkedin: normalizePlatform(settings.linkedin),
    twitter: normalizePlatform(settings.twitter),
  };
}

function rowToSettings(row = {}) {
  return {
    instagram: {
      enabled: !!row.instagram_enabled,
      url: row.instagram_url || '',
    },
    youtube: {
      enabled: !!row.youtube_enabled,
      url: row.youtube_url || '',
    },
    linkedin: {
      enabled: !!row.linkedin_enabled,
      url: row.linkedin_url || '',
    },
    twitter: {
      enabled: !!row.twitter_enabled,
      url: row.twitter_url || '',
    },
  };
}

async function ensureSocialLinksSettingsTable() {
  if (!ensurePromise) {
    ensurePromise = (async () => {
      const [tables] = await db.query("SHOW TABLES LIKE 'social_links_settings'");
      if (!tables.length) {
        throw new Error('Missing required table "social_links_settings". Run backend/db/migrate-social-links.sql.');
      }

      const [columns] = await db.query('SHOW COLUMNS FROM social_links_settings');
      const availableColumns = new Set(columns.map((column) => column.Field));
      const missingColumns = REQUIRED_SOCIAL_LINKS_COLUMNS.filter((column) => !availableColumns.has(column));

      if (missingColumns.length > 0) {
        throw new Error(
          `The social_links_settings table is missing columns: ${missingColumns.join(', ')}. Run backend/db/migrate-social-links.sql.`
        );
      }
    })();
  }

  return ensurePromise;
}

async function getSocialLinksSettings() {
  await ensureSocialLinksSettingsTable();
  const [rows] = await db.execute(
    'SELECT * FROM social_links_settings WHERE id = 1 LIMIT 1'
  );

  if (!rows.length) return DEFAULT_SOCIAL_LINKS_SETTINGS;
  return rowToSettings(rows[0]);
}

async function saveSocialLinksSettings(settings = {}) {
  await ensureSocialLinksSettingsTable();
  const normalized = normalizeSettings(settings);

  await db.execute(
    `INSERT INTO social_links_settings (
      id,
      instagram_enabled,
      instagram_url,
      youtube_enabled,
      youtube_url,
      linkedin_enabled,
      linkedin_url,
      twitter_enabled,
      twitter_url
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      instagram_enabled = VALUES(instagram_enabled),
      instagram_url = VALUES(instagram_url),
      youtube_enabled = VALUES(youtube_enabled),
      youtube_url = VALUES(youtube_url),
      linkedin_enabled = VALUES(linkedin_enabled),
      linkedin_url = VALUES(linkedin_url),
      twitter_enabled = VALUES(twitter_enabled),
      twitter_url = VALUES(twitter_url)`,
    [
      1,
      normalized.instagram.enabled ? 1 : 0,
      normalized.instagram.url || null,
      normalized.youtube.enabled ? 1 : 0,
      normalized.youtube.url || null,
      normalized.linkedin.enabled ? 1 : 0,
      normalized.linkedin.url || null,
      normalized.twitter.enabled ? 1 : 0,
      normalized.twitter.url || null,
    ]
  );

  return normalized;
}

module.exports = {
  DEFAULT_SOCIAL_LINKS_SETTINGS,
  getSocialLinksSettings,
  saveSocialLinksSettings,
};
